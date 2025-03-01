// Invia la prenotazione
const webAppUrl = "https://script.google.com/macros/s/AKfycbxlQW-b0XwZItz25APl7uG9pNRc0oo3rDWWMN5qhm_lIW8s15v9HXHl5PE2NMxWC0beKA/exec";

document.addEventListener("DOMContentLoaded", function () {
    let inputData = document.getElementById("data");
    let orarioSelect = document.getElementById("orario");

    // Crea il banner messaggio
    let bannerMessaggio = document.createElement("div");
    bannerMessaggio.id = "bannerMessaggio";
    document.body.appendChild(bannerMessaggio);

    // Crea l'overlay di caricamento e lo NASCONDE inizialmente
    let loadingOverlay = document.createElement("div");
    loadingOverlay.id = "loadingOverlay";
    loadingOverlay.style.display = "none"; // 🔹 Nascondi appena si carica la pagina
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Stiamo elaborando la tua prenotazione...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    // Imposta la data minima a oggi
    let oggi = new Date().toISOString().split("T")[0];
    inputData.setAttribute("min", oggi);

    // Quando cambia la data, controlla il giorno della settimana
    inputData.addEventListener("change", function () {
        let dataSelezionata = new Date(this.value);
        let giornoSettimana = dataSelezionata.getDay();

        if (giornoSettimana !== 0 && giornoSettimana !== 6) {
            mostraBannerMessaggio("errore", "Puoi prenotare solo il Sabato e la Domenica!");
            this.value = "";
            return;
        }

        // 🔹 Converte la data selezionata in formato YYYYMMDD per il backend
        let dataFormattata = this.value.replace(/-/g, "");

        fetch(`${webAppUrl}?data=${dataFormattata}`)
            .then(response => response.json())
            .then(data => {
                orarioSelect.innerHTML = "";

                if (!data.orari || data.orari.length === 0) {
                    let option = document.createElement("option");
                    option.textContent = "Nessun orario disponibile";
                    orarioSelect.appendChild(option);
                } else {
                    data.orari.forEach(orario => {
                        let option = document.createElement("option");
                        option.value = orario;
                        option.textContent = orario;
                        orarioSelect.appendChild(option);
                    });
                }
            })
            .catch(error => console.error("❌ Errore nel caricamento degli orari:", error));
    });

    // Gestione della prenotazione
    document.getElementById("formPrenotazione").addEventListener("submit", function(event) {
        event.preventDefault();

        // 🔹 Mostra l'overlay SOLO quando l'utente invia il modulo
        document.getElementById("loadingOverlay").style.display = "flex";

        let nome = document.getElementById("nome").value;
        let email = document.getElementById("email").value;
        let persone = document.getElementById("persone").value; 
        let dataInput = new Date(document.getElementById("data").value);
        let orario = document.getElementById("orario").value;
        let codiceAmico = document.getElementById("codiceAmico").value;

        let dataFormattata = dataInput.getFullYear().toString() + 
                             ("0" + (dataInput.getMonth() + 1)).slice(-2) + 
                             ("0" + dataInput.getDate()).slice(-2);

        if (!orario || orario === "Nessun orario disponibile") {
            mostraBannerMessaggio("errore", "❌ Seleziona un orario disponibile!");
            document.getElementById("loadingOverlay").style.display = "none"; // 🔹 Nasconde il messaggio di caricamento se c'è un errore
            return;
        }

        let formData = new FormData();
        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("persone", persone);
        formData.append("data", dataFormattata);
        formData.append("orario", orario);
        formData.append("codiceAmico", codiceAmico);

        fetch(webAppUrl, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("loadingOverlay").style.display = "none"; // 🔹 Nasconde l'overlay dopo la risposta

            if (data.status === "slot_pieno") {
                mostraBannerMessaggio("errore", `❌ <strong>Questo slot è già pieno</strong><br> Attualmente, sono disponibili solo <span style="font-weight: bold; color:rgb(219, 219, 219);">${data.posti_rimasti}</span> posti (Capienza massima: <span style="font-weight: bold; color:rgb(219, 219, 219);">${data.capienza_massima}</span>). <br><br>Ci scusiamo per l'inconveniente e ti invitiamo a scegliere un altro orario per la tua prenotazione. <br><br>Grazie per la tua comprensione.`);
            } else if (data.status === "prenotazione_effettuata") {
                mostraBannerMessaggio("successo", "✅ <strong>Prenotazione effettuata con successo!</strong><br> Controlla la tua mail per confermare la prenotazione.<br> Se non la trovi, verifica anche nella cartella Spam!<br><br> Grazie per aver scelto il nostro servizio! 😊<br> <small> Ti ricordiamo che la conferma potrebbe richiedere qualche minuto.</small>");
                document.getElementById("formPrenotazione").reset();
            } else if (data.status === "errore_codice_amico_non_valido") {
                mostraBannerMessaggio("errore", "❌ <strong>Il codice amico inserito non esiste</strong><br> Per favore, prova ad inserire un altro codice amico valido. Se non hai un codice, puoi comunque procedere senza inserirlo.<br><br> Grazie per la tua comprensione.");
            } else {
                mostraBannerMessaggio("errore", "⚠️ Errore imprevisto. Riprova.");
            }
        })
        .catch(error => {
            console.error("❌ Errore nella prenotazione:", error);
            mostraBannerMessaggio("errore", "❌ Errore nella prenotazione. Riprova.");
            document.getElementById("loadingOverlay").style.display = "none"; // 🔹 Nasconde l'overlay in caso di errore
        });
    });
});

function mostraBannerMessaggio(tipo, testo) {
    let banner = document.getElementById("bannerMessaggio");
    banner.innerHTML = testo;
    banner.className = tipo;
    banner.style.position = "fixed";
    banner.style.top = "-100px";
    banner.style.left = "50%";
    banner.style.transform = "translateX(-50%)";
    banner.style.width = "90%";
    banner.style.maxWidth = "400px";
    banner.style.padding = "15px";
    banner.style.textAlign = "center";
    banner.style.fontWeight = "bold";
    banner.style.borderRadius = "8px";
    banner.style.transition = "top 0.5s ease-in-out";
    banner.style.zIndex = "1000";
    banner.style.color = "white";
    banner.style.backgroundColor = tipo === "successo" ? "#4CAF50" : "#9c2424";
    
    banner.style.top = "10px";
    setTimeout(() => {
        banner.style.top = "-300px";
    }, 8000);
}
       
    
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
    
        
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll fluido all'header
        }