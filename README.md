# 异步最终解决方案 Promise+Async/Await-ES7 实践

> 主要深入熟悉ES7新特性 Async/Await, [原文链接](https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6)

## 1.初步应用Async/Await,实现一个暂停功能

```javascript
// 获得返回值
var  sleep = function (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve('ok');
    }, time);
  })
};

var start = async function () {
  console.log('start');
  let result = await sleep(1000);
  console.log(result);
  console.log('end');
}

start();
```

## 2.根据电影文件名,自动下载对应的海报

自动获得脚本所在目录下的movies/文件夹内电影相关的海报

`$ node get_movie_post.js`

```javascript

const fs = require('fs');
const path = require('path');
const request = require('request');

var movieDir = __dirname + '/movies',
    exts     = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv'];

// 读取文件列表
var readFiles = function () {
    return new Promise(function (resolve, reject) {
        fs.readdir(movieDir, function (err, files) {
            resolve(files.filter((v) => exts.includes(path.parse(v).ext)));
        });
    });
};

// 获取海报
var getPoster = function (movieName) {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;

    return new Promise(function (resolve, reject) {
        request({url: url, json: true}, function (error, response, body) {
            if (error) return reject(error);

            resolve(body.subjects[0].images.large);
        })
    });
};

// 保存海报
var savePoster = function (movieName, url) {
    request.get(url).pipe(fs.createWriteStream(path.join(movieDir, movieName + '.jpg')));
};


(async () => {
    let files = await readFiles();

    // await只能使用在原生语法
    for (var file of files) {
        let name = path.parse(file).name;

        console.log(`正在获取【${name}】的海报`);
        savePoster(name, await getPoster(name));
    }

    console.log('=== 获取海报完成 ===');
})();

```
