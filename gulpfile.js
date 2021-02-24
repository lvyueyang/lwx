const { watch, src, series, dest } = require("gulp");
const sass = require("gulp-sass");
const px2rpx = require("gulp-px2rpx");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const path = require("path");
const map = require("map-stream");
const fs = require("fs");
const args = require("process.args")();
const {
  WXML_STR,
  JS_STR,
  JSON_STR,
  SCSS_STR,
} = require("./config/template-str");

// 获取文件路径
function fp(getFile) {
  return map(function (file, cb) {
    if (getFile) {
      getFile(file);
    }
    cb(null, file);
  });
}

// 监听错误
function swallowError(error) {
  console.error(error.toString());
  this.emit("end");
}

/**
 * 公共转义方法
 * @param {String} filePath scss文件路径
 * @param {String} dirPath 编译后文件路径
 * */
function scssToWxss(filePath, dirPath) {
  src(filePath)
    .pipe(
      replace(/@import.*?\.wxss['|"];/g, (match) => {
        // 为 引入的 .wxss 添加注释，避免编译
        return `/**${match}**/`;
      })
    )
    .pipe(sass())
    .pipe(
      px2rpx({
        screenWidth: 750,
        wxappScreenWidth: 750,
        remPrecision: 2,
      })
    )
    .pipe(
      replace(/\/\*\*@import.*?\.wxss['|"];\*\*\//g, (match) => {
        // 解除 .wxss 注释
        return match.replace(/\/\*\*/, "").replace(/\*\*\//, "");
      })
    )
    .on("error", swallowError)
    .pipe(
      rename((path) => {
        path.extname = ".wxss";
      })
    )
    .pipe(dest("./"));
}

// 监听文件变化目录
const watch_files = [
  "style/*.scss",
  "style/*/**.scss",
  "components/**/*.scss",
  "global-components/**/*.scss",
  "pages/**/*.scss",
].map((item) => "app/" + item);

// 创建新页面
function create() {
  console.clear();
  console.log("创建新页面");
  const arg = args.create;
  const commitVal = arg.name;
  if (!commitVal) {
    console.error("请传入页面名称");
    return;
  }
  const app = path.join(process.cwd(), "/app");
  const dir = path.join(app, "/pages");
  fs.stat(path.join(dir, commitVal), (e) => {
    if (e) {
      try {
        fs.mkdirSync(path.join(dir, commitVal));
        fs.writeFileSync(path.join(dir, commitVal, "temp.wxml"), WXML_STR);
        fs.writeFileSync(path.join(dir, commitVal, "temp.scss"), SCSS_STR);
        fs.writeFileSync(path.join(dir, commitVal, "temp.json"), JSON_STR);
        fs.writeFileSync(path.join(dir, commitVal, "temp.js"), JS_STR);
        console.log("创建成功，添加路由");
        const routeJson = fs
          .readFileSync(path.join(app, "app.json"))
          .toString();
        let r = JSON.parse(routeJson);
        r.pages.push(`pages/${commitVal}/index`);
        fs.writeFileSync(
          path.join(app, "app.json"),
          JSON.stringify(r, null, 4)
        );
        console.log("添加路由成功");
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error(`${commitVal} 已存在不可重复创建`);
    }
  });
}

// 立即编译所有sass文件
function all() {
  console.log("编译全部");
  const cb = fp((file) => {
    const fPath = file.path;
    const fileDirname = path.dirname(fPath);
    scssToWxss(fPath, fileDirname);
    console.log("编译全部-完成");
  });
  const wf = watch_files.map((item) => {
    return "./app/" + item;
  });
  src(wf, { read: false }).pipe(cb);
}

// 监视文件改动并重新载入
function serve() {
  // 变化时执行的方法
  console.log("监听变化");
  // 监听变化
  try {
    const watcher = watch(watch_files);
    watcher.on("change", (filePath) => {
      // 所在文件夹
      const fileDirname = path.dirname(filePath);
      console.log(fileDirname);
      if (fileDirname.includes(`style`)) {
        console.log("style 存在变化, 文件路径为：" + filePath);
        // scssToWxss('./app/style/*.scss', './app/style')
        scssToWxss(filePath, fileDirname);
      } else {
        console.log("存在变化, 文件路径为：" + filePath);
        scssToWxss(filePath, fileDirname);
      }
    });
  } catch (e) {
    console.log(e);
  }
}

exports.serve = serve;
exports.default = series(serve, create, all);
