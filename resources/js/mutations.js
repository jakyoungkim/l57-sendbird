export default {
    item(state, data) {
        state.item = data
    },
    createPopup(state, data) {
        state.createPopup = data
    },
    popupTitle(state, data) {
        state.popupTitle = data
    },
    openChannelListItem(state, data) {
        state.openChannelListItem = data
    },
    setOpenChannel(state, data) {
        state.setOpenChannel = data
    },
    channelMsg(state, data) {
        state.channelMsg = data
    },
    spinner(state, data) {
        state.spinner = data
    }
}
