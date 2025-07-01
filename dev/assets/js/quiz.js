(async function () {
  // get question list

  const questionList = await getQuestion('set1'); // Fetch questions from 'quiz' set
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
