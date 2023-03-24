const url="https://malomgame20230324103459.azurewebsites.net/api/steps/"
const state={
    step:null,
    timer:null,
    gamers:null,
    szam:10,
    lepes:false 
}

const xhr= new XMLHttpRequest();

function requestAPI(metodus,cim,fuggveny,uzenet)
{
xhr.onload = function(){fuggveny();};
xhr.open(metodus, cim, true);
xhr.setRequestHeader("Content-Type","application/json")
xhr.setRequestHeader("Accept","application/json")
xhr.send(JSON.stringify(uzenet));

}

function GetFeldolgozo(){
    if (xhr.status==200 || xhr.status==201 )
    {
        state.step= JSON.parse(xhr.responseText);
        if(state.gamers==null) state.step.gamers=state.step.gamers  
        console.log(state.step,"Ez egy log");
        if (state.step.finish)
        {
            //True
            console.log("Játék indítása.")
            clearInterval(state.timer);
            jatekIndul();
        }
        else{
            console.log("Várakozás a másik játékosra!");
            if (!state.timer)
                state.timer = setInterval(function(){requestAPI("GET",url+state.step.id, GetFeldolgozo);},3000);
        }
    }
    else{
        console.log("Hiba a GET kérésben!",xhr.status);
    }
}
function StepFeldolgozo(){
    if (xhr.status==200 || xhr.status==201 )
    {
        state.step= JSON.parse(xhr.responseText);
        if((state.step.gamers !=state.gamers) && (state.step.sor!=-1))
        {
            clearInterval(state.timer);
            let p = document.getElementById("palya");
            p.children[state.step.sor].children[state.step.oszlop].innerHTML="0";
            p.children[state.step.sor].children[state.step.oszlop].onclick=null;
            state.lepes=true;
        }
    }
    else{
        console.log("Hiba a GET kérésben!",xhr.status);
    }
}
function jatekIndul() 
{
    if(state.gamers==0) state.lepes=true;
    else
    {
        state.timer = setInterval(function(){requestAPI("GET",url+state.step.id, StepFeldolgozo);},3000);
        
    }
    for (let i = 0; i < state.szam; i++)
    {
        let sor = document.createElement("div");
        sor.classList.add("sor");

        for (let j = 0; j < state.szam; j++){
            let cella = document.createElement("div");
            cella.className="cella";
            cella.dataset.sor=i;
            cella.dataset.oszlop=j;
            cella.onclick=katt;
            sor.appendChild(cella);
        }
        document.getElementById("palya").appendChild(sor);
    }
}
function katt()
{
    if(state.lepes)
    {
        this.innerHTML('X');
        state.step.sor=this.dataset.sor;
        state.step.oszlop=this.dataset.oszlop;
        state.steep.gamers=state.step.gamers;
        this.onclick=null;
        requestAPI("PUT",url+step.id, PutFeldolgozo, state.step);
        console.log("Az ellenfél lépésére vár.");
        state.lepes=false;
        //Játék vége
    }
}
function PutFeldolgozo()
{
    if((xhr.status==200 || xhr.status==201))
    {
        state.timer = setInterval(function(){requestAPI("GET",url+state.step.id, GetFeldolgozo);},3000);

    }
    else
    {
        console.log("Hiba a PUT kérésben!",xhr.status);
    }
}

console.log("Szrkipt")
requestAPI("GET",url, GetFeldolgozo);