
    // Invia la prenotazione
    const webAppUrl = "https://script.google.com/macros/s/AKfycbznSpGV9CyaK0GoW3sZl2JLVlQDnnV_gLnuUudPd6kv_1N_LxNq-N8419-ynw9nEm4RyQ/exec"; // 🔹 Inserisci il tuo URL
    
    document.addEventListener("DOMContentLoaded", function () {
        let inputData = document.getElementById("data");
        let orarioSelect = document.getElementById("orario");
    
        // Imposta la data minima a oggi
        let oggi = new Date().toISOString().split("T")[0];
        inputData.setAttribute("min", oggi);
    
        // Quando cambia la data, controlla il giorno della settimana
        inputData.addEventListener("change", function () {
            let dataSelezionata = new Date(this.value);
            let giornoSettimana = dataSelezionata.getDay(); // 0 = Domenica, 6 = Sabato
    
            if (giornoSettimana !== 0 && giornoSettimana !== 6) {
                alert("Puoi prenotare solo il Sabato e la Domenica!");
                this.value = ""; // Resetta il campo data se il giorno non è valido
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
    
            let nome = document.getElementById("nome").value;
            let email = document.getElementById("email").value;
            let persone = document.getElementById("persone").value;
            let dataInput = new Date(document.getElementById("data").value);
            
            // 🔹 Converte la data in YYYYMMDD per l'invio
            let dataFormattata = dataInput.getFullYear().toString() + 
                         ("0" + (dataInput.getMonth() + 1)).slice(-2) + 
                         ("0" + dataInput.getDate()).slice(-2);
    
            let orario = document.getElementById("orario").value;
            let messaggio = document.getElementById("messaggio");
    
            if (!orario || orario === "Nessun orario disponibile") {
                messaggio.textContent = "❌ Seleziona un orario disponibile!";
                messaggio.className = "errore"; 
                return;
            }
    
            let formData = new FormData();
            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("persone", persone);
            formData.append("data", dataFormattata); // 🔹 Invia la data come YYYYMMDD
            formData.append("orario", orario);
    
            // 🔹 LOG per il debug
            console.log("Dati inviati:", { nome, email, persone, dataFormattata, orario });
    
            fetch(webAppUrl, {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log("Risposta dal server:", data);
    
                if (data.status === "slot_pieno") {
                    messaggio.innerHTML = `
        ❌ <strong>Questo slot è già pieno</strong><br>
        Attualmente, sono disponibili solo <span style="font-weight: bold; color: #ff0000;">${data.posti_rimasti}</span> posti 
        (Capienza massima: <span style="font-weight: bold; color: #ff0000;">${data.capienza_massima}</span>).
        <br><br>Ci scusiamo per l'inconveniente e ti invitiamo a scegliere un altro orario per la tua prenotazione.
        <br><br>Grazie per la tua comprensione.
    `;
                    messaggio.className = "errore";
                } else if (data.status === "prenotazione_effettuata") {
                    messaggio.innerHTML = `
        ✅ <strong>Prenotazione effettuata con successo!</strong><br>
        Controlla la tua <span style="font-weight: bold;">mail</span> per confermare la prenotazione.<br>
        Se non la trovi, verifica anche nella cartella <span style="font-weight: bold;">Spam</span>!<br><br>
        Grazie per aver scelto il nostro servizio! 😊<br>
        <small style="font-style: italic; color: #888;">Ti ricordiamo che la conferma potrebbe richiedere qualche minuto.</small>
    `;
                    messaggio.className = "successo";
                    document.getElementById("formPrenotazione").reset();
                } else {
                    messaggio.textContent = "⚠️ Errore imprevisto. Riprova.";
                    messaggio.className = "errore";
                }
            })
            .catch(error => {
                console.error("❌ Errore nella prenotazione:", error);
                messaggio.textContent = "❌ Errore nella prenotazione. Riprova.";
                messaggio.className = "errore";
            });
        });
    });
    
    
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