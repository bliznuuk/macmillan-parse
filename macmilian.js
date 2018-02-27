
var headbar = document.getElementById("headbar");
var partOfSpeech = headbar.getElementsByClassName("PART-OF-SPEECH")[0].innerText;
partOfSpeech;

/*var syntax = headbar.getElementsByClassName("SYNTAX-CODING show_less")[0];
syntax.childNodes[1].textContent;
*/
var content = document.getElementById("leftContent").getElementsByClassName("senses")[0].getElementsByTagName("li");
content;

var def = content[0].getElementsByClassName("DEFINITION")[0];
def.textContent;
