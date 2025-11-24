<template>
  <div class="step-pelatihan">
    <h6 class="mb-3"><i class="fa fa-certificate me-2"></i>Pelatihan</h6>
    <p class="text-muted">Form untuk pelatihan akan ditambahkan di sini.</p>
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
.step-pelatihan {
  padding: 1rem 0;
}
</style>
