<template>
  <div class="bg-[#F2F2F2] lg:mt-[100px] mt-20">
    <div class="text secondary width-base xl:pb-[54px] xl:pt-[69px] flex justify-between flex-col gap-x-[30px] lg:flex-row py-[60px]">
      <div class="relative lg:w-[510px]">
        <div class="w-[125px] h-10">
          <NuxtLink to="/">
            <NuxtImg
              src="/img/logo.png"
              alt="logo"
              class="w-full h-full object-cover"
            />
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
      </div>

    </div>
  </div>
  <div class="w-full h-[68px] bg-primary flex items-center justify-center text-white text-base">
      Uchiha Obito
  </div>
</template>

<script setup>
const width = ref(0);
const PC = computed(() => width.value >= 1024);
</script>