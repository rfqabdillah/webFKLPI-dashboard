import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'
import 'bootstrap/dist/js/bootstrap.bundle'
import '@/assets/scss/app.scss'
import VueFeather from 'vue-feather';
import { createI18n } from 'vue-i18n'
import id from './locales/id.json';
import en from './locales/en.json';
import { defaultLocale, localeOptions } from './constants/config';
import Breadcrumbs from './components/bread_crumbs';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import Toast, {POSITION, useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import Lightbox from 'vue-easy-lightbox'

const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = createI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages: {
    id: id,
    en: en,
  }
});
createApp(App).use(router).use(store).use(i18n).use(VueSweetalert2).use(Vue3Toasity).use(Toast).use(Lightbox).component(VueFeather.name, VueFeather).component('Breadcrumbs', Breadcrumbs).mount('#app')
