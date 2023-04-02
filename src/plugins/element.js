import Vue from 'vue'
// 样式缺失，加这个
import 'element-ui/lib/theme-chalk/index.css'

//导入弹框组件-Message
import { Button, Form, FormItem,Input,Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//Message比较特殊，要进行挂载
Vue.prototype.$message = Message
