import {API_HOST} from "../settings";

export function getUsers() {
  const headers = new Headers({
    "Accept": "application/json"
  });
  const method = "GET";
  const url = `${API_HOST}/user`;

  return fetch(url, {method, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function createUser(data) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "POST";
  const body = JSON.stringify(data);
  const url = `${API_HOST}/user`;

  return fetch(url, {method, body, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}
