/**
 * video.js 설정
 */
window.HELP_IMPROVE_VIDEOJS = false;
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
import 'video.js/dist/video-js.css';
import 'video.js';
import Vue from 'vue';
import utile from './utile/utile.js';
import SendBird from 'sendbird';
import store from './store';
/**
 * Component
 * */
import sbcomponent from './components/SendBird';
import creatpopup from './components/CreatPopup';
import SimpleSendbird from './components/SimpleSendbird';
import TestVideo from  './components/TestVideo';
import spinner from './components/spinner';
/**
 * custom utile
 * */
Vue.prototype.$utile = utile;
Vue.prototype.$sendbird = SendBird;
Vue.prototype.$store = store;
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
//Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('send-bird', sbcomponent);
Vue.component('creat-popup', creatpopup);
Vue.component('simple-sendbird', SimpleSendbird)
Vue.component('test-video', TestVideo);
Vue.component('spinner', spinner)
const app =new Vue({
    el: '#app',
});
