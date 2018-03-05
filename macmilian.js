var result = "";

word();

var headbar = document.getElementById("headbar");
partOfSpeech(headbar);


var liTags = document.getElementById("leftContent").getElementsByClassName("senses")[0].getElementsByTagName("li");
for(i = 0; i < liTags.length; i++){
  var lisChild = liTags[i].firstChild;
  parseLi(lisChild);
};



function word(){
  var span = document.getElementById("headwordleft").getElementsByClassName("BASE")[0];
  var word = span.textContent;
  appendToResult(word);
}

function partOfSpeech(parent){
  var partOfSpeech = parent.getElementsByClassName("PART-OF-SPEECH")[0].innerText;
  appendToResult(partOfSpeech);
}

function getSyntax(body){
  var syntax = body.getElementsByClassName("SYNTAX-CODING")[0];
  if (syntax != null && syntax.parentNode == body){
    var text = syntax.childNodes[1].textContent;
    appendToResult(text);
    
    return text;
  }
  
  return null;
}

function getDefinition(body){
  var definition = body.getElementsByClassName("DEFINITION")[0];
  if (definition.parentNode == body){
    var text = definition.textContent;
    appendToResult(text);

    return text;
  }
  
  return null;
}

function getExamples(body){
  examples = body.getElementsByClassName("EXAMPLES");
  for(let example of examples){
    if (example.parentNode == body){
      var text = example.textContent;
      //don't append user info
      appendToResult(text);
    }
  }
  //
  
  //return array of examples.text | dynamic?
}

function parseLi(li){
  var num = li.getElementsByClassName("SENSE-NUM")[0].textContent;
  var separator;
  var body;
  if (li.className == "SENSE"){
    separator = "___";
    body = li.getElementsByClassName("SENSE-BODY")[0];
  }
  if (li.className == "SUB-SENSE-BODY"){
    separator = "_~__";
    body = li.getElementsByClassName("SUB-SENSE-CONTENT")[0];
  }
  appendToResult(separator + num);
  
  getSyntax(body);
  getDefinition(body);
  getExamples(body);
}


function appendToResult(text){
  text = text.trim();
  console.log(text);
  result += text + "\n";
}