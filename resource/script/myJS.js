var timer = new Timer();

var qaDatabase = []; //collection of question and answers currently selected
var userScore = 0;   //keeps track of user score
var previousID = -1; //keeps tack of previous question ID to prevent repetition
var answerID = -1;   //keeps track of the correct answer within the radio button list

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
        }
    }
    
    this.resetF = function () {
        this.frequency = 10;
    }

}

function calculateTotalSum(){
    var totalSum = 0;
    for(var i = 0; i<qaDatabase.length; i++)
    {
        totalSum += qaDatabase[i].frequency;
    }
    return totalSum;
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
        
        for(var i = 0; i < myObj.programming.length; i++)
        {
            programming[i] = new qa(myObj.programming[i].question, myObj.programming[i].answer, myObj.programming[i].otherInfo)
        }
        
        for(var i = 0; i < myObj.videoGames.length; i++)
        {
            videoGames[i] = new qa(myObj.videoGames[i].question, myObj.videoGames[i].answer, myObj.videoGames[i].otherInfo);
        }
    }
};
xmlhttp.send();
qaDatabase = programming;

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

//From Home to Quiz
$('#gotoQuiz').on('click', () => {
    $('#homePage').hide();
    $('#loadDeckMenu').hide();
    $('#quizMenu').show();
    
    //start with radio button list hidden until start
    $('#rblAnswers').css('visibility', 'hidden');
});

//From Flashcard return to Home (cleanup and setting text back to default)
$('#homeButton').on('click', ()=>{
    gotoHome("#flashCardMenu");
    $('#loadDeckmenu').hide();
    $('#questionLabel').html("\n Press Generate to Begin");
    $('#answerLabel').html("\n WRONG BUTTON!");
});

//From Quiz return to Home (cleanup and setting text and variables back to default)
$('#homeButton2').on('click', ()=>{
    //show home and hide quiz
    gotoHome("#quizMenu");
    
    //stop the timer, reset score and reset weighted-RNG
    timer.stop();
    userScore = 0;
    resetFrequency();
    
    //revert text back to normal
    $('#btnSubmitAnswer').html("Start");
    $('#lblQuestion').html("\n Press Start to Begin");
    $('#Timer1').html("Timer: 60:0");
    $('#Score').html("Score: 0");
    
    //re-enable the submit/start buton if disabled from timeout
    $('#btnSubmitAnswer').prop('disabled', false);
});


function gotoHome(id){
    $(id).hide();
    $('#homePage').show();
    reanimateHomePage();    
}

function reanimateHomePage(){
    //by removing and adding 'animated' class we re-trigger the animation
    $('#myTitleContainer').removeClass('animated').addClass('animated');    
    $('#gotoFlashCard').removeClass('animated').addClass('animated');    
    $('#gotoQuiz').removeClass('animated').addClass('animated');    
    $('#importFile').removeClass('animated').addClass('animated');
}

//shows and hide the answer label in flashcard page
$('#showHideButton').on('click', () => {
    if ( $('#answerLabel').css('visibility') == 'hidden' )
        $('#answerLabel').css('visibility','visible');
    else
        $('#answerLabel').css('visibility','hidden');
});

//generate question and answer pair in flashcard page
$('#generateButton').on('click', () => {
    var ID = generateID();
    $('#questionLabel').html("\n"+qaDatabase[ID].question);
    $('#answerLabel').html(qaDatabase[ID].otherInfo + " \n" + qaDatabase[ID].answer);
    $('#answerLabel').css('visibility','hidden');
    
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
    var totalSum = calculateTotalSum();
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