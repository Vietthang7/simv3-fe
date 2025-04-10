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
const toggleMenu = () => {}
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
      </div>
    </div>

  </div>
</template>