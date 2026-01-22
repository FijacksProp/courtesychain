from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('about/', views.about, name="about"),
    path('how_it_works/', views.how_it_works, name="how_it_works"),
    path('contact/', views.contact, name="contact"),
    path('whitepaper/', views.whitepaper, name="whitepaper"),

]