import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/activities',
    method: 'get',
    params: query
  })
}

export function createActivity(data) {
  return request({
    url: '/api/activities',
    method: 'post',
    data
  })
}

export function updateBaseInfo(id, data) {
  return request({
    url: '/api/activities/' + id,
    method: 'put',
    data
  })
}

export function updateCurrent(data) {
  return request({
    url: '/api/activities/setCurrent',
    method: 'post',
    data
  })
}

export function updateBannerImage(id, data) {
  return request({
    url: '/api/activities/' + id + '/updateBannerImage',
    method: 'put',
    data
  })
}

export function updateRuleImage(id, data) {
  return request({
    url: '/api/activities/' + id + '/updateRuleImage',
    method: 'put',
    data
  })
}

export function updateShareInfo(id, data) {
  return request({
    url: '/api/activities/' + id + '/updateShareInfo',
    method: 'put',
    data
  })
}

export function updateBargainSteps(id, data) {
  return request({
    url: '/api/activities/' + id + '/updateBargainSteps',
    method: 'put',
    data
  })
}
