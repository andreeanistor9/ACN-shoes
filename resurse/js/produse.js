window.onload = function () {
  var btn = document.getElementById("filtrare");
  
  btn.onclick = function () {
    var articole = document.getElementsByClassName("produs");
    for (let art of articole) {
      art.style.display = "none";

      var nume = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
      var nume_introdus = document.getElementById("inp-nume").value.toLowerCase();
      let nr = 0;
      
        if(nume.length == nume_introdus.length)
        for (let i=0; i< nume.length; i++){
          if(nume[i].trim() != nume_introdus[i].trim()){
            nr+=1;
          }
          if(nr<=2)
          var conditie1 = true;
          else
          conditie1 = false;
        }
    
      if(nume_introdus.length == 0)
        conditie1 = true;
        

      var pret = art.getElementsByClassName("val-pret")[0];
      var conditie2 =
        parseInt(pret.innerHTML) >
        parseInt(document.getElementById("inp-pret").value);

      var pret = art.getElementsByClassName("val-pret")[0];
      var conditie2 =
        parseInt(pret.innerHTML) >
        parseInt(document.getElementById("inp-pret").value);
      
      
      var radbtns = document.getElementsByName("gr_rad");
      for (let rad of radbtns) {
        if (rad.checked) {
          var valMarimi = rad.value;
          break;
        }
      }
      var conditie3 = false;
      var sir = art.getElementsByClassName("val-marimi")[0].innerHTML.split(',')
      for (let marime of sir){
      var marimiArt = parseInt(marime);
      
      switch (valMarimi) {
        case "1":
          conditie3 = conditie3 || marimiArt < 36;
          break;
        case "2":
          conditie3 = conditie3 || (36 <= marimiArt && marimiArt < 41);
          break;
        case "3":
          conditie3 = conditie3 || (41 <=  marimiArt && marimiArt < 47);
          break;
        default:
          conditie3 = true;
      }
    }

      console.log(conditie3);

      var selCateg = document.getElementById("inp-categorie");
      var conditie4 =
        art.getElementsByClassName("val-categorie")[0].innerHTML ==
        selCateg.value || selCateg.value == "toate";

      var selCateg = document.getElementById("inp-categorie");
      var conditie4 =
        art.getElementsByClassName("val-categorie")[0].innerHTML ==
          selCateg.value || selCateg.value == "toate";
      
      var conditie5 = false;
      var optiuni = document.getElementById("i_sel_multiplu").options;
      sir = [];
      for (let opt of optiuni) {
        if (opt.selected) sir.push(opt.value);
      }
      if (
        sir.includes(
          art.getElementsByClassName("val-categorie")[0].innerHTML
        ) ||
        sir.includes("toate")
      )
        conditie5 = true;
      else conditie5 = false;
    

      var disponibilArt =
        art.getElementsByClassName("val-disponibil")[0].innerHTML;
      var chk= document.getElementById("i_check");
      if (chk.checked) 
        cond = "true";
       else cond = "false";

       var conditie6 = disponibilArt == cond;
     
       var descriere = art.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase();
       var descriere_introdus = document.getElementById("inp-descriere").value.toLowerCase();
       var conditie7 = descriere == descriere_introdus
    
       if(!(/^[A-Za-z]+$/.test(descriere_introdus.trim())) && descriere_introdus.length != 0){
         alert('Descrierea produsului poate contine doar litere')
         return
        }
        if(descriere_introdus.length == 0)
          conditie7 = true;
        
      if (
        conditie1 &&
        conditie2 &&
        conditie3 &&
        conditie4 &&
        conditie5 &&
        conditie6 &&
        conditie7
      )
        art.style.display = "block";
    }
  };
  var rng = document.getElementById("inp-pret");
  rng.onchange = function () {
    var info = document.getElementById("infoRange"); //returneaza null daca nu gaseste elementul
    if (!info) {
      info = document.createElement("span");
      info.id = "infoRange";
      this.parentNode.appendChild(info);
    }

    info.innerHTML = "(" + this.value + ")";
  };

  function sorteaza(semn) {
    var articole = document.getElementsByClassName("produs");
    var v_articole = Array.from(articole);
    v_articole.sort(function (a, b) {
      var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
      var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
      if (nume_a != nume_b) {
        return semn * nume_a.localeCompare(nume_b);
      } else {
        var pret_a = parseInt(
          a.getElementsByClassName("val-pret")[0].innerHTML
        );
        var pret_b = parseInt(
          b.getElementsByClassName("val-pret")[0].innerHTML
        );
        return semn * (pret_a - pret_b);
      }
    });
    for (let art of v_articole) {
      art.parentNode.appendChild(art);
    }
  }

  var btn2 = document.getElementById("sortCrescNume");
  btn2.onclick = function () {
    sorteaza(1);
    var descriere_introdus = document.getElementById("inp-descriere").value.toLowerCase();
    if(!(/^[A-Za-z]+$/.test(descriere_introdus.trim())) && descriere_introdus.length != 0){
      alert('Descrierea produsului poate contine doar litere')
      sorteaza(0)
      return
     }
  };

  var btn3 = document.getElementById("sortDescrescNume");
  btn3.onclick = function () {
    sorteaza(-1);
    var descriere_introdus = document.getElementById("inp-descriere").value.toLowerCase();
    if(!(/^[A-Za-z]+$/.test(descriere_introdus.trim())) && descriere_introdus.length != 0){
      alert('Descrierea produsului poate contine doar litere')
      return
     }
  };

  document.getElementById("resetare").onclick = function () {
    //resetare inputuri
    document.getElementById("i_rad4").checked = true;
    document.getElementById("inp-pret").value =
      document.getElementById("inp-pret").min;
    document.getElementById("infoRange").innerHTML =
      "(" + document.getElementById("inp-pret").min + ")";
    document.getElementById("sel-toate").selected = true;
    document.getElementById("sel-toate-multiplu").selected = true;
    document.getElementById("inp-descriere").value=''
    document.getElementById("inp-nume").value=''
    

    //de completat...

    //resetare articole
    var articole = document.getElementsByClassName("produs");
    for (let art of articole) {
      art.style.display = "block";
    }
  };
};

window.onkeydown = function () {
  var btn4 = document.getElementById("suma");
  btn4.onclick = function () {
    var suma = 0;
    var articole = document.getElementsByClassName("produs");
    for (let art of articole) {
      if (art.style.display != "none")
        suma += parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
    }

    var spanSuma;
    spanSuma = document.getElementById("numar-suma");
    if (!spanSuma && suma) {
      spanSuma = document.createElement("span");
      spanSuma.innerHTML = " Suma preturilor produselor incarcate in pagina este:" + Math.round(suma * 100) / 100 + "lei"; //<span> Suma:...
      spanSuma.id = "numar-suma"; //<span id="..."
      document.getElementById("p-suma").appendChild(spanSuma);
      setTimeout(function () {
        document.getElementById("numar-suma").remove();
      }, 1500);
    }
  }
};

