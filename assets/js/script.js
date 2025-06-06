        const toggleButton = document.getElementById('theme-toggle-button');
        const body = document.body;

        toggleButton.addEventListener('click', () => {
            body.classList.toggle('light-mode');
        });

        function validateForm() {
            var name = document.getElementById('name').value;
            var email = document.getElementById('email').value;
            var message = document.getElementById('message').value;
            var error = document.getElementById('error');
            var text = "";

            error.style.padding = "10px";

            if (name.length < 5) {
                text = "Please enter a valid name (at least 5 characters).";
                error.innerHTML = text;
                showErrorAnimation();
                return false;
            }

            if (email.indexOf("@") == -1 || email.length < 6) {
                text = "Please enter a valid email.";
                error.innerHTML = text;
                showErrorAnimation();
                return false;
            }

            if (message.length <= 140) {
                text = "Please enter more than 140 characters in the message.";
                error.innerHTML = text;
                showErrorAnimation();
                return false;
            }


            error.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
            error.style.color = "#2ecc71";
            error.innerHTML = "Message sent successfully!";

            setTimeout(() => {
                document.getElementById('contact-form').reset();
                error.innerHTML = "";
                error.style.padding = "0";
                error.style.backgroundColor = "transparent";
            }, 2000);

            return false;
        }

        function showErrorAnimation() {
            const form = document.getElementById('contact-form');
            form.classList.add('shake');
            setTimeout(() => {
                form.classList.remove('shake');
            }, 500);
        }

        function slideImages(sliderId, direction) {
            let slider = document.getElementById(sliderId);
            let slides = slider.getElementsByClassName("slide");
            let dots = document.getElementById(sliderId.replace('slider', 'dots')).getElementsByClassName("dot");
            let progressBar = document.getElementById(sliderId.replace('slider', 'progress'));

            let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains("active"));

            slides[activeIndex].classList.remove("active");
            dots[activeIndex].classList.remove("active");

            let nextIndex = (activeIndex + direction + slides.length) % slides.length;
            slides[nextIndex].classList.add("active");
            dots[nextIndex].classList.add("active");

            let progress = ((nextIndex + 1) / slides.length) * 100;
            progressBar.style.width = progress + "%";
        }

        function currentSlide(sliderId, index) {
            let slider = document.getElementById(sliderId);
            let slides = slider.getElementsByClassName("slide");
            let dots = document.getElementById(sliderId.replace('slider', 'dots')).getElementsByClassName("dot");
            let progressBar = document.getElementById(sliderId.replace('slider', 'progress'));


            Array.from(slides).forEach(slide => slide.classList.remove("active"));
            Array.from(dots).forEach(dot => dot.classList.remove("active"));

            t
            slides[index].classList.add("active");
            dots[index].classList.add("active");


            let progress = ((index + 1) / slides.length) * 100;
            progressBar.style.width = progress + "%";
        }

        document.addEventListener("DOMContentLoaded", function () {
            let navLinks = document.querySelectorAll("nav a");

            navLinks.forEach(link => {
                link.addEventListener("click", function () {
                    navLinks.forEach(nav => nav.classList.remove("active"));
                    this.classList.add("active");
                });
            });


            document.getElementById('wayns-progress').style.width = (1 / document.getElementById('wayns-slider').getElementsByClassName("slide").length) * 100 + "%";
            document.getElementById('rolex-progress').style.width = (1 / document.getElementById('rolex-slider').getElementsByClassName("slide").length) * 100 + "%";


            const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');

            formInputs.forEach(input => {

                if (input.value.trim() !== '') {
                    input.classList.add('has-value');
                }

                input.addEventListener('focus', function () {
                    this.parentElement.classList.add('focused');
                });

                input.addEventListener('blur', function () {
                    this.parentElement.classList.remove('focused');
                    if (this.value.trim() !== '') {
                        this.classList.add('has-value');
                    } else {
                        this.classList.remove('has-value');
                    }
                });
            });


            const skillBars = document.querySelectorAll('.skill-progress');
            
            function checkScroll() {
                skillBars.forEach(bar => {
                    const sectionPos = document.getElementById('about').getBoundingClientRect();
                    if (sectionPos.top < window.innerHeight && sectionPos.bottom >= 0) {
                        bar.style.width = bar.parentElement.getAttribute('data-width');
                    }
                });
            }


            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.parentElement.setAttribute('data-width', width);
                bar.style.width = '0';
            });
            window.addEventListener('scroll', checkScroll);
            setTimeout(checkScroll, 500);
        });
        const words = ["Capture", "Innovate", "Inspire", "Design", "Build"];
        const changingWord = document.getElementById("changing-word");

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];
            const currentText = currentWord.substring(0, charIndex);

            changingWord.textContent = currentText;

            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(typeEffect, 150);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(typeEffect, 100);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(typeEffect, 1000);
            }
        }

        typeEffect();


        function toggleMenu() {
            const navLinks = document.getElementById("nav-links");
            navLinks.classList.toggle("show");
        }
