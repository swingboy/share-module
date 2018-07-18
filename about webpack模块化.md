#### about webpack 模块化

##### 概要
webpack作为一个构建工具，解决了前端代码缺少模块化能力的问题。代码经过webpack构建和包装之后，能够在浏览器以模块化的方式运行。这些能力，都是因为webpack对我们的代码进行了一层包装。

#### 准备
首先我们创建一个简单入口模块index.js和一些依赖模块

```
//index.js
let {name, age, address} = require('./common.js');
import es6 from './es6.js';

console.log(name, es6(10));
```

```
//es6.js
export default function(a){
	return 1000 + a;
}

export function testfun(a){
	return a + '哈哈哈';
}
```

```
//common.js
module.exports = {
	age: 10,
	name: 'zhangsan',
	address: function(){
		return 'dddd'
	}
}
```

webpack 配置如下：

```
var path = require("path");
module.exports = {
    entry: path.join(__dirname, 'index.js'),
    output: {
        path: path.join(__dirname, 'outs'),
        filename: 'index.js'
    },
};
```
>这是一个最简单的配置，只指定了模块入口和输出路径。

执行webpack，得到经过webpack打包的代码如下（去掉了不必要的注释）：

```
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/******/ ({

/***/ "./src/common.js":
/***/ (function(module, exports) {

  eval("module.exports = {\n\tage: 10,\n\tname: 'zhangsan',\n\taddress: function(){\n\t\treturn 'dddd'\n\t}\n}\n\n//# sourceURL=webpack:///./src/common.js?");
  /***/ }),
  
  /***/ "./src/es6.js":
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"testfun\", function() { return testfun; });\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(a){\n\treturn 1000 + a;\n});\n\nfunction testfun(a){\n\treturn a + '哈哈哈';\n}\n\n//# sourceURL=webpack:///./src/es6.js?");
  /***/ }),

  /***/ "./src/index.js":
  /***/ (function(module, __webpack_exports__, __webpack_require__) {  
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _es6_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es6.js */ \"./src/es6.js\");\nlet {name, age, address} = __webpack_require__(/*! ./common.js */ \"./src/common.js\");\n\n\nconsole.log(name, Object(_es6_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(10));\n\n\n//# sourceURL=webpack:///./src/index.js?");

  /***/ })

  /******/ });
```



### 分析
上面webpack打包的代码，整体可以简化成下面的结构：

```
(function (modules) {/* xxxx */})
({
    './src/common.js': (function(module, exports) {
                /* 模块common.js的代码 */
                eval("module.exports = {\n\tage: 10,\n\tname: 'zhangsan',\n\taddress: function(){\n\t\treturn 'dddd'\n\t}\n}\n\n//# sourceURL=webpack:///./src/common.js?");
                }),
    './src/es6.js': f(){}, /* 模块es6.js的代码 */
    './src/index.js': f(){}, /* 模块index.js的代码 */
})
```

入口处文件最后结果：

```
var str = `__webpack_require__.r(__webpack_exports__);
var _es6_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"./src/es6.js\");
var {name, age, address} = __webpack_require__(\"./src/common.js\");
console.log(name, Object(_es6_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(10));`;
eval(str);
```
>可以看到，整个打包生成的代码是一个立即执行函数。


首先：函数参数是我们写的各个模块组成的数组，只不过我们的代码，被webpack包装在了一个函数的内部（也就是说我们的模块），在这里就是一个函数。为什么要这样做，是因为浏览器本身不支持模块化，那么webpack就用函数作用域来hack模块化的效果。


如果你debug过node代码，你会发现一样的hack方式，node中的模块也是函数，跟模块相关的参数exports、require，或者其他参数__filename和__dirname等都是通过函数传值作为模块中的变量，模块与外部模块的访问就是通过这些参数进行的，当然这对开发者来说是透明的。


同样的方式，webpack也控制了模块的module、exports和require，那么我们就看看webpack是如何实现这些功能的。


下面是摘取的函数内容和一些注释：

```
// 1、模块缓存对象
var installedModules = {};
// 2、webpack实现的require
function __webpack_require__(moduleId) {
    // 3、判断是否已缓存模块
    if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // 4、缓存模块
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };
    // 5、调用模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 6、标记模块为已加载
    module.l = true;
    // 7、返回module.exports
    return module.exports;
}
// 8、require第一个模块
return __webpack_require__(__webpack_require__.s = 0);

```

webpack之前的版本打过的内容，是这样子的

```
(function(module) {
})([(function (){}), function() {}])
```

>模块数组作为参数传入IIFE函数后，IIFE做了一些初始化工作：
>IIFE首先定义了installedModules ，这个变量被用来缓存已加载的模块。

>定义了__webpack_require__ 这个函数，函数参数为模块的id。这个函数用来实现模块的require。

>__webpack_require__ 函数首先会检查是否缓存了已加载的模块，如果有则直接返回缓存模块的exports。如果没有缓存，也就是第一次加载，则首先初始化模块，并将模块进行缓存。

>然后调用模块函数，也就是前面webpack对我们的模块的包装函数，将module、module.exports和__webpack_require__作为参数传入。注意这里做了一个动态绑定，将模块函数的调用对象绑定module.exports，这是为了保证在模块中的this指向当前模块。

>调用完成后，模块标记为已加载。

>返回模块exports的内容。

>利用前面定义的__webpack_require__ 函数，require第0个模块，也就是入口模块。


### 结果

打包过的模块生成了一些以自执行函数形式的闭包。




