import { API_HOST } from '../settings';

export function getCompanies() {
  const headers = new Headers({
    "Accept": "application/json"
  });
  const method = "GET";
  const url = `${API_HOST}/company`;

  return fetch(url, {method, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function updateCompany(id, data) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "PUT";
  const body = JSON.stringify(data);
  const url = `${API_HOST}/company/${id}`;

  return fetch(url, {method, body, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function createCompany(data) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "POST";
  const body = JSON.stringify(data);
  const url = `${API_HOST}/company`;

  return fetch(url, {method, body, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function createWorkspace(id, data) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "POST";
  const body = JSON.stringify(data);
  const url = `${API_HOST}/company/${id}/workspace`;

  return fetch(url, {method, body, headers})
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
}

export function updateWorkspace(id, idw, data) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "PUT";
  const body = JSON.stringify(data);
  const url = `${API_HOST}/company/${id}/workspace/${idw}`;

  return fetch(url, {method, body, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function addUserToWorkspace(id, idw, idu) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "POST";
  const url = `${API_HOST}/company/${id}/workspace/${idw}/user/${idu}`;

  return fetch(url, {method, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}

export function removeUserFromWorkspace(id, idw, idu) {
  const headers = new Headers({
    "Accept": "application/json",
    "Content-Type": "application/json",
  });
  const method = "DELETE";
  const url = `${API_HOST}/company/${id}/workspace/${idw}/user/${idu}`;

  return fetch(url, {method, headers})
  .then(response => {
    if (!response.ok) {
      return new Promise((resolve, reject) => reject(response.status));
    }

    return response.json();
  });
}
