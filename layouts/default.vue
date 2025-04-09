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
    <div
      v-if="showModalTel"
      @click.self="handleModalTel"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
      >

    </div>




  </div>
</template>

<script setup>
const showModalZalo = ref(false);
const showModalTel = ref(false);
const handleModalZalo = () => {
  showModalZalo.value = !showModalZalo.value;
};
const handleModalTel = () => {
  showModalTel.value = !showModalTel.value;
};
</script>