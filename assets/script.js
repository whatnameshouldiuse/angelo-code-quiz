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

    /**
     * 
     * @param {HTMLElement} section 
     */
    ApplyQuestion(section) {
        var allOptions = section.querySelectorAll('button');
        allOptions.forEach((option) => {
            option.classList.remove('correct-answer', 'selected');
        })
        section.children[this.correctAnswer].classList.add("correct-answer");

        section.children[0].textContent = this.question;
        section.children[1].textContent = this.option1;
        section.children[2].textContent = this.option2;
        section.children[3].textContent = this.option3;
        section.children[4].textContent = this.option4;
    }
}

class LeaderboardItem {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}

// Main Quiz Methods
var QuizTimer = setInterval;
var Score = 0;

function StartQuiz() {
    QuestionNum = 0;
    Score = 0;
    DisplayQuestion();
    var time = 90;
    QuizTimer.SetInterval(() => {
        time--;
        if (time == 0) {
            clearInterval(QuizTimer);
            EndQuiz();
        }
    }, 1000);
}

function DisplayQuestion() {
    QuizSection.classList.remove('mark-correct', 'mark-wrong');
    QuestionNum++;
    if (QuestionNum > QuizQuestions.length) {
        clearInterval(QuizTimer);
        EndQuiz();
    } else {
        QuizQuestions[QuestionNum].ApplyQuestion(QuizSection);
    }
}

function SelectOption() {
    this.classList.add('selected');
    if (this.classList.contains('correct-answer')) {
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
            DisplayQuestion();
        }
    }, 1000);
}

function EndQuiz() {
    QuizSection.hidden = true;
    ResultSection.hidden = false;
    ResultSection.querySelector('h2').querySelector('span').textContent = Score;
}

function registerLeaderboard(El) {
    if (El.textContent != "") {
        AddToLeaderboard(El.textContent, Score);
        DisplayLeaderboard();
    }
}

// Leaderboard Methods
function AddToLeaderboard(name, score) {
    var rankings = JSON.parse(localStorage.getItem('leaderboard'));
    rankings.push(new LeaderboardItem(name, score));
    rankings.sort((r1, r2) => {return r1 > r2});
    localStorage.setItem('leaderboard', JSON.stringify(rankings));
}

function DisplayLeaderboard() {
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

// DOM Objects
const LandingSection = document.getElementById('Landing');
const QuizSection = document.getElementById('Quiz');
const ResultSection = document.getElementById('Result');
const LeaderboardSection = document.getElementById('Leaderboard');

const BeginQuizBtn = document.getElementById('begin-quiz');
const ResultReturnBtn = document.getElementById('result-return-start');
const LeaderboardReturnBtn = document.getElementById('list-retunr-start');

const QuizOptions = QuizSection.querySelectorAll('button');

const ResetLeaderboardBtn = document.getElementById('reset-list');

// Event Listeners
BeginQuizBtn.addEventListener('click', function() {
    LandingSection.hidden = true;
    QuizSection.hidden = false;
    StartQuiz();
});

ResultReturnBtn.addEventListener('click', function() {
   ResultSection.hidden = true;
   LandingSection = false; 
});

LeaderboardReturnBtn.addEventListener('click', function() {
    LeaderboardSection.hidden = true;
    LandingSection = false;
});

QuizOptions.addEventListener('click', SelectOption());

// Initialization of Local Storage for leaderboard
var lsInitLeaderboard = JSON.parse(localStorage.getItem('leaderboard'));
if (lsInitLeaderboard == null) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}

// Initialization of Local Storage for Questions
const QuizQuestions = JSON.parse(localStorage.getItem('questions'));
if (QuizQuestions == null) {
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

var QuestionNum = 0;