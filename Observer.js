class Observer{
  constructor(data){
    this.observe(data);
  }
  // 观察属性
  observe(data){
    /*
    {person: {name:'张三',fav:{a:'爱好'}}}
    */
    if(!data && typeof data !== 'object'){
      return;  
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function (key) {
      defineReactive(data, key, data[key]);

    })
  }
  //定义响应式数据
  defineReactive(data, key, value){
    this.observe(value);
    const dep = new Dep()
    Object.defineProperties(data,key, {
      enumerable: true,
      configurable: false,
      get(){
        // 订阅数据变化的时，往dep中添加观察者
        // 每个属性都有一个dep容器
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      // 箭头函数是为了this指向
      set: (newVal) => {
        if(newVal !== value){
          // 如果外界直接修改对象 则对新修改的值重新观察
          this.observe(newVal)
          value = newVal
          //通知变化
          dep.notify();

        }
      }

    
      
    })
  }
}