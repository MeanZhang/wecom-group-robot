import * as core from '@actions/core'
import FormData from 'form-data'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

export async function run(): Promise<{errcode: number; errmsg: string}> {
  const key = core.getInput('key')
  const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`
  const msgtype = core.getInput('msgtype')
  const content = core.getInput('content')
  const params: {
    msgtype: string
    text?: {
      content: string
    }
    markdown?: {
      content: string
    }
    file?: {
      media_id: string
    }
  } = {msgtype}
  switch (msgtype) {
    // TODO mentioned
    case 'text':
    case 'markdown':
      params[msgtype] = {content}
      break
    // case "image":
    //   break;
    // case "news":
    //   break;
    case 'file': {
      const upload_url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${key}&type=file`
      const file = fs.createReadStream(content)
      const filename = path.basename(content)
      let filelength = 0
      fs.stat(content, (err, stats) => {
        filelength = stats.size
      })
      const form = new FormData()
      form.append('file', file)
      const res = await axios({
        method: 'post',
        url: upload_url,
        data: form,
        headers: {
          'Content-Disposition': `form-data; name="media";filename=${filename}; filelength=${filelength}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data.errcode === 0) {
        params[msgtype] = {media_id: res.data.media_id}
      } else {
        core.setFailed(res.data)
        return res.data
      }
      break
    }
    default:
      core.setFailed(`invalid msgtype: ${msgtype}`)
      return {
        errcode: -2,
        errmsg: `invalid msgtype: ${msgtype}`
      }
  }
  const response = await axios.post(url, params)
  if (response.data.errcode !== 0) {
    core.setFailed(response.data)
  }
  return response.data
}

run()
