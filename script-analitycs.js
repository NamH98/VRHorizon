window.addEventListener("load", function(){
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#000"
            },
            "button": {
                "background": "#f1d600"
            }
        },
        "theme": "classic",
        "content": {
            "message": "Questo sito utilizza i cookie per migliorare l'esperienza di navigazione e raccogliere dati analitici. <br>I cookie possono essere utilizzati per analisi statistiche, per raccogliere informazioni sulla tua navigazione rendendola anonima. <br> Cliccando su 'Accetta', acconsenti all'uso di questi cookie. Per maggiori dettagli su come gestiamo i tuoi dati, leggi la nostra",
            "dismiss": "Accetta",
            "link": "<strong> Privacy e Policy </strong>",
            "href": "privacy-policy.html"
        },
        "onStatusChange": function(status) {
            if (this.hasConsented()) {
                // Carica Google Analytics solo se l'utente ha dato il consenso
                var script = document.createElement('script');
                script.src = "https://www.googletagmanager.com/gtag/js?id=G-17Q7L3T8E4";
                script.async = true;
                document.head.appendChild(script); // Aggiungi il tag script dinamicamente

                script.onload = function() {
                    // Inizializza Google Analytics dopo che il file è stato caricato
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-17Q7L3T8E4');
                }
            } else {
                // Se non ha acconsentito, non caricare Google Analytics
                console.log("L'utente non ha acconsentito ai cookie.");
            }
        }
    });
});