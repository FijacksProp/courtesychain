from django.urls import path, re_path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path('api/health/', views.api_health, name="api_health"),
    path('api/contact/', views.api_contact, name="api_contact"),
    path('how_it_works/', RedirectView.as_view(url='/how-it-works/', permanent=True), name="how_it_works_legacy"),
    path('', views.spa_entry, name="spa_home"),
    path('about/', views.spa_entry, name="spa_about"),
    path('how-it-works/', views.spa_entry, name="spa_how_it_works"),
    path('contact/', views.spa_entry, name="spa_contact"),
    path('whitepaper/', views.spa_entry, name="spa_whitepaper"),
    re_path(r'^(?!api/).+', views.spa_entry, name='spa_fallback'),

]
