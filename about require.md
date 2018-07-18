## about node require

首先：

```
//node 模块代码
var a = {};
module.exports = a;
```

问题：在node执行的时候会发现，代码变成了这样子

```
(function (exports, require, module, __filename, __dirname) {
    var a = {};
    module.exports = a;
});

```

>可以看到，我们的模块代码在运行的时候是被包裹了一层的，而上面列的这些变量正是在这个包裹函数中作为形参传入的。
其中module指向模块本身，module.exports和exports是等价的，表示模块要导出供调用的内容


## require的内部处理流程

先上[代码](https://github.com/nodejs/node/blob/v5.x/lib/module.js)

```
// Loads a module at the given file path. Returns that module's
// `exports` property.
Module.prototype.require = function (path) {
    assert(path, 'missing path');
    assert(typeof path === 'string', 'path must be a string');
    return Module._load(path, this, /* isMain */ false);
};

...

```

### 分析：

require命令是CommonJS规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的module.require命令，而后者又调用Node的内部命令Module._load。


```
Module._load = function(request, parent, isMain) {
	// .....
	
	return module.exports;
}
```

```
Module._load = function(request, parent, isMain) {
  // 1. 检查 Module._cache，是否缓存之中有指定模块
  // 2. 如果缓存之中没有，就创建一个新的Module实例
  // 3. 将它保存到缓存
  // 4. 使用 module.load() 加载指定的模块文件，
  //    读取文件内容之后，使用 module.compile() 执行文件代码
  // 5. 如果加载/解析过程报错，就从缓存删除该模块
  // 6. 返回该模块的 module.exports
};
```

```
// Given a file name, pass it to the proper extension handler.
Module.prototype.load = function(filename) {
  debug('load %j for module %j', filename, this.id);

  assert(!this.loaded);
  this.filename = filename;
  this.paths = Module._nodeModulePaths(path.dirname(filename));
  
  // .....
}
```

上面的第4步，采用module.compile()执行指定模块的脚本，逻辑如下。

```
// Run the file contents in the correct scope or sandbox. Expose
// the correct helper variables (require, module, exports) to
// the file.
// Returns exception, if any.
Module.prototype._compile = function(content, filename) {
	// .....
	const dirname = path.dirname(filename);
  	const require = internalModule.makeRequireFunction.call(this);
  	const args = [this.exports, require, this, filename, dirname];
  	const depth = internalModule.requireDepth;
  	if (depth === 0) stat.cache = new Map();
  	const result = compiledWrapper.apply(this.exports, args);
  	if (depth === 0) stat.cache = null;
  	return result;
	
}
```


```
Module.prototype._compile = function(content, filename) {
  // 1. 生成一个require函数，指向module.require
  // 2. 加载其他辅助方法到require
  // 3. 将文件内容放到一个函数之中，该函数可调用 require
  // 4. 执行该函数
};
```

上面的第1步和第2步，require函数及其辅助方法主要如下。
>require(): 加载外部模块  
>require.resolve()：将模块名解析到一个绝对路径  
>require.cache：指向所有缓存的模块  
>require.extensions：根据文件的后缀名，调用不同的执行函数  

一旦require函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数之中，这样可以避免污染全局环境。该函数的参数包括require、module、exports，以及其他一些参数。

```
(function (exports, require, module, __filename, __dirname) {
  // YOUR CODE INJECTED HERE!
});
```

Module._compile方法是同步执行的，所以Module._load要等它执行完成，才会向用户返回module.exports的值。


在Module._complie中是会在我们模块的代码外面包裹一些内容。

```

Module.prototype._compile = function(content, filename) {
  // remove shebang
  content = content.replace(shebangRe, '');

  // create wrapper function
  var wrapper = Module.wrap(content);

  var compiledWrapper = runInThisContext(wrapper,
                                      { filename: filename, lineOffset: 0 });
  ....
}

//Module的warp 来自NativeModule

NativeModule.wrap = function(script) {
  return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
};

NativeModule.wrapper = [
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
];
```

自此我们的模块内容算是包装完了。


AND ~~~~~~

我们可以模拟一个类似node require的办法

```
function require(path) {
    function load(){
        return '';
    }
    let code = load(path);
    code = 'function add(a, b) {return a+b}; module.exports = add';
    // 封装成闭包
    code = `(function(module) { ${code} })(context)`;
    // 相当于 exports，用于导出对象
    let context = {};
    // 运行代码，使得结果影响到 context
    const run = new Function('context', code);
    
    //大概就是这样子
    <!-- function(context){
        (function(module) {
            function add(a, b) {return a+b}; 
            module.exports = add;
        })(context)
    } -->

    run(context, code);
    
    //返回导出的结果
    return context.exports;
}

var a = require('xxx').exports;
```

[阮老师require](http://www.ruanyifeng.com/blog/2015/05/require.html)
