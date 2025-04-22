<template>
  <div class="bg-[#F2F2F2] lg:mt-[100px] mt-20">
    <div
      class="text secondary width-base xl:pb-[54px] xl:pt-[69px] flex justify-between flex-col gap-x-[30px] lg:flex-row py-[60px]">
      <div class="relative lg:w-[510px]">
        <div class="w-[125px] h-10">
          <NuxtLink to="/">
            <NuxtImg src="/img/logo.png" alt="logo" class="w-full h-full object-cover" />
          </NuxtLink>
        </div>
        <div class="text-base mt-6">
          <div class="py-1.5 flex items-center">
            <Address />
            <span class="ml-3">
              Hà Nội: Tầng 7, số 247 Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà
              Nội.
            </span>
          </div>
          <div class="py-1.5 flex items-center">
            <Address />
            <span class="ml-3">
              TP.HCM: 1 Bis Phạm Ngọc Thạch, Phường Bến Nghé, Quận 1, TP. Hồ Chí
              Minh.
            </span>
          </div>
          <div class="py-1.5 flex items-center">
            <Phone />
            <span class="ml-3">
              0903.21.01.01 (Hà Nội) - 0914.261.999 (TP.HCM)
            </span>
          </div>
          <div class="py-1.5 flex items-center">
            <MessageCskh />
            <span class="ml-3"> cskh@wifi247.vn </span>
          </div>
        </div>
      </div>
      <div v-if="PC" class="flex-col w-[180px]">
        <div class="text-lg text-title py-1.5 font-medium">
          Sản phẩm
        </div>
        <div class="py-1.5" v-for="link in filteredProducts" :key="link.id">
          <span v-if="link?.visible_footer === 1" @click="navigateTo(constructCategoryPath(link))"
            class="cursor-pointer">
            {{ link.name }}
          </span>

        </div>
      </div>
    </div>
  </div>
  <div class="w-full h-[68px] bg-primary flex items-center justify-center text-white text-base">
    Uchiha Obito
  </div>
</template>

<script setup>

const width = ref(0);
const updateWidth = () => {
  if (process.client) {
    width.value = window.innerWidth;
  }
}
onMounted(() => {
  if (process.client) {
    width.value = window.innerWidth;
    window.addEventListener("resize", updateWidth);
  }
})
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("resize", updateWidth);
  }
})

const PC = computed(() => width.value >= 1024);
const props = defineProps({
  categories: {
    type: Array,
    default: [],
  }
});
const products = props.categories;
const filteredProducts = computed(() =>
  products.filter((item) => item.visible_footer === 1)
);

// Danh sách trang về chúng tôi
const aboutUs = ref([
  { id: 1, slug: "chinh-sach-thanh-toan", text: "Chính sách thanh toán" },
  { id: 2, slug: "chinh-sach-doi-tra", text: "Chính sách đổi trả" },
  { id: 3, slug: "huong-dan-mua-hang", text: "Hướng dẫn mua hàng" },
  { id: 5, slug: "tin-tuc", text: "Tin tức" },
]);

const rawCaterories = products;
const categoriesMap = rawCaterories.reduce((acc, item) => {
  acc[item.id] = { ...item, option: [] };
  return acc;
}, {});


//Xây dựng cấu trúc cây danh mục
Object.values(categoriesMap).forEach((category) => {
  if (
    !isObjectNullOrEmpty(category.parent_id) && categoriesMap[category.parent_id]
  ) {
    categoriesMap[category.parent_id].option.push(category);
  }
});

let visibleCategories = Object.values(categoriesMap).filter(
  (category) => isObjectNullOrEmpty(category.parent_id) && category.visible_footer === 1
);

visibleCategories.forEach((category) => {
  category.options = category.option.filter((child) => child.visible_nav === 1);
  category.options.forEach((child) => {
    child.options = Object.values(categoriesMap).filter(
      (subCategory) => subCategory.parent_id === child.id && subCategory.visible_nav === 1
    );
    child.options.sort((c1, c2) => c1.position - c2.position)
  });
  category.options.sort((c1, c2) => c1.position - c2.position)
});
visibleCategories.sort((c1, c2) => c1.position - c2.position);

// Kiểm tra tính hợp lệ của đường dẫn
const validateRoutePath = () => {
  const categoryPathArr = route.path.split("/").filter(Boolean);
  const allowedPaths = [
    "tin-tuc",
    "search",
    "sanpham",
    "dat-hang",
    
  ]
}







const constructCategoryPath = (category) => {
  let path = `/${category.slug}`;
  const findParent = (categoryId, categories) => {
    for (const cat of categories) {
      if (cat.options?.some((option) => option.id === c))
    }
  }
}
</script>