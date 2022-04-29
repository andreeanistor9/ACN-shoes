
window.addEventListener("DOMContentLoaded", function(){
    var tema=localStorage.getItem("tema");
    if( !tema){//nu am setat inca o tema
        localStorage.setItem("tema","light");
        document.getElementById("temaspan").className = "fas fa-solid fa-moon"
    }
    else{
        if(tema=="dark")
            {document.body.classList.add("dark");
            document.getElementById("temaspan").className = "fas fa-solid fa-sun"}
    }
    btn=document.getElementById("schimba_tema");
    if(btn){
        btn.onclick=function(){
            document.body.classList.toggle("dark");
            if(document.body.classList.contains("dark")){
                localStorage.setItem("tema","dark");
                document.getElementById("temaspan").className = "fas fa-solid fa-sun";
            }
            else{
                localStorage.setItem("tema","light");
                document.getElementById("temaspan").className = "fas fa-solid fa-moon";
            }
            
        }
    }
});

