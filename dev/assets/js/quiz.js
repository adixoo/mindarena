(async function () {
  // get question list

  const params = getQueryParam('set'); // Get the 'set' query parameter from the URL
  const questionList = await getQuestion(params); // Fetch questions from 'quiz' set
  if (!questionList) {
    redirectTo('/app');
  }
  const quizComponent = extractComponent('[data-component="quiz"]');

  let component = '';
  questionList.forEach((element, idx) => {
    const template = generateTemplate(quizComponent, {
      question: element.question,
      answer: element.answer,
      opta: element.options[0],
      optb: element.options[1],
      optc: element.options[2],
      optd: element.options[3],
      questionNumber: idx + 1, // Current question number (1-based index)
      questionCount: questionList.length, // Total number of questions
    });
    component += template;
  });

  s('.quiz-list').innerHTML = component; // Render the quiz list in the container

  startQuizTimer();
}).call(this);

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
function submitQuiz() {
  // Collect answers into an array (A, B, C, D or null)
  const answers = [];

  document.querySelectorAll('.quiz-list form.quiz-box').forEach((form) => {
    // Find selected input within the current form
    const selected = form.querySelector('input.option-radio-input:checked');

    // Push the option value (a/b/c/d) or null
    answers.push(selected?.dataset.option ?? null);
  });
  // Convert the array into a comma-separated string, then encode it
  const answerStr = encodeURIComponent(answers.join(','));
  const set = encodeURIComponent(getQueryParam('set'));

  const redirectUrl = `/app/result/?answer=${answerStr}&set=${set}`;
  window.location.replace(redirectUrl); // Redirect to the result page with answers
}

function startQuizTimer() {
  const timerElem = s('.timer');
  let remainingSeconds = 300; // 5 minutes

  const updateDisplay = () => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerElem.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  updateDisplay(); // initial display

  const countdown = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds < 0) {
      clearInterval(countdown);
      timerElem.textContent = "Time's up!";
      // TODO: call function to end quiz or submit
      // quiz ended
      submitQuiz(); // Automatically submit when time's up
    } else {
      updateDisplay();
    }
  }, 1000);

  return () => clearInterval(countdown); // returns a stopper if needed
}
