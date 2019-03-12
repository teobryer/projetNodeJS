class Arme {
  constructor(nom, degats)
  {
    this.nom = nom;
    this.degats= degats;

  }
}


class Armure  {
  constructor(nom, valeur)
  {
    this.nom = nom;
    this.valeur = valeur;

  }
}

class Joueur {
  constructor(nom, hp, force, agil, intelligence)
  {
    this.nom = nom;
    this.hp = hp;
    this.force = force;
    this.agil =agil;
    this.intelligence=intelligence;
    this.x = 0;
    this.y=0;
    this.inventaire = [new Arme("Poing",1), new Armure("Pas de bouclier", 0)];

  }
}







var donnees='';
var leTexte='';
var joueur;



function createPerso(){
  var nom = document.getElementById('nom').value;
  var hp = document.getElementById('hp').value;
  var agi = document.getElementById('agi').value;
  var fo = document.getElementById('fo').value;
  var intel = document.getElementById('intel').value;
  joueur =  new Joueur(nom, hp , fo , agi, intel);
  console.log(joueur);
  data = JSON.stringify(joueur);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/createPerso?" +data, true);
  xhr.send();

  save();
  load();

}





var monstre;
var degatsPiege;
var armure;
var parchemin;
var coffre;










function tableau(joueur){

  var deb = "<table><tr><th>Nom</th><th>Agilité</th><th>Force</th><th>intelligence</th><th>Points de vies</th></tr>";

  donnees = '<div id="donnees"><tr><td>'+joueur.nom+'</td> <td>'+joueur.agil+'</td> <td>'+joueur.force+'</td> <td>'+joueur.intelligence+'</td>  <td>'+joueur.hp+'</td></tr></div>';
  var fin = "</table>";
  document.getElementById("tab").innerHTML = deb + donnees +fin;

}


function afficherDeplacement(texte){
  leTexte += texte+'</br>'
  document.getElementById("affichageDeplacement").innerHTML = leTexte;
}

function go(id) {
  //afficherDeplacement('Vous vous déplacez à la direction suivante  : '+id);
  data = JSON.stringify(id);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/go?" + data, true);
  xhr.addEventListener('readystatechange',function(){
    if(xhr.readyState===XMLHttpRequest.DONE ){
      var obj = xhr.responseText;
      data = JSON.parse(obj);
      joueur = data.joueur;
      var txt = data.texte;
      console.log(joueur.nom);
      afficherDeplacement(txt);
      


      //

      document.getElementById("position").innerHTML =  joueur.x+","+joueur.y;

    }
  });
  xhr.send();
  
  
  
}



var data;
function load(){

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/load", true);
  xhr.addEventListener('readystatechange',function(){
    if(xhr.readyState===XMLHttpRequest.DONE ){
      var obj = xhr.responseText;
      data = JSON.parse(obj);
      joueur = data;
      console.log(joueur.nom);
      tableau(joueur);
      document.getElementById("position").innerHTML =  joueur.x+","+joueur.y;

    }
  });

  xhr.send();
}


function save(){
  data = JSON.stringify(joueur);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/save?" + data, true);
  xhr.send();

}






