# WeCom (WeChat Work) Group Robot

<p align="center">
  <a href="https://github.com/MeanZhang/wecom-group-robot/actions/workflows/test.yml" alt="Unit Tests">
    <img src="https://github.com/MeanZhang/wecom-group-robot/actions/workflows/test.yml/badge.svg">
  </a>
  <a href="https://github.com/MeanZhang/wecom-group-robot/releases" alt="Releases">
    <img src="https://img.shields.io/github/v/release/MeanZhang/wecom-group-robot?include_prereleases&logo=github">
  </a>
  <a href="https://codecov.io/gh/MeanZhang/wecom-group-robot" alt="codecov">
    <img src="https://codecov.io/gh/MeanZhang/wecom-group-robot/branch/main/graph/badge.svg?token=U39YQJ1KVN"/>
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot?ref=badge_shield" alt="FOSSA Status">
    <img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot.svg?type=shield"/>
  </a>
</p>

通过企业微信[群机器人](https://developer.work.weixin.qq.com/document/path/91770)发送消息。

> **暂时只支持发送文本（text）、markdown（markdown）、文件（file）！**

## 用法

```yaml
- name: 发送到企业微信
  uses: MeanZhang/wecom-group-robot@v1
  with:
    key: ${{ secrets.KEY }}
    msgtype: "file"
    content: "${{ secrets.APP_NAME }}.apk"
```

## 参数

### 输入

| 参数      | 是否必填 | 说明                                                                                         |
| --------- | -------- | -------------------------------------------------------------------------------------------- |
| `key`     | 是       | 机器人的 Webhook 地址中的`key`（注意不是 url），例如`"693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa"` |
| `msgtype` | 是       | 消息类型，可填`"text"`、`"markdown"`、`"file"`                                               |
| `content` | 是       | 消息内容。当`msgtype`为`"file"`时，填写文件路径                                              |

### 输出

| 参数      | 说明                         |
| --------- | ---------------------------- |
| `errcode` | 错误代码，若发送成功为`0`    |
| `errmsg`  | 错误信息，若发送成功为`"ok"` |

> **注意**：只有发送成功时有输出，发送失败时会报错。
