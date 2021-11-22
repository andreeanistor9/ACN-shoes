const express = require('express');
const path = require ('path');
const {Client} = require('pg');
const ejs = require('ejs');
const sharp = require('sharp');
const fs = require('fs')
app = express();

console.log(__dirname);

app.set("view engine","ejs");

var client = new Client({user: "andreean", password:"parola", host:'localhost', port:5432, database:"db_proiectTW"});
client.connect();

app.use("/resurse", express.static(__dirname + '/resurse'));

app.get("/produse", function(req, res){
    console.log(req.query);
    client.query("SELECT * FROM produse", function(err,rez){
        res.render("pagini/produse", {produse: rez.rows}); 
    })
});

// var obImagini;
// function creeazaImagini() {
//     var buf = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf-8");
//     obImagini = JSON.parse(buf)
//     console.log(obImagini);
//     for(let imag of obImagini.imagini){
//         let nume_imag, extensie;
//         [nume_imag, extensie ] = imag.fisier.split('.')
//         let dim_mic = 150
//         imag.mic = `${obImagini.cale_galerie}/${nume_imag}-${dim_mic}.webp`
//         imag.mare = `${obImagini.cale_galerie}/${nume_imag}.png`
//         if(!fs.existsSync(imag.mic))
//             sharp(__dirname + "/" + imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic)
//     }
// }
// creeazaImagini();
app.get(["/","/index"], function(req, res){
    
    console.log(req.ip);
    res.render("pagini/index", {ip:req.ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie}); //calea relativa la folderul views
    
});

app.get("/*.ejs",function(req,res){
    res.status(403).render("pagini/403");
})

app.get("/*",function(req, res){
    console.log(req.url);
    res.render("pagini" + req.url, function(err,rezultatRender){
        console.log(err);
        if (err){
            if (err.message.includes("Failed to lookup")){
                res.status(404).render("pagini/404");
                return;
            }
            else {
                console.log(err);
                res.render("pagini/eroare_generala");
                return;
        }
    }
        res.send(rezultatRender);
    });
});

var s_port = process.env.PORT || 8082
app.listen(s_port);
console.log("Serverul a pornit");