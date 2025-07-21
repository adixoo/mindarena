(async function () {
  const params = getQueryParam('set');
  const userAnswer = getQueryParam('answer');
  const questionId = getQueryParam('question');
  const decodedUserAnswer = decodeURIComponent(userAnswer).split(',');
  const decodedQuestionId = decodeURIComponent(questionId).split(',');

  if (decodedUserAnswer.length !== 10 || decodedQuestionId.length !== 10) {
    redirectTo('/app');
    return;
  }

  console.log('Decoded User Answers:', decodedUserAnswer);
  console.log('Decoded Question IDs:', decodedQuestionId);

  const questionList = await getQuestion(params, true);
  if (!questionList) {
    redirectTo('/app');
    return;
  }

  const resultComponent = extractComponent('[data-component="result-list"]');
  let component = '';

  let correctAnswerCount = 0;
  decodedQuestionId.forEach((element, idx) => {
    const question = questionList[element];

    const correctAnswer = question.answer;
    const userSelected = decodedUserAnswer[idx] || '';

    const statuses = { a: 'default', b: 'default', c: 'default', d: 'default' };

    if (userSelected === '') {
      // No answer chosen → highlight only the correct one
      statuses[correctAnswer] = 'true';
    } else {
      // Mark user’s choice
      statuses[userSelected] =
        userSelected === correctAnswer ? 'true' : 'false';
      // Also highlight the correct answer if user was wrong
      if (userSelected !== correctAnswer) {
        statuses[correctAnswer] = 'true';
      }
    }
    if (userSelected === correctAnswer) {
      correctAnswerCount += 1;
    }

    const template = generateTemplate(resultComponent, {
      question: question.question,
      opta: question.options[0],
      optb: question.options[1],
      optc: question.options[2],
      optd: question.options[3],
      a: statuses.a,
      b: statuses.b,
      c: statuses.c,
      d: statuses.d,
      questionNumber: idx + 1,
    });

    component += template;
  });

  s('.question-result-list').innerHTML = component;
  s('.correct-answer').innerHTML = correctAnswerCount;
})();

const restartQuiz = () => {
  const params = getQueryParam('set');
  redirectTo(`/app/quiz/?set=${params}`);
};
