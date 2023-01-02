const StartEl = document.getElementById("start");
const quizEl = document.getElementById("quiz");
const QuestEL = document.getElementById("questions");
const CounterEl = document.getElementById("counter");
const choices = Array.from(document.getElementsByClassName("choice-text"))
const ProgEl = document.getElementById("progress");
const Prog = document.getElementsByClassName("gauge")
const ScoreEl = document.getElementById("Scorecontainer");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
const MAX_QUESTIONS = 5;
let count = 0;
const QuestTime = 10;
const GaugeWidth = 150;
const GaugeUnit = GaugeWidth/QuestTime;
let TIMER;

const API_URL = "https://opentdb.com/api.php?amount=10&category=9"

let Questions = []

fetch(API_URL)
.then((response) => {
    let data = response.json();
    return data;
})

.then((data) => {
    // console.log(data);
    Questions = data.results.map((data) => {
        const FormatedQuestions = {
            question : data.question,
        };

        const answerchoices = [...data.incorrect_answers];  
        FormatedQuestions.answerInd = Math.floor(Math.random()*4) + 1;
        answerchoices.splice(FormatedQuestions.answerInd - 1, 0 , data.correct_answer);

        answerchoices.forEach((choice, index) => {
        FormatedQuestions['choice ' + (index + 1)] = choice;
        });


        return FormatedQuestions;
    })
    StartEl.addEventListener("click",startGame);
})

startGame = () => {
    questionCounter = 0;
    availableQuestions = [...Questions];
    // console.log(availableQuestions)
    StartEl.style.display = "none";
    GetNewQuestion();
    quizEl.style.display = "block"; 
    TIMER = setInterval(renderCounter,1000)
}
// startGame();
GetNewQuestion = () => {
    if(questionCounter == MAX_QUESTIONS)
    return renderScore();

    questionCounter++;
    ProgEl.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // Prog.style.width = `(${questionCounter}/${MAX_QUESTIONS})*100`
   

    const QuestionIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[QuestionIndex];
    QuestEL.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice ' + number];
        });
        
    availableQuestions.splice(QuestionIndex,1);
    acceptingAnswers = true;
}

choices.forEach((choice) => {
    choice.addEventListener("click", (e) =>{
        if(!acceptingAnswers)
        return;
        acceptingAnswers = false;

        const selectedChoice = e.target;
        const selectedAns = selectedChoice.dataset['number'];

        const checkAns = 
        selectedAns == currentQuestion.answerInd ? 'correct' : 'incorrect';

        if(checkAns == 'correct'){
            score = score + 1;
            count = 0;
            // document.getElementById(choices).style.backgroundColor = "#0f0";
            GetNewQuestion();
    }else{
        count = 0;
        GetNewQuestion();
    }    
})

})



function renderCounter(){
if(count <= QuestTime){
    CounterEl.innerHTML = count;
    count++
    
}else{
    count = 0;
    GetNewQuestion();
}
}

renderScore =() => {
clearInterval(TIMER);
quizEl.style.display = "none";
ScoreEl.style.display = "block";
ScoreEl.innerHTML = `Final score = ${score} `
}


