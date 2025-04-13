import {
  defineStore
} from "pinia";

// Khởi tạo pinia store
export const useCartStore = defineStore(
  "cart",
  () => {
    // Trạng thái giỏ hàng
    const cartQuantity = ref(0); // Số lượng sản phẩm trong giỏ hàng
    // Hàm cập nhật số lượng giỏ hàng
    const setCartQuantity = (quantity) => {
      if (Number.isInteger(quantity) && quantity >= 0) {
        cartQuantity.value = quantity; // Cập nhật số lượng giỏ hàng
      }
    };
    // Đếm số lượng trong giỏ hàng
    const cartItemsCount = computed(() => cartQuantity.value);

    // Đặt lại trạng thái giỏ hàng
    const reset = () => {
      cartQuantity.value = 0; // Đặt lại số lượng giỏ hàng về 0
      cartItemsCount.value = 0;
    }
    return {
      cartQuantity,
      cartItemsCount,
      setCartQuantity,
      reset,
    }
  }, {
    persist: {
      key: "cart", // Tên khóa lưu trữ
      storage: typeof window !== "undefined" ? localStorage : undefined, // Chỉ sử dụng localStorage trên client
    }
  }
);