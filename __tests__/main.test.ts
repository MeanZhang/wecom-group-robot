import fs from 'fs'
import { expect, test } from '@jest/globals'
import { run } from '../src/main'
import path from 'path'
import { config } from 'dotenv'
import * as core from '@actions/core'

config()

process.env['INPUT_KEY'] = process.env['TEST_KEY']

jest.spyOn(core, 'setFailed').mockImplementation((message: string | Error) => {
  console.debug('::error::', message)
})

test('测试文本', async () => {
  process.env['INPUT_MSGTYPE'] = 'text'
  process.env['INPUT_CONTENT'] = `文本测试\n${new Date().toTimeString()}`
  const out = await run()
  expect(out.errcode).toBe(0)
}, 20000)

test('测试 Markdown', async () => {
  process.env['INPUT_MSGTYPE'] = 'markdown'
  process.env['INPUT_CONTENT'] =
    `### Markdown 测试\n${new Date().toTimeString()}`
  const out = await run()
  expect(out.errcode).toBe(0)
}, 20000)

test('测试图片', async () => {
  process.env['INPUT_MSGTYPE'] = 'image'
  process.env['INPUT_CONTENT'] = path.join(__dirname, 'test.png')
  const out = await run()
  expect(out.errcode).toBe(0)
}, 20000)

test('测试新闻', async () => {
  process.env['INPUT_MSGTYPE'] = 'news'
  process.env['INPUT_CONTENT'] = 'test'
  const out = await run()
  expect(out.errcode).toBe(-1)
}, 20000)

test('测试文件', async () => {
  process.env['INPUT_MSGTYPE'] = 'file'
  const filename = `testfile-${getTimeString()}.md`
  fs.writeFileSync(filename, `### Markdown 测试\n${new Date().toTimeString()}`)
  process.env['INPUT_CONTENT'] = filename
  const out = await run()
  expect(out.errcode).toBe(0)
  fs.unlinkSync(filename)
}, 20000)

test('测试空文件', async () => {
  process.env['INPUT_MSGTYPE'] = 'file'
  const filename = `testfile-${getTimeString()}.md`
  fs.writeFileSync(filename, '')
  process.env['INPUT_CONTENT'] = filename
  const out = await run()
  fs.unlinkSync(filename)
  expect(out.errcode).not.toBe(0)
}, 20000)

test('测试文件夹', async () => {
  process.env['INPUT_MSGTYPE'] = 'file'
  const filename = 'testfile'
  if (!fs.existsSync(filename)) {
    fs.mkdirSync(filename)
  }
  fs.writeFileSync(`${filename}/test1.md`, `test1\n${getTimeString()}`)
  fs.writeFileSync(`${filename}/test2.md`, `test2\n${getTimeString()}`)
  process.env['INPUT_CONTENT'] = filename
  const out = await run()
  expect(out.errcode).toBe(0)
}, 20000)

test('测试空文件夹', async () => {
  process.env['INPUT_MSGTYPE'] = 'file'
  const filename = 'testfile'
  if (!fs.existsSync(filename)) {
    fs.mkdirSync(filename)
  } else {
    fs.rmSync(filename, { recursive: true })
    fs.mkdirSync(filename)
  }
  process.env['INPUT_CONTENT'] = filename
  const out = await run()
  expect(out.errcode).toBe(-2)
  fs.rmSync(filename, { recursive: true })
}, 20000)

test('测试错误 key', async () => {
  process.env['INPUT_KEY'] = '111'
  process.env['INPUT_MSGTYPE'] = 'text'
  process.env['INPUT_CONTENT'] = 'test'
  const out = await run()
  expect(out.errcode).not.toBe(0)
}, 20000)

function getTimeString(): string {
  const time = new Date()
  return (
    time.getFullYear().toString() +
    (time.getMonth() + 1).toString().padStart(2, '0') +
    time.getDate().toString().padStart(2, '0') +
    time.getHours().toString().padStart(2, '0') +
    time.getMinutes().toString().padStart(2, '0') +
    time.getSeconds().toString().padStart(2, '0')
  )
}
