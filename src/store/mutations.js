import {
  demo,
  loginIn,
  setAuthorizedBlock,
  setAuthorizedPage
} from "./mutations-types";

export default {
  [demo](state) {
    console.log(state);
  },
  [loginIn](state, payload) {
    state.accessToken = payload.accessToken;
    state.refreshToken = payload.refreshToken;
  },
  [setAuthorizedBlock](state, payload) {
    state.authorizedBlock = payload.authorizedBlock;
  },
  [setAuthorizedPage](state, payload) {
    state.authorizedPage = payload.authorizedPage;
  }
}
