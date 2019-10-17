//jslint browser:true, devel:true, white:true
//global $

$(function () {
    var pseudo = "Anonymous";

    // force le navigateur a etre plus strict concernant la gestion des
    // erreurs javascript   (valable sur les anciennes version de JS < ES6)
    "use strict";

    // 1. prend un objet message,
    // 2. crée du HTML
    // 3. et l'insère dans la div #history
    function ajouteMessage(message) {
        var html, $html, selecteur;

        // je fais une recherche pour l'id actuel
        selecteur = '#message-' + message.id;
        $html = $(selecteur);

        // si j'ai trouvé un/des elements qui correspondent
        // alors je n'ai pas besoin d'ajouter ce meme element
        if ($html.length > 0) { return; }

        // on construit le fragment HTML
        html = $('#template-message').text(); // le code HTML
        $html = $(html); // le DOM correspondant
        
        // on insère les données dans le fragment HTML
        $html.attr('id', 'message-' + message.id); // id='message-34'
        $html.find('.author').text(message.author);
        $html.find('.text').text(message.text);

        // on ajoute le fragment HTML  dans le body
        $('#history').append($html);
    }

    // ETAPE 2: coder la fonction qui
    // - crée un objet au format { text: "", author: "" }
    // - envoie l'objet au serveur et ajoute le nouveau message dans l'historique
    //
    // (utiliser http://localhost:3000/messages pour vérifier dans votre 
    // navigateur)
    function envoieMessage(ev) {
        // on empêche l'action par défaut sur cet évènement
        ev.preventDefault();

        var message = {
            author: pseudo,
            text: $("#chatbox .message").val()
        };

        $.post("/messages", message, function (response) {
            // lâcheté de base pour pas gérer le cas d'erreur
            if (response.status !== "success") { return }
            ajouteMessage(response.message);
        });
    }

    // ETAPE 3: (au démarrage) écrire une fonction qui 
    // - demande un nom à l'utilisateur (prompt) 
    // - charge tous les messages du serveur dans l'historique
    // - utiliser le nom dans tous les messages envoyés par la suite
    function chargeMessages() {
        $.get('/messages', function (response) {
            // lâcheté de base pour pas gérer le cas d'erreur
            if (response.status !== 'success') {
                return;
            }

            // on insère chacun des messages
            response.messages.forEach(function (message) {
                ajouteMessage(message);
            });
        });
    }

    // demander le pseudo
    pseudo = prompt("Quel est ton nom ?")

    //  associer une fonction au bouton d'envoi & au submit
    $("#chatbox").on('submit', envoieMessage);

    // charger l'historique au démarrage
    chargeMessages();

    // charger l'historique toutes les 3 secondes
    setInterval(chargeMessages, 3000);
});