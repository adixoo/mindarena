// Utility function to select the first DOM element matching a CSS selector
const s = (selector) => document.querySelector(selector);

// Function to extract the innerHTML of an element, or return null if it doesn’t exist
const extractComponent = (selector) => {
  const elem = document.querySelector(selector); // Try finding element by selector
  return elem ? elem.innerHTML : null; // Return its HTML content or null
};

// Asynchronous function to fetch question data from a given JSON “set”
// Returns parsed JSON or throws an error on failure
async function getQuestion(set) {
  const QUESTIONS_URL = `/assets/questions/${set}.json`; // Construct URL based on "set" name

  try {
    const response = await fetch(QUESTIONS_URL); // Send HTTP GET to fetch JSON
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
