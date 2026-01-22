// CourtesyChain Website - Enhanced Interactions
// Place in static/js/main.js and include in base.html if needed

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for all anchor links
    const smoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };
    
    // Mobile menu toggle
    const mobileMenu = () => {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        
        if (menuBtn && menu) {
            menuBtn.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
            
            // Close menu on nav link click
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('active');
                });
            });
        }
    };
    
    // Navbar scroll effect
    const navbarScroll = () => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(10, 22, 40, 0.95)';
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                nav.style.background = 'rgba(10, 22, 40, 0.8)';
                nav.style.boxShadow = 'none';
            }
        });
    };
    
    // Animate elements on scroll (simple intersection observer)
    const animateOnScroll = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements with animation class
        document.querySelectorAll('.feature-card, .campaign-card, .value-card, .step-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    };
    
    // Copy contract address to clipboard
    const copyContract = () => {
        const contractCode = document.querySelector('code');
        if (contractCode) {
            contractCode.style.cursor = 'pointer';
            contractCode.title = 'Click to copy';
            
            contractCode.addEventListener('click', () => {
                navigator.clipboard.writeText(contractCode.textContent).then(() => {
                    // Show feedback
                    const original = contractCode.textContent;
                    contractCode.textContent = 'Copied! ✓';
                    contractCode.style.color = '#FFB800';
                    
                    setTimeout(() => {
                        contractCode.textContent = original;
                        contractCode.style.color = '';
                    }, 2000);
                });
            });
        }
    };
    
    // Stats counter animation
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isStar = target.includes('★');
            
            if (!isPercentage && !isStar) return;
            
            const value = parseInt(target);
            let current = 0;
            const increment = value / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    clearInterval(timer);
                    current = value;
                }
                stat.textContent = Math.floor(current) + (isPercentage ? '%' : '★');
            }, 20);
        });
    };
    
    // Add particle effect on button hover (optional - performance heavy)
    const buttonParticles = () => {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function(e) {
                // Create sparkle effect
                for (let i = 0; i < 3; i++) {
                    const sparkle = document.createElement('span');
                    sparkle.innerHTML = '✨';
                    sparkle.style.position = 'absolute';
                    sparkle.style.left = e.offsetX + 'px';
                    sparkle.style.top = e.offsetY + 'px';
                    sparkle.style.pointerEvents = 'none';
                    sparkle.style.fontSize = '12px';
                    sparkle.style.opacity = '0';
                    sparkle.style.transition = 'all 0.5s ease';
                    
                    button.style.position = 'relative';
                    button.appendChild(sparkle);
                    
                    setTimeout(() => {
                        sparkle.style.opacity = '1';
                        sparkle.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px)`;
                    }, 10);
                    
                    setTimeout(() => {
                        sparkle.remove();
                    }, 500);
                }
            });
        });
    };
    
    // Form validation enhancement
    const formValidation = () => {
        const form = document.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = this.querySelector('input[type="text"]');
            const email = this.querySelector('input[type="email"]');
            const message = this.querySelector('textarea');
            
            let isValid = true;
            
            if (name && !name.value.trim()) {
                name.style.borderColor = '#ef4444';
                isValid = false;
            } else if (name) {
                name.style.borderColor = '';
            }
            
            if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                email.style.borderColor = '#ef4444';
                isValid = false;
            } else if (email) {
                email.style.borderColor = '';
            }
            
            if (message && !message.value.trim()) {
                message.style.borderColor = '#ef4444';
                isValid = false;
            } else if (message) {
                message.style.borderColor = '';
            }
            
            if (isValid) {
                // Submit form or show success message
                alert('Thank you for reaching out! We\'ll get back to you soon. 🚀');
                this.reset();
            }
        });
    };
    
    // Initialize all features
    smoothScroll();
    mobileMenu();
    navbarScroll();
    animateOnScroll();
    copyContract();
    formValidation();
    
    // Optional: Enable button particles (can be heavy on mobile)
    // buttonParticles();
    
    // Optional: Animate stats on page load
    // setTimeout(animateStats, 500);
    
    console.log('%c🚗 CourtesyChain ', 'background: #FFB800; color: #0A1628; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%cDrive Kind. Earn More. 💰', 'color: #FFB800; font-size: 14px;');
});
