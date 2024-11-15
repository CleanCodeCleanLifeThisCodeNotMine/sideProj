// ==UserScript==
// @name         10 fast fingers
// @version      0.1
// @require https://code.jquery.com/jquery-2.1.1.min.js
// @match        https://10fastfingers.com/typing-test/*
// @match        https://10fastfingers.com/advanced-typing-test/*
// @match        https://10fastfingers.com/*
// ==/UserScript==

var input = document.getElementsByClassName("form-control")["0"];
var btnreload = document.getElementById("reload-btn");
var mots = 0;
var Keystrokes = 0;
var WPM = 0;
var text;
var inputnospace;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
    text = document.getElementsByClassName("highlight")["0"];
    inputnospace = input.value.replace(/ /g,'');
    if(inputnospace != text.innerHTML){
        input.value = text.innerHTML;
        mots = mots+1;
        Keystrokes = Keystrokes + (input.value.length+1);
        WPM = Math.round((((Keystrokes)-(input.value.length+1))/5));
        btnreload.innerHTML = "WPM: " +WPM;
        console.clear();
        console.log("Correct words: "+ (mots-1));
        console.log("Keystrokes: "+(Keystrokes-(input.value.length+1)));
        console.log("WPM: "+ (((Keystrokes)-(input.value.length+1))/5));
    }
    await sleep(20);
    demo();
}

input.onclick = function() {
   input.setAttribute("type", "submit");
   demo();
};

btnreload.onclick = function() {
   mots = 0;
   Keystrokes = 0;
   WPM = 0;
};