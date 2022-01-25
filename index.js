const express= require("express");
const fs=require('fs');
const sharp=require('sharp');
const ejs=require('ejs');
const {Client}= require("pg");
const path = require('path');
const sass=require('sass');
const formidable= require('formidable');
const crypto= require('crypto');
const nodemailer= require('nodemailer');
const session= require('express-session');
const xmljs = require('xml-js');
const request = require('request');
const html_to_pdf = require('html-pdf-node');
var QRCode = require('qrcode');
const helmet=require('helmet');
var app = express();






var client; //folosit pentru conexiunea la baza de date
if(process.env.SITE_ONLINE){
      protocol="https://";
      numeDomeniu="sleepy-plateau-70184.herokuapp.com/"
       client = new Client({
                    user: "zcgronvaxbgtkt",
                    password:"84c26b6ddb1f2e73c6207d247e5d883ea20715a7e9f8ddbce2e7d548749c9aa8",
                    host:'ec2-34-206-238-105.compute-1.amazonaws.com', 
                    port:5432, 
                    database:"d1ti9t4fb3kj77",
                    ssl: {
                        rejectUnauthorized: false
                    }});

  }
  else{
      client = new Client({user: "andreean", password:"parola", host:'localhost', port:5432, database:"db_proiectTW"});
      protocol="http://";
      numeDomeniu="localhost:8082";
  }
  
  client.connect();
  app.use(helmet.frameguard());//task 22 pentru a nu se deschide paginile site-ului in frame-uri

  app.use(["/produse_cos","/cumpara", "/sterge_poza"],express.json({limit:'2mb'}));//obligatoriu de setat pt request body de tip json
//trec mai jos paginile cu cereri post pe care vreau sa le tratez cu req.body si nu cu formidable

app.use(["/contact"], express.urlencoded({extended:true}));

app.use(session({
  secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
  resave: true,
  saveUninitialized: false
}));
console.log(__dirname);

app.set("view engine", "ejs");

app.use("/resurse",express.static(__dirname + "/resurse"));
app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// setam pentru toate cererile ca in locals sa avem campul utilizator cu valoarea preluata din datele salvate in sesiune
//obiectul req.session.utilizator a fost creat cand utilizatorul a facut cerere catre /login
app.use("/*", function(req,res,next){
    res.locals.utilizator=req.session.utilizator;
    //TO DO de adaugat vectorul de optiuni pentru meniu (sa se transmita pe toate paginile)
    next();
  });
var v_optiuni=[];
client.query(
  "select * from unnest(enum_range(null::categorie_produse))",
  function (errCateg, rezCateg) {
    for (let elem of rezCateg.rows) {
      v_optiuni.push(elem.unnest);
    }
    // console.log(v_optiuni);
  }
);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Resetare folder imagini qr-code 
cale_qr="./resurse/imagini/qrcode";
if (fs.existsSync(cale_qr))
  fs.rmSync(cale_qr, {force:true, recursive:true});
fs.mkdirSync(cale_qr);
client.query("select id from produse", function(err, rez){
    for(let prod of rez.rows){
        let cale_prod=protocol+numeDomeniu+"/produs/"+prod.id;
        //console.log(cale_prod);
        QRCode.toFile(cale_qr+"/"+prod.id+".png",cale_prod);
    }
});

var ipuri_active={};


app.use(function(req,res,next){
    let ipReq=getIp(req);
    let ip_gasit=ipuri_active[ipReq+"|"+req.url];
    //console.log("=================", ip_gasit, ipuri_blocate);
    timp_curent=new Date();
    if(ip_gasit){
    
        if( (timp_curent-ip_gasit.data)< 5*1000) {//diferenta e in milisecunde; verific daca ultima accesare a fost pana in 5 secunde
            if (ip_gasit.nr>10){//mai mult de 10 cereri 
                res.send("<h1>Prea multe cereri intr-un interval scurt. Ia te rog sa fii cuminte, da?!</h1>");
                ip_gasit.data=timp_curent
                return;
            }
            else{  
                
                ip_gasit.data=timp_curent;
                ip_gasit.nr++;
            }
        }
        else{
            //console.log("Resetez: ", req.ip+"|"+req.url, timp_curent-ip_gasit.data)
            ip_gasit.data=timp_curent;
            ip_gasit.nr=1;//a trecut suficient timp de la ultima cerere; resetez
        }
    }
    else{

        //nu mai folosesc baza de date fiindca e prea lenta
        //var queryIp=`select ip, data_accesare from accesari where (now() - data_accesare < interval '00:00:05' ) and ip='${req.ip}' and pagina='${req.url}' `;
        //console.log(queryIp);
        /*
        client.query(queryIp, function(err,rez){
            //console.log(err, rez);
            if (!err){
                if(rez.rowCount>4)
                    {res.send("<h1>Ia te rog sa fii cuminte, da?!</h1>");
                    let ip_gasit=ipuri_blocate.find(function(elem){ return elem.ip==req.ip});
                    if(!ip_gasit)
                        ipuri_blocate.push({ip:req.ip, data:new Date()});
                    //console.log("ipuri_blocate: ",ipuri_blocate);
                    return;
                    }
        */
        ipuri_active[ipReq+"|"+req.url]={nr:1, data:timp_curent};
        //console.log("am adaugat ", req.ip+"|"+req.url);
        //console.log(ipuri_active);
        

    }
    let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (ipReq){
        var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
        //console.log("id_utiliz", id_utiliz);
        client.query(comanda_param, [ipReq, id_utiliz, req.url], function(err, rez){
            if(err) console.log(err);
        });
    }
    next();   
}); 

function stergeAccesariVechi(){
    let comanda= `delete from accesari where now() - data_accesare > interval '10 minutes'`;
    //console.log(comanda);
    client.query(comanda, function(err, rez){
        if(err) console.log(err);
    });
    let timp_curent=new Date();
    for( let ipa in ipuri_active){
        if (timp_curent-ipuri_active[ipa].data>2*60*1000){ // daca sunt mai vechi de 2 minute le deblochez
            console.log("Am deblocat ", ipa);
            delete ipuri_active[ipa];
        }
    }
}


setInterval(stergeAccesariVechi,10*60*1000);


//////////////////////////////////////////////////////////////////////////////////////////////////
// setarea folderelor statice de resurse; TO DO cel de poze_uploadate

client.query("select * from produse", function(err, rez){
    //console.log(err);
    //console.log(rez);
});




app.get("/produse", function (req, res) {
  console.log(req.query);
  var conditie = "";
  if (req.query.tip) conditie += ` and tip_produs='${req.query.tip}'`;
  client.query(
    `select * from produse where 1=1 ${conditie}`,
    function (err, rez) {
      console.log(err);
      if (!err) {
        //console.log(rez);
        client.query(
          "select * from unnest(enum_range(null::categorie_produse))",
          function (errCateg, rezCateg) {
            v_optiuni = [];
            for (let elem of rezCateg.rows) {
              v_optiuni.push(elem.unnest);
            }
            console.log(v_optiuni);
            res.render("pagini/produse", {
              produse: rez.rows,
              optiuni: v_optiuni,
            });
          }
        );
      }
      else{//TO DO 
        console.log(err);
    }
    }
  );
});

app.get("/produs/:id", function(req, res){
    console.log(req.params)
    client.query(`select * from produse where id=${req.params.id}`, function(err,rez){
        if (!err){
            console.log(rez);
            res.render("pagini/produs",{prod:rez.rows[0]});
        }
        else{//TO DO curs
        }
    })
})

async function trimitefactura(username, email,numefis){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"andreeann2021@gmail.com",
			pass:"andreea123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"andreeann2021@gmail.com",
		to:email,
		subject:"Factură",
		text:"Stimate "+username+", aveți atașată factura",
		html:"<h1>Salut!</h1><p>Stimate "+username+", aveți atașată factura</p>",
        attachments: [
            {   // utf-8 string as an attachment
                filename: 'factura.pdf',
                content: fs.readFileSync(numefis)
            }
        ]
	})
	console.log("trimis mail");
}







app.post("/produse_cos",function(req, res){
    
	//console.log("req.body: ",req.body);
    //console.log(req.get("Content-type"));
    //console.log("body: ",req.get("body"));

    /* prelucrare pentru a avea toate id-urile numerice si pentru a le elimina pe cele care nu sunt numerice */
    var iduri=[]
    for (let elem of req.body.ids_prod){
        let num=parseInt(elem);
        if (!isNaN(num))//daca este numar
            iduri.push(num);
    }
    if (iduri.length==0){
        res.send("eroare");
        return;
    }

    //console.log("select id, nume, pret, gramaj, calorii, categorie, imagine from produse where id in ("+iduri+")");
    client.query("select id, nume, pret, marime, culoare, categorie, materiale, imagine from produse where id in ("+iduri+")", function(err,rez){
        //console.log(err, rez);
        //console.log(rez.rows);
        res.send(rez.rows);
       
       
    });

    
});


app.post("/cumpara",function(req, res){
    if(!req.session.utilizator){
        res.write("Nu puteti cumpara daca nu sunteti logat!");res.end();
        return;
    }
    console.log("select id, nume, pret, marime, culoare, categorie, materiale, imagine from produse where id in ("+req.body.ids_prod+")");
    client.query("select id, nume, pret, marime, culoare, categorie, materiale, imagine from produse where id in ("+req.body.ids_prod+")", function(err,rez){
        //console.log(err, rez);
        //console.log(rez.rows);
        
        let rezFactura=ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf8"),{utilizator:req.session.utilizator,produse:rez.rows, protocol:protocol, domeniu:numeDomeniu});
        //console.log(rezFactura);
        let options = { format: 'A4', args: ['--no-sandbox'] };

        let file = { content: rezFactura };

        html_to_pdf.generatePdf(file, options).then(function(pdf) {
            if(!fs.existsSync("./temp"))
                fs.mkdirSync("./temp");
            var numefis="./temp/test"+(new Date()).getTime()+".pdf";
            fs.writeFileSync(numefis,pdf);
            trimitefactura(req.session.utilizator.username, req.session.utilizator.email, numefis);
            res.write("Totul bine!");res.end();
        });
       
        
       
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
  nr_imag_random = numere[Math.floor(Math.random() * numere.length)];
  var array=obImagini.imagini;
  for (let imag of array) {
          lista_imagini.push(imag);
          if (lista_imagini.length == nr_imag_random) {
              break;
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
  let rezScss=ejs.render(sirScss,{nr_imagini: nr_imag_random});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
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

function getIp(req){//pentru Heroku
  var ip = req.headers["x-forwarded-for"];
  if (ip){
      let vect=ip.split(",");
      return vect[vect.length-1];
  } 
  else if (req.ip){
      return req.ip;
  }
  else{
   return req.connection.remoteAddress;
  }
}

// app.get(["/", "/index", "/home"], function (req, res) {
//   console.log(req.ip);
//   res.render("pagini/index", {
//     ip: req.ip,
//     imagini: obImagini.imagini,
//     cale: obImagini.cale_galerie,
//   });
// });

app.get(["/","/index","/home"], function(req,res){
  var rezultat;
  client.query("select username, nume from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare < interval '5 minutes' )").then(function(rezultat){
      console.log("rezultat", rezultat.rows);
      var evenimente=[]
      var locatie="";
      
      request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', //se inlocuieste cu req.ip; se testeaza doar pe Heroku
          function (error, response, body) {
          if(error) {console.error('error:', error)}
          else{
              var obiectLocatie=JSON.parse(body);
              //console.log(obiectLocatie);
              locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
          }

          //generare evenimente random pentru calendar 
          
          var texteEvenimente=["Reduceri sandale", "Reduceri adiadasi", "Intalnire cu Real Madrid", "Primul produs gratis", "Reduceri finale"];
          dataCurenta=new Date();
          for(i=0;i<texteEvenimente.length-2;i++){
              evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*27) ), text:texteEvenimente[i]});
          }
          primaZiLuna = new Date(dataCurenta.getFullYear(),  dataCurenta.getMonth(), 1);
          if(primaZiLuna.getDay() == 1){
              evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), primaZiLuna.getDate()), text: texteEvenimente[3]});
          }
          if(dataCurenta.getFullYear()%400==0 || (dataCurenta.getFullYear()%4==0 && dataCurenta.getFullYear()%100!=0))
          nrZile=[31,29,31,30,31,30,31,31,30,31,30,31];
          else
          nrZile=[31,28,31,30,31,30,31,31,30,31,30,31];
          let nrZileCalendar=nrZile[dataCurenta.getMonth()]
          ultimaZiLuna = new Date(dataCurenta.getFullYear(),  dataCurenta.getMonth(), nrZileCalendar);
          evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), nrZileCalendar-ultimaZiLuna.getDay()), text: texteEvenimente[4]})
          evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), nrZileCalendar-ultimaZiLuna.getDay()-1), text: texteEvenimente[4]})
          
          console.log(evenimente)
          res.render("pagini/index", {evenimente: evenimente, locatie:locatie,utiliz_online: rezultat.rows, ip:getIp(req),imagini:obImagini.imagini, cale:obImagini.cale_galerie, mesajLogin:req.session.mesajLogin});
          req.session.mesajLogin=null;
          
          });
          
      //res.render("pagini/index", {evenimente: evenimente, locatie:locatie,utiliz_online: rezultat.rows, ip:req.ip,imagini:obImagini.imagini, cale:obImagini.cale_galerie, mesajLogin:req.session.mesajLogin});
           
  }, function(err){console.log("eroare",err)});

 // res.render("pagini/index",{ip:req.ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie});//calea relativa la folderul views
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// Administrarea utilizatorilor (inregistrare, login, logout, update profil)

sirAlphaNum="";
v_intervale=[[66,68],[70,72],[74,78],[80,84],[86,90]];
for (let interval of v_intervale){
    for (let i=interval[0];i<=interval[1];i++)
        sirAlphaNum+=String.fromCharCode(i);
}
console.log(sirAlphaNum);



function genereazaToken(lungime){
    sirAleator="";
    for(let i=0;i<lungime; i++){
        sirAleator+= sirAlphaNum[ Math.floor( Math.random()* sirAlphaNum.length) ];
    }
    return sirAleator
}


/*
Pentru task trebuie sa folositi o adresa de gmail creata de voi! Nu folositi cea data la curs fiindca parola e cunoscuta de toti si oricine o poate modifica
Nu folositi o adresa de gmail reala ci faceti una speciala pentru proiect!!!!!!
Pentru a pute folosi adresa de gmail trebuie sa :
1) Mergeti Pe pagina de Google Account (Manage google account). Alegeti tabul security (in dreapta). Setati Less Secure App Access pe "On"
2) Accesati https://accounts.google.com/b/0/DisplayUnlockCaptcha si dati click pe Continue - 
- uneori DisplayUnlockCaptcha se reseteaza si trebuie sa intrati din nou pe link daca vedeti ca nu merge trimiterea mailului. Problema e de la Heroku care schimba ip-ul fiindca folosim o versiune free

*/

async function trimiteMail(username, email, token1, token2){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"andreeann2021@gmail.com",
			pass:"andreea123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"andreeann2021@gmail.com",
		to:email,
		subject:"Mesaj inregistrare",
		text:"Pe " + numeDomeniu + " ai username-ul " + username +", începând de azi, "+ new Date(),
		html:`<h1>Salut!</h1><p>` + 
        "Pe " + numeDomeniu + " ai username-ul " + username +", începând de azi, <span style='color: purple; text-decoration: underline'>"
        + new Date() + 
        `</span></p> <p><a href='http://${numeDomeniu}/confirmare_mail/${token1}/${username}/${token2}'>Click aici pentru confirmare</a></p>`,
   
    
    // <p style="color:purple;">${data_adaugare}</p>
	})
	console.log("trimis mail");
}


//Este un salt (string) folosit pentru criptarea parolelor din tabelul de utilizatori:
parolaCriptare="andreea123";



//Tratarea linkurilor de confirmare a contului, trimise pe mail. Un link de confirmare arata cam asa:
//http://localhost:8080/cod/prof68847/ITuZgIuj42z9067uqTfs69JjOM6wJWBS1c4fQzoKwgrfQfTTaMpsB6kS0yjD4TKlzSKL1wWjR7VWUyqAkjZyRejDcfxcpFVTHZSV

app.get("/confirmare_mail/:token1/:user/:token2", function(req,res){
    token = req.params.token1 + '/' + req.params.user + '/' + req.params.token2;
    var queryUpdate=`update utilizatori set confirmat_mail=true where username = '${req.params.user}' and cod= '${token}' `;
    client.query(queryUpdate, function(err, rez){
        if (err){
            console.log(err);
            res.render("pagini/eroare",{err:"Eroare baza date"});
            return;
        }
        if (rez.rowCount>0){
            res.render("pagini/confirmare");
        }
        else{
            res.render("pagini/eroare",{err:"Eroare link"});
        }
    });

});

app.post("/inreg", function(req, res){
    var formular= new formidable.IncomingForm();
    var username;
    var filePath = '';
    formular.parse(req,function(err, campuriText, campuriFile){//4
        console.log(campuriText);
        console.log("Email: ", campuriText.email);
        //verificari - TO DO
        var eroare="";
        if (!campuriText.username)
            eroare+="Username-ul nu poate fi necompletat. ";
        //TO DO - de completat pentru restul de campuri required
        if( !campuriText.nume.match("^[A-Z][a-z]+([-\.][A-Z][a-z]+)?$"))
            eroare+="Numele trebuie sa inceapa cu majuscula si poate fi alcatuit din doua nume (ex: Ionescu-Pop)"
        if( !campuriText.prenume.match("^[A-Z][a-z]+([-\.][A-Z][a-z]+)?$"))
            eroare+="Prenumele trebuie sa inceapa cu majuscula si poate fi alcatuit din doua nume (ex: Andrei-Ionut)"
            
        if ( !campuriText.username.match("^[A-Za-z0-9]+$"))
            eroare+="Username-ul trebuie sa contina doar litere mici/mari si cifre. ";
        //TO DO - de completat pentru restul de campuri functia match
        if ( !campuriText.parola.match("^[A-Z]+[a-z]+[0-9]{2,}[.]$"))
            eroare+="Parola trebuie sa contina minim o majuscula, minim o litera mica, minim 2 cifre si caracterul . in aceasta ordine."
        if( !campuriText.email.match("^[A-Za-z0-9]+([-._A-Za-z0-9]+?)+@+[a-z]+.+[a-z]$"))
            eroare+="Email-ul trebuie sa fie de forma abcabc@ceva.com sau intre litere puteti adauga caracterele .-_"
        if (eroare!=""){
            res.render("pagini/inregistrare",{err:eroare});
            return;
        }

        queryVerifUtiliz=` select * from utilizatori where username= '${campuriText.username}' `;
        console.log(queryVerifUtiliz)
        
        client.query(queryVerifUtiliz, function(err, rez){
            if (err){
                console.log(err);
                res.render("pagini/inregistrare",{err:"Eroare baza date"});
            }
            
            else{
                if (rez.rows.length==0){

                    var criptareParola=crypto.scryptSync(campuriText.parola,parolaCriptare,32).toString('hex');
                    var token2=genereazaToken(100);
                    var data = new Date();
                    var token1 = '' + data.getFullYear() + data.getMonth() + data.getDay() + data.getHours() + data.getMinutes() + data.getSeconds();
                    var token = token1 +'/' + campuriText.username + '/' + token2;
                    var queryUtiliz=`insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, problema_vedere,fotografie,cod) values ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::boolean, $8::text, $9::text)`; 
                    console.log(queryUtiliz, criptareParola);
                    client.query(queryUtiliz, [campuriText.username, campuriText.nume, campuriText.prenume, criptareParola, campuriText.email, campuriText.culoareText, campuriText.checkbox_vedere, filePath, token], function(err, rez){ //TO DO parametrizati restul de query
                        if (err){
                            console.log(err);
                            res.render("pagini/inregistrare",{err:"Eroare baza date"});
                        }
                        else{
                            trimiteMail(campuriText.username,campuriText.email, token1, token2);
                            res.render("pagini/inregistrare",{err:"", raspuns:"Date introduse"});
                        }
                    });
                }
                else{
                    eroare+="Username-ul mai exista. ";
                    res.render("pagini/inregistrare",{err:eroare});
                }
            }
        });
    }); 
    formular.on("field", function(nume,val){  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
        console.log("----> ",nume, val );
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        if(!fisier.originalFilename)
            return;
        folderUtilizator=__dirname+"/poze_uploadate/"+username+"/";
        console.log("----> ",nume, fisier);
        if (!fs.existsSync(folderUtilizator)){
            fs.mkdirSync(folderUtilizator);
            v = fisier.originalFilename.split(".");
            fisier.filepath = folderUtilizator + "poza." + v[v.length-1];//setez calea de upload
            filePath = "/poze_uploadate/" + username + "/" + "poza." + v[v.length-1];
            console.log(filePath)
        }
        
    })    
    formular.on("file", function(nume,fisier){//3
        //s-a terminat de uploadat
        console.log("fisier uploadat");
    });        
});

app.post("/login", function(req, res){
    var formular= new formidable.IncomingForm();

    formular.parse(req,function(err, campuriText, campuriFile){
        console.log(campuriText);
        
        var querylogin=`select * from utilizatori where username= '${campuriText.username}' `;
        client.query(querylogin, function(err, rez){
            if(err){
                res.render("pagini/eroare",{mesaj:"Eroare baza date. Incercati mai tarziu."});
                return;
            }
            if (rez.rows.length!=1){//ar trebui sa fie 0
                res.render("pagini/eroare",{mesaj:"Username-ul nu exista."});
                return;
            }
            var criptareParola=crypto.scryptSync(campuriText.parola,parolaCriptare,32).toString('hex'); 
            console.log(criptareParola);
            console.log(rez.rows[0].parola);
            if (criptareParola == rez.rows[0].parola){
              if ( !rez.rows[0].confirmat_mail){
                res.render("pagini/index",{ip:req.ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie,mesajLogin:"Mail-ul nu a fost confirmat"});
                return
              }
                console.log("totul ok");
                req.session.mesajLogin=null;//resetez in caz ca s-a logat gresit ultima oara
                if(req.session){
                    req.session.utilizator={
                        id:rez.rows[0].id,
                        username:rez.rows[0].username,
                        nume:rez.rows[0].nume,
                        prenume:rez.rows[0].prenume,
                        culoare_chat:rez.rows[0].culoare_chat,
                        email:rez.rows[0].email,
                        rol:rez.rows[0].rol,
                        data_adaugare: rez.rows[0].data_adaugare,
                        problema_vedere: rez.rows[0].problema_vedere
                    }
                }
                // res.render("pagini"+req.url);
                res.redirect("/index");
            }
            else{
                req.session.mesajLogin="Login esuat";
                res.redirect("/index");
                //res.render("pagini/index",{ip:req.ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie,mesajLogin:"Login esuat"});
            }

        });
        

    });
});

app.post("/profil", function(req, res){
    var username;
    console.log("profil");
    if (!req.session.utilizator){
        res.render("pagini/eroare",{mesaj:"Nu sunteti logat."});
        return;
    }
    var formular= new formidable.IncomingForm();

    formular.parse(req,function(err, campuriText, campuriFile){
        console.log(err);
        console.log(campuriText);
        var criptareParola=crypto.scryptSync(campuriText.parola,parolaCriptare,32).toString('hex'); 
        var criptareParolaNoua=crypto.scryptSync(campuriText.rparola,parolaCriptare,32).toString('hex'); 
        //toti parametrii sunt cu ::text in query-ul parametrizat fiindca sunt stringuri (character varying) in tabel
        var queryUpdate=`update utilizatori set nume=$1::text, prenume=$2::text, email=$3::text, culoare_chat=$4::text,  parola=$7::text, problema_vedere=$8::boolean where username= $5::text and parola=$6::text `;
        if(campuriText.rparola == '')
        criptareParolaNoua = criptareParola;
        if(!campuriText.checkbox_vedere)
        campuriText.checkbox_vedere = 'false';
        client.query(queryUpdate, [campuriText.nume, campuriText.prenume, campuriText.email, campuriText.culoareText, req.session.utilizator.username, criptareParola,  criptareParolaNoua, campuriText.checkbox_vedere], function(err, rez){
            if(err){
                console.log(err);
                res.render("pagini/eroare",{mesaj:"Eroare baza date. Incercati mai tarziu."});
                return;
            }
            console.log(rez.rowCount);
            if (rez.rowCount==0){
                res.render("pagini/profil",{mesaj:"Update-ul nu s-a realizat. Verificati parola introdusa."});
                return;
            }
        
            
            req.session.utilizator.nume=campuriText.nume;
            req.session.utilizator.prenume=campuriText.prenume;
            
            req.session.utilizator.culoare_chat=campuriText.culoareText;
            req.session.utilizator.email=campuriText.email;
            req.session.utilizator.problema_vedere = campuriText.checkbox_vedere;
            
            res.render("pagini/profil",{mesaj:"Update-ul s-a realizat cu succes."});

        });
        

    });
    formular.on("field", function(nume,val){  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
        console.log("----> ",nume, val );
        if(nume=="username")
            username=val;
    }) 
    formular.on("fileBegin", function(nume,fisier){ //2
        if(!fisier.originalFilename)
            return;
        folderUtilizator=__dirname+"/poze_uploadate/"+username+"/";
        console.log("----> ",nume, fisier);
        
        if (!fs.existsSync(folderUtilizator)){
            fs.mkdirSync(folderUtilizator);
        }
        v = fisier.originalFilename.split(".");
        fisier.filepath = folderUtilizator + "poza." + v[v.length-1];//setez calea de upload
        filePath = "/poze_uploadate/" + username + "/" + "poza." + v[v.length-1];
        console.log(filePath)
        
    })
});


app.get("/logout",function(req,res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.redirect("/index");
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// Pagini/cereri pentru admin

app.get('/useri', function(req, res){
	
	if( req.session && req.session.utilizator && req.session.utilizator.rol=="admin" ){
        client.query("select * from utilizatori",function(err, rezultat){
            if(err) throw err;
            //console.log(rezultat);
            res.render('pagini/useri',{useri:rezultat.rows});//afisez index-ul in acest caz
        });
	} 
    else{
		res.status(403).render('pagini/eroare',{mesaj:"Nu aveti acces"});
	}
    
});




app.post("/sterge_utiliz",function(req, res){
	if( req.session && req.session.utilizator && req.session.utilizator.rol=="admin"  ){
	var formular= new formidable.IncomingForm()
	
	formular.parse(req, function(err, campuriText, campuriFisier){
		//var comanda=`delete from utilizatori where id=${campuriText.id_utiliz} and rol!='admin'`;
        var comanda=`delete from utilizatori where id=$1 and rol !='admin' and nume!= $2::text `;
		client.query(comanda, [campuriText.id_utiliz,"Mihai"],  function(err, rez){
			// TO DO mesaj cu stergerea
            if(err)
                console.log(err);
            else{
                if (rez.rowCount>0){
                    console.log("sters cu succes");
                }
                else{
                    console.log("stergere esuata");
                }
            }
		});
	});
	}
	res.redirect("/useri");
	
});




///////////////////////////////////////////////////////////////////////////////////////////////
//////////////// Contact
caleXMLMesaje="resurse/xml/contact.xml";
headerXML=`<?xml version="1.0" encoding="utf-8"?>`;
function creeazaXMlContactDacaNuExista(){
    if (!fs.existsSync(caleXMLMesaje)){
        let initXML={
            "declaration":{
                "attributes":{
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name":"contact",
                    "elements": [
                        {
                            "type": "element",
                            "name":"mesaje",
                            "elements":[]                            
                        }
                    ]
                }
            ]
        }
        let sirXml=xmljs.js2xml(initXML,{compact:false, spaces:4});
        console.log(sirXml);
        fs.writeFileSync(caleXMLMesaje,sirXml);
        return false; //l-a creat
    }
    return true; //nu l-a creat acum
}


function parseazaMesaje(){
    let existaInainte=creeazaXMlContactDacaNuExista();
    let mesajeXml=[];
    let obJson;
    if (existaInainte){
        let sirXML=fs.readFileSync(caleXMLMesaje, 'utf8');
        obJson=xmljs.xml2js(sirXML,{compact:false, spaces:4});
        

        let elementMesaje=obJson.elements[0].elements.find(function(el){
                return el.name=="mesaje"
            });
        let vectElementeMesaj=elementMesaje.elements?elementMesaje.elements:[];
        console.log("Mesaje: ",obJson.elements[0].elements.find(function(el){
            return el.name=="mesaje"
        }))
        let mesajeXml=vectElementeMesaj.filter(function(el){return el.name=="mesaj"});
        return [obJson, elementMesaje,mesajeXml];
    }
    return [obJson,[],[]];
}
async function trimiteMailStergere(nume, prenume, email){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"andreeann2021@gmail.com",
			pass:"andreea123"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"test.tweb.node@gmail.com",
		to:email,
		subject:"Mesaj stergere",
		text:"Nu ne mai plăcea cum arăți, [prenume nume], așa că ți-am șters poza. Sorry! ",
		html:`<h1>Salut!</h1><p>` + "Nu ne mai plăcea cum arăți, " + nume + " "+ prenume + ", așa că ți-am șters poza. Sorry!</p>"
	})
	console.log("trimis mail");
}

app.get("/contact", function(req, res){
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] =parseazaMesaje();

    res.render("pagini/contact",{ utilizator:req.session.utilizator, mesaje:mesajeXml})
});

app.post("/contact", function(req, res){
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] =parseazaMesaje();
        
    let u= req.session.utilizator?req.session.utilizator.username:"anonim";
    let mesajNou={
        type:"element", 
        name:"mesaj", 
        attributes:{
            username:u, 
            data:new Date()
        },
        elements:[{type:"text", "text":req.body.mesaj}]
    };
    if(elementMesaje.elements)
        elementMesaje.elements.push(mesajNou);
    else 
        elementMesaje.elements=[mesajNou];
    console.log(elementMesaje.elements);
    let sirXml=xmljs.js2xml(obJson,{compact:false, spaces:4});
    console.log("XML: ",sirXml);
    fs.writeFileSync("resurse/xml/contact.xml",sirXml);
    
    res.render("pagini/contact",{ utilizator:req.session.utilizator, mesaje:elementMesaje.elements})
});

app.post("/sterge_poza", function(req, res) {
    client.query("SELECT nume, prenume, email, fotografie FROM utilizatori WHERE id=" + req.body.userId, function(err, rez) {
        if(rez.rowCount != 0 ) {
            fs.rmSync(__dirname + "/" + rez.rows[0].fotografie);
            client.query("update utilizatori set fotografie='' where id=" + req.body.userId, function(err, rezUpdate){
                if(err) {
                    console.log(err);
                }
                else {
                    trimiteMailStergere(rez.rows[0].nume, rez.rows[0].prenume, rez.rows[0].email);
                }
            });
        }
    });

});

///////////////////////////////////////////////////////////////////////////////////////////////
////////////// Cereri generale

app.get("/favicon.ico",function(req,res){//uneori browserul cere faviconul pentru a adauga paginain bookmarks sau in "pagini recente"
    res.sendFile("./resurse/imagini/favicon.ico");
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


