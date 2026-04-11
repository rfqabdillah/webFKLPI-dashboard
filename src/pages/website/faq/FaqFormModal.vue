<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form
      @submit.prevent="submitForm"
      novalidate
      :class="{ 'was-validated': wasValidated }"
      id="faqForm"
    >
      <div class="row">
        <div class="col-md-12">
          <div class="mb-3">
            <label class="form-label fw-semibold">Pertanyaan</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.pertanyaan"
              :class="{
                'is-invalid': formErrors.pertanyaan,
                shake: isShaking && formErrors.pertanyaan,
              }"
              placeholder="Masukkan pertanyaan"
              required
            />
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.pertanyaan">
                {{ formErrors.pertanyaan }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Jawaban</label>
            <textarea
              class="form-control"
              v-model="formData.jawaban"
              :class="{
                'is-invalid': formErrors.jawaban,
                shake: isShaking && formErrors.jawaban,
              }"
              placeholder="Masukkan jawaban"
              rows="4"
            ></textarea>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.jawaban">
                {{ formErrors.jawaban }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Status Tayang</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="tayangSwitch"
                v-model="formData.tayang"
                true-value="Tayang"
                false-value="Draft"
                :class="{
                  'is-invalid': formErrors.tayang,
                  shake: isShaking && formErrors.tayang,
                }"
              />
              <label class="form-check-label" for="tayangSwitch">
                {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
              </label>
            </div>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.tayang">
                {{ formErrors.tayang }}
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addFaq, updateFaq } from "@/services/general/website/faq";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "FAQ" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  pertanyaan: "",
  jawaban: "",
  tayang: "Draft",
});
const formErrors = reactive({
  pertanyaan: "",
  jawaban: "",
  tayang: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const logoPreviewUrl = ref(null);
const fileInput = ref(null);
const isLogoRemoved = ref(false);

const validationSchema = yup.object().shape({
  pertanyaan: yup.string().required("Pertanyaan wajib diisi."),
  jawaban: yup.string().required("Jawaban wajib diisi."),
  tayang: yup
    .string()
    .oneOf(["Tayang", "Draft"], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.pertanyaan = newData.pertanyaan;
      formData.jawaban = newData.jawaban;
      formData.tayang = newData.tayang;
    } else {
      formData.pertanyaan = "";
      formData.jawaban = "";
      formData.tayang = "Draft";
    }
  },
  { immediate: true },
);

// === Methods ===
function closeModal() {
  emit("close");
}

function handleError(error) {
  errorMessage.value =
    error.response?.data?.failed ||
    error.response?.data?.message ||
    "Gagal menyimpan data. Silakan coba lagi.";
  toast.error(errorMessage.value);
}

useRealtimeValidation({ formData, formErrors, wasValidated, validationSchema });

async function validateForm() {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    return true;
  } catch (err) {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    return false;
  }
}

async function submitForm() {
  wasValidated.value = true;

  const isValid = await validateForm();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[pertanyaan]", formData.pertanyaan);
  data.append("record[jawaban]", formData.jawaban);
  data.append("record[tayang]", formData.tayang);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_faq;
      data.append("_method", "PUT");
      await updateFaq(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addFaq(data);
      toast.success(`Data ${props.entityName} berhasil ditambah`);
    }

    emit("save-successful");
    closeModal();
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.fade-error-enter-active,
.fade-error-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
