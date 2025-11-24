<template>
  <i :class="iconClass" class="fa ms-1"></i>
</template>

<script setup>
import { computed } from 'vue';

// === Props ===
const props = defineProps({
  column: { type: String, required: true },
  sortColumn: { type: String, required: true },
  sortDirection: { type: String, required: true }
});

// === Computed ===
const iconClass = computed(() => {
  if (props.column !== props.sortColumn) {
    return 'fa-sort text-muted'; 
  }

  if (props.sortDirection === 'asc') {
    return 'fa-sort-asc'; 
  }
  return 'fa-sort-desc'; 
});
</script>

<style scoped>
.fa {
  font-size: 0.8em;
  vertical-align: middle;
}
.text-muted {
  opacity: 0.5;
}
</style>