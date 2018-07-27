function qa (question, answer, otherInfo) {
    this.question = question;
    this.answer = answer;

    if(otherInfo==="undefined")
    {
            this.otherInfo="";
    }else{
            this.otherInfo = otherInfo;
    }

}


var qaDatabase =[
                new qa("What is an Alogrithm?", "It is a set of ordered and finite steps used to solve a given problem", ""),
                new qa("Define AJAX", "Used to retrieve and process information without needing to reload the browser", "Asynchronous Javascript And XML"),
                new qa("Define JSON", "Used to convert any javascript object into text and vice versa, allowing communication between browser and server", "JavaScript Object Notation"),
                new qa("Define the DOM in HTML/CSS", "It defines the logical structure of documents and the way a document is accessed and manipulated", "Document Object Model"),
                new qa("What is ASP.Net?","It is a program which allow you to create dynamic website using the .Net framework", "Active Server Page"),
                new qa("Explain the function of the HTML, CSS and Javascript in front end programming", "Adds content to the website, styles the content and adds functionality to the content"),
                new qa("Define Progressive Enchancement", "Layering technologies sequentially so that they work without reliance upon each other"),
                new qa("Define a variable", "It is used to store information in a memory address to be referenced and manipulated in a computer program")
                //new qa("Name the 7 Development Lifecycles", "Planning, Analysis, Design, Implementation, Testing and Intergration, Maintenance"),
                //new qa("Is C# front end or Back end?", "Back end"),
                //new qa("Describe the basic HTML code strucutre", @"<!doctype HTML> \n <HTML> \n <head></head> \n <body></body> \n </HTML>"),
                //new qa("List some of the c# error handling exceptions","FileNotFoundException \n IndexOutOfRangeException \n ArgumentException \n DivideByZero \n FormatException")
    ];

var deckDisplay = document.getElementById("loadDeckmenu").style;
document.getElementById("importFile").addEventListener('click', function(){
    
    if(deckDisplay.display == "inline-block")
    {
          deckDisplay.display = "none";  
      
    }else{
        deckDisplay.display = "inline-block";
    }
});



document.getElementById("gotoFlashCard").addEventListener('click', function(){
    document.getElementById("homePage").style.display= "none";
    document.getElementById("flashCardMenu").style.display= "inline-block";
    document.getElementById("answerLabel").style.display= "none";
    
});

document.getElementById("gotoQuiz").addEventListener('click', function(){
    document.getElementById("homePage").style.display= "none";
    document.getElementById("quizMenu").style.display= "inline-block";
    
});

document.getElementById("homeButton").addEventListener('click', function(){
    gotoHome("flashCardMenu");
    document.getElementById("answerLabel").style.display= "none";
});

document.getElementById("homeButton2").addEventListener('click', function(){
    gotoHome("quizMenu");
    
});

function gotoHome(id){
    document.getElementById(id).style.display= "none";
    document.getElementById("homePage").style.display= "inline-block";
}


var flashcardAnswer = document.getElementById("answerLabel").style;
document.getElementById("showHideButton").addEventListener('click', function(){
    
    if(flashcardAnswer.display == "inline-block")
    {
          flashcardAnswer.display = "none";  
    }else{
          flashcardAnswer.display = "inline-block";
    }
});

document.getElementById("generateButton").addEventListener('click', function(){
    flashcardAnswer.display = "none";
    var ID = generateID();
    
    document.getElementById("questionLabel").innerHTML = qaDatabase[ID].question;
    document.getElementById("answerLabel").innerHTML= qaDatabase[ID].extraInfo + " " + qaDatabase[ID].answer;
    
    
});

var previousID = -1;
function generateID(){
    var ID = -1;
    do{
        ID = Math.floor(Math.random()*qaDatabase.length);}
    while(ID == previousID)
    previousID = ID;
    return ID;
    
}


