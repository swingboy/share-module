##### 运行机制的差异：

ES6模块的运行机制与CommonJS不一样。JS引擎对脚本静态分析的时候，遇到模块加载命令import就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。换句话说，ES6的import有点像Unix系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。


###### coomonJS

* 动态加载模块 
commonJS和es6的最大区别大概就在于此了吧，commonJS模块的动态加载能够很轻松的实现懒加载，优化用户体验。
* 加载整个模块 
commonJS模块中，导出的是整个模块。
* 每个模块皆为对象 
commonJS模块都被视作一个对象。
* 值拷贝 
commonJS的模块输出和 函数的值传递相似，都是值的拷贝

###### es6

* 静态解析 
即在解析阶段就确定输出的模块，所以es6模块的import一般写在被引入文件的开头。
* 模块不是对象 
在es6里，每个模块并不会当做一个对象看待
* 加载的不是整个模块 
在es6模块中经常会看见一个模块中有好几个export 导出
* 模块的引用 
es6模块中，导出的并不是模块的值拷贝，而是这个模块的引用


>在结合es6模块和commonJS模块的区别之后，我们知道es6的特点是静态解析，而commonJS模块的特点是动态解析的，因此，借于es6模块的静态解析，tree-shaking（摇树优化）的实现才能成为可能。

>在webpack中，tree-shaking指的就是按需加载，即没有被引用的模块不会被打包进来，减少我们的包大小，缩小应用的加载时间，呈现给用户更佳的体验。
（Tree-shaking 字面意思就是 摇晃树， 其实就是去除那些引用的但却没有使用的代码。）

>webpack默认es6规范编写的模块都能使用tree-shaking。