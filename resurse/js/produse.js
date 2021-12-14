window.onload = function () {
    var btn = document.getElementById("filtrare");
    btn.onclick = function () {
      var articole = document.getElementsByClassName("produs");
      for (let art of articole) {
        art.style.display = "none";
  
        /*
              v=art.getElementsByClassName("nume")
              nume=v[0]*/
        var nume = art.getElementsByClassName("val-nume")[0]; //<span class="val-nume">aa</span>
        console.log(nume.innerHTML);
        var conditie1 = nume.innerHTML.toLowerCase().includes(document.getElementById("inp-nume").value.toLowerCase())
  
        var pret = art.getElementsByClassName("val-pret")[0];
        var conditie2 =
          parseInt(pret.innerHTML) >
          parseInt(document.getElementById("inp-pret").value);
  
        var radbtns = document.getElementsByName("gr_rad");
        var radbtns = document.getElementsByName("gr_rad");
        for (let rad of radbtns){
            if (rad.checked){
                var valMarimi=rad.value;//poate fi 1, 2 sau 3
                break;
            }
        }
        
        var marimiArt= parseInt(art.getElementsByClassName("val-marimi")[0].innerHTML);
        var conditie3=false;
        switch (valMarimi){
            case "1": conditie3= (marimiArt<36); break;
            case "2": conditie3= (36<=marimiArt && marimiArt<41); break;
            case "3": conditie3= (41<=marimiArt && marimiArt<47); break;
            default: conditie3=true;
        }
        console.log(conditie3);
  
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
          if (sir.includes(art.getElementsByClassName("val-categorie")[0].innerHTML) || sir.includes("toate"))
            conditie5 = true;
          else conditie5 = false;

          var disponibilArt = art.getElementsByClassName("val-disponibil")[0].innerHTML
            var chk = document.getElementById("i_check");
            if(chk.checked){
                cond = "true";
            }
            else cond = "false";

            var conditie6 = (disponibilArt==cond);

        if (conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6)
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
    };
  
    var btn3 = document.getElementById("sortDescrescNume");
    btn3.onclick = function () {
      sorteaza(-1);
    };
  
    document.getElementById("resetare").onclick = function () {
      //resetare inputuri
      document.getElementById("i_rad4").checked = true;
    document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
    document.getElementById("infoRange").innerHTML = "(" + document.getElementById("inp-pret").min + ")";
    document.getElementById("sel-toate").selected=true;
    document.getElementById("i_check").checked = true;
    document.getElementsByTagName("textarea")[0].value=""
  
      //de completat...
  
      //resetare articole
      var articole = document.getElementsByClassName("produs");
      for (let art of articole) {
        art.style.display = "block";
      }
    };
  };
  
  window.onkeydown = function (e) {
    console.log(e);
    if (e.key == "c" && e.altKey == true) {
      var suma = 0;
      var articole = document.getElementsByClassName("produs");
      for (let art of articole) {
        if (art.style.display != "none")
          suma += parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
      }
  
      var spanSuma;
      spanSuma = document.getElementById("numar-suma");
      if (!spanSuma) {
        spanSuma = document.createElement("span");
        spanSuma.innerHTML = " Suma:" + suma; //<span> Suma:...
        spanSuma.id = "numar-suma"; //<span id="..."
        document.getElementById("p-suma").appendChild(spanSuma);
        setTimeout(function () {
          document.getElementById("numar-suma").remove();
        }, 1500);
      }
    }
  };