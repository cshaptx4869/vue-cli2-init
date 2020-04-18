import {
  demo,
  loginIn
} from "./mutations-types";

export default {
  [demo](state) {
    console.log(state);
  },
  [loginIn](state, payload) {
    state.accessToken = payload.accessToken;
    state.refreshToken = payload.refreshToken;
  }
}
