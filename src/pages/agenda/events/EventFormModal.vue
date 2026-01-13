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
      id="agendaForm"
    >
      <div class="row">
        <div class="mb-3">
          <label class="form-label fw-semibold">Penulis</label>
          <input
            type="text"
            class="form-control bg-light"
            v-model="authorName"
            disabled
            readonly
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Judul (Bahasa)</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.judul"
            :class="{ 'is-invalid': formErrors.judul }"
            placeholder="Masukkan judul agenda"
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
            placeholder="Masukkan judul agenda (English)"
          />
          <div class="invalid-feedback">
            {{ formErrors.judul_en }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Slug</label>
          <input
            type="text"
            class="form-control bg-light"
            v-model="formData.slug"
            disabled
            readonly
            placeholder="slug"
          />
          <div class="form-text text-muted">
            Slug dibuat otomatis dari judul bahasa Indonesia.
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Kategori Program</label>
            <select
              class="form-select"
              v-model="formData.idakategoriagenda"
              :class="{ 'is-invalid': formErrors.idakategoriagenda }"
              required
              :disabled="categoriesLoading"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-if="categoriesLoading" value="" disabled>
                Memuat kategori...
              </option>
              <option
                v-for="category in agendaCategories"
                :key="category.idakategoriagenda"
                :value="category.idakategoriagenda"
              >
                {{ category.namakategoriagenda }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ formErrors.idakategoriagenda }}
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6 mb-3">
              <label class="form-label fw-semibold">Tanggal Pelaksanaan</label>
              <input
                type="date"
                class="form-control"
                v-model="formData.tglpelaksanaan"
                :class="{ 'is-invalid': formErrors.tglpelaksanaan }"
                required
              />
              <div class="invalid-feedback">
                {{ formErrors.tglpelaksanaan }}
              </div>
            </div>
            <div class="col-sm-6 mb-3">
              <label class="form-label fw-semibold">Batas Pendaftaran</label>
              <input
                type="date"
                class="form-control"
                v-model="formData.tglbatasdaftar"
                :class="{ 'is-invalid': formErrors.tglbatasdaftar }"
                required
              />
              <div class="invalid-feedback">
                {{ formErrors.tglbatasdaftar }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Tempat Pelaksanaan</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.tmptpelaksanaan"
              :class="{ 'is-invalid': formErrors.tmptpelaksanaan }"
              placeholder="Masukkan tempat pelaksanaan"
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.tmptpelaksanaan }}
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Upload Poster</label>
            <input
              type="file"
              class="form-control"
              @change="handleFileUpload"
              accept="image/png, image/jpeg, image/jpg"
              :class="{ 'is-invalid': formErrors.poster }"
              ref="fileInput"
            />
            <div class="form-text">
              Maks 2MB. Format: .jpg, .jpeg, .png.
              <span v-if="isEditMode && fieldToEdit.poster" class="d-block">
                *Kosongkan jika tidak ingin mengubah poster.
              </span>
            </div>
            <div class="invalid-feedback">
              {{ formErrors.poster }}
            </div>

            <div class="mt-3" v-if="posterPreviewUrl">
              <label class="form-label fw-semibold d-block"
                >Preview Poster</label
              >

              <div class="position-relative d-inline-block">
                <img
                  :src="posterPreviewUrl"
                  alt="Preview Poster"
                  class="img-thumbnail shadow-sm"
                  style="
                    max-width: 200px;
                    max-height: 200px;
                    object-fit: contain;
                    background-color: #f8f9fa;
                  "
                />

                <button
                  type="button"
                  class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                  style="
                    width: 28px;
                    height: 28px;
                    padding: 0;
                    border: 2px solid white;
                  "
                  @click="removePoster"
                  title="Hapus Poster"
                >
                  <i class="fa fa-times" style="font-size: 14px"></i>
                </button>
              </div>
            </div>
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
        <label class="form-label fw-semibold">Konten (Bahasa)</label>
        <BaseRichTextEditor
          v-model="formData.konten"
          :is-invalid="!!formErrors.konten"
          placeholder="Masukkan konten agenda (Bahasa)"
        />
        <div class="invalid-feedback">
          {{ formErrors.konten }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Konten (English)</label>
        <BaseRichTextEditor
          v-model="formData.konten_en"
          :is-invalid="!!formErrors.konten_en"
          placeholder="Masukkan konten agenda (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.konten_en }}
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
import { addEvent, updateEvent } from "@/services/general/events/events";
import { getEventCategories } from "@/services/general/events/eventsCategories";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import BaseRichTextEditor from "@/components/base/default/richTextEditor.vue";
import { compressImage } from "@/utils/imageCompressor";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Data" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  idpengguna: "",
  idakategoriagenda: "",
  judul: "",
  judul_en: "",
  konten: "",
  konten_en: "",
  poster: null,
  tglpelaksanaan: "",
  tmptpelaksanaan: "",
  tglbatasdaftar: "",
  tayang: "Draft",
  flash: false,
  slug: "",
});

const formErrors = reactive({
  idpengguna: "",
  idakategoriagenda: "",
  judul: "",
  judul_en: "",
  konten: "",
  konten_en: "",
  poster: "",
  tglpelaksanaan: "",
  tmptpelaksanaan: "",
  tglbatasdaftar: "",
  tayang: "",
  flash: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const agendaCategories = ref([]);
const categoriesLoading = ref(false);

const posterPreviewUrl = ref(null);
const fileInput = ref(null);
const isPosterRemoved = ref(false);
const authorName = ref("");

// === Validation Schema ===

// === Validation Schema ===
const validationSchema = yup.object().shape({
  idakategoriagenda: yup.string().required("Kategori agenda wajib diisi."),
  judul: yup.string().required("Judul wajib diisi."),
  judul_en: yup.string().nullable(),
  konten: yup.string().required("Konten wajib diisi."),
  konten_en: yup.string().nullable(),
  poster: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Format file tidak didukung (Hanya .jpg, .jpeg, .png)",
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }
    ),
  tglpelaksanaan: yup
    .date()
    .required("Tanggal pelaksanaan wajib diisi.")
    .typeError("Format tanggal tidak valid."),
  tmptpelaksanaan: yup.string().required("Tempat pelaksanaan wajib diisi."),
  tglbatasdaftar: yup
    .date()
    .required("Tanggal batas daftar wajib diisi.")
    .typeError("Format tanggal tidak valid."),
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

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isPosterRemoved.value = false;

    if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(posterPreviewUrl.value);
    }

    if (newData) {
      formData.idakategoriagenda = newData.idakategoriagenda;
      formData.idpengguna = newData.idpengguna;
      formData.judul = newData.judul;
      formData.judul_en = newData.judul_en;
      formData.konten = newData.konten;
      formData.konten_en = newData.konten_en;
      formData.poster = null;
      formData.tglpelaksanaan = newData.tglpelaksanaan;
      formData.tmptpelaksanaan = newData.tmptpelaksanaan;
      formData.tglbatasdaftar = newData.tglbatasdaftar;
      formData.tayang = newData.tayang;
      formData.flash = !!newData.flash;
      formData.slug = newData.slug || "";
      posterPreviewUrl.value = newData.poster;
    } else {
      formData.idakategoriagenda = "";
      formData.idpengguna = "";
      formData.judul = "";
      formData.judul_en = "";
      formData.konten = "";
      formData.konten_en = "";
      formData.poster = null;
      formData.tglpelaksanaan = "";
      formData.tmptpelaksanaan = "";
      formData.tglbatasdaftar = "";
      formData.tayang = "Draft";
      formData.tayang = "Draft";
      formData.flash = false;
      formData.slug = "";

      formData.slug = "";

      posterPreviewUrl.value = null;

      // Reset author name to logged in user for new entry
      loadUserIdFromStorage();
    }

    if (fileInput.value) {
      fileInput.value.value = null;
    }
  },
  { immediate: true, deep: true }
);

// Watcher untuk auto-generate slug
watch(
  () => formData.judul,
  (newVal) => {
    if (newVal) {
      formData.slug = newVal
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter spesial kecuali spasi & dash
        .trim()
        .replace(/\s+/g, "-"); // Ganti spasi dengan dash
    } else {
      formData.slug = "";
    }
  }
);

async function fetchCategories() {
  categoriesLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namakategoriagenda",
      dir: "asc",
    };
    const response = await getEventCategories(params);
    agendaCategories.value = response.data?.[0]?.data;
  } catch (error) {
    console.error("Gagal memuat kategori agenda:", error);
    toast.error("Gagal memuat daftar kategori agenda.");
  } finally {
    categoriesLoading.value = false;
  }
}

onMounted(() => {
  fetchCategories();
  loadUserIdFromStorage();
});

// Load user ID from localStorage
function loadUserIdFromStorage() {
  try {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const user = userData?.data?.[0];
      const userId = user?.id_pengguna || user?.idpengguna;

      if (userId && !isEditMode.value) {
        formData.idpengguna = userId;
      }

      if (user) {
        const parts = [user.gelardepan, user.nama, user.gelarbelakang].filter(
          Boolean
        );
        authorName.value = parts.join(" ") || user.username || "User";
      }
    }
  } catch (err) {
    console.error("Error loading user ID:", err);
  }
}

// === Hook Lifecycle ===
onUnmounted(() => {
  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  emit("close");
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.poster = null;
    posterPreviewUrl.value = isEditMode.value ? props.fieldToEdit.poster : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.poster = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.poster = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres poster...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    formData.poster = compressedFile;
    posterPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.poster = "";
    isPosterRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses poster: " + error.message);
    resetToOriginal();
    formErrors.poster = "Gagal memproses gambar.";
  } finally {
    isLoading.value = false;
  }
}

function removePoster() {
  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  formData.poster = null;

  if (isEditMode.value && props.fieldToEdit.poster) {
    const isBlobPreview =
      posterPreviewUrl.value && posterPreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      posterPreviewUrl.value = null;
      isPosterRemoved.value = true;
    } else {
      posterPreviewUrl.value = props.fieldToEdit.poster;
      isPosterRemoved.value = false;
    }
  } else {
    posterPreviewUrl.value = null;
    isPosterRemoved.value = false;
  }
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
  data.append("record[idpengguna]", formData.idpengguna);
  data.append("record[idakategoriagenda]", formData.idakategoriagenda);
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[konten]", formData.konten);
  data.append("record[konten_en]", formData.konten_en || "");
  data.append("record[tglpelaksanaan]", formData.tglpelaksanaan);
  data.append("record[tmptpelaksanaan]", formData.tmptpelaksanaan);
  data.append("record[tglbatasdaftar]", formData.tglbatasdaftar);
  data.append("record[tayang]", formData.tayang);
  data.append("record[flash]", formData.flash ? "1" : "0");
  data.append("record[slug]", formData.slug);

  if (formData.poster) {
    data.append("upload_poster", formData.poster);
  } else if (isPosterRemoved.value) {
    data.append("record[poster]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idagenda;
      data.append("_method", "PUT");
      await updateEvent(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addEvent(data);
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
.form-text {
  font-size: 0.875em;
}
.img-thumbnail {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  object-fit: contain;
}
</style>
