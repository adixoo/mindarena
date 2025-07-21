// Utility function to select the first DOM element matching a CSS selector
const s = (selector) => document.querySelector(selector);

// Function to extract the innerHTML of an element, or return null if it doesn’t exist
const extractComponent = (selector) => {
  const elem = document.querySelector(selector); // Try finding element by selector
  return elem ? elem.innerHTML : null; // Return its HTML content or null
};

// Asynchronous function to fetch question data from a given JSON “set”
// Returns parsed JSON or throws an error on failure
async function getQuestion(set, all = false) {
  const QUESTIONS_URL = `/assets/questions/${set}.json`;

  try {
    const response = await fetch(QUESTIONS_URL);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    if (all) return data;
    // Map questions with their index, strip out 'answer'
    const questionsWithIndex = data.map((q, idx) => ({
      index: idx,
      question: q.question,
      options: q.options,
      // No 'answer' here
    }));

    // Shuffle the questions
    for (let i = questionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsWithIndex[i], questionsWithIndex[j]] = [
        questionsWithIndex[j],
        questionsWithIndex[i],
      ];
    }

    // Return first 10
    return questionsWithIndex.slice(0, 10);
  } catch (error) {
    throw error;
  }
}

async function getSetList() {
  const SET_URL = `/assets/set/list.json`; // Construct URL based on "set" name

  try {
    const response = await fetch(SET_URL); // Send HTTP GET to fetch JSON
    if (!response.ok) {
      // If response status is not OK (e.g. 404 or 500), throw error with status info
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`,
      );
    }
    const data = await response.json(); // Parse the response body as JSON
    return data; // Return the parsed JSON object or array
  } catch (error) {
    console.error('Failed to get or parse JSON:', error); // Log error for debugging
    throw error; // Re-throw so caller knows fetch failed
  }
}
function generateTemplate(component, data = {}) {
  const html = component.replace(/\$([a-zA-Z0-9_]+)\$/g, (_, key) =>
    key in data ? data[key] : `$${key}$`,
  );
  return html;
}

function changeTheme() {
  const html = document.documentElement;
  const newTheme = html.classList.contains('dark') ? 'light' : 'dark';
  html.className = newTheme;
  localStorage.setItem('theme', newTheme);
}

/**
 * Returns the width and height of a DOM element.
 * @param {Element} el - The target DOM element.
 * @returns {{ width: number, height: number }} - The dimensions in pixels.
 */
function getElementSize(el) {
  if (!(el instanceof Element)) {
    throw new Error('Expected a DOM Element');
  }
  const rect = el.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

function redirectTo(path) {
  window.location.href = path;
}

function isUserLoggedIn() {
  const user = localStorage.getItem('username');
  return user ? user : null;
}

/**
 * Get the value of a query parameter from the current page's URL.
 * @param {string} name - The name of the parameter to retrieve.
 * @returns {string|null} The decoded value, or null if it's not present.
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name); // returns first value or null if not found :contentReference[oaicite:1]{index=1}
}
