window.addEventListener("load", function () {
  // 	var myHeaders = new Headers();
  // myHeaders.append();
  var prod_sel = localStorage.getItem("produse_selectate");

  if (prod_sel) {
    //p.then(f1).then(f2).then(f3)
    var vect_ids = prod_sel.split(",");
    fetch("/produse_cos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      mode: "cors",
      cache: "default",
      body: JSON.stringify({
        ids_prod: vect_ids,
        a: 10,
      }),
    })
      .then(function (rasp) {
        console.log(rasp);
        x = rasp.json();
        console.log(x);
        return x;
      })
      .then(function (objson) {
        k = 0;
        for (let prod of objson) {
          for (let ids of vect_ids) {
            cant = ids.split(":");
            if (cant[0] == prod.id) k = cant[1];
            console.log(objson.indexOf(prod));
          }

          let divCos = document.createElement("div");
          divCos.classList.add("cos-virtual");
          let divImagine = document.createElement("div");
          let imag = document.createElement("img");
          imag.src = "/resurse/imagini/produse/" + prod.imagine;
          divImagine.appendChild(imag);
          divCos.appendChild(divImagine);
          let divInfo = document.createElement("div");

          divInfo.innerHTML = `<p><b>${prod.nume}</b></p><p>Pret: ${prod.pret}</p><p>Culoare: ${prod.culoare}</p><p>Marime: ${prod.marime}</p><p>Materiale: ${prod.materiale}</p></p><p>Cantitate: ${k}  </p>`;

          let btn = document.createElement("button");
          btn.innerHTML = "Sterge";
          btn.onclick = function () {
            vect = getIdsProduse();
            for (let i = 0; i < vect.length; i++) {
              console.log(vect[i], prod.id);
              k = vect[i];
              if (k[0] == prod.id) {
                vect.splice(i, 1);
              }
            }
            StorageIdsProduse(vect);
            location.reload();
          };
          divCos.appendChild(divInfo);
          divInfo.appendChild(btn);

          document
            .getElementsByTagName("main")[0]
            .insertBefore(divCos, document.getElementById("cumpara"));
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    function getIdsProduse() {
      let ids_produse = [];
      aux_produse = localStorage.getItem("produse_selectate");
      if (aux_produse) {
        // Presupunem ca in localStorage ar trebui salvate in modul urmator "1:5,2:3,3:1,4:1" // 5 produse de tipul 1, 3 produse de tipul 2, 1 produs de tipul 3...
        aux_produse = aux_produse.split(","); // ['1:5','2:3',..]
        for (let p of aux_produse) {
          let per = p.split(":");
          ids_produse.push([parseInt(per[0]), parseInt(per[1])]);
        }
      } else ids_produse = [];
      return ids_produse;
    }

    document.getElementById("cumpara").onclick = function () {
      var vect_ids = getIdsProduse();
      fetch("/cumpara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        mode: "cors",
        cache: "default",
        body: JSON.stringify({
          ids_prod: vect_ids,
          a: 10,
        }),
      })
        .then(function (rasp) {
          console.log(rasp);
          return rasp.text();
        })
        .then(function (raspunsText) {
          console.log(raspunsText);

          let p = document.createElement("p");
          p.innerHTML = raspunsText;
          document.getElementsByTagName("main")[0].innerHTML = "";
          document.getElementsByTagName("main")[0].appendChild(p);
          if (!raspunsText.includes("nu sunteti logat"))
            localStorage.removeItem("produse_selectate");
        })
        .catch(function (err) {
          console.log(err);
        });
    };
  } else {
    document.getElementsByTagName("main")[0].innerHTML =
      "<p>Nu aveti nimic in cos!</p>";
  }

  function StorageIdsProduse(ids_produse) {
    v_sir_prod = [];
    for (let prod of ids_produse) {
      // prod o lista cu id si cantitate
      let sir_prod = prod[0] + ":" + prod[1];
      v_sir_prod.push(sir_prod); //v_sir_prod va fi de forma ['1:5','2:3',..]
    }
    localStorage.setItem("produse_selectate", v_sir_prod.join(","));
  }
});
