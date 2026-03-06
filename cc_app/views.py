import json
from pathlib import Path

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods
from django.contrib.auth.hashers import check_password, make_password

from .forms import ContactForm
from .models import InvestorRequest

INVESTOR_SESSION_KEY = "investor_email"
INVESTOR_LAST_ACTIVITY_KEY = "investor_last_activity"
INVESTOR_IDLE_TIMEOUT_SECONDS = 60 * 60


def _now_ts():
    return int(timezone.now().timestamp())


def _is_password_strong(password):
    if len(password) < 8:
        return False
    has_alpha = any(ch.isalpha() for ch in password)
    has_digit = any(ch.isdigit() for ch in password)
    has_symbol = any(not ch.isalnum() for ch in password)
    return has_alpha and has_digit and has_symbol


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
        return JsonResponse({"exists": False, "is_verified": False, "has_password": False}, status=200)

    return JsonResponse(
        {
            "exists": True,
            "is_verified": investor.is_verified,
            "has_password": bool(investor.password_hash),
            "company_or_representative": investor.company_or_representative,
        },
        status=200,
    )


@require_GET
def api_investor_session(request):
    email = request.session.get(INVESTOR_SESSION_KEY)
    if not email:
        return JsonResponse({"authenticated": False}, status=401)

    last_activity = request.session.get(INVESTOR_LAST_ACTIVITY_KEY)
    now_ts = _now_ts()
    if not isinstance(last_activity, int) or (now_ts - last_activity) > INVESTOR_IDLE_TIMEOUT_SECONDS:
        request.session.pop(INVESTOR_SESSION_KEY, None)
        request.session.pop(INVESTOR_LAST_ACTIVITY_KEY, None)
        return JsonResponse({"authenticated": False, "reason": "session_expired"}, status=401)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None or not investor.password_hash:
        request.session.pop(INVESTOR_SESSION_KEY, None)
        request.session.pop(INVESTOR_LAST_ACTIVITY_KEY, None)
        return JsonResponse({"authenticated": False}, status=401)

    request.session[INVESTOR_LAST_ACTIVITY_KEY] = now_ts
    return JsonResponse(
        {
            "authenticated": True,
            "email": email,
            "company_or_representative": investor.company_or_representative,
        },
        status=200,
    )


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
        return JsonResponse({"error": "Email and company/representative are required."}, status=400)

    existing = InvestorRequest.objects.filter(email=email).first()
    if existing is not None:
        return JsonResponse(
            {
                "error": "This email already has an investor request.",
                "is_verified": existing.is_verified,
                "has_password": bool(existing.password_hash),
                "company_or_representative": existing.company_or_representative,
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
def api_investor_set_password(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    confirm_password = payload.get("confirm_password") or ""
    if not email or not password or not confirm_password:
        return JsonResponse({"error": "Email, password, and confirmation are required."}, status=400)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None:
        return JsonResponse({"error": "Investor is not verified yet."}, status=403)

    if investor.password_hash:
        return JsonResponse({"error": "Password is already set. Please log in."}, status=409)

    if password != confirm_password:
        return JsonResponse({"error": "Passwords do not match."}, status=400)

    if not _is_password_strong(password):
        return JsonResponse(
            {"error": "Password must be at least 8 characters and include letters, numbers, and symbols."},
            status=400,
        )

    investor.password_hash = make_password(password)
    investor.save(update_fields=["password_hash"])

    request.session[INVESTOR_SESSION_KEY] = email
    request.session[INVESTOR_LAST_ACTIVITY_KEY] = _now_ts()
    return JsonResponse({"authenticated": True, "message": "Password set. Investor access granted."}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def api_investor_authenticate(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)
    if not isinstance(payload, dict):
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    investor = InvestorRequest.objects.filter(email=email, is_verified=True).first()
    if investor is None:
        return JsonResponse({"error": "Investor is not verified yet."}, status=403)

    if not investor.password_hash:
        return JsonResponse({"error": "Password is not set yet for this investor."}, status=400)

    if not check_password(password, investor.password_hash):
        return JsonResponse({"error": "Invalid password."}, status=401)

    request.session[INVESTOR_SESSION_KEY] = email
    request.session[INVESTOR_LAST_ACTIVITY_KEY] = _now_ts()
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
