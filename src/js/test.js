//test.js

function add (num1, num2) {
  return num1 + num2
}

function mul (num1, num2) {
  return num1 * num2
}
function throttle (fn, time) {
  //3. 通过闭包保存一个 "节流阀" 默认为false
  let temp = false;
  return function () {
    //8.触发事件被调用 判断"节流阀" 是否为true  如果为true就直接trurn出去不做任何操作
    if (temp) {
      return;
    } else {
      //4. 如果节流阀为false  立即将节流阀设置为true
      temp = true; //节流阀设置为true
      //5.  开启定时器
      setTimeout(() => {
        //6. 将外部传入的函数的执行放在setTimeout中
        fn.apply(this, arguments);
        //7. 最后在setTimeout执行完毕后再把标记'节流阀'为false(关键)  表示可以执行下一次循环了。当定时器没有执行的时候标记永远是true，在开头被return掉
        temp = false;
      }, time);
    }
  };
}
window.addEventListener('resize', throttle(function (e) {
  console.log(e.target.innerHeight, 'e.target.innerHeight')
  console.log(e.target.innerWidth, 'e.target.innerWidth')
  // 处理窗口大小变化的代码
  var root = document.getElementsByTagName("body")[0];
  if (e.target.innerHeight > 300) {
    root.style.cssText = "background-color: blue;color: #fff; ";
  } else {
    root.style.cssText = "background-color: yellow;color: red; ";
  }

}, 1000));

module.exports = {
  add,
  mul
}
