<script setup>
import {useCartStore} from "~/stores/cart";

const {restAPI} = useApi();
const route = useRoute();
const props = defineProps({
  productDetail: {
    type: Object,
    default: {},
  },
});
const gtm = useGtm();
const { data: resData } = await restAPI.stores.getProductsEndow();
const endowProducts = resData.value.data[0];

const productDetail = props.productDetail;
const selectedDay = ref(null);
const selectedData = ref({
  data: null,
  type: null,
});

//Tìm variant phù hợp trong productDetail.variants
const filterData = computed(() => {
  if(selectedDay.value && selectedData.value?.data) {
    return productDetail.variants?.find(
      (v) => 
        v?.day === selectedDay.value &&
        v?.sim_package === selectedData.value?.type &&
        (v?.data
          ? v?.data === selectedData.value.data
          : "Unlimited" === selectedData.value.data)
    );
  } else {
    return null;
  }
});
const quantity = ref(1); // Khởi tạo giá trị ban đầu

// Hàm thay đổi giá trị
const changeValue = (amount) => {
  const newValue = quantity.value + amount;
  // Đảm bảo giá trị không nhỏ hơn 1
  if (newValue >= 1) {
    quantity.value = newValue;
  }
};
const handleInput = () => {
  const parsedValue = parseInt(quantity.value, 10);
  if (isNaN(parsedValue)) {
    quantity.value = 1;
  } else {
    if (parsedValue < 1) {
      quantity.value = 1;
    } else {
      quantity.value = parsedValue;
    }
  }
};
const containerRef = ref(null);
const imagesProduct = [...productDetail?.thumb_image, ...productDetail?.images];
const selectedImage = ref(
  productDetail?.thumb_image?.[0]?.src || "/img/empty.jpg"
);

const changeImage = (imageSrc) => {
  selectedImage.value = imageSrc;
};
// Tính toán giá
const getPriceRange = (variants) => {
  const prices = variants.map((variant) => {
    return variant.price_sale !== null ? variant.price_sale : variant.price;
  });
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (minPrice === maxPrice) {
    return {minPrice}
  }
  return { minPrice, maxPrice };
}
const priceRange = getPriceRange(productDetail.variants);
const { minPrice, maxPrice } = priceRange;


const dataFixed = productDetail?.options?.datafixed || [];
const dataFlexible = productDetail?.options?.dataflexible || [];
const dayFixed = productDetail?.options?.dayfixed || [];
const dayFlexible = productDetail?.options?.dayflexible || [];

const sortData = (data) => {
  const sorted = data
    .filter((item) => item !== null)
    // .map(String)
    .sort((a, b) => a - b);
  return sorted;
}
const sortedDataFlexible = sortData(dataFlexible);
const sortedDataFixed = ref([]);
if (dataFixed.includes(null)) {
  if (!dataFixed.includes("Unlimited")) {
    dataFixed.unshift("Unlimited");
  }
}
sortedDataFixed.value = sortData(dataFixed);

const dayOption = [...dayFixed, ...dayFlexible]
  .filter((value, index, self) => self.indexOf(value) === index)
  .sort((a, b) => a - b);

const selectData = (data, type) => {
  // Nếu click vào cái đang chọn → bỏ chọn
  if (selectedData.value.data === data && selectedData.value.type === type) {
    selectedData.value.data = null;
    selectedData.value.type = null;
  } 
  // Ngược lại → chọn cái mới
  else {
    selectedData.value.data = data;
    selectedData.value.type = type;
  }
};

const isValidData = (data, type) => {
  if (selectedDay.value) {
    const variantHasDay = productDetail.variants?.filter(
      (v) =>
        v?.day === selectedDay.value &&
        v?.sim_package === type &&
        (data === "Unlimited" ? !v?.data : v?.data === data)
    );
    return variantHasDay?.length > 0;
  }
  return true;
};
const isValidDay = (day) => {
  if (selectedData.value.data) {
    const variantHasData = productDetail.variants?.filter(
      (v) =>
        (v?.data
          ? v?.data === selectedData.value.data
          : "Unlimited" === selectedData.value.data) &&
        v?.sim_package === selectedData.value.type &&
        v?.day === day
    );
    return variantHasData?.length > 0;
  }
  return true;
};
</script>