// 中间件机制推理

async function m1(next) {
  console.log("m1");
  await next();
}

async function m2(next) {
  console.log("m2");
  await next();
}

async function m3() {
  console.log("m3");
}

// 模拟中间件调用机制
// const next1 = async function() {
//   await m3()
// }

// const next2 = async function() {
//   await m2(next1)
// }

// m1(next2) // 输出 m1 m2 m3

// 抽象
// function createNext(middleware, oldNext) {
//   return async function() {
//     await middleware(oldNext)
//   }
// }

// const next1 = createNext(m3, null)
// const next2 = createNext(m2, next1)
// const next3 = createNext(m1, next2)

// next3() // 输出 m1 m2 m3

// 精简 合并
function createNext(middleware, oldNext) {
  return async function () {
    await middleware(oldNext);
  };
}

const middlewares = [m1, m2, m3];
const len = middlewares.length;

// let next = async function() {
//   return Promise.resolve()
// }

let next = null;

for (let i = len - 1; i >= 0; i--) {
  const currentMiddleware = middlewares[i];
  next = createNext(currentMiddleware, next);
}

next(); // 输出 m1 m2 m3
