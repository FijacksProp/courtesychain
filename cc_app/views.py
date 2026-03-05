import json
import secrets
from datetime import timedelta
from pathlib import Path

from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt

from .forms import ContactForm
from .models import InvestorRequest

INVESTOR_SESSION_KEY = "investor_email"
INVESTOR_TOKEN_EXPIRY_MINUTES = 10


def _generate_access_token():
    return f"{secrets.randbelow(1000000):06d}"


def _send_investor_token_email(recipient_email, token):
    send_mail(
        "Your CourtesyChain Investor Access Code",
        (
            "Your CourtesyChain investor access code is "
            f"{token}. It expires in {INVESTOR_TOKEN_EXPIRY_MINUTES} minutes."
        ),
        settings.DEFAULT_FROM_EMAIL,
        [recipient_email],
        fail_silently=False,
    )


def spa_entry(request):
    candidate_paths = [
        Path(settings.BASE_DIR) / "courtesy_ui" / "dist" / "index.html",
        Path(getattr(settings, "STATIC_ROOT", "")) / "index.html",
    ]
    index_path = next((p for p in candidate_paths if p and p.exists()), None)

    if index_path is None:
        return JsonResponse(
            {
                "error": "Frontend build not found.",
                "hint": "Run frontend build and collectstatic during deploy (see build.sh and Render build command).",
            },
            status=503,
        )

    return HttpResponse(index_path.read_text(encoding="utf-8"), content_type="text/html")


@require_GET
def api_health(request):
    return JsonResponse({"status": "ok"})


@require_GET
def api_investor_status(request):
    email = (request.GET.get("email") or "").strip().lower()
    if not email:
        return JsonResponse({"error": "Email is required."}, status=400)

    investor = InvestorRequest.objects.filter(email=email).first()
    if investor is None:
        return JsonResponse({"exists": False, "is_verified": False}, status=200)

    return JsonResponse({"exists": True, "is_verified": investor.is_verified}, status=200)


@require_GET
def api_investor_session(request):
    email = request.session.get(INVESTOR_SESSION_KEY)
    if not email:
        return JsonResponse({"authenticated": False}, status=401)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None:
        request.session.pop(INVESTOR_SESSION_KEY, None)
        return JsonResponse({"authenticated": False}, status=401)

    return JsonResponse({"authenticated": True, "email": email}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def api_investor_request(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = (payload.get("email") or "").strip().lower()
    company_or_representative = (payload.get("company_or_representative") or "").strip()

    if not email or not company_or_representative:
        return JsonResponse(
            {"error": "Email and company/representative are required."},
            status=400,
        )

    existing = InvestorRequest.objects.filter(email=email).first()
    if existing is not None:
        return JsonResponse(
            {
                "error": "This email already has an investor request.",
                "is_verified": existing.is_verified,
            },
            status=409,
        )

    InvestorRequest.objects.create(
        email=email,
        company_or_representative=company_or_representative,
    )

    return JsonResponse({"message": "Request saved. Verification takes 0-60 minutes."}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def api_investor_request_token(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = (payload.get("email") or "").strip().lower()
    if not email:
        return JsonResponse({"error": "Email is required."}, status=400)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None:
        return JsonResponse({"error": "Investor is not verified yet."}, status=403)

    investor.access_token = _generate_access_token()
    investor.token_expires_at = timezone.now() + timedelta(minutes=INVESTOR_TOKEN_EXPIRY_MINUTES)
    investor.save(update_fields=["access_token", "token_expires_at"])

    try:
        _send_investor_token_email(email, investor.access_token)
    except Exception:
        return JsonResponse({"error": "Unable to send token email right now."}, status=502)

    return JsonResponse(
        {"message": "Access token sent to investor email.", "expires_in_minutes": INVESTOR_TOKEN_EXPIRY_MINUTES},
        status=200,
    )


@csrf_exempt
@require_http_methods(["POST"])
def api_investor_verify_token(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = (payload.get("email") or "").strip().lower()
    access_token = (payload.get("access_token") or "").strip()
    if not email or not access_token:
        return JsonResponse({"error": "Email and token are required."}, status=400)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None:
        return JsonResponse({"error": "Investor is not verified."}, status=403)

    if not investor.access_token or not investor.token_expires_at:
        return JsonResponse({"error": "No active token. Request a new one."}, status=400)

    if timezone.now() > investor.token_expires_at:
        return JsonResponse({"error": "Token expired. Request a new one."}, status=400)

    if access_token != investor.access_token:
        return JsonResponse({"error": "Invalid token."}, status=400)

    request.session[INVESTOR_SESSION_KEY] = email
    investor.access_token = ""
    investor.token_expires_at = None
    investor.save(update_fields=["access_token", "token_expires_at"])

    return JsonResponse({"authenticated": True, "message": "Investor access granted."}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def api_contact(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    category_map = {
        "General Inquiry": "general",
        "Partnership Opportunity": "partnership",
        "Technical Support": "support",
        "Media & Press": "media",
        "Investment Inquiry": "investment",
        "Other": "other",
    }

    form_data = {
        "name": (payload.get("name") or "").strip(),
        "email": (payload.get("email") or "").strip(),
        "category": category_map.get(
            payload.get("category") or payload.get("type"),
            payload.get("category") or payload.get("type"),
        ) or "general",
        "subject": (payload.get("subject") or "").strip(),
        "message": (payload.get("message") or "").strip(),
    }

    form = ContactForm(form_data)
    if not form.is_valid():
        return JsonResponse(
            {"error": "Please correct the highlighted fields.", "fields": form.errors.get_json_data()},
            status=400,
        )

    contact = form.save()

    subject = f"New Contact Form Submission: {contact.subject}"
    message = f"""
New contact form submission received:

Name: {contact.name}
Email: {contact.email}
Category: {contact.get_category_display()}
Subject: {contact.subject}

Message:
{contact.message}

---
This message was sent from the CourtesyChain contact form.
"""

    email_sent = True
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [settings.CONTACT_EMAIL_RECIPIENT],
            fail_silently=False,
        )
    except Exception:
        email_sent = False

    return JsonResponse(
        {
            "message": "Thank you for your message! We'll get back to you within 24 hours.",
            "email_sent": email_sent,
        },
        status=201,
    )
