const express = require("express");
const path = require("path");
const { Client } = require("pg");
const ejs = require("ejs");
const sharp = require("sharp");
const fs = require("fs");
app = express();

console.log(__dirname);

app.set("view engine", "ejs");

// var client = new Client({user: "andreean", password:"parola", host:'localhost', port:5432, database:"db_proiectTW"});
var client = new Client({
    user: "zcgronvaxbgtkt",
    password:"84c26b6ddb1f2e73c6207d247e5d883ea20715a7e9f8ddbce2e7d548749c9aa8",
    host:'ec2-34-206-238-105.compute-1.amazonaws.com', 
    port:5432, 
    database:"d1ti9t4fb3kj77",
    ssl: {
        rejectUnauthorized: false
    }});
client.connect();


app.use("/resurse", express.static(__dirname + "/resurse"));

app.get("/produse", function (req, res) {
  console.log(req.query);
  client.query("SELECT * FROM produse", function (err, rez) {
    res.render("pagini/produse", { produse: rez.rows });
  });
});

app.get(["/", "/index", "/home"], function (req, res) {
  console.log(req.ip);

  //-----------galerie
  var buf = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf-8");
  obImagini = JSON.parse(buf);
  console.log(obImagini);

  res.render("pagini/index", {
    ip: req.ip,
    imagini: obImagini.imagini,
    cale: obImagini.cale_galerie,
  });
});

app.get("/*.ejs", function (req, res) {
  res.status(403).render("pagini/403");
});

app.get("/*", function (req, res) {
  console.log(req.url);
  res.render("pagini" + req.url, function (err, rezultatRender) {
    console.log(err);
    if (err) {
      if (err.message.includes("Failed to lookup")) {
        res.status(404).render("pagini/404");
        return;
      } else {
        console.log(err);
        res.render("pagini/eroare_generala");
        return;
      }
    }
    res.send(rezultatRender);
  });
});

var s_port = process.env.PORT || 8082;
app.listen(s_port);

console.log("Serverul a pornit");