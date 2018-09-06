// upload.js
import * as qiniu from 'qiniu-js'

// token 找后端，obj 这里指代从 el-upload 接收到的 object
export const upload = token => obj => {
  const { file } = obj
  const suffix = file.name.split('.')
  const ext = suffix.splice(suffix.length - 1, 1)[0]
  // 关于 key 要怎么处理自行解决，但如果为 undefined 或者 null 会使用上传后的 hash 作为 key.
  const key = `${suffix.join('.')}_${new Date().getTime()}.${ext}`
  // 因人而异，自行解决
  const putExtra = {}
  const config = {}

  const observable = qiniu.upload(file, key, token, putExtra, config)

  // 刚刚得到的信息可以使用了，这样可以使用到 el-upload 的进度条
  const next = ({ total }) => obj.onProgress({ percent: total.percent })

  const error = err => obj.onError(err)

  const complete = res => obj.onSuccess(res)

  const subscription = observable.subscribe(next, error, complete)
  return subscription // 返回以方便取消上传操作
}
