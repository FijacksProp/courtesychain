from django.contrib import admin
from .models import Contact

# Register your models here.

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'category', 'subject', 'created_at', 'is_read']
    list_filter = ['category', 'is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    list_editable = ['is_read']
    ordering = ['-created_at']

    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'category')
        }),
        ('Message Details', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read', 'created_at')
        }),
    )
