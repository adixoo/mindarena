(async function () {
  // check user logged in or not

  const user = isUserLoggedIn();
  if (!user) {
    redirectTo('/app/sign');
  }
  console.log(user);
  const username = formatNameShort(user);

  console.log(username);
  s('#username').innerHTML = username;

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

function formatNameShort(fullName) {
  // Ensure it's treated as a string
  const nameStr = String(fullName || '').trim();
  if (!nameStr) return '';

  const parts = nameStr.split(/\s+/).map((w) => {
    const lower = w.toLowerCase();
    return lower[0].toUpperCase() + lower.slice(1);
  });

  if (parts.length === 1) {
    return parts[0];
  }

  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0] + '.';
  return `${first} ${lastInitial}`;
}
