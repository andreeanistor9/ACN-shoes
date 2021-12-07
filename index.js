const express= require("express");
const fs=require('fs');
const sharp=require('sharp');
const ejs=require('ejs');
const {Client}= require("pg");
const path = require('path');
const sass=require('sass');
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

function creeazaImagini(){
  var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
  obImagini=JSON.parse(buf);//global
  console.log(obImagini);
  for (let imag of obImagini.imagini){
      let nume_imag, extensie;
      [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"]
      let dim_mic=200
      
      imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
      console.log(imag.mic);

      let dim_mediu=300
      imag.mediu = `${obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.jpg`;
      imag.mare = `${obImagini.cale_galerie}/${nume_imag}.jpg`;

      if (!fs.existsSync(imag.mic))
        sharp(__dirname + "/" + imag.mare)
          .resize(dim_mic)
          .toFile(__dirname + "/" + imag.mic);

      if (!fs.existsSync(imag.mediu))
        sharp(__dirname + "/" + imag.mare)
          .resize(dim_mediu)
          .toFile(__dirname + "/" + imag.mediu);     
      
  }

}
creeazaImagini();

function get_anotimp(){
  today = new Date();
  luna = today.getMonth()+1;
  console.log(luna);
  if(luna == 12 || (luna >=1 && luna <=2))
    anotimp = "iarna";
  if(luna >=3 && luna <=5)
    anotimp = "primavara";
  if(luna >=6 && luna <=8)
    anotimp = "vara"
  if(luna >=9 && luna <=11)
    anotimp = "toamna"

  // console.log(anotimp)
}

get_anotimp();

function get_imag_animate() {
  var lista_imagini = [];
  var numere = [5,7,9,11];
  nr_imag_aleatoare_calculat = numere[Math.floor(Math.random() * numere.length)];
  var array=obImagini.imagini;
  for (let imag of array) {
      if (imag.titlu.length>=1) {
          lista_imagini.push(imag);
          if (lista_imagini.length == nr_imag_aleatoare_calculat) {
              break;
          }
      }
  }
  return lista_imagini;
}
get_imag_animate();
app.get("*/galerie-animata.css",function(req, res){
  /*Atentie modul de rezolvare din acest app.get() este strict pentru a demonstra niste tehnici
  si nu pentru ca ar fi cel mai eficient mod de rezolvare*/
  res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
  let sirScss=fs.readFileSync("./resurse/scss/galerie_animata.scss").toString("utf-8");//citesc scss-ul cs string
  let rezScss=ejs.render(sirScss,{nr_imagini: nr_imag_aleatoare_calculat});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
  // console.log(rezScss);
  fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar

let cale_css=path.join(__dirname,"temp","galerie-animata.css");//__dirname+"/temp/galerie-animata.css"
let cale_scss=path.join(__dirname,"temp","galerie-animata.scss");
sass.render({file: cale_scss, sourceMap:true}, function(err, rezCompilare) {
  console.log(rezCompilare);
  if (err) {
          console.log(`eroare: ${err.message}`);
         
          res.end();
          return;
      }
  fs.writeFileSync(cale_css, rezCompilare.css, function(err){
    if(err){console.log(err);}
  });
  res.sendFile(cale_css);
});
});

app.get("*/galerie-animata.css.map",function(req, res){
  res.sendFile(path.join(__dirname,"temp/galerie-animata.css.map"));
});

app.get(["/", "/index", "/home"], function (req, res) {
  console.log(req.ip);
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