import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/auth/local',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/users/me',
    method: 'get',
    params: { token }
  })
}
