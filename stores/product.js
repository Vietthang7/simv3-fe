import {
  defineStore
} from "pinia";

export const useProductStore = defineStore(
  "product",
  () => {
    const productsSeen = ref([]);
    const addProductToSeen = (itemAdd) => {
      const checkIndex = productsSeen.value.findIndex(
        (item) => item.id === itemAdd.id
      );
      if (checkIndex === -1) {
        productsSeen.value.unshift(itemAdd);
      }
    };
    return {
      productsSeen,
      addProductToSeen
    };
  }, {
    persist: {
      storage: typeof window !== "undefined" ? window.sessionStorage : null,
    },
  }
);