var timer = new Timer();

var qaDatabase = []; //collection of question and answers currently selected
var previousID = -1; //keeps tack of previous quesiton ID to prevent repeition
var userScore = 0;   //keeps track of user score
var answerID = -1;   //keeps track of the correct answer within the radio button list
var totalSum = 0;    //used for weighted random number generation

function qa(question, answer, otherInfo) {
    this.question = question;
    this.answer = answer;
    if (otherInfo === undefined) {
            this.otherInfo = "";
    } else {
            this.otherInfo = otherInfo +"\n";
    }
    
    this.frequency = 10;
    
    this.reduceF = function (decrement){
        if(this.frequency > 1){
            this.frequency -= decrement;
            totalSum -=decrement;
        }
    }
    
    this.resetF = function () {
        totalSum += 10 - this.frequency;
        this.frequency = 10;
    }

}

function calculateTotalSum(){
    totalSum = 0;
    for(var i = 0; i<qaDatabase.length; i++)
    {
        totalSum += qaDatabase[i].frequency;
    }
}

//Retrieve questions and answers from my github
var xmlhttp = new XMLHttpRequest();
var programming = [];
var videoGames = [];
xmlhttp.open("GET", "https://raw.githubusercontent.com/TonyDuon/FlashcardQuiz-qaDatabase/master/qaDatabase.json", true);
xmlhttp.onload = function() {
    if (this.readyState == 4 && this.status == 200) 
    {
        var a = xmlhttp.responseText;
        var myObj = JSON.parse(a);        
        
        for(var i =0; i<myObj.programming.length; i++)
        {
            programming[i] = new qa(myObj.programming[i].question, myObj.programming[i].answer, myObj.programming[i].otherInfo)
        }
        
        for(var i =0; i<myObj.videoGames.length; i++)
        {
            videoGames[i] = new qa(myObj.videoGames[i].question, myObj.videoGames[i].answer, myObj.videoGames[i].otherInfo);
        }
    }
};
xmlhttp.send();
qaDatabase = programming;
calculateTotalSum();

//var programming = [
//                new qa("What is an Alogrithm?", "A set of ordered and finite steps used to solve a given problem"),
//                new qa("Define AJAX", "Used to retrieve and process information without needing to reload the browser", "Asynchronous Javascript And XML"),
//                new qa("Define JSON", "Used to convert any javascript object into text and vice versa, allowing communication between browser and server", "JavaScript Object Notation"),
//                new qa("Define the DOM in HTML/CSS", "Defines the logical structure of documents and the way a document is accessed and manipulated", "Document Object Model"),
//                new qa("What is ASP.Net?","A program which allow you to create dynamic website using the .Net framework", "Active Server Page"),
//                new qa("Explain the function of the HTML, CSS and Javascript in front end programming", "Adds content to the website, styles the content and adds functionality to the content"),
//                new qa("Define Progressive Enchancement", "Layering technologies sequentially so that they work without reliance upon each other"),
//                new qa("Define a variable", "Stores information in a memory address to be referenced and manipulated in a computer program")
//                //new qa("Name the 7 Development Lifecycles", "Planning, Analysis, Design, Implementation, Testing and Intergration, Maintenance"),
//                //new qa("Is C# front end or Back end?", "Back end"),
//                //new qa("Describe the basic HTML code strucutre", @"<!doctype HTML> \n <HTML> \n <head></head> \n <body></body> \n </HTML>"),
//                //new qa("List some of the c# error handling exceptions","FileNotFoundException \n IndexOutOfRangeException \n ArgumentException \n DivideByZero \n FormatException")
//    ];

//var videoGames = [
//    new qa("Which platform acheived the #1 highest record of units ever sold (155 million units)?","Playstation 2"),
//    new qa("Blueray-based videogames was first introduced by which platform?","Playstation 3"),
//    new qa("What console was created after a result of a failed collaboration with Nintendo?","Playstation 1"),
//    new qa("Which platform was first to introduced online multiplayer gaming?","Original Xbox"),
//    new qa("Mario was first introduced on what platform?","Nintendo Entertainment System (NES)")
//];

//document.getElementById("importFile").addEventListener('click', function(){
//    var deckDisplay = document.getElementById("loadDeckmenu").style;
//    if(deckDisplay.display == "inline-block"){
//          deckDisplay.display = "none";  
//      
//    }else{
//        deckDisplay.display = "inline-block";
//    }
    
    
    
    //setCookie("firstName","Tonny",1);
    //console.log(getCookie("firstName"));
    
//});

$('#importFile').on('click', () => {
    $('#loadDeckmenu').toggle();
});


const deckList = document.getElementsByName("loadDeck");
for(var i = 0; i< deckList.length; i++)
{
    deckList[i].addEventListener("change", function(){
        //console.log(this.value);
        switch(this.value)
        {
            case "1":
                qaDatabase = videoGames;
                break;
            case "0": default:
                qaDatabase = programming;
                break;
        }
    });
}

//From Home to Flashcard
$('#gotoFlashCard').on('click', () =>{
    $('#homePage').hide();
    $('#flashCardMenu').show();
    $('#answerLabel').css('visibility', 'hidden');
});
//document.getElementById("gotoFlashCard").addEventListener('click', function(){
//    document.getElementById("homePage").style.display= "none";
//    document.getElementById("flashCardMenu").style.display= "inline-block";
//    
//    //start with the answer initially hidden
//    document.getElementById("answerLabel").style.visibility = "hidden"; 
//});


//From Home to Quiz
//$('')
$('#gotoQuiz').on('click', () => {
    $('#homePage').hide();
    $('#loadDeckMenu').hide();
    $('#quizMenu').show();
    
    //start with radio button list hidden until start
    $('#rblAnswers').addClass('hide');
});
//document.getElementById("gotoQuiz").addEventListener('click', function(){
//    document.getElementById("homePage").style.display= "none";
//    document.getElementById("loadDeckmenu").style.display = "none"; 
//    document.getElementById("quizMenu").style.display= "inline-block";
//    
//    //start with the radio button list hidden until start
//    document.getElementById("rblAnswers").style.visibility = "hidden"; 
//});

//From Flashcard to Home (cleanup and setting text back to default)
document.getElementById("homeButton").addEventListener('click', function(){
    gotoHome("flashCardMenu");
    document.getElementById("loadDeckmenu").style.display = "none"; 
    document.getElementById("questionLabel").innerHTML = "\n Press Generate to Begin";
    document.getElementById("answerLabel").innerHTML = "\n WRONG BUTTON!"
});

//From Quiz to Home (cleanup and setting text and variables back to default)
document.getElementById("homeButton2").addEventListener('click', function(){
    //show home and hide quiz
    gotoHome("quizMenu");
    
    //stop the timer, reset score and reset weighted-RNG
    timer.stop();
    userScore = 0;
    resetFrequency();
    
    //revert text back to normal
    document.getElementById("btnSubmitAnswer").innerHTML = "Start";
    document.getElementById("lblQuestion").innerHTML = "\n Press Start to Begin";
    document.getElementById("Timer1").innerHTML = "Timer: 60:0";
    document.getElementById("Score").innerHTML = "Score: 0";    
    
    //re-enable the submit/start buton if disabled
    document.getElementById("btnSubmitAnswer").disabled = false;
});

function gotoHome(id){
    document.getElementById(id).style.display= "none";
    document.getElementById("homePage").style.display= "inline-block";
    reanimateHomePage();    
}

function reanimateHomePage(){
    var title = document.getElementById("myTitleContainer").classList;
    var gotoFlash = document.getElementById("gotoFlashCard").classList;
    var gotoQuiz = document.getElementById("gotoQuiz").classList;
    var getimport = document.getElementById("importFile").classList;
    
    title.remove("animated");
    title.add("animated");
    gotoFlash.remove("animated");
    gotoFlash.add("animated");
    gotoQuiz.remove("animated");
    gotoQuiz.add("animated");
    getimport.remove("animated");
    getimport.add("animated");
}

//shows and hide the answer label in flashcard page
document.getElementById("showHideButton").addEventListener('click', function(){
    var flashcardAnswer = document.getElementById("answerLabel").style;
    
    if(flashcardAnswer.visibility == "visible")
    {
          flashcardAnswer.visibility = "hidden";  
    }else{
          flashcardAnswer.visibility = "visible";
    }
});

//generate question and answer pair in flashcard page
document.getElementById("generateButton").addEventListener('click', function(){
    var ID = generateID();
    document.getElementById("questionLabel").innerHTML = "\n"+qaDatabase[ID].question;
    document.getElementById("answerLabel").innerHTML= qaDatabase[ID].otherInfo + " \n" + qaDatabase[ID].answer;
    document.getElementById("answerLabel").style.visibility = "hidden"; 
});

function generateID(){
    var ID = -1;
    do{ ID = Math.floor(Math.random()*qaDatabase.length); }while(ID == previousID)
    previousID = ID; //remembers previous ID to prevent repetition
    return ID;
}

document.getElementById("btnSubmitAnswer").addEventListener('click', function(){
    
    //begin quiz
    if(document.getElementById("btnSubmitAnswer").innerHTML==="Start")
    {
        document.getElementById("btnSubmitAnswer").innerHTML = "Submit";
        //show radiobutton list of answers
        document.getElementById("rblAnswers").style.visibility = "visible"; 
        //start timer
        timer.start({countdown: true, precision: 'secondTenths', startValues: {seconds: 60}});
    }else{
        //check answer and update score
        if(document.getElementsByClassName("ansr")[answerID].checked)
        {
            userScore++;
            qaDatabase[answerID].reduceF(1);
            document.getElementById("Score").innerHTML = "Score: "+String(userScore)+" - Well done";
        }else{
            document.getElementById("Score").innerHTML = "Score: "+String(userScore)+" - Wrong!";
        }
        
        //clear radiobutton list selection
        document.getElementsByName("userAnswer").forEach(function(item){
         item.checked = false;
        });
    }
    
    //generate new question and answer
    generateQuizQuestion()
});

//timer count
timer.addEventListener('secondTenthsUpdated', function (e) {
    document.getElementById("Timer1").innerHTML = "Timer: " + timer.getTimeValues().toString(['seconds', 'secondTenths']);
});

//timer finished
timer.addEventListener('targetAchieved', function (e) {
    document.getElementById("Timer1").innerHTML = "GAME OVER!";
    document.getElementById("btnSubmitAnswer").disabled = true;
});

//generates questions and 4 answers in the quiz page
function generateQuizQuestion(){
    var ID = generateWeightedID(); //generateID();
    document.getElementById("lblQuestion").innerHTML= "\n"+qaDatabase[ID].question;
    
    var id0 = generateOtherID(ID, -1, -1, -1);
    var id1 = generateOtherID(ID, id0, -1, -1);
    var id2 = generateOtherID(ID, id0, id1, -1);
    var id3 = generateOtherID(ID, id0, id1, id2);
    
    document.getElementsByClassName("ans")[0].innerHTML = qaDatabase[id0].answer;
    document.getElementsByClassName("ans")[1].innerHTML = qaDatabase[id1].answer;
    document.getElementsByClassName("ans")[2].innerHTML = qaDatabase[id2].answer;
    document.getElementsByClassName("ans")[3].innerHTML = qaDatabase[id3].answer; //note:one is redunadant
    
    //selects a radio button to hold the real answer
    answerID = String(Math.floor(Math.random()*4));
    document.getElementsByClassName("ans")[answerID].innerHTML = qaDatabase[ID].answer;
    
    //TODO optimisation: place the real answer in before-hand instead of generating an additonal fake answer to override
}

function generateWeightedID(){
    var ID = -1;
    calculateTotalSum();
    do{
        ID = Math.floor(Math.random() * totalSum) + 1;
        for(var i = 0; i<qaDatabase.length; i++){
            if(qaDatabase[i].frequency < ID){
                ID -= qaDatabase[i].frequency;
            }
            else{
                ID = i;
                break;
            }
        }
    }while(ID == previousID)
    previousID = ID;
    return ID;
}

function generateOtherID(notThisOne, orThisOne, norThisOne, andThisToo){
    var otherID = -1;
    
    do{ otherID = Math.floor(Math.random()*qaDatabase.length);
    }while(otherID == notThisOne ||
          otherID == orThisOne ||
          otherID == norThisOne ||
          otherID == andThisToo);
    
    return otherID;
}

function resetFrequency(){
    for(var i = 0; i<qaDatabase.length; i++)
    {
        qaDatabase[i].resetF();
    }
}


//COKKIE HANDLING-------------------------------------------------------------------------------
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


