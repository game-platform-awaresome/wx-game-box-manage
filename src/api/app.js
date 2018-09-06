import request from '@/utils/request'

export function fetchListByPage(query) {
  return request({
    url: '/api/apps/fetchList',
    method: 'get',
    params: query
  })
}

export function fetchListByType(query) {
  return request({
    url: '/api/apps',
    method: 'get',
    params: query
  })
}

export function createApp(data) {
  return request({
    url: '/api/apps',
    method: 'post',
    data
  })
}

export function updateApp(id, data) {
  return request({
    url: `/api/apps/${id}`,
    method: 'put',
    data
  })
}

export function removeApp(id) {
  return request({
    url: `/api/apps/${id}`,
    method: 'delete'
  })
}

export function updateBannerIndex(data) {
  return request({
    url: `/api/apps/bannerIndex`,
    method: 'put',
    data
  })
}

export function updateListIndex(data) {
  return request({
    url: `/api/apps/listIndex`,
    method: 'put',
    data
  })
}
