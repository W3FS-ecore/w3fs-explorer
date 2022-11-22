import Vue from "vue";
import {
  Button,
  Row,
  Col,
  Loading,
  Input,
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Icon,
  Dialog,
  Tooltip,
  Pagination,
  Message,
} from "element-ui";

Vue.use(Button);
Vue.use(Loading);
Vue.use(Col);
Vue.use(Row);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Icon);
Vue.use(Dialog);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.prototype.$message = Message;

import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";

locale.use(lang);
