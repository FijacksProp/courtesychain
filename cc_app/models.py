from django.db import models

# Create your models here.

class Contact(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('partnership', 'Partnership Opportunity'),
        ('support', 'Technical Support'),
        ('media', 'Media & Press'),
        ('investment', 'Investment Inquiry'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.subject}"

    class Meta:
        ordering = ['-created_at']
