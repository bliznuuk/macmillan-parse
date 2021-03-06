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

var menu = document.getElementById("menu");
word.addNotNullProperty("menu", getMenu(menu));

var phrases = document.getElementById("phrases_container");
word.addNotNullProperty("phrases", getMenu(phrases));

var phrasalVerbs = document.getElementById("phrasal_verbs_container");
word.addNotNullProperty("phrasalVerbs", getMenu(phrasalVerbs));

word.addNotNullProperty("relatedWords", getRelatedWords());


var wordJson = JSON.stringify(word);

var checkAudio = headbar.getElementsByClassName("PRONS")[0];
var audioSrc = null;
if ((checkAudio != undefined) && (checkAudio != null)){
  audioSrc = checkAudio.getElementsByClassName("sound")[0].getAttribute("data-src-mp3");
}


console.log(wordJson);
console.log(word);
console.log(audioSrc);

var audioLink;
if (audioSrc != null){
  audioLink = document.createElement("a");
  audioLink.appendChild(document.createTextNode("Download audio"));
  audioLink.download = "";
  audioLink.href = audioSrc;
}
else{
  audioLink = document.createElement("span");
  audioLink.style = "color:red; font-size:2em";
  audioLink.textContent = "Audio not found!"
}

var jsonContainer = document.createElement("div");
jsonContainer.innerText = wordJson;

var innerRightCol = document.getElementById("innerrightcol");
innerRightCol.appendChild(audioLink);
innerRightCol.appendChild(jsonContainer);


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

function getMenu(menu){
  if ((menu == undefined) || (menu == null)){
    return null;
  }
  
  let lis = menu.getElementsByTagName("li");
  if ((lis == undefined) || (lis == null) || (lis.length == 0)){
    return null;
  }

  let result = [];
  for (let li of lis){
    let text = li.textContent;
    if (text != null){
      result.push(text);
    }
  }
  return result;
}

function getRelatedWords(){
  let reletedEntries = document.getElementById("relatedentries");
  if ((reletedEntries == undefined) || (reletedEntries == null)){
    return null;
  }

  let entryList = reletedEntries.getElementsByClassName("entrylist")[0];
  if ((entryList == undefined) || (entryList == null)){
    return null;
  }
  
  let lis = entryList.getElementsByTagName("li");
  if ((lis == undefined) || (lis == null) || (lis.length == 0)){
    return null;
  }

  let result = [];
  for (let li of lis){
    let base = getTextContent(li.getElementsByClassName("BASE")[0]);
    if (base == null){
      base = getTextContent(li.getElementsByClassName("INFLX")[0]);
      if (base == null){
        let a = li.getElementsByTagName("a")[0];
        base = a.title;
        
        //add message to the page
        let alrt = document.createElement("span");
        alrt.style = "color:red;font-weight:bold;font-size:2em";
        alrt.innerText = "related word missing! Add: " + base + "\n";
        document.getElementById("headbar").appendChild(alrt);
      }
    }
    let partOfSpeech = getTextContent(li.getElementsByClassName("PART-OF-SPEECH")[0]);
    
    let ReletedWord = new Meaning();
    ReletedWord.addNotNullProperty("word", base);
    ReletedWord.addNotNullProperty("partOfSpeech", partOfSpeech);
    
    result.push(ReletedWord);
  }
  return result;
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
      Category.addNotNullProperty("synonyms", getSynonyms(snippet));
      
      arrayOfCategories.push(Category);
    }
    
    return arrayOfCategories;
  }
  
  return null;
}

function getSynonyms(snippet){
  let synonyms = snippet.getElementsByClassName("synonyms")[0];
  if ((synonyms == undefined) || (synonyms == null)){
    return null;
  }
  
  let synonymsArr = synonyms.getElementsByTagName("a");
  if ((synonymsArr == undefined) || (synonymsArr == null) || (synonymsArr.length == 0)){
    return null;
  }
  
  let result = [];
  for (let a of synonymsArr){
    result.push(a.textContent);
  }
  
  return result;
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

  let num = getChildText(li, "SENSE-NUM");
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