const api = '/mongo';

function handleResponse(res) {
  if (res.ok) return res.json();
  else res.text().then((text) => Promise.reject(text));
}

export function readPlots() {
  return fetch(api).then(handleResponse);
}

export function createPlot(data) {
  return fetch(api, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function updatePlot(data) {
  return fetch(api, {
    method: 'PUt',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function deletePlot(data) {
  return fetch(api, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(handleResponse);
}
