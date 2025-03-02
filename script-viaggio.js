function openModal(title, description) {
    // Imposta il titolo e la descrizione
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalDescription").textContent = description;

    // Mostra il modal con una transizione
    var modal = document.getElementById("modal");
    modal.classList.add("open");  // Aggiungi la classe per attivare la visibilità e la transizione

    // Aggiungi la classe per applicare la sfocatura al body
    document.body.classList.add("modal-open");

    // Mostra l'overlay di sfocatura
    var overlay = document.getElementById("overlay-blur");
    overlay.style.display = "block";
    setTimeout(function() {
        overlay.style.opacity = "1";  // Aggiungi una leggera transizione per l'overlay
    }, 10);
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.classList.remove("open");  // Rimuovi la classe per nascondere il modal

    // Rimuovi la sfocatura dal body
    document.body.classList.remove("modal-open");

    // Nascondi l'overlay di sfocatura con una transizione
    var overlay = document.getElementById("overlay-blur");
    overlay.style.opacity = "0";
    setTimeout(function() {
        overlay.style.display = "none";  // Nascondi completamente l'overlay dopo la transizione
    }, 300);  // Tempo della transizione
}
