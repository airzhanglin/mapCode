const state = {
  userInfo: {}
}

const getters = {
  userInfo: state => state.userInfo,
}

const mutations = {
  setuser(state, info) {
    state.userInfo=info
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
