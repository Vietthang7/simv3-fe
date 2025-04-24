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
const categoyName = computed(() => {
  const categories = Array.isArray(props.categories) ? props.categories : [];
  const categoriesDetail = Array.isArray(props.categoriesDetail) ? props.categoriesDetail : [];
  const category = categories.find((cat) => cat.slug === slug) || null;
  const categorySearch = categoriesDetail.find((cat) => cat?.nation_slug === slug) || null;
  return category ? category.name : categorySearch ? categorySearch.name : null;
});
const searchQuery = ref(null);
const searchResults = ref([]);
const showBaseSearch = ref(false);
const searchInput = ref(null);
const resultSearch = ref([]);

const callApiSearch = async () => {
  // Gọi API để lấy dữ liệu
  if (resultSearch.value.length === 0) {
    const { data: resData } = await restAPI.stores.getSearch();
    resultSearch.value  = resData.value.data || [];
  }
};
await callApiSearch();
//Lọc kết quả
const handleSearch = () => {
  const searchQueryTrimmed = searchQuery.value.trim().toLowerCase();
  if(searchQueryTrimmed === "") {
    return [];
  };
  const 
}

</script>