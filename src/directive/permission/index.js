import Vue from 'vue';
import CommonMethod from "../../assets/js/common";

const permission = {
  // https://cn.vuejs.org/v2/guide/custom-directive.html
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
  inserted(el, binding, vnode) {
    const {value} = binding;
    const authorizedBlock = CommonMethod.getAuthorizedBlock();

    if (value && value instanceof Array && value.length > 0) {
      // 满足一个即可
      const hasPermission = value.some(block => {
        return authorizedBlock.includes(block);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need rules! Like v-permission="['userStore']"`)
    }
  }
};

Vue.directive('permission', permission);
