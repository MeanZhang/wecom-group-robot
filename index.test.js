const process = require("process");
const cp = require("child_process");
const path = require("path");
const fs = require("fs");

process.env["INPUT_KEY"] = process.env["TEST_KEY"];

test("测试文本", () => {
  process.env["INPUT_MSGTYPE"] = "text";
  process.env["INPUT_CONTENT"] = "文本测试\n" + new Date().toTimeString();
  const ip = path.join(__dirname, "index.js");
  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
  console.log(result);
});

test("测试 Markdown", () => {
  process.env["INPUT_MSGTYPE"] = "markdown";
  process.env["INPUT_CONTENT"] =
    "### Markdown 测试\n" + new Date().toTimeString();
  const ip = path.join(__dirname, "index.js");
  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
  console.log(result);
});

test("测试文件", () => {
  process.env["INPUT_MSGTYPE"] = "file";
  const filename = "testfile-" + getTimeString() + ".md";
  fs.writeFileSync(filename, "### Markdown 测试\n" + new Date().toTimeString());
  process.env["INPUT_CONTENT"] = filename;
  const ip = path.join(__dirname, "index.js");
  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
  console.log(result);
  fs.unlinkSync(filename)
});

function getTimeString() {
  const time = new Date();
  return (
    time.getFullYear().toString() +
    (time.getMonth() + 1).toString().padStart(2, "0") +
    time.getDate().toString().padStart(2, "0") +
    time.getHours().toString().padStart(2, "0") +
    time.getMinutes().toString().padStart(2, "0") +
    time.getSeconds().toString().padStart(2, "0")
  );
}
