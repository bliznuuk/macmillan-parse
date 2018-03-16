function addNotNullProperty(propertyName, value){
  if (value != null){
    this[propertyName] = value;
  }
}


function WordCard(name) {
  this.name = name;
}
WordCard.prototype.addNotNullProperty = addNotNullProperty;


function Meaning(){}
Meaning.prototype.addNotNullProperty = addNotNullProperty;


function Sense(){}
Sense.prototype = Object.create(Meaning.prototype);
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


var wordJson = JSON.stringify(word);

console.log(wordJson);
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
  let Definition = new Meaning();
  Definition.addNotNullProperty("syntax", getSyntax(body));
  Definition.addNotNullProperty("subjectArea", getChildText(body, "SUBJECT-AREA"));
  Definition.addNotNullProperty("dialect", getChildText(body, "DIALECT"));
  Definition.addNotNullProperty("style", getChildText(body, "STYLE-LEVEL"));
  Definition.addNotNullProperty("definition", getChildText(body, "DEFINITION"));

  return Definition;
}

function getExamples(body){
  let arrayOfExamples = [];
  let examples = body.getElementsByClassName("EXAMPLES");

  if((examples == undefined) || (examples == null) || (examples.length == 0) ){
    return null;
  }
  for(let example of examples){
    if (example.parentNode == body){
      let Example = new Meaning();
      
      //let phrase = getChildText(example, "strong");
      let phrase = example.getElementsByTagName("strong")[0];
      let sentence = example.querySelectorAll("p.EXAMPLE")[0];
      
      let phraseText = getTextContent(phrase);
      let sentenceText = getTextContent(sentence);
      Example.addNotNullProperty("phrase", phraseText);
      Example.addNotNullProperty("sentence", sentenceText);

      if((sentenceText != null) || (phraseText != null)){
        arrayOfExamples.push(Example);
      }
    }
  }
  
  return (arrayOfExamples.length != 0) ? arrayOfExamples : null;
}

function getCategorySynonyms(body){
  let arrayOfCategories = [];
  
  let thes = body.getElementsByClassName("THES")[0];

  if ((thes != null) && (thes.parentNode == body)){ 
    let snippets = thes.getElementsByClassName("thessnippet");
    for(let snippet of snippets){
      let Category = new Meaning();
      Category.addNotNullProperty("category", getChildText(snippet, "cattitle"));
      Category.addNotNullProperty("synonyms", getChildText(snippet, "synonyms"));
      
      arrayOfCategories.push(Category);
    }
    
    return arrayOfCategories;
  }
  
  return null;
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

function getChildText(element, className, childNumber){
  if (childNumber == undefined) childNumber = 0;

  let result = element.getElementsByClassName(className)[childNumber];
  if ((result != null) && (result.parentNode == element)){
    return getTrimText(result.textContent);
  }
  return null;
}

function getTextContent(element){
  if ((element != undefined) && (element != null)){
    return getTrimText(element.textContent);
  }
  return null;
}

function getTrimText(text){
  let result = text.replace(/^[\.\s,:]+|[\.\s,:]+$/g, "");
  return result
}