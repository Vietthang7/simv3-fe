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

const callApiSearch = async () => {
  // Gọi API để lấy dữ liệu
  if (resultSearch.value.length === 0) {
    const { data: resData } = await restAPI.stores.getSearch();
    resultSearch.value = resData.value.data || [];
  }
};
// Hàm xử lí tìm kiếm
const handleSearch = () => {
  const searchQueryTrimmed = searchQuery.value.trim().toLowerCase();
  if (searchQueryTrimmed === "") {
    return [];
  }
  const filteredResults = resultSearch.value.filter((item) => {
    const scopeNormalized = item.scope
      .toLowerCase()
      .replace(/\s+/g, "") // Loại bỏ khoảng trắng
      .split(",") // Tách các phần tử cách nhau bằng dấu phẩy
      .join(""); // Nối lại thành một chuỗi liên tục
    return (
      item.name.toLowerCase().includes(searchQueryTrimmed) ||
      scopeNormalized.includes(searchQueryTrimmed)
    );
  });
  return filteredResults;
}
// Hàm xử lí sự kiện tìm kiếm
const onInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filteredResults = handleSearch();
    searchResults.value = filteredResults;
  });
}
const onInputMb = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const filteredResults = handleSearch();
    searchResults.value = filteredResults;
  });
};
// Ẩn kết quả tìm kiếm khi nhấn vào bên ngoài
const searchResultsContainer = ref(null);
const handleClickOutside = (event) => {
  if (
    searchResultsContainer.value &&
    !searchResultsContainer.value.contains(event.target)
  ) {
    searchResults.value = [];
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
const route = useRoute();
const showDrawer = ref(false); // Điều khiển hiển thị menu mobile (drawer trái).
const showCart = ref(false); // Điều khiển hiển thị giỏ hàng
const showBaseSearch = ref(false); // Điều khiển hiển thị popup tìm kiếm.
const showCartCount = ref(true); // Điều khiển hiển thị số lượng sản phẩm trong giỏ.

const routeSlug = route.path.split("/").pop();

// Hàm kiểm tra gía trị rỗng
const isObjectNullOrEmpty = (value) =>
  value === null || value === undefined || value === "";

// Xử lí danh mục
const rawCategories = [...props.categories]; // Tránh thay đổi trực tiếp props.categories (vì props trong Vue là bất biến
const categoriesMap = rawCategories.reduce((acc, item) => {
  acc[item.id] = { ...item, options: [] };
  return acc;
}, {});

// Gắn danh muc con vào danh mục cha
Object.values(categoriesMap).forEach((category) => {
  if (
    !isObjectNullOrEmpty(category.parent_id) &&
    categoriesMap[category.parent_id]
  ) {
    categoriesMap[category.parent_id].options.push(category);
  }
});

// Lọc danh mục cấp 1
let visibleCategories = Object.values(categoriesMap).filter(
  (category) =>
    isObjectNullOrEmpty(category.parent_id) && category.visible_nav === 1
);
// Lọc và xây dựng các danh mục con
visibleCategories.forEach((category) => {
  category.options = category.options.filter(
    (child) => child.visible_nav === 1
  );
  category.options.forEach((child) => {
    child.options = Object.values(categoriesMap).filter(
      (subCategory) => subCategory.parent_id === child.id && subCategory.visible_nav === 1
    );
    child.options.sort((c1, c2) => c1.position - c2.position); // Sắp xếp danh mục con cấp 3
  });
  category.options.sort((c1, c2) => c1.position - c2.position); // Sắp xếp danh mục con cấp 2
});
// Hàm đóng tìm kiếm
const onCloseSearch = () => {
  showBaseSearch.value = false;
  searchQuery.value = null;
  searchResults.value = [];
};
// Theo dõi Popup tìm kiếm
watch(
  () => showBaseSearch.value,
  (newValue) => {
    if (newValue === false) {
      searchQuery.value = null;
      searchResults.value = [];
    }
  }
);
// Kiểm tra đường dẫn route
const validateRoutePath = () => {
  const categoryPathArr = route.path.split("/").filter(Boolean);
  const allowedPaths = [
    "tin-tuc",
    "search",
    "sanpham",
    "dat-hang",
    "chinh-sach-thanh-toan",
    "chinh-sach-doi-tra",
    "huong-dan-mua-hang",
    "kiem-tra-thiet-bi",
  ];
  if (allowedPaths.includes(categoryPathArr[0])) {
    return;
  }
  let currentCategories = visibleCategories; // Mảng danh mục cấp 1
  for (let i = 0; i < categoryPathArr.length; i++) {
    const category = currentCategories.find(
      (cat) => cat.slug === categoryPathArr[i],
    );
    if (!category) {
      navigateTo("/");
      return;
    }
    currentCategories = category.options;
  }
};
validateRoutePath();


// Quản lí giỏ hàng
import { useCartStore } from "@/stores/cart";
const cartStore = useCartStore();
const cartItemsCount = computed(() => cartStore.cartQuantity);

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
// Trạng thái loading
const loading = ref(false);
let lastClickTime = 0;



// Cập nhật giỏ hàng khi người dùng thay đổi số lượng sản phẩm trong giỏ hàng
const updateCart = async (item) => {
  if (loading.value) {
    return false;
  }
  loading.value = true;
  try {
    const cart_id = localStorage.getItem("cart_id");
    if (!cart_id) {
      loading.value = false;
      return false;
    }
    const items = cart.value.map((e) => {
      if (e.line_item_id === item.line_item_id) {
        return {
          line_item_id: e.line_item_id,
          quantity: item.quantity,
          checkout: true
        };
      } else {
        return e
      }
    });
    const { data: resUpdate } = await restAPI.stores.updateCustomer(cart_id, {
      body: { items }
    });
    if (resUpdate.value?.error === false) {
      updatePiniaCartQuantity();
      loadCart();
      loading.value = false;
      return true;
    }
    loading.value = false;
    return false;
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
  }
}
// Cập nhật số lượng giỏ hàng trong Pinia
const updatePiniaCartQuantity = () => {
  const totalQuantity = cart.value.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  cartStore.setCartQuantity(totalQuantity);
};

// Xóa sản phẩm
const clearItemCart = async (line_item_id) => {
  if (loading.value) {
    return false;
  }
  loading.value = true;
  const cart_id = localStorage.getItem("cart_id");
  const itemToRemove = cart.value.find(
    (item) => item.line_item_id === line_item_id
  );
  if (!itemToRemove) {
    console.error("Không tìm thấy mục cần xóa");
    loading.value = false;
    return false;
  }
  const items = cart.value
    .filter((item) => item.line_item_id !== line_item_id)
    .map((item) => ({
      line_item_id: item.line_item_id,
      quantity: item.quantity,
      checkout: true,
    }));
  const { data: resUpdate } = await restAPI.stores.updateCustomer(cart_id, {
    body: { items },
  });
  if (resUpdate.value?.error === false) {
    cartStore.setCartQuantity(cartStore.cartQuantity - itemToRemove.quantity);
    loadCart();
    loading.value = false;
  } else {
    console.error("Xóa mục thất bại qua API", resUpdate);
    loading.value = false;
  }
}
// Tăng số lượng giỏ hàng
const increaseQuantity = async (item) => {
  const currentTime = Date.now();
  if (loading.value || currentTime - lastClickTime < 2000) {
    alert("...");
    return;
  }
  lastClickTime = currentTime;
  item.quantity += 1;
  const success = await updateCart(item);
  if (success) loadCart();
}
// Giảm số lượng giỏ hàng
const decreaseQuantity = async (item) => {
  const currentTime = Date.now();
  if (item.quantity === 1) {
    alert("Số lượng không thể nhỏ hơn 1");
    return;
  }
  if (loading.value || currentTime - lastClickTime < 1000 || item.quantity <= 1) {
    alert("...");
    return;
  }
  lastClickTime = currentTime;
  item.quantity -= 1;
  const success = await updateCart(item);
  if (success) loadCart();
}


// Cập nhật Số lượng với Debounce
let debounceTimeout;
const updateQuantityWithDelay = async (item, value) => {
  item.quantity = parseInt(value) || 1;
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(async () => {
    const success = await updateCart(item);
    if (success) loadCart();
  }, 1000);
}
// Theo dõi Số lượng Giỏ hàng
watch(
  () => cartItemsCount.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue > 0) {
      window.scrollBy(0, -1);
      showCart.value = true;
      loadCart();
    }
  }
);
// Hàm điều khiển UI
const toggleMenu = () => {
  callApiSearch();
  showDrawer.value = !showDrawer.value;
  showCart.value = false;
}
const toggleCart = () => {
  showCart.value = !showCart.value;
  showDrawer.value = false;
  loadCart();
}
const toggleSearch = () => {
  callApiSearch();
  if (route.path === "/") {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition >= 500) {
      showBaseSearch.value = !showBaseSearch.value;
    } else {
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  } else {
    showBaseSearch.value = true;
  }
}

// State cho Menu Mobile
const selectedOption = ref(-1); // Lưu chỉ số của danh mục cấp 1 đang được chọn (nếu có).
const selectedOptionChild = ref(-1); // Lưu chỉ số của danh mục cấp 2 đang được chọn (nếu có).
const isExpanded = ref(Array(visibleCategories.length).fill(false)); // Lưu trạng thái mở rộng của các danh mục cấp 1 (mở hay đóng).
// Điền tất cả phần tử bằng false, biểu thị rằng mọi danh mục cấp 1 đều đóng ban đầu.
// Ví dụ: Nếu visibleCategories.length = 3, thì isExpanded.value = [false, false, false].

const isChildExpanded = ref(
  visibleCategories.map((category) => category.options.map(() => false)) // Lưu trạng thái mở rộng của các danh mục cấp 2 trong từng danh mục cấp 1.
);
// Hàm Mở/Rút gọn Menu
const toggleCollapse = (index) => {
  // index là id của danh mục cấp 1
  isExpanded.value[index] = !isExpanded.value[index];
  if (selectedOption.value === index) {
    selectedOption.value = -1;
  } else {
    selectedOption.value = index;
  }
}
const toggleChildCollapse = (index) => {
  isChildExpanded.value[index] = !isChildExpanded.value[index];
  if (selectedOptionChild.value === index) {
    selectedOptionChild.value = -1;
  } else {
    selectedOptionChild.value = index;
  }
};
//Menu tĩnh
const menuItems = ref([
  { name: "Tin tức", slug: "tin-tuc" },
]);

// Định dạng giá
const formatPrice = (price) => {
  return price ? new Intl.NumberFormat("vi-VN").format(price) + "đ" : "";
}

//Đóng menu mobile khi route thay đổi.
watch(route, () => {
  showDrawer.value = false;
})

// Focus ô tìm kiếm khi mở popup.
watch(showBaseSearch, async (newVal) => {
  if (newVal) {
    await nextTick(); // đợi khi render DOM (giao diện thành công)
    searchInput.value?.focus();
  }
});
// Chuyển hướng đến danh mục cấp 3 và đóng menu.
function handleClick(menuSlug, optionSlug, childSlug) {
  toggleMenu();
  navigateTo(`/${menuSlug}/${optionSlug}/${childSlug}`);
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
            <div v-if="!showDrawer && !showCart" class="w-6 h-6 relative flex ml-6 cursor-pointer"
              @click="toggleCart()">
              <Cart />
              <ClientOnly>
                <div v-if="showCartCount"
                  class="w-4 h-4 bg-primary flex items-center justify-center text-white rounded-full text-[10px] absolute lg:-top-1.5 lg:-right-1.5 top-1.5 left-[14px]">
                  {{ cartItemsCount }}
                </div>
              </ClientOnly>
            </div>
            <div v-if="showDrawer || showCart" class="flex items-center justify-center ml-auto">
              <div @click="
                () => {
                  showDrawer = false;
                  showCart = false;
                }
              " class="mr-2">
                <Close />
              </div>
            </div>
          </div>
          <div class="hidden lg:flex items-center justify-center text-sm">
            <div class="py-4 flex text-sm">
              <NuxtLink to="/" class="text-secondary mr-2">
                <span :class="{ 'text-primary': route.path === '/' }" class="hover:text-[#39B54A]">
                  Trang chủ
                </span>
              </NuxtLink>
              <div v-for="(menuItem, index) in visibleCategories" :key="index" class="relative group flex items-center">
                <div class="xl:mx-2 lg:mx-2">
                  <NuxtLink :to="`/${menuItem.slug}`" class="relative block">
                    <div class="flex items-center justify-center text-sm hover:text-[#39B54A]">
                      <div :class="{
                        'text-primary': route.path === `/${menuItem.slug}`,
                      }" class="text-secondary">
                        {{ menuItem.name }}
                      </div>
                      <div v-if="menuItem?.options && menuItem?.options?.length > 0" class="">
                        <DropDownMenu />
                      </div>
                    </div>
                    <div class="absolute top-full left-0 right-0 bg-transparent h-12">
                    </div>
                  </NuxtLink>
                </div>
                <div v-if="menuItem?.options" class="hidden group-hover:block absolute top-16 z-20 bg-white rounded-xl"
                  id="dropdownMenu">
                  <div class="" v-for="option in menuItem.options" :key="option">
                    <div
                      class="w-full dropdown p-1 text-base text-secondary whitespace-nowrap flex items-center justify-between">
                      <div class="flex items-center justify-between cursor-pointer hover:bg-[#DBEFDE] rounded-xl"
                        @click="navigateTo(`/${menuItem.slug}/${option.slug}`)">
                        <div class="text-secondary p-2 pr-8 w-full hover:text-[#39B54A]">
                          {{ option.name }}
                        </div>
                        <div class="hover:bg-[#DBEFDE]" v-if="option?.options && option?.options?.length > 0">
                          <DropRightMenu />
                        </div>
                      </div>
                      <div class="hidden 2xl:block">
                        <div v-if="option?.options" class="dropdown-content top-0 left-full ml-[1px] rounded-xl"
                          id="dropdownMenuChild">
                          <div class="p-1 w-full" v-for="child in option?.options" :key="child">
                            <div @click="
                              navigateTo(
                                `/${menuItem?.slug}/${option?.slug}/${child?.slug}`
                              )
                              "
                              class="p-2 text-base text-secondary hover:bg-[#DBEFDE] hover:text-[#39B54A] whitespace-nowrap rounded-xl pr-8 cursor-pointer">
                              {{ child.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-for="(item, index) in menuItems" :key="index" class="flex items-center justify-center">
              <div @click="navigateTo(`/${item.slug}`)" class="mx-2 text-secondary hover:text-[#39B54A] cursor-pointer"
                :class="{
                  'text-primary': routeSlug === `${item.slug}`,
                }">
                {{ item.name }}
              </div>
            </div>
            <div class="mx-2 text-secondary hover:text-[#39B54A] cursor-pointer">
              <a href="https://wifi247.vn" class="" target="_blank">
                Dịch vụ khác</a>
            </div>

            <div class="flex">
              <div class="flex">
                <div @click="toggleSearch" class="">
                  <SearchHeader class="cursor-pointer mb-1 ml-5" />
                </div>
                <div class="w-6 h-6 relative flex ml-6 cursor-pointer" @click="toggleCart">
                  <Cart />
                  <ClientOnly fallback-tag="span" fallback="">
                    <div v-if="showCartCount"
                      class="w-4 h-4 bg-primary flex items-center justify-center text-white rounded-full text-[10px] absolute lg:-top-1.5 lg:-right-1.5 top-1.5 left-[14px]">
                      {{ cartItemsCount }}
                    </div>
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Drawer v-model:show="showDrawer" placement="left" :classList="'w-75% px-18px'">
      <div class="px-4 mb-[350px]">
        <div class="w-full flex items-center py-2 mb-2 mt-2">
          <input type="text" placeholder="Tìm kiếm sản phẩm"
            class="py-[18px] pl-4 pr-1 w-full h-[36px] text-secondary text-base border border-[#39b54a] focus:outline-none rounded-xl"
            v-model="searchQuery" @input="onInputMb" />
          <button aria-label="search"
            class="min-w-[36px] min-h-[36px] ml-2 right-0 bg-primary rounded-full flex items-center justify-center"
            @click="resultSearch">
            <Search />
          </button>
        </div>
        <div v-if="searchResults?.length > 0" ref="searchResultsContainer"
          class="bg-white absolute z-[200] md:w-[90%] sm:w-[85%] w-[82%] rounded-2xl p-[15px] space-y-2 text-secondary border border-gray-200">
          <div class="space-y-2">
            <div v-for="(result, index) in searchResults" :key="index" class="cursor-pointer">
              <div @click="navigateTo(`/search/${result?.slug}`)" class="">
                {{ result.name }}
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/" class="text-secondary mr-2">
          <span :class="{ 'text-primary': route.path === '/' }" class="">Trang chủ</span>
        </NuxtLink>
        

      </div>
    </Drawer>
  </div>
</template>
<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>