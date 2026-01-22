from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from .forms import ContactForm

# Create your views here.

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def how_it_works(request):
    return render(request, 'how_it_works.html')

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            # Save to database
            contact = form.save()

            # Send email notification
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

            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.CONTACT_EMAIL_RECIPIENT],
                    fail_silently=False,
                )
                messages.success(request, 'Thank you for your message! We\'ll get back to you within 24 hours.')
            except Exception as e:
                # Log the error but still save to database
                print(f"Email sending failed: {e}")
                messages.warning(request, 'Your message was saved, but there was an issue sending the email. We\'ll still get back to you!')

            return redirect('contact')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})

def whitepaper(request):
    return render(request, 'whitepaper_clean.html')