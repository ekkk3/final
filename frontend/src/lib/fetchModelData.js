/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url The URL to issue the GET request.
 */
async function fetchModel(url) {
  try {
    const response = await fetch(`http://localhost:8081/api${url}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default fetchModel;
