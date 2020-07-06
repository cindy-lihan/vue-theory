class Compile{ 
    constructor(el,vm){
        this.el = this.isEelementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 1.获取文档碎片对象放入内存中减少页面的回流和重绘
        const fragment = this.nodeToFragment(this.el);
        // 2. 编译模版
        this.compile(fragment);
        // 3. 追加子元素到根元素
        this.el.appendChild(fragment);
    }
    /*
        <h2>{{person.name}} -- {{person.age}}</h2>
        <h3>{{person.fav}}</h3>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
        <h3>{{msg}}</h3>
        <div v-text="msg"></div>
        <div v-if="show">显示成功</div>
        <input type="text" v-model=“msg>
    */
    compile(fragment){
        // 1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if(this.isEelementNode(childNodes)){
                // 是元素节点
                // 编译元素节点
                console.log('元素节点', child)
                compileElement(node);
            }else{
                // 是文本节点
                // 编译文本节点
                console.log('文本节点', child)
                compileText(text);

            }

        });

    }
    compileElement(node) {
        // <div v-text="msg"></div>
        const attributes = node.attributes;
        [...attributes].forEach(attr =>{
            const {name, value} = attr;
            console.log(attr);
            if(this.isDirective(name)){ //是一个指令 v-model v-text

            }

        })
    }

    compileText(text) {

    }

    isDirective(name){

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
    isEelementNode(node){
        return node.nodeType === 1;
    }
    

}
class MVue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.$data;
        this.$options = options;

        if(this.$el){
            // 1.实现一个数据的观察者
            // 2.实现一个指令的解析器
            new Compile(this.$el,this);

        }
    }

}