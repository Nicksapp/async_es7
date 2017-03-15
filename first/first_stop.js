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

// start();

// 捕捉错误
var catch_err = function (time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject('error')
    }, time)
  })
}

var catch_err_start = async function () {
  try {
    console.log('start');
    await catch_err(2000); // 这里得到一个错误的返回值
    // 所以一下代码不会执行
    console.log('end');
  } catch (error) {
    console.log(error);
  }
}

// catch_err_start();
