<template>
  <div class="step-pangkat">
    <h6 class="mb-3"><i class="fa fa-star me-2"></i>Pangkat</h6>
    <p class="text-muted">Form untuk pangkat akan ditambahkan di sini.</p>
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
.step-pangkat {
  padding: 1rem 0;
}
</style>
