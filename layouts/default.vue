<template>
  <div class="flex flex-col min-h-screen">
    <Header :categories="categories" :class="{ 'hidden-header': isHeaderHidden }" class="fixed-header" />
    <div class="content bg-white min-h-[calc(100vh-677px)]">
      <slot />
    </div>
    <div id="zalo-vr" :class="zaloVrClass">
      <div @click="showModalZalo = true"
        class="flex flex-col items-center align-center min-w-[60px] cursor-pointer play">
        <div class="play_child">
          <MBotZalo class="pt-1.5" />
        </div>
      </div>
      <div @click="showModalTel = true"
        class="flex flex-col items-center align-center min-w-[60px] cursor-pointer mt-6 play">
        <div class="play_child">
          <MBotCall class="p-1" />
        </div>
      </div>
      <div v-show="showButton" @click="backToTop"
        class="lg:hidden flex-col items-center align-center min-w-[60px] cursor-pointer mt-10 ml-3 lg:ml-1">
        <BackToTop />
      </div>
    </div>
    <div v-show="showButton" @click="backToTop"
      class="hidden z-[100] lg:flex right-8 bottom-24 fixed flex-col items-center align-center min-w-[60px] cursor-pointer">
      <BackToTop />
    </div>
    <div v-if="showModalZalo" @click.self="handleModalZalo"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="w-full flex justify-end">
          <CloseBlack @click="handleModalZalo" class="cursor-pointer" />
        </div>
        <h3 class="text-lg font-semibold text-title text-center mb-4">
          Kết nối với chúng tôi qua Zalo
        </h3>
        <div class="flex flex-col space-y-4">
          <a href="https://zalo.me/0394143687" class="w-full" target="_blank">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hà Nội
              </div>
            </button>
          </a>
          <a href="https://zalo.me/0394143687" class="w-full" target="_blank">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hồ Chí Minh
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
    <div v-if="showModalTel" @click.self="handleModalTel"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
      <div class="bg-white rounded-lg p-6 w-96">
        <div class="w-full flex justify-end">
          <CloseBlack @click="handleModalTel" class="cursor-pointer" />
        </div>
        <h3 class="text-lg font-semibold text-title text-center mb-4">
          Liên hệ với chúng tôi qua phone
        </h3>
        <div class="flex flex-col space-y-4">
          <a href="tel:+84987654321" class="w-full">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hà Nội
              </div>
            </button>
          </a>
          <a href="tel:+84912345678" class="w-full">
            <button class="bg-primary text-white py-2 px-4 rounded w-full">
              <div class="flex flex-col items-center align-center min-w-[60px]">
                Hồ Chí Minh
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
    <Footer :categories="categories" />
  </div>
</template>

<script setup>
const { restAPI } = useApi();
// Ẩn/Hiện Header
const isHeaderHidden = ref(false);
let lastScrollY = 0;
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    isHeaderHidden.value = true;
  } else if (currentScrollY < lastScrollY) {
    isHeaderHidden.value = false;
  }
  lastScrollY = currentScrollY;
};


// Lấy danh mục
const { data: resData } = await restAPI.stores.getStoreProductCategories({
  params: {
    current: 1,
    pageSize: 9999,
  }
});
const categories = resData.value?.data;
// End lấy danh mục

// Sự kiện cuộn trang
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Quản lý Modal
const showModalZalo = ref(false);
const showModalTel = ref(false);
const handleModalZalo = () => {
  showModalZalo.value = !showModalZalo.value;
};
const handleModalTel = () => {
  showModalTel.value = !showModalTel.value;
};

// Nút quay lại đầu trang
const showButton = ref(false);
const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const checkScroll = () => {
  if (window.scrollY > window.innerHeight) {
    showButton.value = true;
  } else {
    showButton.value = false;
  }
};
onMounted(() => {
  window.addEventListener("scroll", checkScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", checkScroll);
});

// Định vị nút nổi
const route = useRoute();
const zaloVrClass = computed(() => {
  if (route.path.startsWith("/sanpham/")) {
    return "fixed z-[60] mt-32 lg:mt-0 lg:right-6 right-3 top-1/2 transform -translate-y-1/2 flex flex-col"
  }
  return "fixed z-[60] mb-20 lg:right-6 right-3 lg:top-1/2 transform lg:-translate-y-1/2 bottom-5 lg:bottom-64 flex flex-col"
})
</script>


<!-- CSS -->
<style>
.fixed-header {
  @apply fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out;
}

.hidden-header {
  transform: translateY(-100%);
}

.content {
  margin-top: 130px;
}

.play {
  -webkit-animation: zoom 1.4s infinite;
  animation: zoom 1.4s infinite;
  box-shadow: 0 0 0 0 rgba(57, 181, 74, 0.6);
  background-color: rgba(57, 181, 74, 0.6);
  border-radius: 50%;
  border: 5px solid transparent;
  transition: all 0.5s;
  transform-origin: 50% 50%;
}

.play_child {
  animation: phone-vr-circle-fill 1.4s infinite ease-in-out;
  border-radius: 50%;
  display: flex;
  background-color: rgba(57, 181, 74, 0.6);
}

#zalo-vr .phone-vr-circle-fill {
  box-shadow: 0 0 0 0 rgba(57, 181, 74, 0.6);
  background-color: rgba(57, 181, 74, 0.5);
}

@keyframes zoom {
  0% {
    transform: scale(0.9);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px transparent;
  }

  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 transparent;
  }
}

@keyframes phone-vr-circle-fill {
  0% {
    -webkit-transform: rotate(0) scale(1) skew(1deg);
  }

  10% {
    -webkit-transform: rotate(-25deg) scale(1) skew(1deg);
  }

  20% {
    -webkit-transform: rotate(25deg) scale(1) skew(1deg);
  }

  30% {
    -webkit-transform: rotate(-25deg) scale(1) skew(1deg);
  }

  40% {
    -webkit-transform: rotate(25deg) scale(1) skew(1deg);
  }

  50% {
    -webkit-transform: rotate(0) scale(1) skew(1deg);
  }

  100% {
    -webkit-transform: rotate(0) scale(1) skew(1deg);
  }
}
</style>