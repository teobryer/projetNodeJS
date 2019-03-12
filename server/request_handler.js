
var fs = require("fs");
var url = require("url");
var joueur;

// variables utilisées 

var lesNomsMonstres=["Monstre1","Monstre2","Monstre3","Monstre4","Monstre5","Monstre6","Monstre7"]
var lesNomsArmes=["Arme1","Arme2","Arme3"]
var lesNomsBoucliers=["Petite", "Moyenne" , "Puissante"]
var lesValeursBoucliers=[25,50,100]

// classes utilisées 
class Monstre {
  constructor(nom, hp, degats)
  {
    this.nom = nom;
    this.hp = hp;
    this.degats= degats;
  }
}


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

function start(response) {
    console.log("Le gestionnaire 'start' est appelé.");

    }

   

// Créer personnage
function createPerso(response, request){
  response.setHeader("Access-Control-Allow-Origin", "*");
  var data = url.parse(request.url).query;
  joueur = JSON.parse(decodeURI(data));
  

}

/////////////////////////////////////////// Fonctions utiles 
function entierAleatoire(min, max)
{
  return Math.floor(Math.random() * (max - min) + min);
}


/////////////////////////////////////////// Fonctions événements 

// coffre
function coffreEvent(){
  var nom = lesNomsArmes[entierAleatoire(0,lesNomsArmes.length)];
  var degats = entierAleatoire(5,30);
  var coffre = new Arme(nom,degats);
  joueur.inventaire[0]= coffre;
  return ("</br>Il y a "+ coffre.nom)+"et vous la prenez sans hésiter et lachez votre ancienne arme qui est en mauvais état";
}

// Monstre 
function monstreEvent(){
  var nom = lesNomsMonstres[entierAleatoire(0,lesNomsMonstres.length)];
  var hp = entierAleatoire(20,80);
  var degats = entierAleatoire(5,30);
  monstre = new Monstre(nom,hp,degats);
  return ("</br>Il s'agit de "+ monstre.nom+"</br>")+combat();
  

}



// armure 
function armureEvent(){
  var val = entierAleatoire(0,lesNomsBoucliers.length);
  var nom = lesNomsBoucliers[val]+" armure";
  var valeur = lesValeursBoucliers[val];
  var armure = new Armure(nom, valeur);
  var comp ="";
  if(joueur.inventaire[1].valeur<valeur){
    joueur.inventaire[1]=armure;
    comp =" et vous la prenez pour plus de bouclier !"

  }
  return("</br>Il s'agit d'une "+armure.nom+"("+armure.valeur+")"+ comp);
}

// piege
function piegeEvent(){
  var val = entierAleatoire(1,joueur.hp)
  joueur.hp = joueur.hp - val;
  return ("</br>"+val+" dégâts il vous reste donc "+joueur.hp+" points de vies");
}




// Fonctions sauvegarde - chargement 

function save(response,request) {
 var data = url.parse(request.url).query;

 fs.writeFileSync("save.json",decodeURI(data),"UTF-8");
}

function load(response,request) {

	response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "x-requested-with");

  var monJson = fs.readFileSync('save.json', 'utf8');

  joueur = JSON.parse(decodeURI(monJson));

  response.write(monJson);

  response.end();
}



function go(response, request){
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  response.setHeader("Access-Control-Allow-Headers", "x-requested-with");

  var data = url.parse(request.url).query;
  var id = JSON.parse(decodeURI(data));
  console.log(joueur.x)
  switch (id) {
    case 'est':
    joueur.x=joueur.x+1;
    break;
    case 'ouest':
    joueur.x=joueur.x-1;
    break;
    case 'nord':
    joueur.y=joueur.y+1;
    break;
    case 'sud':
    joueur.y=joueur.y-1;
    break;
    
    default:
    console.log('Sorry, we are out of ' + expr + '.');
  }

  var txt = evenement();
  console.log("typeof player: " + typeof(joueur));
  console.log("player contents: " + joueur);
  console.log("typeof data: " + typeof(data));
  console.log("data contents: " + data);
  var donnee = {joueur:joueur,texte:txt}
  var data = JSON.stringify(donnee);
  response.write(data);
  response.end();
}


function evenement(){

  var alea = entierAleatoire(0,10);
  console.log(alea);
  var txt;
  switch (alea) {
    case 0:
    txt = "Vous avez subit des dégâts du piège présent à cette position"+piegeEvent();
    break;
    case 1:
    txt = "Un monstre est présent ici !"+monstreEvent();
    break;
    case 2:
    txt = "Vous avez trouvé une armure"+armureEvent();
    break;
    case 3:
    txt = "Vous avez trouvé un coffre"+coffreEvent();
    break;
    default:
    txt ="Rien ne se trouve ici, continuez à vous déplacer si vous voulez découvrir les secrets de ce monde";
    
  }
return txt;



}

function combat(){
  var text="";
  while(joueur.hp>0 && monstre.hp>0 ){
    text=text+(joueur.nom+" utilise " +joueur.inventaire[0].nom+ " qui provoque "+ joueur.inventaire[0].degats+" dégats.</br>");

    monstre.hp=monstre.hp-joueur.inventaire[0].degats;
    
   text=text+(monstre.nom+" répond et inflige "+ monstre.degats+" dégats.</br>");
    if(joueur.inventaire[1].valeur>0){
      joueur.inventaire[1].valeur-monstre.degats
    }
    if(joueur.inventaire[1].valeur<0){
      joueur.hp=joueur.Maths.abs(joueur.inventaire[1]);
    }
   else {
     joueur.hp=joueur.hp-monstre.degats;
    }
    
  }
  if(monstre.hp<=0){
   text=text+(monstre.nom+ "a succombé !</br>")
  }
  else{
    text=text+("Vous êtes mort</br>")
  }
  return text;
}






exports.createPerso = createPerso;
exports.save = save;
exports.load = load;
exports.start = start;
exports.go = go;