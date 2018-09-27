import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const state = {
    item: 'testItem',
    createPopup: false,
    popupTitle: ''
};

export default new Vuex.Store({
    state,
    getters,
    mutations
});
