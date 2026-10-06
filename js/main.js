// ==========================================
// Hetul Interior — Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    // --- Variables ---
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu .nav-link, #mobile-menu a');
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const revealElements = document.querySelectorAll('.reveal');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.querySelector('.contact-form');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar .nav-link, .navbar a');
    const statementBg = document.querySelector('.statement-bg');

    // --- 2. Navbar Scroll Behavior & 12. Navbar Logo Color ---
    function handleScroll() {
        if (!navbar) return;
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Passive scroll listener for performance
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    }, { passive: true });

    // --- 3. Mobile Menu Toggle ---
    function toggleMobileMenu() {
        if (!mobileMenuToggle || !mobileMenu) return;
        
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            
            // Animate links in
            mobileMenuLinks.forEach((link, index) => {
                link.style.transitionDelay = `${index * 0.08}s`;
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            });
        } else {
            document.body.style.overflow = '';
            
            // Reset links
            mobileMenuLinks.forEach(link => {
                link.style.transitionDelay = '0s';
                link.style.opacity = '0';
                link.style.transform = 'translateY(20px)';
            });
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuLinks) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // --- 4. Smooth Scroll for Anchor Links ---
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Prevent default behavior
                e.preventDefault();

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
                
                // Account for navbar height offset
                const navbarHeight = navbar ? navbar.offsetHeight || 80 : 80;
                const topPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: topPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Scroll Reveal Animations (Intersection Observer) ---
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // --- 6. Project Category Filters ---
    if (filterBtns && projectCards) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || (category && category.includes(filterValue))) {
                        card.style.display = 'block';
                        
                        // Subtle fade animation
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.4s ease';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 7. Project Modal & 11. Project Card Click Handlers ---
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalHeroImg = document.getElementById('modal-hero-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');

    window.openProjectModal = function(cardElement) {
        if (!projectModal) return;
        
        const titleEl = cardElement.querySelector('h3');
        const categoryEl = cardElement.querySelector('span') || cardElement.querySelector('.category');
        const imgEl = cardElement.querySelector('img');
        
        if (imgEl && modalHeroImg) modalHeroImg.src = imgEl.src;
        if (titleEl && modalTitle) modalTitle.textContent = titleEl.textContent;
        if (categoryEl && modalCategory) modalCategory.textContent = categoryEl.textContent;
        
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        projectModal.scrollTop = 0;
    };

    window.closeProjectModal = function() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (projectCards) {
        projectCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Ignore if clicked on a button/link inside card
                if(e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') return;
                window.openProjectModal(this);
            });
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', window.closeProjectModal);
    }

    if (projectModal) {
        projectModal.addEventListener('click', function(e) {
            // Close if clicked exactly on the modal wrapper (backdrop)
            if (e.target === projectModal) {
                window.closeProjectModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
            window.closeProjectModal();
        }
    });

    // --- 8. Contact Form Validation ---
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get fields
            const nameField = contactForm.querySelector('input[name="name"]') || contactForm.querySelector('#name');
            const phoneField = contactForm.querySelector('input[name="phone"]') || contactForm.querySelector('#phone');
            const emailField = contactForm.querySelector('input[name="email"]') || contactForm.querySelector('#email');
            
            let isValid = true;
            
            // Reset previous errors
            [nameField, phoneField, emailField].forEach(field => {
                if (field) {
                    field.style.border = '';
                }
            });
            
            // Validate Name
            if (nameField && nameField.value.trim() === '') {
                nameField.style.border = '2px solid red';
                isValid = false;
            }
            
            // Validate Phone
            if (phoneField && phoneField.value.trim() === '') {
                phoneField.style.border = '2px solid red';
                isValid = false;
            }
            
            // Validate Email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField && (emailField.value.trim() === '' || !emailRegex.test(emailField.value.trim()))) {
                emailField.style.border = '2px solid red';
                isValid = false;
            }
            
            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success-message';
                successMsg.textContent = 'Thank you! Your message has been sent successfully.';
                successMsg.style.color = '#155724';
                successMsg.style.backgroundColor = '#d4edda';
                successMsg.style.padding = '15px';
                successMsg.style.marginTop = '20px';
                successMsg.style.borderRadius = '4px';
                successMsg.style.border = '1px solid #c3e6cb';
                
                // Remove existing if any
                const existingMsg = contactForm.querySelector('.form-success-message');
                if (existingMsg) existingMsg.remove();
                
                contactForm.appendChild(successMsg);
                
                // Clear form
                contactForm.reset();
                
                // Remove message after 5 seconds
                setTimeout(() => {
                    if (successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 5000);
            }
        });
    }

    // --- 9. Active Navigation Highlighting ---
    function updateActiveNav() {
        const scrollPosition = window.scrollY;
        const navbarHeight = navbar ? navbar.offsetHeight || 80 : 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50; // offset buffer
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNav);
    }, { passive: true });
    
    updateActiveNav(); // Initial check

    // --- 10. Parallax Effect (Subtle) ---
    function handleParallax() {
        if (window.innerWidth > 768 && statementBg) {
            const rect = statementBg.parentElement.getBoundingClientRect();
            
            // Only apply if the section is in view or approaching view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate simple offset based on scroll
                const yPos = -(rect.top * 0.1); 
                statementBg.style.transform = `translateY(${yPos}px)`;
            }
        } else if (statementBg) {
            statementBg.style.transform = 'translateY(0)';
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleParallax);
    }, { passive: true });

});
