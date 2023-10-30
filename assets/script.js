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

function selectOption() {
    
}

var LandingSection = document.getElementById('Landing');
var QuizSection = document.getElementById('Quiz');
var ResultSection = document.getElementById('Result');
var LeaderboardSection = document.getElementById('Leaderboard');