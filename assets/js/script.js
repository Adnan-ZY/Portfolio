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
                return false;
            }

            if (email.indexOf("@") == -1 || email.length < 6) {
                text = "Please enter a valid email.";
                error.innerHTML = text;
                return false;
            }

            if (message.length <= 140) {
                text = "Please enter more than 140 characters in the message.";
                error.innerHTML = text;
                return false;
            }

            alert("Form Submitted Successfully!");
            return true;
        }
        function slideImages(sliderId, direction) {
            let slider = document.getElementById(sliderId);
            let slides = slider.getElementsByClassName("slide");
            let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains("active"));

            slides[activeIndex].classList.remove("active");
            let nextIndex = (activeIndex + direction + slides.length) % slides.length;
            slides[nextIndex].classList.add("active");
        }
        document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove("active"));

            // Add active class to the clicked link
            this.classList.add("active");
        });
    });
});
