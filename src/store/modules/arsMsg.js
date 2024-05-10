const state = {
  outputMessage:'',
}

const mutations={
  updateOutputMessage(state, newmsg) {
    state.outputMessage = newmsg;
  },
}

export default {
  namespaced: true,
  state,
  mutations
};