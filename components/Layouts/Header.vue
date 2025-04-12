<script setup>
const { restAPI } = useApi();
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
});
const searchQuery = ref(null);
const searchResults = ref([]);
const resultSearch = ref([]);
let searchTimeout = null;
const searchInput = ref(null);

const route = useRoute();
const showDrawer = ref(false);
const showCart = ref(false);
const showCartCount = ref(true);


const callApiSearch = async () => {
  // Gọi API để lấy dữ liệu
  if (resultSearch.value.length === 0) {
    const { data: resData } = await restAPI.stores.getSearch();
    resultSearch.value = resData.data;
  }
}
const handleSearch = () => {
  const searchQueryTrimmed = searchQuery.value.trim().toLowerCase();
  if (searchQueryTrimmed === "") {
    return [];
  }

}
const toggleMenu = () => {
  callApiSearch();
  showDrawer.value = !showDrawer.value;
  showCart.value = false;
}

// Lấy dữ liệu giỏ hàng
const dataCart = ref(null);
const cart = ref([]);
// Hàm load giỏ hàng
const loadCart = async () => {
  const cart_id = localStorage.getItem("cart_id");
  if (cart_id) {
    const { data: resDataCart } = await restAPI.stores.getCustomer(cart_id);
    if (!resDataCart.value.error) {
      dataCart.value = resDataCart.value?.data;
      cart.value = resDataCart.value?.data?.items || [];
    } else {
      // console.error("Không có dữ liệu giỏ hàng từ API");
    }
  } else {
    dataCart.value = null;
    cart.value = [];
  }
}
const toggleCart = () => {
  showCart.value = !showCart.value;
  showDrawer.value = false;
  loadCart();
}
</script>

<template>
  <div class="">
    <div class="relative">
      <div class="sticky top-0 z-[45] w-full">
        <div class="w-full lg:w-auto py-2 gap-4 bg-primary text-center z-60">
          <h1 class="text-white text-base font-light" v-if="['/'].includes(route.path)">
            Sim247 - Sim du lịch quốc tế
          </h1>
          <p class="text-white text-base font-light" v-else>
            Sim247 - Sim du lịch quốc tế
          </p>
        </div>
        <div class="flex w-full items-center justify-between bg-white py-5 width-base lg:py-4 space-x-0">
          <div @click="toggleMenu" v-if="!showDrawer && !showCart" class="lg:hidden w-6 h-6 mr-[5.5px]">
            <MenuMobile />
          </div>
          <div class="w-[125px] h-10 gap-2">
            <NuxtLink to="/">
              <NuxtImg src="/img/logo.png" alt="logo" class="w-full h-full object-cover" />
            </NuxtLink>
          </div>
          <div class="block lg:hidden">
            <div v-if="!showDrawer && !showCart" class="w-6 h-6 relative flex ml-6 cursor-pointer" @click="toggleCart()">
              <Cart />
              <ClientOnly>
                <div v-if ="showCartCount"
                class="w-4 h-4 bg-primary flex items-center rounded-full text-[10px] absolute lg:-top-1.5 lg-right-1.5 top-1.5 left-[14px]">
                  {{ }}
                </div>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>