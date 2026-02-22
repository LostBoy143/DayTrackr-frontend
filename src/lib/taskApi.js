import { apiRequest } from './apiClient'

export function createTask(token, payload) {
  return apiRequest('/task', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getTasks(token) {
  return apiRequest('/task', {
    method: 'GET',
    token,
  })
}

export function updateTaskById(token, taskId, payload) {
  return apiRequest(`/task/${taskId}`, {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function deleteTaskById(token, taskId) {
  return apiRequest(`/task/${taskId}`, {
    method: 'DELETE',
    token,
  })
}
