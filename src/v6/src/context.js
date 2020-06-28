// 使用 Object.defineProperty 代理属性

const proto = {};

function proxyKey(property, key) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: true,
    get() {
      return this[property][key];
    },
    set(val) {
      this[property][key] = val;
    },
  });
}

const requestProperties = ["query"];
const responseProperties = ["body", "status"];

requestProperties.forEach((key) => proxyKey("request", key));
responseProperties.forEach((key) => proxyKey("response", key));

module.exports = proto;
