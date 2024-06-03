import { expect } from '@jest/globals'
import * as main from '../src/main'
import { config } from 'dotenv'

config()

// Mock the action's entrypoint
const runMock = jest.spyOn(main, 'run').mockImplementation()
process.env['INPUT_KEY'] = process.env['TEST_KEY']
process.env['INPUT_MSGTYPE'] = 'text'
process.env['INPUT_CONTENT'] = `测试 index.ts\n${new Date().toTimeString()}`

describe('index', () => {
  it('calls run when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
