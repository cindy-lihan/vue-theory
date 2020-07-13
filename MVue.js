const compileUtil = {
  getVal(expr, vm){
    return expr.split('.').reduce((data,currentValue)=>{
      return data[currentValue]
    },vm.$data)

  },
  text(node, expr, vm){
    let value ;
    //expr 可能是 {{obj.name}}--{{obj.age}} -用正则表达式
    if(expr.indexOf('{{') !== -1){
      value = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
        console.log('args',args)
        return this.getVal(args[1],vm);
      })
    }else{ ////也可能是v-text='obj.name' v-text='msg'
        value = this.getVal(expr,vm)
    }
    //也可能是v-text='obj.name' v-text='msg'
    this.updater.textUpdater(node,value);

  },
  model(node, expr, vm){
    const value = this.getVal(expr, vm);
    this.updater.modelUpdater(node,value);

  },
  html(node, expr, vm){
    const value = this.getVal(expr, vm);
    this.updater.htmlUpdater(node,value);
  },
  on(node, expr, vm, eventName){
    console.log(node)
    //获取实践函数
    let fn = vm.$options.methods && vm.$options.methods[expr]
    node.addEventListener(eventName,fn.bind(vm),false)
  },
  // 绑定属性 简单的属性 已经处理 类名样式的绑定有点复杂 因为对应的值可能是对象 也可能是数组 大家根据个人能力尝试写一下
  bind(node,expr,vm,attrName){
    
   },
  updater:{
    textUpdater(node,value){
      node.textContent = value
    },
    htmlUpdater(node, value){
      node.html = value
    },
    modelUpdater(node, value){
      node.value = value;
    }
  }

}

class Compile{ 
    constructor(el,vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 1.获取文档碎片对象放入内存中减少页面的回流和重绘
        const fragment = this.nodeToFragment(this.el);
        // 2. 编译模版
        this.compile(fragment);
        // 3. 追加子元素到根元素
        this.el.appendChild(fragment);
    }
    /*
        <h3>{{person.fav}}</h3>
        <h3>{{msg}}</h3>
        <div v-text="msg"></div>
        <input type="text" v-model=“msg>
    */
    compile(fragment){
        // 1.获取子节点
        const childNodes = fragment.childNodes;
        // 2.递归循环编译
        [...childNodes].forEach(child => {
            if(this.isElementNode(child)){
                // 是元素节点
                // 编译元素节点
                console.log('元素节点', child);
                this.compileElement(child);
            }else{
                // 是文本节点
                // 编译文本节点
                console.log('文本节点', child);
                this.compileText(child);
            }
            // 一定要记得递归遍历
            if(child.childNodes && child.childNodes.length){
              this.compile(child);
          }

        });

    }
    compileElement(node) {
        // <div v-text="msg"></div>
        const attributes = node.attributes;
        [...attributes].forEach(attr =>{
            const {name, value} = attr;
            if(this.isDirective(name)){ //是一个指令 v-model v-text v-html v-on
              const[,directive] = name.split('-')
              const [dirName,eventName] = directive.split(':')
              compileUtil[dirName] && compileUtil[dirName](node, value, this.vm, eventName);
            }else if(this.isEventName(name)){
              let [,eventName] = name.split('@');
              compileUtil['on'](node, value, this.vm, eventName);
            }

        })
    }

    compileText(node) {
      const content = node.textContent;
      // 匹配{{xxx}}内容
      if(/\{\{(.+?)\}\}/.test(content)){
        //处理文本节点
        compileUtil['text'](node,content,this.vm)
      }

    }

    isDirective(attrName){
      return attrName.startsWith('v-')
    }

    isEventName(attrName){
      return attrName.startsWith('@')
    }
    nodeToFragment(el){
        // 创建文件碎片
        const fragment= document.createDocumentFragment()
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    isElementNode(node){
        return node.nodeType === 1;
    }
    

}
class MVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;

        if(this.$el){
            // 1.实现一个数据的观察者
            // new Observer(this.$data)

            // 2.实现一个指令的解析器
            new Compile(this.$el,this);

        }
    }

}