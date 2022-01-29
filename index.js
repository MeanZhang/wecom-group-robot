const core = require("@actions/core");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

async function run() {
  try {
    const key = core.getInput("key");
    const url = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=" + key;
    const msgtype = core.getInput("msgtype");
    const content = core.getInput("content");
    const params = {
      msgtype: msgtype,
    };
    switch (msgtype) {
      // TODO mentioned
      case "text":
      case "markdown":
        params[msgtype] = { content: content };
        break;
      case "image":
        break;
      case "news":
        break;
      case "file": {
        const upload_url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key=${key}&type=file`;
        const file = fs.createReadStream(content);
        const filename = path.basename(content);
        let filelength = 0;
        fs.stat(content, (err, stats) => {
          filelength = stats.size;
        });
        const form = new FormData();
        form.append("file", file);
        const res = await axios({
          method: "post",
          url: upload_url,
          data: form,
          headers: {
            "Content-Disposition": `form-data; name="media";filename=${filename}; filelength=${filelength}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (res.data.errcode === 0) {
          params[msgtype] = { media_id: res.data.media_id };
        } else {
          throw new Error(res.data);
        }
        break;
      }
      default:
        throw new Error("invalid msgtype: " + msgtype);
    }
    axios.post(url, params).then((response) => {
      if (response.data.errcode === 0) {
        core.setOutput("errcode", 0);
        core.setOutput("errmsg",response.data.errmsg)
      } else {
        core.debug(response.data);
        core.setFailed(response.data);
      }
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
