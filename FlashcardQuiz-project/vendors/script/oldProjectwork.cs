using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FlashCardQuiz_Project
{
    public partial class Index : System.Web.UI.Page
    {
        public qa[] qaDatabase = new qa[] {
                new qa("What is an Alogrithm?", "It is a set of ordered and finite steps used to solve a given problem"),
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
    };



        public Random rng = new Random();

        protected void Page_Load(object sender, EventArgs e)
        {


            //Testlabel.Text += Convert.ToString(Session["ID"])+", ";
        }

        //From main menu go to flashcard
        protected void gotoFlashCard_Click(object sender, EventArgs e)
        {
            flashCardMenu.Visible = true;
            MainMenu.Visible = false;

            answerLabel.Visible = false;
        }

        //From main menu go to quiz
        protected void gotoQuiz_Click(object sender, EventArgs e)
        {
            quizMenu.Visible = true;
            MainMenu.Visible = false;
        }

        //Form flashcard or quiz go to main menu - i.e. clean up and restore to default
        protected void homeButton_Click(object sender, EventArgs e)
        {
            MainMenu.Visible = true;

            if (flashCardMenu.Visible)
            {
                flashCardMenu.Visible = false;
                questionLabel.Text = "Press Generate to Begin";


            }
            else if (quizMenu.Visible)
            {
                quizMenu.Visible = false;
                btnSubmitAnswer.Text = "Start";
                lblQuestion.Text = "Press Start to Begin";
                rblAnswers.Visible = false;
                Session["quizCntr"] = -1;
                tmrlblQuiz.Text = "Timer";
            }

        }

        //Flashcard: show or hide answer label
        protected void showHideButton_Click(object sender, EventArgs e)
        {
            if (answerLabel.Visible)
            {
                answerLabel.Visible = false;
            }
            else
            {
                answerLabel.Visible = true;
            }

        }

        //Flashcard: generate flashcard question
        protected void generateButton_Click(object sender, EventArgs e)
        {
            answerLabel.Visible = false;
            int ID = generateID();

            questionLabel.Text = qaDatabase[ID].question;
            answerLabel.Text = qaDatabase[ID].extraInfo + " " + qaDatabase[ID].answer;

        }

        //Quiz: start/submit quiz answer button
        protected void btnSubmitAnswer_Click(object sender, EventArgs e)
        {
            if (btnSubmitAnswer.Text == "Start")
            {
                btnSubmitAnswer.Text = "Submit";
                rblAnswers.Visible = true;
                Session["quizCntr"] = 60;
                Timer1.Enabled = true;
                generateQuizQuestion();
            }
            else if (btnSubmitAnswer.Text == "Submit")
            {

                if (rblAnswers.SelectedIndex == Convert.ToInt32(Session["answerID"]))
                {
                    TestTextBox.Text = "WELL DONE";
                }
                else
                {
                    TestTextBox.Text = "WRONG";
                }

                generateQuizQuestion();
                rblAnswers.ClearSelection();

            }

        }

        //Quiz: generate question and answers
        public void generateQuizQuestion()
        {
            //generate questions remembering the ID of the answer
            int ID = generateID();
            lblQuestion.Text = qaDatabase[ID].question;

            //generate four fake answers that isn't same ID as the true answer or each other
            int id0 = generateOtherID(ID, -1, -1, -1);
            int id1 = generateOtherID(ID, id0, -1, -1);
            int id2 = generateOtherID(ID, id0, id1, -1);
            int id3 = generateOtherID(ID, id0, id1, id2);

            rblAnswers.Items[0].Text = qaDatabase[id0].answer;
            rblAnswers.Items[1].Text = qaDatabase[id1].answer;
            rblAnswers.Items[2].Text = qaDatabase[id2].answer;
            rblAnswers.Items[3].Text = qaDatabase[id3].answer;

            //place the answer over one of the fake answers
            int answerID = rng.Next(0, 4);
            rblAnswers.Items[answerID].Text = qaDatabase[ID].answer;
            Session["answerID"] = answerID;


        }

        public int generateOtherID(int notThisOne, int orThisOne, int norThisOne, int andThisToo)
        {
            int otherID = -1;

            do
            {
                otherID = rng.Next(0, qaDatabase.Length);
            } while (otherID == notThisOne ||
                     otherID == orThisOne ||
                     otherID == norThisOne ||
                     otherID == andThisToo);

            return otherID;
        }



        //Random: generate random ID from QA database
        public int generateID()
        {
            int ID;

            if (Session["ID"] == null) { Session["ID"] = -1; }

            do
            {
                ID = rng.Next(0, qaDatabase.Length);
            } while (ID == (int)Session["ID"]);


            Session["ID"] = ID;

            return ID;
        }


        //Quiz: counter down timer
        protected void Timer1_Tick(object sender, EventArgs e)
        {
            int tick = Convert.ToInt32(Session["quizCntr"]);

            if (tick > 0)
            {
                tmrlblQuiz.Text = Convert.ToString(tick);
                Session["quizCntr"] = tick - 1;
            }
            else if (tick <= 0)
            {
                tmrlblQuiz.Text = Convert.ToString(tick);
                TestTextBox.Text = "QUIZ IS DONE";
                Session["quizCntr"] = -1;
                Timer1.Enabled = false;
            }

        }

        //Load Deck btn: changes the deck used in the flash card and quiz
        protected void importFile_Click(object sender, EventArgs e)
        {
            if (myDeck.Visible)
            {
                myDeck.Visible = false;
            }
            else
            {
                myDeck.Visible = true;
            }

            if (myDeck.SelectedIndex == -1)
            {
                myDeck.SelectedIndex = 0;
            }
        }
    }

    public class qa
    {
        public string question { get; set; }
        public string answer { get; set; }
        public string extraInfo { get; set; }

        public int frequency = 10;
        public static int totalFrequency;

        public qa() : this("", "", "")
        {

        }

        public qa(string question, string answer) : this(question, answer, "")
        {

        }

        public qa(string question, string answer, string extraInfo)
        {
            this.question = question;
            this.answer = answer;
            this.extraInfo = extraInfo;
            totalFrequency += frequency;
        }
    }
}