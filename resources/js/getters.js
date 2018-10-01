export default {
    getItem: (state) => {
        return state.item
    },
    getCreatePopup: (state) => {
        return state.createPopup
    },
    getPopupTitle: (state) => {
        return state.popupTitle
    },
    getOpenChannelListItem: (state) => {
        return state.openChannelListItem
    },
    getSetOpenChannel: (state) => {
        return state.setOpenChannel
    },
    getChannelMsg: (state) => {
        return state.channelMsg
    }
};
