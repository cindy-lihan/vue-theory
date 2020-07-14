class Watcher {
  constructor(expr, vm, cb){
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.oldVal = this.getOldVal();

  }
  update(){
    //判断新值和旧值有没有变化
    const newVal = compileUtil.getVal(this.expr,this.vm);
    console.log('newVal',newVal)
    if(newVal !== this.oldVal){
      //将新值回调出去
      this.cb(newVal)
    }
    

  }
  getOldVal(){
    console.log('this.expr',this.expr)
    // 给dep挂载当前观察者实例
    Dep.target = this;
    // 通过编译函数获取旧的值
    const oldVal = compileUtil.getVal(this.expr, this.vm);
    // 挂载完毕需要注销，防止重复挂载 (数据一更新就会挂载)
    Dep.target = null;
    return oldVal

  }

}
class Dep{
  constructor(){
    this.subs = [];
  }
  // 收集观察者
  addSub(watcher){
    this.subs.push(watcher);
  }
  // 通知观察者去更新
  notify(){
    console.log("通知了观察者");
    this.subs.forEach(w => w.update())
  }

}