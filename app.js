const challenges = [
  {
    title: "Count up with a nested loop",
    code: `for (int i = 1; i <= 3; i++) {
    System.out.println(i);
    for (int j = i + 1; j <= i + 2; j++) {
        System.out.println(" " + j);
    }
}`,
    lines: ["1", " 2", " 3", "2", " 3", " 4", "3", " 4", " 5"],
    steps: [
      {i: 1, j: "—", line: "1"},
      {i: 1, j: 2, line: " 2"},
      {i: 1, j: 3, line: " 3"},
      {i: 2, j: "—", line: "2"},
      {i: 2, j: 3, line: " 3"},
      {i: 2, j: 4, line: " 4"},
      {i: 3, j: "—", line: "3"},
      {i: 3, j: 4, line: " 4"},
      {i: 3, j: 5, line: " 5"}
    ],
    hint: "Start with i = 1. The first println prints i, then j starts at i + 1 and runs through i + 2.",
    explanation: "For each i, Java prints i first. Then the inner loop prints two values: i + 1 and i + 2."
  },
  {
    title: "Print even numbers",
    code: `for (int i = 2; i <= 6; i += 2) {
    System.out.println(i);
}`,
    lines: ["2", "4", "6"],
    steps: [
      {i: 2, j: "—", line: "2"},
      {i: 4, j: "—", line: "4"},
      {i: 6, j: "—", line: "6"}
    ],
    hint: "The loop starts at 2 and adds 2 to i after every repetition. Stop when i is greater than 6.",
    explanation: "The values of i are 2, 4, and 6. The next value would be 8, which fails the condition i <= 6."
  },
  {
    title: "Count down",
    code: `for (int i = 3; i >= 1; i--) {
    System.out.println("*".repeat(i));
}`,
    lines: ["***", "**", "*"],
    steps: [
      {i: 3, j: "—", line: "***"},
      {i: 2, j: "—", line: "**"},
      {i: 1, j: "—", line: "*"}
    ],
    hint: "i begins at 3 and decreases by 1 each time. The repeat(i) expression prints that many asterisks.",
    explanation: "The loop uses i values 3, 2, and 1, so it prints three stars, then two, then one."
  }
];

let challengeIndex = 0;
let stepIndex = 0;
let printed = [];

const codeBlock = document.getElementById("codeBlock");
const challengeTitle = document.getElementById("challengeTitle");
const challengeNumber = document.getElementById("challengeNumber");
const prediction = document.getElementById("prediction");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const answer = document.getElementById("answer");
const currentI = document.getElementById("currentI");
const currentJ = document.getElementById("currentJ");
const lineCount = document.getElementById("lineCount");
const liveOutput = document.getElementById("liveOutput");

function currentChallenge() {
  return challenges[challengeIndex];
}

function loadChallenge() {
  const challenge = currentChallenge();
  challengeNumber.textContent = String(challengeIndex + 1).padStart(2, "0");
  challengeTitle.textContent = challenge.title;
  codeBlock.textContent = challenge.code;
  prediction.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  hint.textContent = "";
  hint.classList.add("hidden");
  answer.classList.add("hidden");
  answer.querySelector("code").textContent = challenge.lines.join("\n");
  resetTrace();
}

function normalizeOutput(value) {
  return value.trim().split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0).join("\n");
}

function checkAnswer() {
  const guess = normalizeOutput(prediction.value);
  const correct = normalizeOutput(currentChallenge().lines.join("\n"));
  if (!guess) {
    feedback.textContent = "Type your predicted output first.";
    feedback.className = "feedback bad";
  } else if (guess === correct) {
    feedback.textContent = "Correct! You traced the loop successfully.";
    feedback.className = "feedback good";
  } else {
    feedback.textContent = "Not quite yet. Compare each printed line with the trace below and try again.";
    feedback.className = "feedback bad";
  }
}

function resetTrace() {
  stepIndex = 0;
  printed = [];
  currentI.textContent = "—";
  currentJ.textContent = "—";
  lineCount.textContent = "0";
  liveOutput.textContent = "(Press “Next step” to begin.)";
}

function nextStep() {
  const steps = currentChallenge().steps;
  if (stepIndex >= steps.length) {
    liveOutput.textContent = printed.join("\n") + "\n\nTrace complete!";
    return;
  }
  const step = steps[stepIndex];
  currentI.textContent = step.i;
  currentJ.textContent = step.j;
  printed.push(step.line);
  lineCount.textContent = printed.length;
  liveOutput.textContent = printed.join("\n");
  stepIndex++;
  if (stepIndex === steps.length) {
    liveOutput.textContent += "\n\nTrace complete!";
  }
}

document.getElementById("checkBtn").addEventListener("click", checkAnswer);
document.getElementById("hintBtn").addEventListener("click", () => {
  hint.textContent = currentChallenge().hint;
  hint.classList.remove("hidden");
});
document.getElementById("showBtn").addEventListener("click", () => answer.classList.toggle("hidden"));
document.getElementById("stepBtn").addEventListener("click", nextStep);
document.getElementById("resetBtn").addEventListener("click", resetTrace);
document.getElementById("nextChallengeBtn").addEventListener("click", () => {
  challengeIndex = (challengeIndex + 1) % challenges.length;
  loadChallenge();
});

loadChallenge();
