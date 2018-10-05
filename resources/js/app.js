/**
 * video.js 설정
 */
window.HELP_IMPROVE_VIDEOJS = false;
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web apstoreplications using Vue and Laravel.
 */
require('./bootstrap');

import 'video.js/dist/video-js.css';
import 'video.js';
import Vue from 'vue';
/**
 * Component
 * */
import SimpleSendbird from './components/SimpleSendbird';
import TestVideo from './components/TestVideo';
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
Vue.component('simple-sendbird', SimpleSendbird);
Vue.component('test-video', TestVideo);
const app = new Vue({
    el: '#app',
});
