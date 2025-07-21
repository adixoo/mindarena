const LS_SET_KEY = 'QUIZ_SET';
const LS_QUESTIONS_KEY = 'QUIZ_QUESTIONS';
const LS_STARTTIME_KEY = 'QUIZ_START_TIME';
const QUIZ_DURATION = 300; // 5 minutes in seconds

(async function () {
  const params = getQueryParam('set');
  let questionList;
  let startTime;
  let timeLeft;

  // Check if data exists in localStorage and set matches
  const savedSet = localStorage.getItem(LS_SET_KEY);
  const savedQuestions = localStorage.getItem(LS_QUESTIONS_KEY);
  const savedStartTime = localStorage.getItem(LS_STARTTIME_KEY);

  if (savedSet === params && savedQuestions && savedStartTime) {
    // Use stored questions
    questionList = JSON.parse(savedQuestions);
    startTime = +savedStartTime;
  } else {
    // Fetch new questions and store
    questionList = await getQuestion(params);
    if (!questionList) {
      redirectTo('/app');
      return;
    }
    startTime = Date.now();
    localStorage.setItem(LS_QUESTIONS_KEY, JSON.stringify(questionList));
    localStorage.setItem(LS_STARTTIME_KEY, startTime);
    localStorage.setItem(LS_SET_KEY, params);
  }

  // Timer logic
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  timeLeft = QUIZ_DURATION - elapsed;

  if (timeLeft <= 0) {
    // Time's up! erase old data and reload questions
    localStorage.removeItem(LS_QUESTIONS_KEY);
    localStorage.removeItem(LS_STARTTIME_KEY);
    localStorage.removeItem(LS_SET_KEY);
    location.reload();
    return;
  }

  // Render questions as per your code
  const quizComponent = extractComponent('[data-component="quiz"]');
  let component = '';
  questionList.forEach((element, idx) => {
    const template = generateTemplate(quizComponent, {
      question: element.question,
      // answer: element.answer, // Should be excluded if not for the UI
      opta: element.options[0],
      optb: element.options[1],
      optc: element.options[2],
      optd: element.options[3],
      questionNumber: idx + 1,
      questionCount: questionList.length,
    });
    component += template;
  });
  s('.quiz-list').innerHTML = component;

  startQuizTimer(timeLeft); // pass the actual time left
})().catch(console.error);

// When user submits the quiz
function removeStoredData() {
  localStorage.removeItem(LS_QUESTIONS_KEY);
  localStorage.removeItem(LS_STARTTIME_KEY);
  localStorage.removeItem(LS_SET_KEY);
  // ... other logic
}

// Shared helper to scroll list left or right
function scrollQuizList(direction) {
  const elem = document.querySelector('#quiz-question');
  const width = getElementSize(elem).width;

  const list = document.querySelector('.quiz-list');
  const offset = direction === 'left' ? -width : width;
  list.scrollBy({ left: offset, behavior: 'smooth' });
}

// Now you can call:
function previous() {
  scrollQuizList('left');
}

function next() {
  scrollQuizList('right');
}

// e.g. ["a", null, "d", "b", ...]
// function submitQuiz() {
//   // Collect answers into an array (A, B, C, D or null)
//   const answers = [];

//   document.querySelectorAll('.quiz-list form.quiz-box').forEach((form) => {
//     // Find selected input within the current form
//     const selected = form.querySelector('input.option-radio-input:checked');

//     // Push the option value (a/b/c/d) or null
//     answers.push(selected?.dataset.option ?? null);
//   });
//   // Convert the array into a comma-separated string, then encode it
//   const answerStr = encodeURIComponent(answers.join(','));
//   const set = encodeURIComponent(getQueryParam('set'));

//   const redirectUrl = `/app/result/?answer=${answerStr}&set=${set}`;
//   window.location.replace(redirectUrl); // Redirect to the result page with answers
// }
function submitQuiz() {
  // Collect answers into an array (A, B, C, D or null)
  const answers = [];
  document.querySelectorAll('.quiz-list form.quiz-box').forEach((form) => {
    const selected = form.querySelector('input.option-radio-input:checked');
    answers.push(selected?.dataset.option ?? null);
  });

  // Get CURRENT question list from localStorage (as stored earlier)
  const storedQuestions = JSON.parse(
    localStorage.getItem('QUIZ_QUESTIONS') || '[]',
  );
  // Get the array of original indices in the order they appear in the quiz
  const questionIndexes = storedQuestions.map((q) => q.index); // assuming each question object has an `index` field
  const questionStr = encodeURIComponent(questionIndexes.join(','));

  // Existing logic
  const answerStr = encodeURIComponent(answers.join(','));
  const set = encodeURIComponent(getQueryParam('set'));

  // Add question parameter
  const redirectUrl = `/app/result/?answer=${answerStr}&set=${set}&question=${questionStr}`;
  removeStoredData();
  window.location.replace(redirectUrl); // Redirect to the result page with answers
}

function startQuizTimer(onTimeUp) {
  const timerElem = s('.timer');

  // On first run, store start time if not present
  let startTime = localStorage.getItem(LS_STARTTIME_KEY);
  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(LS_STARTTIME_KEY, startTime);
  } else {
    startTime = parseInt(startTime, 10);
  }

  // Calculate remaining time based on current time
  function getRemainingSeconds() {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    return QUIZ_DURATION - elapsed;
  }

  let remainingSeconds = getRemainingSeconds();

  const updateDisplay = () => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerElem.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  updateDisplay(); // initial display

  const countdown = setInterval(() => {
    remainingSeconds = getRemainingSeconds();
    if (remainingSeconds <= 0) {
      clearInterval(countdown);
      timerElem.textContent = "Time's up!";
      setInterval(() => {
        submitQuiz(); // Automatically submit quiz when time's up
      }, 1000);
      localStorage.removeItem(LS_STARTTIME_KEY);
      localStorage.removeItem('QUIZ_QUESTIONS');
      localStorage.removeItem('QUIZ_SET');
      // End quiz
      if (typeof onTimeUp === 'function') onTimeUp();
    } else {
      updateDisplay();
    }
  }, 1000);

  // Returns a function to stop the timer if needed
  return () => clearInterval(countdown);
}
