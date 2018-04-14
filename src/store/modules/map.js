
const state = {
  enclosureInfo: {}
}

const getters = {
    enclosureInfo: state => state.enclosureInfo,
}

const mutations = {
  setMap(state, info) {
    state.enclosureInfo=info
  }
}

const action = {

}

export default {
  state,
  getters,
  mutations,
  action
}
