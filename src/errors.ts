export interface PushResult {
  errcode: number
  errmsg: string
}

export class InvalidMsgtypeError implements PushResult {
  errcode = -1
  errmsg: string
  constructor(msgtype: string) {
    this.errmsg = `invalid msgtype: ${msgtype}`
  }
}

export class NoFilesFound implements PushResult {
  errcode = -2
  errmsg: string
  constructor(path: string) {
    this.errmsg = `no files found in ${path}`
  }
}
