<script setup>
const { restAPI } = useApi();

const { data: resData } = await restAPI.stores.getPartners({
  params: {
    current: 1,
    pageSize: 9999,
  },
});

const partner = resData.value?.data;
</script>

<template>
  <div v-if="partner.length > 0" class="lg:mt-[100px] mt-20">
    <div class="text-title text-[28px] text-center mb-10 font-medium">
      Đối tác của chúng tôi.
    </div>
    <div
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:gap-x-[30px] gap-x-4 gap-y-[20px]"
    >
      <div
        v-for="item in partner.slice(0, 12)"
        :key="item.id"
        class="hidden lg:flex items-center justify-center hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
      >
        <img
          :src="item?.image || '/img/empty.jpg'"
          :alt="item?.alt || 'img empty'"
          class="w-full h-auto aspect-[2.0] object-cover"
        />
      </div>

      <div
        v-for="item in partner.slice(0, 8)"
        :key="item.id"
        class="hidden sm:block lg:hidden hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
      >
        <img
          :src="item?.image || '/img/empty.jpg'"
          :alt="item?.alt || 'img empty'"
          class="w-full h-auto aspect-[2.0] object-cover"
        />
      </div>

      <div
        v-for="item in partner.slice(0, 6)"
        :key="item.id"
        class="sm:hidden flex items-center justify-center hover:bg-[#DBEFDE] hover:scale-110 transition duration-300 ease-in-out"
      >
        <img
          :src="item?.image || '/img/empty.jpg'"
          :alt="item?.alt || 'img empty'"
          class="w-full h-auto aspect-[2.0] object-cover"
        />
      </div>
    </div>
  </div>
</template>
