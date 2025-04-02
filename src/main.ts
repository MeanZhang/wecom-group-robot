import * as core from '@actions/core'
import * as glob from '@actions/glob'
import FormData from 'form-data'
import axios from 'axios'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { InvalidMsgtypeError, NoFilesFound, PushResult } from './errors.js'

type MsgType = 'text' | 'markdown' | 'image' | 'file'

function isMsgType(msgtype: string): msgtype is MsgType {
  return ['text', 'markdown', 'image', 'file'].includes(msgtype)
}

/**
 * 推送文件
 * @param paths 要推送的文件路径，支持 \@actions/glob 语法
 * @returns {Promise<PushResult>} 推送结果
 */
async function pushFiles(paths: string): Promise<PushResult> {
  const globber = await glob.create(paths)
  core.debug(`searching: ${paths}`)
  const files = await globber.glob()
  core.debug(`found: ${files}`)
  for (const file_path of files) {
    const stats = fs.statSync(file_path)
    if (stats.isDirectory()) {
      core.debug(`Removing ${file_path} because it is a directory`)
      files.splice(files.indexOf(file_path), 1)
    }
  }
  if (files.length === 0) {
    core.warning(
      `No files were found with the provided path: ${paths}. No files will be uploaded.`
    )
    return new NoFilesFound(paths)
  } else {
    const s = files.length === 1 ? '' : 's'
    core.info(
      `With the provided path, there will be ${files.length} file${s} uploaded`
    )
  }
  const key = core.getInput('key')
  for (const file_path of files) {
    const upload_url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${key}&type=file`
    const file = fs.createReadStream(file_path)
    const filename = path.basename(file_path)
    const stats = fs.statSync(file_path)
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
      core.setFailed(res.data.errmsg)
      return res.data
    }
  }
  return {
    errcode: 0,
    errmsg: 'ok'
  }
}

export async function run(): Promise<PushResult> {
  const key = core.getInput('key')
  const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`
  const msgtype = core.getInput('msgtype')
  if (!isMsgType(msgtype)) {
    core.setFailed(`invalid msgtype: ${msgtype}`)
    return new InvalidMsgtypeError(msgtype)
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
  } = { msgtype }
  switch (msgtype) {
    // TODO mentioned
    case 'text':
    case 'markdown':
      params[msgtype] = { content }
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
    core.setFailed(response.data.errmsg)
  }
  return response.data
}
