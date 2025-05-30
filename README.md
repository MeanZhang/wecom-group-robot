# WeCom (WeChat Work) Group Robot

<p align="center">
  <a href="https://github.com/MeanZhang/wecom-group-robot/actions/workflows/ci.yml" alt="CI">
    <img src="https://github.com/MeanZhang/wecom-group-robot/actions/workflows/ci.yml/badge.svg" alt="CI"/>
  </a>
  <a href="https://github.com/MeanZhang/wecom-group-robot/releases" alt="Releases">
    <img src="https://img.shields.io/github/v/release/MeanZhang/wecom-group-robot?include_prereleases&logo=github" alt="Releases"/>
  </a>
  <a href="https://codecov.io/gh/MeanZhang/wecom-group-robot" alt="codecov">
    <img src="./badges/coverage.svg" alt="covera"/>
  </a>
  <a href="https://app.fossa.com/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot?ref=badge_shield" alt="FOSSA Status">
    <img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot.svg?type=shield" alt="FOSSA Status"/>
  </a>
</p>

通过企业微信[群机器人](https://developer.work.weixin.qq.com/document/path/91770)发送消息，支持发送文本（text）、markdown（markdown）、图片（image）、文件（file）。

## 用法

```yaml
# 发送 APK 文件
- name: 发送到企业微信
  uses: MeanZhang/wecom-group-robot@v1
  with:
    key: ${{ secrets.KEY }}
    msgtype: 'file'
    content: 'app/build/outputs/apk/*.apk'
```

## 参数

### 输入

| 参数      | 是否必填 | 说明                                                                                                                                                                                                |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`     | 是       | 机器人的 Webhook 地址中的`key`（注意不是 url），例如`"693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa"`                                                                                                        |
| `msgtype` | 是       | 消息类型，可填`"text"`、`"markdown"`、`"image"`、`"file"`                                                                                                                                           |
| `content` | 是       | 消息内容。当`msgtype`为`"image"`时，填写文件路径，当`msgtype`为`"file"`时，填写文件路径，格式参考[@actions/glob Patterns](https://github.com/actions/toolkit/tree/main/packages/glob#glob-behavior) |

## 许可证

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FMeanZhang%2Fwecom-group-robot?ref=badge_large)
