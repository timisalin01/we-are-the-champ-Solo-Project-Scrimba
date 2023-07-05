import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playtext-8e39f-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsListInDB = ref(database, "endorsementsList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")

const inputFieldFromEl = document.getElementById("from");
const inputFieldToEl = document.getElementById("to");


const endorsementsListEl = document.getElementById("endorsements-list")

addButtonEl.addEventListener("click", function() {
    let inputFromValue = inputFieldFromEl.value;
    let inputTextEl = inputFieldEl.value;
    let inputToValue = inputFieldToEl.value;
    
  
    const errorMessageEl = document.getElementById('error-message');
    errorMessageEl.textContent = 'Please add your endorsement';
  
    if (inputFromValue.trim() === '' || inputToValue.trim() === '') {
      return;
    }
  
     // Verificăm lungimea textului introdus
  if (inputTextEl.trim().length < 25) {
    errorMessageEl.textContent = 'Please enter at least 25 characters';
    return;
  }

    const endorsementValue = `From: ${inputFromValue}\n${inputTextEl}\nTo: ${inputToValue}`;
  
    push(endorsementsListInDB, endorsementValue);
  
    errorMessageEl.textContent = '';
    inputFieldFromEl.value = '';
    inputFieldToEl.value = '';
  
    clearInputFieldEl();
  });
  

onValue(endorsementsListInDB, function(snapshot){

    if (snapshot.exists()){
        let listArray = Object.entries(snapshot.val())

    clearEndorsementsListEl()

        for(let i = 0; i < listArray.length; i++){
            let currentItem = listArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            

            appendItemToEndorsementsListEl(currentItem)
        }
    } else {
        endorsementsListEl.innerHTML = "<span style='color:rgb(21, 75, 252); font-weight: bold; margin: 0 auto; font-size: 22px;'>There is no endorsement in the list</span>";
    }

    
})

function clearEndorsementsListEl() {
    endorsementsListEl.innerHTML = ""
}

function clearInputFieldEl(){
    inputFieldEl.value = '';
}

function appendItemToEndorsementsListEl(item) {
    let itemID = item[0];
    let itemValue = item[1];
    let itemValues = itemValue.split('\n');
    
    let newEl = document.createElement("li");
    
    let fromEl = document.createElement("span");
    fromEl.textContent = "From: ";
    newEl.appendChild(fromEl);
    
    let fromValueEl = document.createElement("span");
    fromValueEl.textContent = itemValues[0].substring(6); // Ignorăm primele 6 caractere ("From: ")
    newEl.appendChild(fromValueEl);
    
    newEl.appendChild(document.createElement("br")); // Adăugăm un element <br> pentru a crea o linie nouă
    
    let contentEl = document.createElement("span");
    contentEl.textContent = itemValues.slice(1, -1).join('\n'); // Excludem ultima linie ("To: ...")
    newEl.appendChild(contentEl);
    
    newEl.appendChild(document.createElement("br")); // Adăugăm un element <br> pentru a crea o linie nouă
    
    let toEl = document.createElement("span");
    toEl.textContent = itemValues[itemValues.length - 1]; // Afișăm ultima linie ("To: ...")
    newEl.appendChild(toEl);
    
    newEl.addEventListener("click", function() {
      let exactLocationEndorsementsList = ref(database, `endorsementsList/${itemID}`);
      remove(exactLocationEndorsementsList);
    });
    
    endorsementsListEl.prepend(newEl);
  }
  

  