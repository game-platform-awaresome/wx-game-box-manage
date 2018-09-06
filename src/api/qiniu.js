import request from '@/utils/request'

export function getUploadToken(query) {
  return request({
    url: '/api/qiniu/simpleUploadToken',
    method: 'get',
    params: query
  })
}
