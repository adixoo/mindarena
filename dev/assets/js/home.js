(async function () {
  const questionSet = await getSetList();

  const setComponent = extractComponent('[data-component="quiz-set"]');

  let component = '';
  questionSet.forEach((element) => {
    const template = generateTemplate(setComponent, {
      setName: element.name,
      description: element.description,
      set: element.set,
      questionNumber: `${element.question} Questions`,
    });
    component += template;
  });

  s('.quiz-set').innerHTML = component;
}).call(this);
