import * as core from '@actions/core'
import * as glob from '@actions/glob'
import FormData from 'form-data'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

type MsgType = 'text' | 'markdown' | 'image' | 'file'

function isMsgType(msgtype: string): msgtype is MsgType {
  return ['text', 'markdown', 'image', 'file'].includes(msgtype)
}

async function pushFiles(
  paths: string
): Promise<{errcode: number; errmsg: string}> {
  const globber = await glob.create(paths)
  const files = await globber.glob()
  const key = core.getInput('key')
  for (const file_path of files) {
    const upload_url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${key}&type=file`
    const file = fs.createReadStream(file_path)
    const filename = path.basename(file_path)
    const stats = fs.statSync(file_path)
    if (stats.isDirectory()) {
      continue
    }
    const filelength = stats.size
    const form = new FormData()
    form.append('file', file)
    const res = await axios({
      method: 'post',
      url: upload_url,
      data: form,
      headers: {
        'Content-Disposition': `form-data; name="media"; filename=${filename}; filelength=${filelength}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    if (res.data.errcode === 0) {
      const params = {
        msgtype: 'file',
        file: {
          media_id: res.data.media_id
        }
      }
      const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`
      await axios.post(url, params)
    } else {
      core.setFailed(res.data)
      return res.data
    }
  }
  return {
    errcode: 0,
    errmsg: 'ok'
  }
}

export async function run(): Promise<{errcode: number; errmsg: string}> {
  const key = core.getInput('key')
  const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`
  const msgtype = core.getInput('msgtype')
  if (!isMsgType(msgtype)) {
    core.setFailed(`invalid msgtype: ${msgtype}`)
    return {
      errcode: -1,
      errmsg: `invalid msgtype: ${msgtype}`
    }
  }
  const content = core.getInput('content')
  const params: {
    msgtype: string
    text?: {
      content: string
    }
    markdown?: {
      content: string
    }
    image?: {
      base64: string
      md5: string
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
    case 'image': {
      const file = fs.readFileSync(content)
      params[msgtype] = {
        base64: file.toString('base64'),
        md5: crypto.createHash('md5').update(file).digest('hex')
      }
      break
    }
    // case "news":
    //   break;
    case 'file':
      return pushFiles(content)
  }
  const response = await axios.post(url, params)
  if (response.data.errcode !== 0) {
    core.setFailed(response.data)
  }
  return response.data
}

run()
