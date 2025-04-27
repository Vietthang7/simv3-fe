<script setup>
const { restAPI } = useApi();
const route = useRoute();
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img("/img/banner.png", { format: "webp" });
  return { backgroundImage: `url('${imgUrl}')` };
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
const categoryName = computed(() => {
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
    const { data: resData } = await restAPI.stores.getSearch();
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
    <div v-if="['/'].includes(route.path)" :style="backgroundStyles"
      class="banner w-full bg-cover bg-center rounded-3xl md:flex pt-[60px] pb-[140px] md:pt-0 md:pb-0 items-center justify-center">
      <div class="w-full relative text-white text-base mb-8">
        <div class="text-center">
          <p>Sim247 - Sim du lịch quốc tế</p>
          <div class="mb-8">
            <h2 class="lg:text-5xl md:text-4xl text-[28px] font-semibold">
              SIM Du Lịch Quốc Tế<br />Kết Nối Internet Mọi Nơi, Mọi Lúc.
            </h2>
          </div>
          <NuxtLink to="/kiem-tra-thiet-bi" class="underline">Kiểm tra thiết bị có hỗ trợ<br class="block sm:hidden" />
            eSIM không tại đây.
          </NuxtLink>
        </div>
        <!--Search PC-->
        <div
          class="hidden md:flex bg-white w-[705px] h-[86px] rounded-2xl mt-[107px] absolute left-1/2 transform -translate-x-1/2 item-center justify-between p-[15px]">
          <div class="w-full mr-4 mb-3 md:mb-0">
            <span class="text-title ml-2 font-medium">
              Địa điểm
            </span>
            <input v-model="searchQuery" ref="searchInput" @input="onInput" @focus="toggleSearch" type="text"
              placeholder="Nhập quốc gia du lịch..."
              class="rounded-md text-sm w-full px-2 py-2 text-secondary focus:outline-none font-light" />
          </div>
          <ButtonBase
            class="md:min-w-14 md:max-w-14 w-full min-h-14 md:rounded-md rounded-xl flex justify-center items-center">
            <Search />
            <span class="block md:hidden ml-1 font-light text-sm">Tìm kiếm</span>
          </ButtonBase>
        </div>
        <!--Search Mobile-->
        <div v-if="!showBaseSearch"
          class="md:hidden bg-white md:w-[705px] w-full md:h-[86px] md:rounded-2xl rounded-3xl md:mt-[107px] mt-[130px] absolute md:left-1/2 md:transform md:-translate-x-1/2 items-center justify-between p-[15px]">
          <div class="w-full mr-4 mb-3 md:mb-0">
            <span class="text-title ml-2">Địa điểm</span>
            <input type="text" class="rounded-md text-sm w-full px-2 py-2 text-secondary focus:outline-none font-light"
              placeholder="Nhập quốc gia du lịch..." @click="toggleSearch" v-model="searchQuery" />
            />
          </div>
          <ButtonBase
            class="md:min-w-14 md:max-w-14 w-full min-h-14 md:rounded-md rounded-xl flex justify-center items-center">
            <Search />
            <span class="block md:hidden ml-1 font-light text-sm">Tìm kiếm</span>
          </ButtonBase> >
        </div>

        <div v-if="searchQuery && searchResults.length > 0"
          class="hidden md:block bg-white md:mt-[200px] absolute z-[200] md:w-[705px] md:left-1/2 md:transform md:-translate-x-1/2 w-full md:rounded-2xl rounded-3xl p-[15px] space-y-2 text-secondary border border-gray-200">
          <div class="space-y-2">
            <div v-for="(result, index) in searchResults" :key="index" class="cursor-pointer">
              <div @click="navigateTo(`/search/${result?.slug}`)" class="">
                {{ result.name }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="searchQuery && searchResults.length === 0"
          class="hidden md:block bg-white md:mt-[200px] absolute z-[200] md:w-[705px] md:left-1/2 md:transform md:-translate-x-1/2 w-full md:rounded-2xl rounded-3xl p-[15px] space-x-2 text-secondary border border-gray-200">
          Không tìm thấy kết quả nào
        </div>

        <BaseSearchMobile v-model:show ="showBaseSearch">
          <div class="bg-white w-full rounded-3xl absolute items-center justify-center p-[15px]">
            <div class="w-full mr-4 mb-3 md:mb-0">
              <span class="text-title ml-2">
                Địa điểm
              </span>
              <input type="text" ref="searchInput"
              class="rounded-md text-sm w-full px-2 py-2 text-secondary focus:outline-none font-light"
              placeholder="Nhập quốc gia du lịch..." v-model="searchQuery" @input="onInput"/>
            </div>
            <ButtonBase class="w-full min-h-14 rounded-xl flex justify-center items-center">
              <Search />
              <span class="ml-1 font-light text-sm">Tìm kiếm</span>
            </ButtonBase>
          </div>

          <div v-if="searchQuery" class="bg-white w-full items-center justify-between p-[15px]">
            <div v-if="searchQuery && searchResults.length > 0">
              <div class="bg-white absolute z-[200] w-[90%] rounded-xl p-[15px] space-y-2 text-secondary border border-gray-200">
                  <div class="space-y-2">
                    <div class="space-y-2">
                      <div v-for="(result, index) in searchResults" :key="index" class="cursor-pointer">
                          <div @click="navigateTo(`/search/${result?.slug}`)" class="">
                            {{ result.name }}
                          </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div v-else-if="searchQuery && searchResults.length === 0"
                 class="bg-white absolute z-[200] rounded-xl p-[15px] w-[90%] space-y-2 text-secondary border border-gray-200">
              Không tìm thấy kết quả nào
            </div>
          </div>
        </BaseSearchMobile>
      </div>
    </div>

    <div v-else :style="backgroundStyles"
         class="lg:min-h-[500px] min-h-[360px] w-full bg-cover bg-center rounded-3xl flex items-center justify-center">
      <div class="w-full text-white text-base">
        <div class="text-center">
          <p>Sim247 - Sim du lịch quốc tế</p>
          <div class="mb-4 mt-2">
            <h1 class="lg:text-5xl md:text-4xl text-[28px] font-semibold">
              {{ categoryName }}
            </h1>
          </div>
          <NuxtLink to="/kiem-tra-thiet-bi" class="underline">Kiểm tra thiết bị có hỗ trợ<br class="block sm:hidden" />
            eSIM không tại đây.
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.banner {
  min-height: 600px;
  background-repeat: no-repeat;
}
</style>

<!--Theo cấu hình mặc định của Tailwind CSS, text-5xl = 3rem = 48px.-->
<!--Theo cấu hình mặc định của Tailwind CSS, text-4xl = 2.25rem = 36px-->
