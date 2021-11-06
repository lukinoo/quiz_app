// global variables
const quiz_box = document.getElementById("quiz-box");
const question_element = document.querySelector(".question");
const answers_side = document.querySelector(".answers-side");
const quiz_indicator = document.getElementById("quiz-indicator");
const next_question = document.getElementById("next-question");
const category_selector = document.getElementById("category-selector");
const choose_button = document.getElementById("choose-button");
const loader = document.getElementById("loader");
const main_menu = document.querySelector(".main-menu");
const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
let currentIndex = 0;
let score = 0;
let hide_answers = false;
let currentIndicator = 0;
let api_index = 21; // default value of api index which is sport category
let call_once = false;
// add event listeners
next_question.addEventListener("click", nextQuestion)
category_selector.addEventListener("change", categoryHandler);
choose_button.addEventListener("click", () => {
    fetchApi();
    choose_button.style.pointerEvents = "none";
    tl.fromTo(".main-menu", { clipPath: "circle(100% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)", duration: 0.8 })
    tl.fromTo(".main-menu", 0.4, { opacity: 1 }, { opacity: 0 }, "-=0.5")
});
// showing loading
function displayLoading() {
    loader.classList.add("loader-active");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("loader-active");
    }, 5000);
}
// hiding loading 
function hideLoading() {
    loader.classList.remove("loader-active");
}
// function which handling what will be quiz type
function categoryHandler(e) {
    let optionValue = e.target.value;
    switch (optionValue) {
        case "sports":
            api_index = 21;
            break;
        case "video games":
            api_index = 15;
            break;
        case "animals":
            api_index = 27;
            break;
        case "film":
            api_index = 11;
            break;
        case "computers":
            api_index = 18;
            break;
        case "vehicles":
            api_index = 28;
            break;
    }
}

function fetchApi() {
    displayLoading();
    fetch(`https://opentdb.com/api.php?amount=10&category=${api_index}&difficulty=easy`)
        .then(res => res.json())
        .then(data => {
            hideLoading();
            const dataResult = data.results.map(item => (
                {
                    ...item,
                    answers: [item.correct_answer, ...item.incorrect_answers]
                        .sort(() => 0.5 - Math.random())
                }
            ))
            creatingQuiz(dataResult[currentIndex]);
        })
}

function creatingQuiz(data) {
    // quiz question
    question_element.innerHTML = data.question;
    // quiz answers |
    data.answers.forEach(answer => {
        const answer_buttons = document.createElement("button");
        answer_buttons.innerHTML = answer;
        answer_buttons.classList.add("answer-buttons");
        answers_side.appendChild(answer_buttons);
    })
    // select all answer buttons which created up
    const createdAnswerButtons = answers_side.querySelectorAll("button").forEach((button, index) => {
        button.addEventListener("click", (e) => {
            hide_answers = true;
            if (hide_answers) {
                const item = document.querySelectorAll(".answer-buttons").forEach(button => {
                    button.setAttribute("disabled", true);
                })
                // next question button showing here
                next_question.style.display = "block";
            }
            quizOptions(button, data.correct_answer);
        })
    })
};
// function which checks clicked button is correct answer or NOT
function quizOptions(button, answer) {
    if (button.innerHTML === answer) {
        score++;
        button.classList.add("correct");
    } else if (button.innerHTML !== answer) {
        button.classList.add("incorrect");
    }
}

function nextQuestion(e) {
    // reseting answers
    resetAnswers();
    currentIndex++;
    currentIndicator += 10; // increment indicator variable
    quiz_indicator.style.width = `${currentIndicator}%`; // display quiz indicator width here
    fetchApi();
    // next question button disappear here 
    const change_next_question = e.target;
    change_next_question.style.display = "none";
    if (currentIndex >= 10) {
        quiz_box.innerHTML = `<h2>Your score is <span class="score-tag">${score}</span>/10 🔥</h2>
                              <button class="restart-game-btn" onclick="quizRestart()"}>Play again.</button>`;
    }
}

// this function resets current answers
function resetAnswers() {
    const currentAnswers = answers_side;
    currentAnswers.innerHTML = "";
}
// game restarts full
function quizRestart() {
    window.location = "index.html";
}
