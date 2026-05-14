document.addEventListener('DOMContentLoaded', () => {
    //automatic highlighting the active page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navigation-bar .nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const interactiveButtons = document.querySelectorAll('.nav-link, .profile-btn, .sidebar-tab');

    interactiveButtons.forEach(btn => {
        btn.style.transition = 'all 0.4s ease';

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            btn.style.background = `radial-gradient(circle at ${x}% ${y}%, #4eba85, #296a4a)`;
            btn.style.color = 'whitesmoke';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = '';
            btn.style.color = '';
        });
    });

    const modals = document.querySelectorAll('.modal');

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    });
});