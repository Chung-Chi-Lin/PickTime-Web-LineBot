import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import moment from 'moment';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
	Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import App from './App.vue';
import router from './router';
import { currency, date } from './methods/filters';
import store from './store'; // 引入 Vuex store

const app = createApp(App);
// 註冊全域 千分號、日期
app.config.globalProperties.$filters = {
	currency, date,
};
app.config.globalProperties.$moment = moment;
// vee-validate-rule
Object.keys(AllRules).forEach((rule) => {
	defineRule(rule, AllRules[rule]);
});

defineRule('confirmed', (value, [target]) => {
	if (value === target) {
		return true;
	}
	return '您輸入的兩個密碼並不相符，請再試一次。';
});

configure({
	generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
	validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale('zh_TW');

app.use(VueAxios, axios);
app.use(router);
app.use(store); // 使用 Vuex store
// 自訂 loading 樣式導入

app.component('loading', Loading);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');
