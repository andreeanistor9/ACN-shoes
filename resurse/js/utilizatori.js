window.addEventListener("load", function() {
    var stergePoze = document.getElementsByClassName("sterge-poza");
    
});

function stergePoza(userId) {
    var imag = document.getElementById("poza-" + userId);
    imag.remove();
    fetch("/sterge_poza", {		

        method: "POST",
        headers:{'Content-Type': 'application/json'},
        
        mode: 'cors',		
        cache: 'default',
        body: JSON.stringify({
            userId: userId
        })
    })
    .then(function(rasp){ console.log(rasp); x=rasp.json(); console.log(x); return x})
}