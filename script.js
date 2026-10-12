
const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const backTop = document.getElementById("backTop");

// Mobile navigation
menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");

    menuBtn.textContent = navbar.classList.contains("open")
        ? "✕"
        : "☰";
});

// Close menu after clicking a link
navbar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuBtn.textContent = "☰";
    });
});

// Back-to-top button
window.addEventListener("scroll", () => {
    backTop.classList.toggle("visible", window.scrollY > 300);
});

backTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Service model information
const models = {
    iaas: {
        title: "IaaS — Infrastructure as a Service",
        text: "Rent virtual machines, storage and networking. You manage the operating system and applications, while the provider manages physical infrastructure."
    },

    paas: {
        title: "PaaS — Platform as a Service",
        text: "Developers build and deploy applications without managing the underlying operating system and servers. Example: Google App Engine."
    },

    saas: {
        title: "SaaS — Software as a Service",
        text: "Use complete software through a browser or application. The provider manages the application and its infrastructure. Examples: Gmail and Microsoft 365."
    }
};

const modelCards = document.querySelectorAll(".model-card");
const modelDetail = document.getElementById("modelDetail");

modelCards.forEach(card => {
    card.addEventListener("click", () => {
        modelCards.forEach(item => {
            item.classList.remove("active");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("active");
        card.setAttribute("aria-pressed", "true");

        const selectedModel = models[card.dataset.model];

        modelDetail.innerHTML = `
            <h3>${selectedModel.title}</h3>
            <p>${selectedModel.text}</p>
        `;
    });

    card.setAttribute(
        "aria-pressed",
        card.classList.contains("active") ? "true" : "false"
    );
});

// Quiz questions
const questions = [
    {
        question: "Which model provides ready-to-use software?",
        options: ["IaaS", "PaaS", "SaaS", "Private Cloud"],
        answer: 2,
        explanation: "SaaS provides ready-to-use applications such as Gmail."
    },
    {
        question: "Which model combines public and private clouds?",
        options: [
            "Public Cloud",
            "Hybrid Cloud",
            "Community Cloud",
            "SaaS"
        ],
        answer: 1,
        explanation: "Hybrid cloud combines public and private cloud environments."
    },
    {
        question: "What does cloud elasticity mean?",
        options: [
            "Using physical servers only",
            "Removing the Internet",
            "Changing resources based on demand",
            "Printing documents"
        ],
        answer: 2,
        explanation: "Elasticity lets resources increase or decrease based on demand."
    }
];

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("nextQuestion");

let currentQuestion = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;

function showQuestion() {
    const question = questions[currentQuestion];

    questionElement.textContent = question.question;
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";

    selectedAnswer = null;
    answered = false;

    nextButton.disabled = true;
    nextButton.textContent = "Check Answer →";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "answer";
        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.addEventListener("click", () => {
            if (answered) return;

            selectedAnswer = index;

            document.querySelectorAll(".answer").forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");
            nextButton.disabled = false;
        });

        optionsElement.appendChild(button);
    });
}

nextButton.addEventListener("click", () => {
    // Show the result after the last question
    if (currentQuestion === questions.length) {
        currentQuestion = 0;
        score = 0;
        showQuestion();
        return;
    }

    // Check the selected answer
    if (!answered) {
        if (selectedAnswer === null) return;

        answered = true;

        const question = questions[currentQuestion];
        const buttons = document.querySelectorAll(".answer");

        buttons.forEach((button, index) => {
            button.disabled = true;

            if (index === question.answer) {
                button.classList.add("correct");
            }

            if (
                index === selectedAnswer &&
                selectedAnswer !== question.answer
            ) {
                button.classList.add("wrong");
            }
        });

        if (selectedAnswer === question.answer) {
            score++;
            feedbackElement.textContent =
                "Correct! " + question.explanation;
            feedbackElement.style.color = "#6ee7b7";
        } else {
            feedbackElement.textContent =
                "Incorrect. " + question.explanation;
            feedbackElement.style.color = "#fbbf24";
        }

        nextButton.textContent =
            currentQuestion === questions.length - 1
                ? "See Result →"
                : "Next Question →";

        return;
    }

    // Move to the next question
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    questionElement.textContent = "Quiz Completed! 🎉";

    optionsElement.innerHTML = `
        <div class="card">
            <h3>Your Score: ${score} / ${questions.length}</h3>
            <p>
                ${
                    score === questions.length
                        ? "Excellent! You answered every question correctly."
                        : "Good effort! Review the topics and try again."
                }
            </p>
        </div>
    `;

    feedbackElement.textContent = "Keep learning about cloud computing!";
    feedbackElement.style.color = "#6ee7b7";

    nextButton.disabled = false;
    nextButton.textContent = "Try Again ↻";

    currentQuestion = questions.length;
}

showQuestion();
