function addNotNullProperty(propertyName, value){
  if (value != null){
    this[propertyName] = value;
  }
}

function WordCard(name) {
  this.name = name;
}
WordCard.prototype.addNotNullProperty = addNotNullProperty;

function Sense(){
}
Sense.prototype.addNotNullProperty = addNotNullProperty;
//add subSense to the senses array
Sense.prototype.addSubSense = function(subSense){
  if (this.senses == undefined){
    this.senses = [];
  }
  this.senses[this.senses.length] = subSense;
}

var word = new WordCard(getWord());

var headbar = document.getElementById("headbar");

word.addNotNullProperty("partOfSpeech", getPartOfSpeech(headbar));

if (word.partOfSpeech == "PHRASAL VERB"){
  word.addNotNullProperty("syntaxCoding", getSyntax(headbar));
}
else{
  word.addNotNullProperty("transcription", getTranscription(headbar));
}


var liTags = document.getElementById("leftContent").getElementsByClassName("senses")[0].getElementsByTagName("li");
word.senses = [];
for(let i = 0; i < liTags.length; i++){
  let lisChild = liTags[i].firstChild;
  parseLi(word.senses, lisChild);
};


console.log(word);

function getWord(){
  var span = document.getElementById("headwordleft").getElementsByClassName("BASE")[0];
  var word = span.textContent;
  return word;
}

function getPartOfSpeech(parent){
  var partOfSpeech = parent.getElementsByClassName("PART-OF-SPEECH")[0].innerText;
  return partOfSpeech;
}

function getSyntax(body){
  var syntax = body.getElementsByClassName("SYNTAX-CODING")[0];
  if (syntax != null && syntax.parentNode == body){
    var text = syntax.childNodes[1].textContent;
    return text;
  }
  
  return null;
}

function getTranscription(headbar){
  var transcr = headbar.getElementsByClassName("PRON")[0];
  if ((transcr != null) && (transcr.parentNode.parentNode == headbar)){
    var text = transcr.childNodes[1].textContent;
    return text;
  }
  
  return null
}

function getDefinition(body){
  let Definition = {};
  Definition.syntax = getSyntax(body);
  Definition.subjectArea = getChildText(body, "SUBJECT-AREA");
  Definition.dialect = getChildText(body, "DIALECT");
  Definition.style = getChildText(body, "STYLE-LEVEL");
  Definition.definition = getChildText(body, "DEFINITION");

  return Definition;
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

function parseLi(senses, li){
  let sense = new Sense();
  let body;
  //If this is main sense body:
  //add object sense to the array senses
  if (li.className == "SENSE"){
    senses[senses.length] = sense;
    body = li.getElementsByClassName("SENSE-BODY")[0];
  }
  //If this is sub sense body:
  //add object sense to the last object in the array senses
  else if (li.className == "SUB-SENSE-BODY"){
    senses[senses.length-1].addSubSense(sense);
    body = li.getElementsByClassName("SUB-SENSE-CONTENT")[0];
  }

  let num = li.getElementsByClassName("SENSE-NUM")[0].textContent;
  sense.addNotNullProperty("num", num);
  
  sense.addNotNullProperty("definition", getDefinition(body));
  sense.addNotNullProperty("examples", getExamples(body));
  sense.addNotNullProperty("categories", getCategorySynonyms(body));
}

function getChildText(element, className){
  getOnlyChild(element, className, 0);
}

function getChildText(element, className, childNumber){
  let result = element.getElementsByClassName(className)[childNumber];
  if (result.parentNode == element){
    return element.textContent;
  }
  return null;
}


function appendToResult(text){
  text = text.trim();
//  console.log(text);
//result += text + "\n";
}
