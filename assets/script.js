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

const ResultSubmitBtn = document.getElementById('result-list-submit');

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
        ),
        new QuestionSet(
            'What is NOT a correct way of defining a function?',
            'function name(parameter1)',
            'public static void main(args)',
            'let name = function(parameter1)',
            '(parameter1) =>',
            2
        ),
        new QuestionSet(
            'What declaration should be used for variables that cannot be updated?',
            'const',
            'var',
            'define',
            'let',
            1
        ),
        new QuestionSet(
            'Which of the following was created to standardize the use of JavaScript code?',
            'JSStandards',
            'TypeScript',
            'ECMAScript',
            'UniversalJS',
            3
        ),
        new QuestionSet(
            'What is a programming technique that allows for a task to run without interrupting the main thread?',
            'Synchronous Programming',
            'Task Oriented Programming',
            'Entity-Component-System',
            'Asynchronous Programming',
            4
        ),
        
        new QuestionSet(
            'Which of the following is not a valid way of commenting in JavaScript?',
            '//This is a comment',
            '/*This is a comment*/',
            '/** This is a comment */',
            '# This is a comment',
            4
        ),
        new QuestionSet(
            'Which of the following is used to add a new element to the end of an array in JavaScript?',
            'array.unshift()',
            'array.push()',
            'array.pop()',
            'array.append()',
            2
        ),
        new QuestionSet(
            'What does DOM stand for in the context of web development?',
            'Document Object Model',
            'Dynamic Object Manipulation',
            'Data Object Model',
            'Document Order Manager',
            1
        ),
        new QuestionSet(
            'Which of the following is true about JavaScript\'s \'==\' and \'===\' operators?',
            '\'==\' compares values for equality, \'===\' compares both values and types',
            '\'==\' compares values and types for equality, \'===\' compares values only',
            '\'==\' compares values only, \'===\' compares values and types',
            '\'==\' and \'===\' are interchangeable and can be used interchangeably',
            3
        ),
        new QuestionSet(
            'What is the primary purpose of JavaScript?',
            'Document styling',
            'Server-side scripting',
            'Client-side scripting',
            'Video editing',
            3
        ),
    ];
    localStorage.setItem('questions', JSON.stringify(questions));
}
const QuizQuestions = JSON.parse(localStorage.getItem('questions'));

let QuestionNum = 0;
let QuizTimer = setInterval;
let Score = 0;
let time = 90;

let StartQuiz = function() {
    QuestionNum = 0;
    Score = 0;
    DisplayQuestion();
    time = 90;
    TimerHeader.textContent = 'Time Left: ' + time;
    QuizTimer = setInterval(function() {
        time--;
        TimerHeader.textContent = 'Time Left: ' + time;
        if (time <= 0) {
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
        option.disabled = false;
    })
    QuizSection.children[question.correctAnswer].classList.add("correct-answer");

    QuizSection.children[0].textContent = question.question;
    QuizSection.children[1].textContent = question.option1;
    QuizSection.children[2].textContent = question.option2;
    QuizSection.children[3].textContent = question.option3;
    QuizSection.children[4].textContent = question.option4;
}

let SelectOption = function(event) {
    var allOptions = QuizSection.querySelectorAll('button');
    allOptions.forEach((option) => {
        option.disabled = true;
    })
    event.currentTarget.classList.add('selected');
    if (event.currentTarget.classList.contains('correct-answer')) {
        QuizSection.classList.add('mark-correct');
        Score++;
    } else {
        QuizSection.classList.add('mark-wrong');
        time -= 10;
    }
    var delay = 1;
    var nextQuestionDelay = setInterval(() => {
        delay--;
        if (delay == 0) {
            clearInterval(nextQuestionDelay);
            QuestionNum++;
            if (time > 0) {
                DisplayQuestion();
            }
        }
    }, 1500);
}

let EndQuiz = function() {
    QuizSection.hidden = true;
    ResultSection.hidden = false;
    ResultSection.querySelector('h2').querySelector('span').textContent = Score;
    TimerHeader.textContent = "";
}

let registerLeaderboard = function() {
    var El = ResultSection.querySelector('input');
    if (El.value != "") {
        AddToLeaderboard(El.value, Score);
        DisplayLeaderboard();
    }
}

// Leaderboard Methods
let AddToLeaderboard = function(name, score) {
    var rankings = JSON.parse(localStorage.getItem('leaderboard'));
    rankings.push(new LeaderboardItem(name, score));
    rankings.sort((r1, r2) => {return r1.Score > r2.Score});
    localStorage.setItem('leaderboard', JSON.stringify(rankings));
}

let DisplayLeaderboard = function () {
    var listHtml = document.getElementById('high-score-list');
    listHtml.innerHTML = "";

    var rankings = JSON.parse(localStorage.getItem('leaderboard'));
    rankings.forEach((ranking, index) => {
        var rankLi = document.createElement("div");
        var rankNum = document.createElement("span");
        var rankName = document.createElement("span");
        var rankScore = document.createElement("span");

        rankNum.textContent = index + 1;
        rankName.textContent = ranking.name;
        rankScore.textContent = ranking.score;

        rankNum.classList.add('rankNum');
        rankName.classList.add('rankName');
        rankScore.classList.add('rankScore');
        
        rankLi.appendChild(rankNum);
        rankLi.appendChild(rankName);
        rankLi.appendChild(rankScore);

        listHtml.appendChild(rankLi);
    });
    ResultSection.hidden = true;
    LeaderboardSection.hidden = false;
}

function ResetLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify([]));
    DisplayLeaderboard();
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

ResultSubmitBtn.addEventListener('click', registerLeaderboard);

ResetLeaderboardBtn.addEventListener('click', ResetLeaderboard);

QuizSection.children[1].addEventListener('click', SelectOption);
QuizSection.children[2].addEventListener('click', SelectOption);
QuizSection.children[3].addEventListener('click', SelectOption);
QuizSection.children[4].addEventListener('click', SelectOption);