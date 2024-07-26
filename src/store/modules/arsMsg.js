const state = {
  outputMessage:'',
  outputMessage1:'',
}

const mutations={
  updateOutputMessage(state, newmsg) {
    state.outputMessage = newmsg;
  },
  updateOutputMessage1(state, newmsg) {
    state.outputMessage1 = newmsg;
  },
}

export default {
  namespaced: true,
  state,
  mutations
};