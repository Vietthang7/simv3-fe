<script setup>
const {restAPI} = useApi();
const route = useRoute();
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img("/img/banner.png", {format: "webp"});
  return {backgroundImage: `url('${imgUrl}')`};
});
const props = defineProps({
  categories: {
    type: Array,
    default: [],
  },
  categoriesDetail: {
    type: Object,
    default: {},
  }
});
const slug = route.path.split("/").pop();
const categoyName = computed(() => {
  const categories = Array.isArray(props.categories) ? props.categories : [];
  const categoriesDetail = Array.isArray(props.categoriesDetail) ? props.categoriesDetail : [];
  const category = categories.find((cat) => cat.slug === slug) || null;
  const categorySearch = categoriesDetail.find((cat) => cat?.nation_slug === slug) || null;
  return category ? category.name : categorySearch ? categorySearch.name : null;
});
const searchQuery = ref(null); // Chuỗi tìm kiếm nhập từ người dùng
const searchResults = ref([]); // Kết quả tìm kiếm được lọc từ API
const showBaseSearch = ref(false); // Trạng thái hiển thị giao diện tìm kiếm cơ bản
const searchInput = ref(null); //Tham chiếu  đến input tìm kiếm
const resultSearch = ref([]); // Dữ liệu kết quả tìm kiếm từ API

const callApiSearch = async () => {
  // Gọi API để lấy dữ liệu
  if (resultSearch.value.length === 0) {
    const {data: resData} = await restAPI.stores.getSearch();
    resultSearch.value = resData.value.data || [];
  }
};
await callApiSearch();
//Lọc kết quả
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
};

const onInput = () => {
  const filteredResults = handleSearch();
  searchResults.value = filteredResults;
};
/*
watch: Theo dõi thay đổi của showBaseSearch. Nếu tắt tìm kiếm, reset lại searchQuery và searchResults.
*/
watch(
    () => showBaseSearch.value,
    (newValue) => {
      if (newValue == false) {
        searchQuery.value = null;
        searchResults.value = [];
      }
    }
);
/*
toggleSearch: Bật giao diện tìm kiếm nếu đang ở trang chủ (route.path === "/").
*/
const toggleSearch = () => {
  if (route.path === "/") {
    showBaseSearch.value = true;
  }
};

/*
1.11. Focus input khi tìm kiếm
*/
/*
watch là một API trong Vue 3 dùng để theo dõi sự thay đổi của một giá trị hoặc biểu thức phản ứng (reactive) như ref, computed, hoặc các biến trong props.
*/
watch(showBaseSearch, async (newVal) => {
  if (newVal) {
    await nextTick();
    searchInput.value?.focus();
  }
});

/*
 await nextTick();
nextTick: Là một API trong Vue 3, đảm bảo mọi thay đổi trong DOM (liên quan đến các biến phản ứng hoặc template) được cập nhật hoàn toàn trước khi thực thi các lệnh tiếp theo.
Ở đây, nó được sử dụng để đảm bảo rằng DOM chứa phần tử searchInput đã được render đầy đủ trước khi cố gắng focus vào nó.
*/

</script>

<template>
  <div class="mx-4">
    <div
        v-if="['/'].includes(route.path)"
        :style="backgroundStyles"
        class="w-full bg-cover bg-center rounded-3xl md:flex pt-[60px] pb-[140px] md:pt-0 md:pb-0 items-center justify-center"
    >
      <div
          class="w-full relative text-white text-base mb-8">
        <div class="text-center">
          <p>Sim247 - Sim du lịch quốc tế</p>
          <div class="mb-8">
            <h2 class="lg:text-5xl md:text-4xl text-[28px] font-semibold">
              SIM Du Lịch Quốc Tế<br/>Kết Nối Internet Mọi Nơi, Mọi Lúc.
            </h2>
          </div>
          <NuxtLink to="/kiem-tra-thiet-bi" class="underline"
          >Kiểm tra thiết bị có hỗ trợ<br class="block sm:hidden"/>
            eSIM không tại đây.
          </NuxtLink>
        </div>
      <!--Search PC-->

      </div>

    </div>

  </div>
</template>
<!--Theo cấu hình mặc định của Tailwind CSS, text-5xl = 3rem = 48px.-->
<!--Theo cấu hình mặc định của Tailwind CSS, text-4xl = 2.25rem = 36px-->
