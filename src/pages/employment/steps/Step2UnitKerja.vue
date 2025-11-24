<template>
  <div class="step-unit-kerja">
    <h6 class="mb-3"><i class="fa fa-building me-2"></i>Unit Kerja</h6>
    <p class="text-muted">Form untuk unit kerja akan ditambahkan di sini.</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);

// Emit valid by default for now
emit("validation-change", true);
</script>

<style scoped>
.step-unit-kerja {
  padding: 1rem 0;
}
</style>
