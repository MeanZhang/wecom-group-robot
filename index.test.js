const process = require("process");
const fs = require("fs");
const { run } = require("./index");

process.env["INPUT_KEY"] = process.env["TEST_KEY"];

test("测试文本", () => {
  process.env["INPUT_MSGTYPE"] = "text";
  process.env["INPUT_CONTENT"] = "文本测试\n" + new Date().toTimeString();
  return run().then((out) => {
    expect(out.errcode).toBe(0);
  });
});

test("测试 Markdown", () => {
  process.env["INPUT_MSGTYPE"] = "markdown";
  process.env["INPUT_CONTENT"] =
    "### Markdown 测试\n" + new Date().toTimeString();
  return run().then((out) => {
    expect(out.errcode).toBe(0);
  });
});

test("测试图片", () => {
  process.env["INPUT_MSGTYPE"] = "image";
  process.env["INPUT_CONTENT"] = "test.png";
  return run().then((out) => {
    expect(out.errcode).toBe(-2);
  });
});

test("测试新闻", () => {
  process.env["INPUT_MSGTYPE"] = "news";
  process.env["INPUT_CONTENT"] = "test";
  return run().then((out) => {
    expect(out.errcode).toBe(-2);
  });
});

test("测试文件", () => {
  process.env["INPUT_MSGTYPE"] = "file";
  const filename = "testfile-" + getTimeString() + ".md";
  fs.writeFileSync(filename, "### Markdown 测试\n" + new Date().toTimeString());
  process.env["INPUT_CONTENT"] = filename;
  return run().then((out) => {
    fs.unlinkSync(filename);
    expect(out.errcode).toBe(0);
  });
});

test("测试空文件", () => {
  process.env["INPUT_MSGTYPE"] = "file";
  const filename = "testfile-" + getTimeString() + ".md";
  fs.writeFileSync(filename, "");
  process.env["INPUT_CONTENT"] = filename;
  return run().then((out) => {
    fs.unlinkSync(filename);
    expect(out.errcode).not.toBe(0);
  });
});

test("测试错误 key", () => {
  process.env["INPUT_KEY"] = "111";
  process.env["INPUT_MSGTYPE"] = "text";
  process.env["INPUT_CONTENT"] = "test";
  return run().then((out) => {
    expect(out.errcode).not.toBe(0);
  });
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
