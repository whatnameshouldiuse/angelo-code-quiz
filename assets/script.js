// Classes
class QuestionSet {
    constructor(question, option1, option2, option3, option4, correctAnswer) {
        this.question = question;
        this.option1 = option1;
        this.option2 = option2;
        this.option3 = option3;
        this.option4 = option4;
        this.correctAnswer = correctAnswer;
    }
}

class LeaderboardItem {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

// DOM Objects
const LandingSection = document.getElementById('Landing');
const QuizSection = document.getElementById('Quiz');
const ResultSection = document.getElementById('Result');
const LeaderboardSection = document.getElementById('Leaderboard');

const BeginQuizBtn = document.getElementById('begin-quiz');
const ResultReturnBtn = document.getElementById('result-return-start');
const LeaderboardReturnBtn = document.getElementById('list-return-start');

const ResetLeaderboardBtn = document.getElementById('reset-list');

const TimerHeader = document.getElementById('Timer');

// Initialization of Local Storage for leaderboard
let lsInitLeaderboard = JSON.parse(localStorage.getItem('leaderboard'));
if (lsInitLeaderboard == null) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}

// Initialization of Local Storage for Questions
let IsInitQuestions = JSON.parse(localStorage.getItem('questions'));
if (IsInitQuestions == null) {
    var questions = [
        new QuestionSet(
            'What statement is used for conditional branching?',
            'if',
            'while',
            'then',
            'when',
            1
        )
    ];
    localStorage.setItem('questions', JSON.stringify(questions));
}
const QuizQuestions = JSON.parse(localStorage.getItem('questions'));

let QuestionNum = 0;
let QuizTimer = setInterval;
let Score = 0;

let StartQuiz = function() {
    QuestionNum = 0;
    Score = 0;
    DisplayQuestion();
    var time = 90;
    QuizTimer = setInterval(function() {
        time--;
        TimerHeader.textContent = 'Time Left: ' + time;
        if (time == 0) {
            clearInterval(QuizTimer);
            EndQuiz();
        }
    }, 1000);
}

let DisplayQuestion = function() {
    QuizSection.classList.remove('mark-correct', 'mark-wrong');
    if (QuestionNum > QuizQuestions.length - 1) {
        clearInterval(QuizTimer);
        EndQuiz();
    } else {
        ApplyQuestion(QuizQuestions[QuestionNum]);
    }
}

/**
 * 
 * @param {QuestionSet} question 
 */
let ApplyQuestion = function(question) {
    var allOptions = QuizSection.querySelectorAll('button');
    allOptions.forEach((option) => {
        option.classList.remove('correct-answer', 'selected');
    })
    QuizSection.children[question.correctAnswer].classList.add("correct-answer");

    QuizSection.children[0].textContent = question.question;
    QuizSection.children[1].textContent = question.option1;
    QuizSection.children[2].textContent = question.option2;
    QuizSection.children[3].textContent = question.option3;
    QuizSection.children[4].textContent = question.option4;
}

let SelectOption = function(event) {
    event.currentTarget.classList.add('selected');
    if (event.currentTarget.classList.contains('correct-answer')) {
        QuizSection.classList.add('mark-correct');
        Score++;
    } else {
        QuizSection.classList.add('mark-wrong');
    }
    var secondDelay = 2;
    var nextQuestionDelay = setInterval(() => {
        secondDelay--;
        if (secondDelay == 0) {
            clearInterval(nextQuestionDelay);
            QuestionNum++;
            DisplayQuestion();
        }
    }, 1000);
}

let EndQuiz = function() {
    QuizSection.hidden = true;
    ResultSection.hidden = false;
    ResultSection.querySelector('h2').querySelector('span').textContent = Score;
}

let registerLeaderboard = function(El) {
    if (El.textContent != "") {
        AddToLeaderboard(El.textContent, Score);
        DisplayLeaderboard();
    }
}

// Leaderboard Methods
let AddToLeaderboard = function(name, score) {
    var rankings = JSON.parse(localStorage.getItem('leaderboard'));
    rankings.push(new LeaderboardItem(name, score));
    rankings.sort((r1, r2) => {return r1 > r2});
    localStorage.setItem('leaderboard', JSON.stringify(rankings));
}

let DisplayLeaderboard = function () {
    var listHtml = document.getElementById('high-score-list');
    listHtml.innerHTML = "";

    var rankings = JSON.parse(localStorage.getItem('leaderboard'));
    rankings.forEach((ranking, index) => {
        var rankLi = document.createElement("li");
        var rankNum = document.createElement("span");
        var rankName = document.createElement("span");
        var rankScore = document.createElement("span");

        rankNum.textContent = index;
        rankName.textContent = ranking.name;
        rankScore.textContent = ranking.score;
        
        rankLi.appendChild(rankNum);
        rankLi.appendChild(rankName);
        rankLi.appendChild(rankScore);

        listHtml.appendChild(rankLi);
    });
}

function ResetLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}

// Event Listeners
BeginQuizBtn.addEventListener('click', function() {
    LandingSection.hidden = true;
    QuizSection.hidden = false;
    StartQuiz();
});

ResultReturnBtn.addEventListener('click', function() {
   ResultSection.hidden = true;
   LandingSection.hidden = false; 
});

LeaderboardReturnBtn.addEventListener('click', function() {
    LeaderboardSection.hidden = true;
    LandingSection.hidden = false;
});

QuizSection.children[1].addEventListener('click', SelectOption);
QuizSection.children[2].addEventListener('click', SelectOption);
QuizSection.children[3].addEventListener('click', SelectOption);
QuizSection.children[4].addEventListener('click', SelectOption);