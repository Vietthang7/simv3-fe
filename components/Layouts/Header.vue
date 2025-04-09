<script setup>
const { restAPI } = useApi();
</script>

<template>
  <div class="">
    <div class="relative">
      <div class="sticky top-0 z-[45] w-full">
        <div class="w-full lg:w-auto py-2 gap-4 bg-primary text-center z-60">
          <h1 class="text-white text-base font-light" v-if="['/'].includes(route.path)">

          </h1>
        </div>
      </div>

    </div>

  </div>
</template>