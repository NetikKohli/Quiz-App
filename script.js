const questions = [                //all questions in questions array
    {   question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Preprocessor", correct: false },
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyper Text Multiple Language", correct: false },
            { text: "Hyper Tool Multi Language", correct: false }
        ]
    },
    {   question: "What does CSS stand for?",
        answers: [
            { text: "Cascading Style Sheets", correct: true },
            { text: "Colorful Style Sheets", correct: false },
            { text: "Computer Style Sheets", correct: false },
            { text: "Competitive Style Shield", correct: false }
        ]
    },
    {   question: "Which language is used for web development on the server side?",
        answers: [
            { text: "JavaScript", correct: false },
            { text: "Spring Boot", correct: true },
            { text: "HTML", correct: false },
            { text: "CSS", correct: false }
        ]
    },
    {   question: "Which of the following is a popular front-end framework for building user interfaces in JavaScript?",
        answers: [
            { text: "React.Js", correct: true },
            { text: "HTML", correct: false },
            { text: "CSS", correct: false },
            { text: "Django", correct: false }
        ]
    },
    {   question: " Which HTML tag is used to create a form?",
        answers: [
            { text: "form", correct: true },
            { text: "css", correct: false },
            { text: "script", correct: false },
            { text: "head", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer, nextQuestionTimeout;
const timeLimit = 10; 
let userAns=[]
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const scoreElement = document.getElementById("score");
const resultContainer = document.getElementById("result-container");
const restartButton = document.getElementById("restart-btn");
const timeDisplay = document.getElementById("time");
const questionsLeftDisplay = document.getElementById("questions-left");
const progressBar = document.getElementById("progress-bar");

function startQuiz() {
    score = 0;
    randomQues()
    let title=document.createElement('div')
    document.getElementById('time-left-badge').style.display='none'
    let head=document.querySelector('#header>h2')
    head.innerHTML='Quiz Application'
    head.style.color='#8f00ff'
    head.style.width='100%'
    head.style.textAlign='center'

    let start=document.createElement('div')
    start.style.width='25rem'
    start.style.backgroundColor='' 
    start.style.height='25rem'
    start.style.boxShaddow='2px 2px 30px'
    questionElement.append(start)
    start.style.display='flex'
    start.style.justifyContent='center'
    start.style.alignItems='center'
    start.style.flexDirection='column'
    
    let img=document.createElement('img')
    img.src='start.png'
    img.style.borderRadius='70px'
    img.style.width='5em'
    img.style.boxShadow='2px 2px 15px'
    let startQuizHead=document.createElement('h2')
    startQuizHead.innerHTML='Start Quiz'
    start.append(startQuizHead, img)
    start.style.alignItems='center'
    start.style.width='100%'
    currentQuestionIndex = 0;
    resultContainer.classList.add("hide");
    nextButton.classList.add("hide");
    
    img.addEventListener('click',showQuestion)
}

function randomQues() {
    const shuffled = [];
    while (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        shuffled.push(questions[randomIndex]);
        questions.splice(randomIndex, 1);
    }
    for(let i=0;i<shuffled.length;i++)
         questions[i]=shuffled[i];
}
function showQuestion() {
    resetState();
    document.getElementById('time-left-badge').style.display='inline-block'
    document.querySelector('#progress-container').style.display='block'
  
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener("click",()=>{ 
            if(!answer.correct){
            button.classList.add('incorrect') 
            button.innerHTML += ' <img src="incorrect.png"  width="20em"></img>';
            }
            selectAnswer(answer.correct,answer.text)});
        answerButtons.appendChild(button);
    });
    
    updateQuestionsLeft();
    updateProgressBar();
    startTimer();
}

function resetState() {
    clearInterval(timer);
    clearTimeout(nextQuestionTimeout);
    timeDisplay.innerText = timeLimit;
    
    while (answerButtons.hasChildNodes()) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    nextButton.classList.add("hide");
}

function startTimer() {
    let timeRemaining = timeLimit;
    timer = setInterval(() => {
        timeRemaining--;
        timeDisplay.innerText = timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            markAnswer(false,null); // Time out, treat as incorrect
        }
    }, 1000);
}

function selectAnswer(correct, answer) {

    clearInterval(timer);
    markAnswer(correct,answer);
}

function markAnswer(isCorrect,val) {
    if (isCorrect===true){ 
        score++;
        userAns.push(true)
    }
    else
        userAns.push(val)
        
    
    Array.from(answerButtons.children).forEach(button => {
        const isButtonCorrect = button.dataset.correct === "true";
        if(isButtonCorrect)
           button.classList.add('correct');
        button.disabled = true;
        
        if (isButtonCorrect) {
            button.innerHTML += ' <img src="check.png" width="20em"></img>'; // Check icon
        } 
        else 
           button.classList.add('notSelect')
        
    });
    setTimeout(100000)
    nextButton.classList.remove("hide");
    
    nextQuestionTimeout = setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showScore();
        }
    }, 3000); // 5 second delay
}

function showScore() {
    resetState()
    document.querySelector('#time-left-badge').style.display='none'
    document.querySelector('#questions-left').style.display='none'
    
    let ind=0;
    let top=document.querySelector('#header>h2')
    top.innerHTML='Quiz Result'
    top.parentElement.style.display='flex'
    top.parentElement.style.justifyContent='center'

    questionElement.innerHTML=''
    questions.forEach(ques=>{
         let q=(document.createElement('div'))
         q.innerHTML=`${++ind}.${ques.question}`;
         q.style.marginTop="20px";
         q.style.fontSize='20px'
         const el=document.createElement('div')
         el.classList.add('incorrect')
         el.style.fontSize='16px'

         ques.answers.forEach((e)=>{
            if(e.correct)
                ans=String(e.text);
         })
         if(userAns[ind-1]===true){
            el.classList.add('correct')
            el.classList.remove('incorrect')
            el.innerHTML='Your Answer is Correct: '+ans
    }
         else if(userAns[ind-1]!=null)
            el.innerHTML=`Your Answer : ${userAns[ind-1]}<br>Correct Answer : ${ans}<br>`
         else
            el.innerHTML='Not Attempted! <br> Correct answer : '+ans+'<br>';
        
         questionElement.append(q,el)
    })
    let scr=document.createElement('div')
    scr.style.color='blue'
    scr.innerHTML=`<br>You scored ${score} out of ${questions.length}!`
    questionElement.appendChild(scr)
    console.log(userAns)
    nextButton.classList.add("hide");
    resultContainer.classList.remove("hide");
    scoreElement.innerText = score;
}

function updateQuestionsLeft() {
    questionsLeftDisplay.innerText = `${currentQuestionIndex + 1} of ${questions.length} Questions`;
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Event listeners for Next and Restart buttons
nextButton.addEventListener("click", () => {
    clearTimeout(nextQuestionTimeout);
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showScore();
    }
});

restartButton.addEventListener("click",()=>{ 
    questionElement.innerHTML=""
    startQuiz()});

startQuiz();
