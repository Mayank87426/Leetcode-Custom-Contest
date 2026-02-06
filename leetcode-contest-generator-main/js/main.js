document.addEventListener('DOMContentLoaded', init);

let timerInterval = null;
let remainingSeconds = 0;

/* =========================
   INITIALIZATION
========================= */
function init() {
    console.log('DOM fully loaded');

    document.querySelector('.start-button')?.addEventListener('click', startContest);
    document.querySelector('.regenerate-button')?.addEventListener('click', regenerateContest);
    document.querySelector('.end-button')?.addEventListener('click', endContest);
}

/* =========================
   CONTEST FLOW
========================= */
function startContest() {
    console.log('Starting contest');

    loadQuestions();
    setupUIForContest();
    startTimer();
}

function regenerateContest() {
    console.log('Regenerating contest');
    loadQuestions();
}

function endContest() {
    console.log('Ending contest');

    stopTimer();
    resetUI();
    clearQuestions();
}

/* =========================
   UI HANDLING
========================= */
function setupUIForContest() {
    toggleElement('.start-button', false);
    toggleElement('.input-container', false);

    toggleElement('.regenerate-button', true);
    toggleElement('.end-button', true);

    document.querySelector('.timer')?.classList.remove('hidden');
}

function resetUI() {
    toggleElement('.start-button', true);
    toggleElement('.input-container', true);

    toggleElement('.regenerate-button', false);
    toggleElement('.end-button', false);

    document.querySelector('.timer')?.classList.add('hidden');
}

function toggleElement(selector, show) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.display = show ? 'inline-block' : 'none';
}

function clearQuestions() {
    const list = document.querySelector('.question-list');
    if (list) list.innerHTML = '';
}

/* =========================
   QUESTIONS LOGIC
========================= */
function loadQuestions() {
    console.log('Loading questions');

    fetch('data/questions.json')
        .then(res => res.json())
        .then(data => {
            const selectedQuestions = selectQuestionsByDifficulty(data);
            displayQuestions(selectedQuestions);
        })
        .catch(err => console.error('Error loading questions:', err));
}

function selectQuestionsByDifficulty(data) {
    const easy = data.filter(q => q.difficulty === 'EASY');
    const medium = data.filter(q => q.difficulty === 'MEDIUM');
    const hard = data.filter(q => q.difficulty === 'HARD');

    return [
        ...getRandom(easy, 1),
        ...getRandom(medium, 2),
        ...getRandom(hard, 1)
    ].map(q => ({
        title: q.title,
        slug: q.titleSlug,
        difficulty: q.difficulty,
        url: `https://leetcode.com/problems/${q.titleSlug}/`
    }));
}

function displayQuestions(questions) {
    const container = document.querySelector('.question-list');
    container.innerHTML = '';

    questions.forEach(q => {
        const item = document.createElement('div');
        item.className = `question-item ${q.difficulty.toLowerCase()}`;

        const link = document.createElement('a');
        link.href = q.url;
        link.target = '_blank';
        link.textContent = q.title;

        const button = document.createElement('button');
        button.className = 'tick-button';
        button.textContent = 'Mark as Solved';

        button.addEventListener('click', () => {
            item.classList.toggle('solved');
            button.textContent = item.classList.contains('solved')
                ? '✔ Solved'
                : 'Mark as Solved';
        });

        item.appendChild(link);
        item.appendChild(button);
        container.appendChild(item);
    });
}

/* =========================
   TIMER LOGIC
========================= */
function startTimer() {
    stopTimer();

    const durationInput = document.getElementById('duration');
    const minutes = parseInt(durationInput?.value) || 60;

    remainingSeconds = minutes * 60;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        remainingSeconds--;

        if (remainingSeconds <= 0) {
            stopTimer();
            alert('⏰ Time is up!');
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

/* =========================
   HELPERS
========================= */
function getRandom(arr, count) {
    return [...arr]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
}
