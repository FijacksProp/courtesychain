from django import forms
from .models import Contact

class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['name', 'email', 'category', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 md:py-4 border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-secondary-900 placeholder-secondary-400 text-sm md:text-base',
                'placeholder': 'John Doe'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'w-full px-4 py-3 md:py-4 border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-secondary-900 placeholder-secondary-400 text-sm md:text-base',
                'placeholder': 'john@example.com'
            }),
            'category': forms.Select(attrs={
                'class': 'w-full px-4 py-3 md:py-4 border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-secondary-900 bg-white text-sm md:text-base'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 md:py-4 border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-secondary-900 placeholder-secondary-400 text-sm md:text-base',
                'placeholder': 'Brief description of your inquiry'
            }),
            'message': forms.Textarea(attrs={
                'class': 'w-full px-4 py-3 md:py-4 border-2 border-secondary-300 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none resize-none text-secondary-900 placeholder-secondary-400 text-sm md:text-base',
                'rows': '6',
                'placeholder': 'Tell us more about your inquiry...'
            }),
        }