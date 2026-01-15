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
      id="videoForm"
    >
      <!-- Full Width Titles -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (Bahasa)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul"
          :class="{ 'is-invalid': formErrors.judul }"
          placeholder="Masukkan judul video"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.judul }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul_en"
          :class="{ 'is-invalid': formErrors.judul_en }"
          placeholder="Masukkan judul video (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.judul_en }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Kategori Video</label>
            <select
              class="form-select"
              v-model="formData.idkategorivideo"
              :class="{ 'is-invalid': formErrors.idkategorivideo }"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              <option
                v-for="cat in videoCategories"
                :key="cat.idkategorivideo"
                :value="cat.idkategorivideo"
              >
                {{ cat.namakategorivideo }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ formErrors.idkategorivideo }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Link Video (URL)</label>
            <input
              type="url"
              class="form-control"
              v-model="formData.linkvideo"
              :class="{ 'is-invalid': formErrors.linkvideo }"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.linkvideo }}
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Penulis</label>
            <input
              type="text"
              class="form-control"
              :value="currentUser.nama"
              disabled
            />
          </div>

          <div class="row">
            <div class="col-sm-6 mb-3">
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
                  :class="{ 'is-invalid': formErrors.tayang }"
                />
                <label class="form-check-label" for="tayangSwitch">
                  {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
                </label>
              </div>
              <div class="invalid-feedback">
                {{ formErrors.tayang }}
              </div>
            </div>
            <div class="col-sm-6 mb-3">
              <label class="form-label fw-semibold">Status Flash</label>
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  v-model="formData.flash"
                  id="flashCheck"
                />
                <label class="form-check-label" for="flashCheck">
                  {{ formData.flash ? "Aktif" : "Nonaktif" }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi (Bahasa)</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi"
          :class="{ 'is-invalid': formErrors.deskripsi }"
          placeholder="Masukkan deskripsi singkat (Bahasa)"
          rows="4"
        ></textarea>
        <div class="invalid-feedback">
          {{ formErrors.deskripsi }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi (English)</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi_en"
          :class="{ 'is-invalid': formErrors.deskripsi_en }"
          placeholder="Masukkan deskripsi singkat (English)"
          rows="4"
        ></textarea>
        <div class="invalid-feedback">
          {{ formErrors.deskripsi_en }}
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
import {
  addVideo,
  updateVideo,
} from "@/services/general/website/videos/videos";
import { getVideoCategories } from "@/services/general/website/videos/videoCategories";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Video" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  judul: "",
  judul_en: "",
  deskripsi: "",
  deskripsi_en: "",
  linkvideo: "",
  idpengguna: "",
  idkategorivideo: "", // Added category
  flash: false,
  tayang: "Draft",
});

const formErrors = reactive({
  judul: "",
  judul_en: "",
  deskripsi: "",
  deskripsi_en: "",
  linkvideo: "",
  idpengguna: "",
  idkategorivideo: "", // Added category error
  flash: "",
  tayang: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const videoCategories = ref([]); // Store categories

const currentUser = ref({ idpengguna: "", nama: "" });

const validationSchema = yup.object().shape({
  judul: yup.string().required("Judul wajib diisi."),
  judul_en: yup.string().nullable(),
  deskripsi: yup.string().nullable(),
  deskripsi_en: yup.string().nullable(),
  linkvideo: yup
    .string()
    .url("Format URL tidak valid")
    .required("URL video wajib diisi."),
  idpengguna: yup.string().required("Penulis wajib diisi."),
  idkategorivideo: yup.string().required("Kategori video wajib dipilih."), // Validation for category
  tayang: yup
    .string()
    .oneOf(["Tayang", "Draft"], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
  flash: yup.boolean(),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Methods ===
async function fetchCategories() {
  try {
    const response = await getVideoCategories({ per_page: 100 }); // Get all categories
    if (response && response.data) {
      // Handle nested data structure based on user example
      if (
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        response.data[0].data
      ) {
        videoCategories.value = response.data[0].data;
      } else if (response.data.data) {
        videoCategories.value = response.data.data;
      } else {
        videoCategories.value = Array.isArray(response.data)
          ? response.data
          : [];
      }
    }
  } catch (error) {
    console.error("Gagal mengambil kategori video:", error);
    toast.error("Gagal memuat kategori video.");
  }
}

function loadCurrentUser() {
  const fallbackUser = { idpengguna: "user-id-001", nama: "Admin Website" };
  try {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      if (userData && userData.data && userData.data.length > 0) {
        const user = userData.data[0];
        const userId = user.id_pengguna;
        const userName = user.nama;
        if (userId && userName) {
          currentUser.value = { idpengguna: userId, nama: userName };
          formData.idpengguna = userId;
          return;
        }
      }
    }
    console.warn(
      "Tidak dapat memuat pengguna dari localStorage, menggunakan data placeholder."
    );
    currentUser.value = fallbackUser;
    formData.idpengguna = fallbackUser.idpengguna;
  } catch (error) {
    console.error("Gagal mem-parsing userData dari localStorage:", error);
    currentUser.value = fallbackUser;
    formData.idpengguna = fallbackUser.idpengguna;
  }
}

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    formData.idpengguna = currentUser.value.idpengguna;

    if (newData) {
      formData.judul = newData.judul;
      formData.judul_en = newData.judul_en;
      formData.deskripsi = newData.deskripsi;
      formData.deskripsi_en = newData.deskripsi_en;
      formData.linkvideo = newData.linkvideo;
      formData.idpengguna = newData.idpengguna;
      formData.idkategorivideo = newData.idkategorivideo; // Set category
      formData.tayang = newData.tayang;
      formData.flash = newData.flash === "1" || newData.flash === true;
    } else {
      formData.judul = "";
      formData.judul_en = "";
      formData.deskripsi = "";
      formData.deskripsi_en = "";
      formData.linkvideo = "";
      formData.idkategorivideo = ""; // Reset category
      formData.tayang = "Draft";
      formData.flash = false;
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  loadCurrentUser();
  fetchCategories(); // Fetch on mount
});

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
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[deskripsi_en]", formData.deskripsi_en || "");
  data.append("record[linkvideo]", formData.linkvideo);
  data.append("record[idpengguna]", formData.idpengguna);
  data.append("record[idkategorivideo]", formData.idkategorivideo); // Append category
  data.append("record[tayang]", formData.tayang);
  data.append("record[flash]", formData.flash ? "1" : "0");

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idvideo;
      data.append("_method", "PUT");
      await updateVideo(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addVideo(data);
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
