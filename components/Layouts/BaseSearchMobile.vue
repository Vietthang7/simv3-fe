<template>
  <Teleport to="body">
    <div class="fixed z-[200] inset-0 pointer-events-none mx-[30px]">
      <div :class="">

      </div>
    </div>
  </Teleport>
</template>

<script setup>
const show = defineModel("show");
const props = defineProps({
  classList:{
    type: String,
    default: "",
  },
  placement: {
    type: String,
    default: "",
  },
  searchResults: {
    type: Array,
    default: () => [],
  },
});

</script>