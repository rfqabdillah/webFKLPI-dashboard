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
      id="newsForm"
    >
      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (Bahasa)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul"
          :class="{ 'is-invalid': formErrors.judul }"
          placeholder="Masukkan judul berita"
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
          placeholder="Masukkan judul berita (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.judul_en }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Slug</label>
            <input
              type="text"
              class="form-control bg-light"
              v-model="formData.slug"
              :class="{ 'is-invalid': formErrors.slug }"
              placeholder="slug-otomatis-muncul"
              required
              disabled
            />
            <div class="form-text text-muted small">
              *Dibuat otomatis dari judul.
            </div>
            <div class="invalid-feedback">
              {{ formErrors.slug }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Kategori Berita</label>
            <select
              class="form-select"
              v-model="formData.idkategoriberita"
              :class="{ 'is-invalid': formErrors.idkategoriberita }"
              required
              :disabled="categoriesLoading"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-if="categoriesLoading" value="" disabled>
                Memuat kategori...
              </option>
              <option
                v-for="category in newsCategories"
                :key="category.idkategoriberita"
                :value="category.idkategoriberita"
              >
                {{ category.namakategoriberita }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ formErrors.idkategoriberita }}
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Penulis</label>
            <input
              type="text"
              class="form-control bg-light"
              :value="currentUser.nama"
              disabled
              readonly
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Kata Kunci (Keywords)</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.katakunci"
              :class="{ 'is-invalid': formErrors.katakunci }"
              placeholder="Mis: teknologi, berita, update"
            />
            <div class="form-text small">Pisahkan dengan koma (,)</div>
            <div class="invalid-feedback">
              {{ formErrors.katakunci }}
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label fw-semibold">Status Tayang</label>
              <div class="form-check form-switch mt-2">
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
              <div class="invalid-feedback">{{ formErrors.tayang }}</div>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label fw-semibold">Status Flash</label>
              <div class="form-check form-switch mt-2">
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
        <label class="form-label fw-semibold">Upload Gambar Utama</label>
        <input
          type="file"
          class="form-control"
          @change="handleImageUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{ 'is-invalid': formErrors.gambar_utama }"
          ref="fileInput"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span v-if="isEditMode && fieldToEdit.gambar_utama" class="d-block">
            *Kosongkan jika tidak ingin mengubah gambar.
          </span>
        </div>
        <div class="invalid-feedback">
          {{ formErrors.gambar_utama }}
        </div>

        <div v-if="imagePreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Gambar</label>

          <div class="position-relative d-inline-block">
            <img
              :src="imagePreviewUrl"
              alt="Preview Gambar Utama"
              class="img-thumbnail shadow-sm"
              style="
                max-height: 200px;
                max-width: 100%;
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
              @click="removeImage"
              title="Hapus Gambar"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Konten (Bahasa)</label>
        <BaseRichTextEditor
          v-model="formData.konten"
          :is-invalid="!!formErrors.konten"
          placeholder="Masukkan konten berita (Bahasa)"
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
          placeholder="Masukkan konten berita (English)"
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
import { addNews, updateNews } from "@/services/general/website/news/news";
import { getNewsCategories } from "@/services/general/website/news/newsCategories";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import BaseRichTextEditor from "@/components/base/default/richTextEditor.vue";
import { compressImage } from "@/utils/imageCompressor";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Berita" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  idkategoriberita: "",
  idpengguna: "",
  judul: "",
  judul_en: "",
  slug: "",
  katakunci: "",
  gambar_utama: null,
  konten: "",
  konten_en: "",
  tayang: "Draft",
  flash: false,
});

const formErrors = reactive({
  idkategoriberita: "",
  idpengguna: "",
  judul: "",
  judul_en: "",
  slug: "",
  katakunci: "",
  gambar_utama: "",
  konten: "",
  konten_en: "",
  tayang: "",
  flash: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const newsCategories = ref([]);
const categoriesLoading = ref(false);
const imagePreviewUrl = ref(null);
const fileInput = ref(null);
const isImageRemoved = ref(false);
const currentUser = ref({ idpengguna: "", nama: "" });
const slugDebounceTimer = ref(null);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  idkategoriberita: yup.string().required("Kategori berita wajib diisi."),
  idpengguna: yup.string().required("Penulis wajib diisi."),
  judul: yup.string().required("Judul wajib diisi."),
  judul_en: yup.string().nullable(),
  slug: yup
    .string()
    .required("Slug wajib diisi.")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)"
    ),
  katakunci: yup.string().nullable(),
  konten: yup.string().required("Konten wajib diisi."),
  konten_en: yup.string().nullable(),
  gambar_utama: yup
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
  tayang: yup
    .string()
    .oneOf(["Tayang", "Draft"], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
  flash: yup.boolean(),
});

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

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
    isImageRemoved.value = false;

    if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }

    formData.idpengguna = currentUser.value.idpengguna;

    if (newData) {
      formData.idkategoriberita = newData.idkategoriberita;
      formData.idpengguna = newData.idpengguna;
      formData.judul = newData.judul;
      formData.judul_en = newData.judul_en;
      formData.slug = newData.slug;
      formData.katakunci = newData.katakunci;
      formData.konten = newData.konten;
      formData.konten_en = newData.konten_en;
      formData.gambar_utama = null;
      formData.tayang = newData.tayang;
      formData.flash = newData.flash === "1" || newData.flash === true;
      imagePreviewUrl.value = newData.gambar_utama;
    } else {
      formData.idkategoriberita = "";
      formData.judul = "";
      formData.judul_en = "";
      formData.slug = "";
      formData.katakunci = "";
      formData.konten = "";
      formData.konten_en = "";
      formData.gambar_utama = null;
      formData.tayang = "Draft";
      formData.flash = false;
      imagePreviewUrl.value = null;
    }

    if (fileInput.value) {
      fileInput.value.value = null;
    }
  },
  { immediate: true, deep: true }
);

// === WATCHER ===
watch(
  () => formData.judul,
  (newJudul) => {
    if (slugDebounceTimer.value) {
      clearTimeout(slugDebounceTimer.value);
    }
    slugDebounceTimer.value = setTimeout(() => {
      formData.slug = slugify(newJudul);
    }, 500); // Jeda 500ms
  }
);

async function fetchNewsCategories() {
  categoriesLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namakategoriberita",
      dir: "asc",
    };
    const response = await getNewsCategories(params);
    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        newsCategories.value = response.data[0].data;
      } else {
        newsCategories.value = response.data;
      }
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      newsCategories.value = response.data.data;
    } else {
      console.warn(
        "Struktur data kategori berita tidak terduga:",
        response.data
      );
      newsCategories.value = [];
    }
  } catch (error) {
    console.error("Gagal memuat kategori berita:", error);
    toast.error("Gagal memuat daftar kategori berita.");
  } finally {
    categoriesLoading.value = false;
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

onMounted(() => {
  loadCurrentUser();
  fetchNewsCategories();
});

// === Hook Lifecycle ===
onUnmounted(() => {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  if (slugDebounceTimer.value) {
    clearTimeout(slugDebounceTimer.value);
  }
});

// === Methods ===
function closeModal() {
  emit("close");
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.gambar_utama = null;
    imagePreviewUrl.value = isEditMode.value
      ? props.fieldToEdit.gambar_utama
      : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.gambar_utama = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.gambar_utama = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    formData.gambar_utama = compressedFile;
    imagePreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.gambar_utama = "";
    isImageRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.gambar_utama = "Gagal memproses gambar.";
  } finally {
    isLoading.value = false;
  }
}

function removeImage() {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  formData.gambar_utama = null;

  if (isEditMode.value && props.fieldToEdit.gambar_utama) {
    const isBlobPreview =
      imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      imagePreviewUrl.value = null;
      isImageRemoved.value = true;
    } else {
      imagePreviewUrl.value = props.fieldToEdit.gambar_utama;
      isImageRemoved.value = false;
    }
  } else {
    imagePreviewUrl.value = null;
    isImageRemoved.value = false;
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

  formData.slug = slugify(formData.judul);

  const isValid = await validateForm();
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[idkategoriberita]", formData.idkategoriberita);
  data.append("record[idpengguna]", formData.idpengguna);
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[slug]", formData.slug || "");
  data.append("record[katakunci]", formData.katakunci || "");
  data.append("record[konten]", formData.konten);
  data.append("record[konten_en]", formData.konten_en || "");
  data.append("record[tayang]", formData.tayang);
  data.append("record[flash]", formData.flash ? "1" : "0");

  if (formData.gambar_utama) {
    data.append("upload_gambar_utama", formData.gambar_utama);
  } else if (isImageRemoved.value) {
    data.append("record[gambar_utama]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idberita;
      data.append("_method", "PUT");
      await updateNews(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addNews(data);
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
