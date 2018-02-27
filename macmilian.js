var result;

var headbar = document.getElementById("headbar");
partOfSpeech(headbar);

var content = document.getElementById("leftContent").getElementsByClassName("senses")[0].getElementsByTagName("li");
content;

var def = content[0].getElementsByClassName("DEFINITION")[0];
def.textContent;

function partOfSpeech(perent){
  var partOfSpeech = perent.getElementsByClassName("PART-OF-SPEECH")[0].innerText;
}

function syntax(perent){
  var syntax = perent.getElementsByClassName("SYNTAX-CODING show_less")[0];
  syntax.childNodes[1].textContent;
}