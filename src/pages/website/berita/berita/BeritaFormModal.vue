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
          :class="{
            'is-invalid': formErrors.judul,
            shake: isShaking && formErrors.judul,
          }"
          placeholder="Masukkan judul berita"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.judul">
            {{ formErrors.judul }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul_en"
          :class="{
            'is-invalid': formErrors.judul_en,
            shake: isShaking && formErrors.judul_en,
          }"
          placeholder="Masukkan judul berita (English)"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.judul_en">
            {{ formErrors.judul_en }}
          </div>
        </transition>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Slug</label>
            <input
              type="text"
              class="form-control bg-light"
              v-model="formData.slug"
              :class="{
                'is-invalid': formErrors.slug,
                shake: isShaking && formErrors.slug,
              }"
              placeholder="slug-otomatis-muncul"
              required
              disabled
            />
            <div class="form-text text-muted small">
              *Dibuat otomatis dari judul.
            </div>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.slug">
                {{ formErrors.slug }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Kategori Berita</label>
            <select
              class="form-select"
              v-model="formData.id_kategori_berita"
              :class="{
                'is-invalid': formErrors.id_kategori_berita,
                shake: isShaking && formErrors.id_kategori_berita,
              }"
              required
              :disabled="kategoriLoading"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-if="kategoriLoading" value="" disabled>
                Memuat kategori...
              </option>
              <option
                v-for="category in kategoriBerita"
                :key="category.id_kategori_berita"
                :value="category.id_kategori_berita"
              >
                {{ category.nama_kategori_berita }}
              </option>
            </select>
            <transition name="fade-error">
              <div
                class="invalid-feedback"
                v-if="formErrors.id_kategori_berita"
              >
                {{ formErrors.id_kategori_berita }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Organisasi (FKLPI)</label>
            <BaseSearchSelect
              v-model="formData.id_organisasi"
              :api-fn="getOrganisasi"
              value-key="id_organisasi"
              label-key="nama_organisasi"
              filter-key="nama_organisasi"
              placeholder="Pilih Organisasi"
              search-placeholder="Ketik nama organisasi"
              :initial-label="initialOrganisasiLabel"
              :is-invalid="!!formErrors.id_organisasi"
              :shake="isShaking && !!formErrors.id_organisasi"
            />
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.id_organisasi">
                {{ formErrors.id_organisasi }}
              </div>
            </transition>
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
            <div
              class="keywords-input-container"
              :class="{
                'is-invalid': formErrors.katakunci,
                shake: isShaking && formErrors.katakunci,
              }"
              @click="$refs.keywordInputRef.focus()"
            >
              <div class="keywords-bubbles">
                <span
                  v-for="(tag, index) in keywords"
                  :key="index"
                  class="keywords-bubble"
                >
                  {{ tag }}
                  <button
                    type="button"
                    class="bubble-remove"
                    @click.stop="removeKeyword(index)"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </span>
                <input
                  type="text"
                  class="keywords-input"
                  v-model="keywordInput"
                  @keydown.enter.prevent="addKeyword"
                  @keydown.prevent.,="addKeyword"
                  @keydown.backspace="handleBackspace"
                  placeholder="Ketik kata kunci"
                  ref="keywordInputRef"
                />
              </div>
            </div>
            <small class="form-text text-muted">
              Tekan koma (,) atau Enter untuk menambahkan kata kunci.
            </small>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.katakunci">
                {{ formErrors.katakunci }}
              </div>
            </transition>
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
          :class="{
            'is-invalid': formErrors.gambar_utama,
            shake: isShaking && formErrors.gambar_utama,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.gambar_utama"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah gambar.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.gambar_utama">
            {{ formErrors.gambar_utama }}
          </div>
        </transition>

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
          :class="{ shake: isShaking && formErrors.konten }"
          placeholder="Masukkan konten berita (Bahasa)"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.konten">
            {{ formErrors.konten }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Konten (English)</label>
        <BaseRichTextEditor
          v-model="formData.konten_en"
          :is-invalid="!!formErrors.konten_en"
          :class="{ shake: isShaking && formErrors.konten_en }"
          placeholder="Masukkan konten berita (English)"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.konten_en">
            {{ formErrors.konten_en }}
          </div>
        </transition>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import BaseSearchSelect from "@/components/base/BaseSearchSelect.vue";
import { addBerita, updateBerita } from "@/services/general/website/berita";
import { getKategoriBerita } from "@/services/referensi/kategoriBerita";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import BaseRichTextEditor from "@/components/base/default/richTextEditor.vue";
import { compressImage } from "@/utils/imageCompressor";
import { parseBubble } from "@/utils/parseBubble";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Berita" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  id_kategori_berita: "",
  id_organisasi: "",
  id_pengguna: "",
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
  id_kategori_berita: "",
  id_organisasi: "",
  id_pengguna: "",
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
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

const kategoriBerita = ref([]);
const kategoriLoading = ref(false);
const imagePreviewUrl = ref(null);
const fileInput = ref(null);
const isImageRemoved = ref(false);
const currentUser = ref({ id_pengguna: "", nama: "" });
const slugDebounceTimer = ref(null);
const keywords = ref([]);
const keywordInput = ref("");

// === Validation Schema ===
const validationSchema = yup.object().shape({
  id_kategori_berita: yup.string().required("Kategori berita wajib diisi."),
  id_organisasi: yup.string().required("Organisasi wajib diisi."),
  id_pengguna: yup.string().required("Penulis wajib diisi."),
  judul: yup.string().required("Judul wajib diisi."),
  judul_en: yup.string().nullable(),
  slug: yup
    .string()
    .required("Slug wajib diisi.")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
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
      },
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

    formData.id_pengguna = currentUser.value.id_pengguna;

    if (newData) {
      const berita = newData;
      formData.id_kategori_berita = berita.id_kategori_berita;
      formData.id_organisasi = berita.id_organisasi;
      initialOrganisasiLabel.value = berita.fklpi?.nama_organisasi || berita.organisasi?.nama_organisasi || berita.nama_organisasi || "";
      formData.id_pengguna = berita.id_pengguna;
      formData.judul = berita.judul;
      formData.judul_en = berita.judul_en;
      formData.slug = berita.slug;
      formData.katakunci = berita.katakunci;
      keywords.value = parseBubble(berita.katakunci);
      formData.konten = berita.konten;
      formData.konten_en = berita.konten_en;
      formData.gambar_utama = null;
      formData.tayang = berita.tayang;
      formData.flash = berita.flash === "1" || berita.flash === true;
      imagePreviewUrl.value = berita.gambar_utama;
    } else {
      formData.id_kategori_berita = "";
      formData.id_organisasi = "";
      initialOrganisasiLabel.value = "";
      formData.judul = "";
      formData.judul_en = "";
      formData.slug = "";
      formData.katakunci = "";
      keywords.value = [];
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
  { immediate: true, deep: true },
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
    }, 500);
  },
);

async function fetchKategoriBerita() {
  kategoriLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "nama_kategori_berita",
      dir: "asc",
    };
    const response = await getKategoriBerita(params);
    kategoriBerita.value = response.data?.[0]?.data;
  } catch (error) {
    console.error("Gagal memuat kategori berita:", error);
    toast.error("Gagal memuat daftar kategori berita.");
  } finally {
    kategoriLoading.value = false;
  }
}

function loadCurrentUser() {
  const fallbackUser = { id_pengguna: "", nama: "Admin Website" };
  try {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);

      if (parsed) {
        const user = parsed.data?.[0] || parsed.user || parsed;
        const userId = user.id || user.id_pengguna;
        const userName = user.nama || user.username;

        if (userId) {
          currentUser.value = { id_pengguna: userId, nama: userName || "User" };
          formData.id_pengguna = userId;
          return;
        }
      }
    }

    console.warn(
      "Tidak dapat memuat pengguna dari localStorage, menggunakan data placeholder.",
    );
    currentUser.value = fallbackUser;
    formData.id_pengguna = fallbackUser.id_pengguna;
  } catch (error) {
    console.error("Gagal mem-parsing userData dari localStorage:", error);
    currentUser.value = fallbackUser;
    formData.id_pengguna = fallbackUser.id_pengguna;
  }
}

onMounted(() => {
  loadCurrentUser();
  fetchKategoriBerita();
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
    imagePreviewUrl.value =
      isEditMode.value && props.fieldToEdit
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

function addKeyword(event) {
  const value = keywordInput.value.trim().replace(/,/g, "");
  if (value && !keywords.value.includes(value)) {
    keywords.value.push(value);
    updateKeywordsString();
  }
  keywordInput.value = "";
  if (event) event.preventDefault();
}

function removeKeyword(index) {
  keywords.value.splice(index, 1);
  updateKeywordsString();
}

function handleBackspace(event) {
  if (keywordInput.value === "" && keywords.value.length > 0) {
    removeKeyword(keywords.value.length - 1);
  }
}

function updateKeywordsString() {
  formData.katakunci = keywords.value.join(",");
}

function removeImage() {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  formData.gambar_utama = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.gambar_utama) {
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

  formData.slug = slugify(formData.judul);

  const isValid = await validateForm();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[id_kategori_berita]", formData.id_kategori_berita);
  data.append("record[id_organisasi]", formData.id_organisasi);
  data.append("record[id_pengguna]", formData.id_pengguna);
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
      const fieldId = props.fieldToEdit.id_berita;
      data.append("_method", "PUT");
      await updateBerita(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addBerita(data);
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

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.keywords-input-container {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #fff;
  cursor: text;
  min-height: 48px;
}

.keywords-input-container:focus-within {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.keywords-bubbles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.keywords-bubble {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid #0d6efd;
  border-radius: 50px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.bubble-remove {
  background: #0d6efd;
  border: none;
  border-radius: 50%;
  color: white;
  width: 16px;
  height: 16px;
  font-size: 10px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.bubble-remove:hover {
  opacity: 1;
}

.keywords-input {
  border: none;
  outline: none;
  flex-grow: 1;
  min-width: 120px;
  background: transparent;
  padding: 0;
  margin: 0;
  color: #212529;
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
  transition: opacity 0.3s ease;
}

.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
}
</style>
