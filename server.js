#!/usr/bin/env node

// on charge le framework express
// et on initialise une instance du framework
const express = require('express')
var bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// on demande à Express de lire les fichier de public sans les interpreter
// et de créer une route pour chaque fichier
app.use(express.static('public'));

// on stocke l'état du serveur dans deux variables 
// (un jour vous apprendrez à utiliser des fichiers ou des BDD)
var messages = [];
var counter = 0;

// on définit des routes qui vont appeler du code dynamique
app.get('/messages', function (req, res) {
    console.log(messages);
    res.send({
        status: "success",
        messages: messages
    });
})

app.post('/messages', function (req, res) {
    counter += 1;
    
    try {
        var message = {
            id: counter,
            author: req.body.author.toString(),
            text: req.body.text.toString(),
        };
        console.log(message);
        messages.push(message);

        res.send({
            status: "success",
            message: message
        });
    } catch (e) {
        res.send({
            status: "error",
            error: "Unable to parse input data"
        });
    }
});

app.listen(3000, function () {
    console.log('Serveur en écoute sur 0.0.0.0:3000 .');
});