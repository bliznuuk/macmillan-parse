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
  stringOfExamples = "";
  examples = body.getElementsByClassName("EXAMPLES");

  for(let example of examples){
    if (example.parentNode == body){
      //example = [phrase: ]sentence
      var phrase = example.getElementsByTagName("strong")[0];
      var sentence = example.querySelectorAll("p.EXAMPLE")[0];
      
      //check if phrase exist and append it to the result
      if (phrase != null){
        var text = phrase.textContent;
        stringOfExamples += text + ": ";
        appendToResult(text);
      }
      
      //check if example exist and append it to the result
      if (sentence != null){
        var text = sentence.textContent;
        stringOfExamples += text + "\n";
        appendToResult(text);
      }
    }
  }
  
  return stringOfExamples;
}

function getCategorySynonyms(body){
  var THES = body.getElementsByClassName("THES")[0];
  if ((THES != null) && (THES.parentNode == body)){ 
    
    var snippets = THES.getElementsByClassName("thessnippet");
    for(let snippet of snippets){
      var category = getCategory(snippet);
      var synonyms = getSynonyms(snippet);
      appendToResult(category);
      appendToResult(synonyms);
    }
    
  }
}

function getCategory(snippet){
  var category = snippet.getElementsByClassName("cattitle")[0];
  if (category.parentNode == snippet){
    return category.textContent;
  }
}

function getSynonyms(snippet){
  var synonyms = snippet.getElementsByClassName("synonyms")[0];
  if (synonyms.parentNode == snippet){
    return synonyms.textContent;
  }
  
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
  getCategorySynonyms(body);
}


function appendToResult(text){
  text = text.trim();
  console.log(text);
  result += text + "\n";
}