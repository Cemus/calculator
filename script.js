const screenResult = document.getElementById("result");
const screenCalcul = document.getElementById("calcul");
const bouton = document.querySelectorAll("button");
const arrayNombre = [];
let errorMessage = "Oops...";
let nombre = "";
var delay = 1000;
let paire = 0;
let paireMax = 2;
let total = 0;
let masterOperator = "";
equalPushed = 0;

const operators = {
    "+": function(a,b){ return a + b },
    "-": function(a,b){ return a - b },
    "x": function(a,b){ return a * b },
    "/": function(a,b){ return a / b },
    "%": function(a,b){ return (a / 100) * b },
};

bouton.forEach(btn => {
    btn.addEventListener("mouseup", function(){
            let valeur = btn.innerHTML;    
            if (screenResult.innerHTML != errorMessage && screenResult.innerHTML != "Infinity"){  
                /* ALL CLEAR */        
                if (valeur == "AC"){
                    Reset();
                }       
                /* DEL */       
                if (valeur == "DEL"){
                    if (arrayNombre.length > 1){
                        if (nombre == ""){
                            for (var key in operators) {
                                if (key == arrayNombre[arrayNombre.length-1]) {
                                    arrayNombre.pop();
                                }
                            }
                        }
                        else{
                            arrayNombre.push(nombre)
                            arrayNombre.join("")
                        }
                        screenResult.innerHTML = screenResult.innerHTML.substring(0, screenResult.innerHTML.length-1, -1);
                        nombre = nombre.substring(0, nombre.length-1, -1);
                    }
                    else if (arrayNombre.length <= 1){
                        screenResult.innerHTML = screenResult.innerHTML.substring(0, screenResult.innerHTML.length-1, -1);
                        nombre = nombre.substring(0, nombre.length-1, -1);
                        arrayNombre[0] = screenResult.innerHTML;
                        if (screenResult.innerHTML.length == 0 || screenResult.innerHTML == ".."){
                            Reset();
                        }
                    }
                } 
                /* OPERATORS */ 
                if (operators[valeur]){
                    if (valeur == "-" && arrayNombre.length == 0){
                            if (nombre == ""){
                                nombre = valeur;   
                            }
                            else{
                                arrayNombre.push(nombre)
                                arrayNombre.push(valeur);
                                nombre = "";  
                            }
                    }  
                    else{
                        if (nombre != ""){
                            arrayNombre.push(nombre)
                            nombre = "";
                        }
                        if (arrayNombre.length <= 1){
                            arrayNombre.push(valeur);
                        }
                        else if (arrayNombre.length > 1){
                            let arrayPaire = [...arrayNombre]
                            arrayNombre.length = 0;
                            Calcul([...arrayPaire])
                            arrayNombre.push(valeur)
                        }                              
                    }
                }
                /* EQUAL */ 
                if (valeur == "="){
                    if (arrayNombre.length > 0){
                        if (nombre != ""){
                            arrayNombre.push(nombre)
                            nombre = "";
                        }
                        let arrayPaire = [...arrayNombre]
                        arrayNombre.length = 0;
                        Calcul([...arrayPaire])
                    }
                }
                /* INPUTS */ 
                if (valeur != "=" && valeur != "AC"){
                    if (valeur != "DEL"){
                        if (valeur != "+" && valeur != "-" && valeur != "/" && valeur != "x" && valeur != "%"){
                            nombre = nombre + valeur; 
                            //Il faudrait ajouter le nombre après le résultat au nombre pour n'en avoir qu'un seul ! (join())
                            //ajouter un equalPushed pour se faire
                        }
                        if (screenResult.innerHTML == "..." && arrayNombre.length == 0){
                            screenResult.innerHTML = valeur; 
                        }

                        else if (screenResult.innerHTML != 0 || arrayNombre.length > 0){
                            screenResult.innerHTML = screenResult.innerHTML + valeur; 
                        }
                    } 
                }
            }
            else{
                screenCalcul.style.visibility = "hidden";
                setTimeout(function() {
                    Reset();
                  }, delay);
                   
            }
        });
});

function Reset(){
    nombre = "";
    screenResult.innerHTML = "...";
    screenCalcul.innerHTML = screenResult.innerHTML;
    screenCalcul.style.visibility = "hidden";
    arrayNombre.length = 0;
}

function Calcul(array){
    let resultat;
    resultat = Operate([...array]);
    screenCalcul.innerHTML = calculDisplay(array,resultat);
    screenResult.innerHTML = resultat; 
    arrayNombre.push(resultat)
    if (resultat == errorMessage || resultat == "Infinity"){
        /*screenCalcul.style.visibility = "hidden"*/
        screenResult.innerHTML = resultat; 
        setTimeout(function() {
            Reset();
        }, delay);
    }
}

function Expo(x, f) {
    return Number.parseFloat(x).toExponential(f);
  }
  
function calculDisplay(array, operated){
    let result;
    screenCalcul.style.visibility = "visible";
    result = `${array[0]} ${array[1]} ${array[2]}  =  ${operated}`
    if (result.length > 40){
        result = "Too long..."
    }
    return result;
}

function Operate(array){
    let result = "";
    for (i = 0; i < array.length; i++){
        if (array[i] === ""){
            array[i] = 0;
        }
        if (array[i] == "."){
            array[i+1] = array[i-1] + (array[i+1] / 10);
        }
        if (operators[array[i]]){
            array[i+1] = operators[array[i]](parseFloat([array[i-1]]),parseFloat([array[i+1]]));
            result = array[i+1];
        }
    }
    let strResult = String(result);
    if (strResult.length >= 14){
        result = Expo(result,2);
    }
    isNaN(result) ? result = errorMessage :  result;
    if (result == errorMessage){
        return result;
    }
    return result;

}


