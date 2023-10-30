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

function SelectOption() {

}

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

const LandingSection = document.getElementById('Landing');
const QuizSection = document.getElementById('Quiz');
const ResultSection = document.getElementById('Result');
const LeaderboardSection = document.getElementById('Leaderboard');

const BeginQuizBtn = document.getElementById('begin-quiz');
const ResultReturnBtn = document.getElementById('result-return-start');
const LeaderboardReturnBtn = document.getElementById('list-retunr-start');

const ResetLeaderboardBtn = document.getElementById('reset-list');

BeginQuizBtn.addEventListener('click', function() {
    LandingSection.hidden = true;
    QuizSection.hidden = false;
});

ResultReturnBtn.addEventListener('click', function() {
   ResultSection.hidden = true;
   LandingSection = false; 
});

LeaderboardReturnBtn.addEventListener('click', function() {
    LeaderboardSection.hidden = true;
    LandingSection = false;
});

var lbInit = JSON.parse(localStorage.getItem('leaderboard'));
if (lbInit == null) {
    localStorage.setItem('leaderboard', JSON.stringify([]));
}