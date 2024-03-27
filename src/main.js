// 依赖css模块 
require('./css/normal.css')
//依赖less文件：
require('./css/special.less')
// 依赖scss文件
require('./css/scss1.scss')
// ts类型
import { show } from './js/show.ts'
// 依赖es6写法
import sumObj from './js/module1.js'

//main.js文件
const { add, mul } = require('./js/test.js')

// (1)commonJS方式导入

console.log(add(20, 30));
console.log(mul(20, 30))
show('webpack')

//(2) ES6方式导入 
import {
  name,
  age,
  height
} from './js/test2.js'

console.log(name);
console.log(age);
console.log('es6=>es5---sumObj:', sumObj.sum(5, 6))
// let c1 = new Cookie('name', 'dirunru1234')
// console.log('c1', c1)
document.cookie = 'dirunru1234'
sessionStorage.setItem('name', '123456')
console.log('sessionStorage.getItem', sessionStorage.getItem('name'))
