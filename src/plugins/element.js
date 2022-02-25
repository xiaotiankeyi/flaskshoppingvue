// 三方组件
import Vue from 'vue'
import {
  Button, Form, Input, FormItem, Message, container, header,
  aside, main, Menu, MenuItemGroup, MenuItem, Submenu, Breadcrumb,
  BreadcrumbItem, Card, Row, Col, TableColumn, Table, Pagination,
  Dialog, Select, Option, Tag, Tree, Cascader, Steps, Step, Tabs,
  TabPane, Alert
} from 'element-ui'
import ZkTable from 'vue-table-with-tree-grid'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)

Vue.component('tree-Table', ZkTable)
Vue.prototype.$msg = Message
