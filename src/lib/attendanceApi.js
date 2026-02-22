import { apiRequest } from './apiClient'

export function markAttendance(token) {
  return apiRequest('/attendance/mark', {
    method: 'POST',
    token,
  })
}

export function getMyAttendance(token) {
  return apiRequest('/attendance/me', {
    method: 'GET',
    token,
  })
}
