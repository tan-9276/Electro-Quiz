const questions = [
  { category: "VOLTAGE & CURRENT", question: "Which unit is used to measure electric current?", options: ["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Watt (W)"], answer: 1, explanation: "Current is measured in amperes (A). Voltage is measured in volts." },
  { category: "OHM'S LAW", question: "According to Ohm's Law, voltage equals:", options: ["Current ÷ Resistance", "Current × Resistance", "Resistance ÷ Current", "Power × Current"], answer: 1, explanation: "Ohm's Law is V = I × R, where V is voltage, I is current, and R is resistance." },
  { category: "COMPONENTS", question: "What is the main job of a resistor in a circuit?", options: ["Store electric charge", "Produce light", "Oppose the flow of current", "Convert AC to DC"], answer: 2, explanation: "A resistor limits or opposes current flow, helping protect and control other components." },
  { category: "SEMICONDUCTORS", question: "A diode ideally allows current to flow in:", options: ["Both directions", "One direction only", "No direction", "A random direction"], answer: 1, explanation: "A diode conducts mainly in one direction when it is forward biased." },
  { category: "CIRCUITS", question: "In a series circuit, if one component breaks, what usually happens?", options: ["Everything keeps working", "Only that component stops", "The entire circuit opens", "Voltage doubles"], answer: 2, explanation: "A series circuit has one path. A break anywhere opens that path for all components." },
  { category: "POWER", question: "Which formula gives electrical power?", options: ["P = V × I", "P = V ÷ I", "P = R ÷ I", "P = I ÷ V"], answer: 0, explanation: "Electrical power is voltage multiplied by current: P = V × I." },
  { category: "CAPACITORS", question: "A capacitor is primarily used to:", options: ["Store electrical charge", "Increase resistance", "Generate current", "Measure voltage"], answer: 0, explanation: "Capacitors store electrical energy as charge in an electric field." },
  { category: "SIGNALS", question: "What does DC stand for in electronics?", options: ["Digital Circuit", "Direct Current", "Dual Charge", "Dynamic Current"], answer: 1, explanation: "DC means Direct Current: charge flows in one consistent direction." },
  { category: "SAFETY", question: "Before changing a component in a circuit, you should first:", options: ["Increase the voltage", "Disconnect the power supply", "Touch the wires", "Add another resistor"], answer: 1, explanation: "Always disconnect power first to protect both yourself and the circuit." },
  { category: "MEASUREMENT", question: "Which instrument is commonly used to measure voltage, current, and resistance?", options: ["Oscillator", "Transformer", "Multimeter", "Breadboard"], answer: 2, explanation: "A multimeter can measure multiple electrical quantities, including voltage, current, and resistance." }
];

const welcomeScreen = document.querySelector("#welcome-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const questionCount = document.querySelector("#question-count");
const questionCategory = document.querySelector("#question-category");
const questionText = document.querySelector("#question-text");
const optionsContainer = document.querySelector("#options");
const progressBar = document.querySelector("#progress-bar");
const liveScore = document.querySelector("#live-score");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");

let currentQuestion = 0;
let score = 0;
let hasAnswered = false;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  welcomeScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const current = questions[currentQuestion];
  hasAnswered = false;
  questionCount.textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${questions.length}`;
  questionCategory.textContent = current.category;
  questionText.textContent = current.question;
  liveScore.textContent = score;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.disabled = true;
  nextButton.textContent = "Choose an answer";
  optionsContainer.innerHTML = "";

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.setAttribute("role", "radio");
    button.innerHTML = `<span class="option-key">${String.fromCharCode(65 + index)}</span>${option}`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    optionsContainer.appendChild(button);
  });
}

function chooseAnswer(selectedIndex, selectedButton) {
  if (hasAnswered) return;
  hasAnswered = true;
  const current = questions[currentQuestion];
  const buttons = [...document.querySelectorAll(".option")];
  const isCorrect = selectedIndex === current.answer;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === current.answer) button.classList.add("correct");
  });
  if (!isCorrect) selectedButton.classList.add("wrong");
  if (isCorrect) score += 1;
  liveScore.textContent = score;
  feedback.textContent = `${isCorrect ? "Correct!" : "Not quite."} ${current.explanation}`;
  feedback.classList.add(isCorrect ? "correct-text" : "wrong-text");
  nextButton.disabled = false;
  nextButton.textContent = currentQuestion === questions.length - 1 ? "See my result →" : "Next question →";
}

function nextQuestion() {
  if (!hasAnswered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  document.querySelector("#result-score").textContent = score;
  const best = Math.max(score, Number(localStorage.getItem("electroQuizBestScore")) || 0);
  localStorage.setItem("electroQuizBestScore", best);
  document.querySelector("#best-score").textContent = `${best} / ${questions.length}`;

  const title = document.querySelector("#result-title");
  const message = document.querySelector("#result-message");
  if (score >= 9) { title.textContent = "Circuit superstar!"; message.textContent = "You have a very strong grasp of the basics. You are ready to explore more circuits."; }
  else if (score >= 6) { title.textContent = "Great foundation!"; message.textContent = "You know the important ideas. Review the explanations and try again to sharpen your score."; }
  else { title.textContent = "Every expert starts here."; message.textContent = "Use the feedback after each question to learn, then take another attempt. Progress matters more than a first score."; }
}

document.querySelector("#start-button").addEventListener("click", startQuiz);
document.querySelector("#restart-button").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
