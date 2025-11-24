<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="menuForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Nama Menu (ID)</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nama"
            :class="{ 'is-invalid': formErrors.nama }"
            placeholder="Masukkan nama menu (Bahasa Indonesia)"
            required
          />
          <div class="invalid-feedback">
            {{ formErrors.nama }}
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Nama Menu (EN)</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nama_en"
            :class="{ 'is-invalid': formErrors.nama_en }"
            placeholder="Masukkan nama menu (English)"
          />
          <div class="invalid-feedback">
            {{ formErrors.nama_en }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Link (URL)</label>
          <input
            type="url"
            class="form-control"
            v-model="formData.link"
            :class="{ 'is-invalid': formErrors.link }"
            placeholder="https://contoh.com atau /halaman-slug"
            required
          />
          <div class="invalid-feedback">
            {{ formErrors.link }}
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Ikon</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.icon"
            :class="{ 'is-invalid': formErrors.icon }"
            placeholder="Cth: fa fa-home"
          />
          <div class="form-text">Masukkan kelas ikon (cth: Font Awesome).</div>
          <div class="invalid-feedback">
            {{ formErrors.icon }}
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Target Link</label>
          <select
            class="form-select"
            v-model="formData.target"
            :class="{ 'is-invalid': formErrors.target }"
            required
          >
            <option value="_blank">Tab Baru (_blank)</option>
            <option value="_self">Tab Ini (_self)</option>
          </select>
          <div class="invalid-feedback">
            {{ formErrors.target }}
          </div>
        </div>
        
        <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold">Status</label>
            <div class="form-check form-switch">
            <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckTayang"
                v-model="formData.tayang"
                true-value="Tayang"
                false-value="Draft"
                :class="{ 'is-invalid': formErrors.tayang }"
            />
            <label class="form-check-label" for="flexSwitchCheckTayang">
                {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
            </label>
            </div>
            <div class="invalid-feedback">
            {{ formErrors.tayang }}
            </div>
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        {{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addMenu, updateMenu } from "@/services/general/website/settings/menu";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Menu" }, 
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama: "",
  nama_en: "",
  link: "",
  icon: "",
  target: "_blank",
  tayang: "Draft",
});

const formErrors = reactive({
  nama: "",
  nama_en: "",
  link: "",
  icon: "",
  target: "",
  tayang: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);


// === Skema Validasi ===
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama menu (ID) wajib diisi."),
  nama_en: yup.string().nullable(),
  link: yup.string().required("Link wajib diisi."),
  icon: yup.string().nullable(),
  target: yup.string().oneOf(["_self", "_blank"]).required("Target wajib diisi."),
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
    if (newData) {
      formData.nama = newData.nama;
      formData.nama_en = newData.nama_en;
      formData.link = newData.link;
      formData.icon = newData.icon;
      formData.target = newData.target;
      formData.tayang = newData.tayang; 
    } else {
      formData.nama = "";
      formData.nama_en = "";
      formData.link = "";
      formData.icon = "";
      formData.target = "_blank";
      formData.tayang = "Draft"; 
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true }
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

async function validateForm() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));

  let isYupValid = false;
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    isYupValid = true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
  }
  
  return isYupValid;
}

async function submitForm() {
  const isValid = await validateForm();
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[nama]", formData.nama);
  data.append("record[nama_en]", formData.nama_en || "");
  data.append("record[link]", formData.link || "");
  data.append("record[icon]", formData.icon || "");
  data.append("record[target]", formData.target);
  data.append("record[tayang]", formData.tayang);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idmenu; 
      data.append("_method", "PUT");
      await updateMenu(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addMenu(data);
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
</style>