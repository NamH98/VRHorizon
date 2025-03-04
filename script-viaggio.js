let currentSlide = 0;
let mediaItems = [];

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('show');
}

function updateCharCount() {
    let textarea = document.getElementById('messaggio');
    let counter = document.getElementById('char-counter');
    counter.textContent = textarea.value.length + " / 500";
}

window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    const title = document.querySelector(".header-title"); // Seleziona il titolo

    if (window.scrollY > 50) {
        header.classList.add("scrolled"); // Aggiunge l'effetto trasparente e blur
        title.classList.add("scrolled");  // Cambia il colore della scritta
    } else {
        header.classList.remove("scrolled"); // Rimuove l'effetto
        title.classList.remove("scrolled");  // Torna al colore originale
    }
});

function openModal(title, description, items = []) {
    // Imposta il titolo e la descrizione
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDescription").textContent = description;

    // Salva gli oggetti media
    mediaItems = items;

    // Aggiungi il contenuto dinamico del carosello
    const carouselContent = document.querySelector(".carousel-content");
    carouselContent.innerHTML = '';  // Pulisci il contenuto precedente

    // Crea gli elementi del carosello (immagini e video)
    mediaItems.forEach(item => {
        let mediaElement;
        if (item.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = item.src;
            mediaElement.alt = item.alt || "Image";
        } else if (item.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = item.src;
            mediaElement.controls = true;
        }

        carouselContent.appendChild(mediaElement);
    });

    // Mostra il modale
    var modal = document.getElementById("modal");
    modal.classList.add("open");

    // Disabilita lo scrolling dello sfondo
    document.body.style.overflow = "hidden";

    // Mostra e attiva l'overlay con transizione
    var overlay = document.getElementById("overlay-blur");
    overlay.style.display = "block";
    setTimeout(() => {
        overlay.style.opacity = "1";
    }, 10);

    // Aggiungi listener per chiudere con ESC
    document.addEventListener("keydown", closeOnEsc);

    // Mostra il primo slide
    showSlide(currentSlide);
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.classList.remove("open");

    // Riattiva lo scrolling
    document.body.style.overflow = "";

    // Nasconde l'overlay con transizione
    var overlay = document.getElementById("overlay-blur");
    overlay.style.opacity = "0";
    setTimeout(() => {
        overlay.style.display = "none";
    }, 300);

    // Rimuovi listener per evitare spreco di risorse
    document.removeEventListener("keydown", closeOnEsc);
}

// Chiude il modale quando si preme ESC
function closeOnEsc(event) {
    if (event.key === "Escape") {
        closeModal();
    }
}

// Chiude il modale cliccando fuori
document.getElementById("overlay-blur").addEventListener("click", closeModal);

// Mostra il slide corrente nel carosello
function showSlide(index) {
    const carouselContent = document.querySelector(".carousel-content");
    const slides = carouselContent.children;

    // Prevenire errori se non ci sono elementi
    if (slides.length === 0) return;

    // Cicla gli slide
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    // Applica la trasformazione per spostare il carosello
    carouselContent.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Funzione per navigare tra i caroselli
function moveCarousel(direction) {
    showSlide(currentSlide + direction);
}
