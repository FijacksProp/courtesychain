from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')
    
def how_it_works(request):
    return render(request, 'how_it_works.html')

def contact(request):
    return render(request, 'contact.html')

def whitepaper(request):
    return render(request, 'whitepaper_clean.html')