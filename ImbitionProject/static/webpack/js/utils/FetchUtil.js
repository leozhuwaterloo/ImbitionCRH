export function getCSRFToken() {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, 10) === ('csrftoken=')) {
        return decodeURIComponent(cookie.substring(10));
      }
    }
  }
  throw new Error('Failed to find csrftoken');
}

export function fetchJson(url, csrftoken, callback, data) {
  if (!csrftoken) csrftoken = getCSRFToken();
  fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then((responseJson) => {
      if (responseJson.error) throw new Error(responseJson.error);
      else return responseJson;
    })
    .then(responseJson => (callback ? callback(responseJson) : responseJson))
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });
}
