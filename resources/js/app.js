
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');
import utile from './utile/utile.js'
window.Vue = require('vue');

/**
 * custom utile
 * */
Vue.prototype.$utile = utile;

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
//Vue.component('example-component', require('./components/ExampleComponent.vue'));
Vue.component('send-bird', require('./components/SendBird.vue'));

const app =new Vue({
    el: '#app'
});
