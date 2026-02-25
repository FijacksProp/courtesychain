import json
from pathlib import Path

from django.http import HttpResponse, JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt

from .forms import ContactForm


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
