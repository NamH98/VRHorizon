document.querySelectorAll('.accordion-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        let content = this.nextElementSibling;
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });
});