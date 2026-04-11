<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="agendaForm">
      <!-- Judul (Bahasa) -->
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
          placeholder="Masukkan judul agenda"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.judul">
            {{ formErrors.judul }}
          </div>
        </transition>
      </div>

      <!-- Judul (English) -->
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
          placeholder="Masukkan judul agenda (English)"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.judul_en">
            {{ formErrors.judul_en }}
          </div>
        </transition>
      </div>

      <!-- Kategori Agenda (full-width) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Kategori Agenda</label>
        <select
          class="form-select"
          v-model="formData.id_kategori_agenda"
          :class="{
            'is-invalid': formErrors.id_kategori_agenda,
            shake: isShaking && formErrors.id_kategori_agenda,
          }"
          required
          :disabled="kategoriLoading"
        >
          <option value="" disabled>
            {{ kategoriLoading ? "Memuat..." : "Pilih kategori" }}
          </option>
          <option
            v-for="category in kategoriAgenda"
            :key="category.id_kategori_agenda"
            :value="category.id_kategori_agenda"
          >
            {{ category.nama_kategori_agenda }}
          </option>
        </select>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.id_kategori_agenda">
            {{ formErrors.id_kategori_agenda }}
          </div>
        </transition>
      </div>

      <!-- Organisasi (FKLPI) (full-width) -->
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

      <!-- Slug (full-width, auto-generated) -->
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
      </div>

      <div class="row">
        <!-- Penulis -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Penulis</label>
          <input
            type="text"
            class="form-control bg-light"
            :value="currentUser.nama"
            disabled
            readonly
          />
        </div>

        <!-- Tempat Pelaksanaan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tempat Pelaksanaan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tempat_pelaksanaan"
            :class="{
              'is-invalid': formErrors.tempat_pelaksanaan,
              shake: isShaking && formErrors.tempat_pelaksanaan,
            }"
            placeholder="Masukkan tempat pelaksanaan"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tempat_pelaksanaan">
              {{ formErrors.tempat_pelaksanaan }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Tanggal Pelaksanaan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tanggal Pelaksanaan</label>
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggal_pelaksanaan"
            :class="{
              'is-invalid': formErrors.tanggal_pelaksanaan,
              shake: isShaking && formErrors.tanggal_pelaksanaan,
            }"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tanggal_pelaksanaan">
              {{ formErrors.tanggal_pelaksanaan }}
            </div>
          </transition>
        </div>

        <!-- Tanggal Batas Pendaftaran -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Tanggal Batas Pendaftaran</label
          >
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggal_batas_pendaftaran"
            :class="{
              'is-invalid': formErrors.tanggal_batas_pendaftaran,
              shake: isShaking && formErrors.tanggal_batas_pendaftaran,
            }"
          />
          <transition name="fade-error">
            <div
              class="invalid-feedback"
              v-if="formErrors.tanggal_batas_pendaftaran"
            >
              {{ formErrors.tanggal_batas_pendaftaran }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Status Tayang & Flash -->
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
            />
            <label class="form-check-label" for="tayangSwitch">
              {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
            </label>
          </div>
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

      <!-- Upload Poster -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Poster</label>
        <input
          type="file"
          class="form-control"
          @change="handleImageUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.poster,
            shake: isShaking && formErrors.poster,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.poster"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah poster.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.poster">
            {{ formErrors.poster }}
          </div>
        </transition>

        <div v-if="imagePreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Poster</label>
          <div class="position-relative d-inline-block">
            <img
              :src="imagePreviewUrl"
              alt="Preview Poster"
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
              title="Hapus Poster"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Konten (Bahasa) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Konten (Bahasa)</label>
        <BaseRichTextEditor
          v-model="formData.konten"
          :is-invalid="!!formErrors.konten"
          :class="{ shake: isShaking && formErrors.konten }"
          placeholder="Masukkan konten agenda (Bahasa)"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.konten">
            {{ formErrors.konten }}
          </div>
        </transition>
      </div>

      <!-- Konten (English) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Konten (English)</label>
        <BaseRichTextEditor
          v-model="formData.konten_en"
          :is-invalid="!!formErrors.konten_en"
          :class="{ shake: isShaking && formErrors.konten_en }"
          placeholder="Masukkan konten agenda (English)"
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
import BaseRichTextEditor from "@/components/base/default/richTextEditor.vue";
import { addAgenda, updateAgenda } from "@/services/general/agenda/agenda";
import { getKategoriAgenda } from "@/services/referensi/kategoriAgenda";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import { compressImage } from "@/utils/imageCompressor";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Agenda" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  id_kategori_agenda: "",
  id_organisasi: "",
  id_pengguna: "",
  judul: "",
  judul_en: "",
  slug: "",
  konten: "",
  konten_en: "",
  poster: null,
  tanggal_pelaksanaan: "",
  tempat_pelaksanaan: "",
  tanggal_batas_pendaftaran: "",
  tayang: "Draft",
  flash: false,
});

const formErrors = reactive({
  id_kategori_agenda: "",
  id_organisasi: "",
  judul: "",
  judul_en: "",
  slug: "",
  konten: "",
  konten_en: "",
  poster: "",
  tanggal_pelaksanaan: "",
  tempat_pelaksanaan: "",
  tanggal_batas_pendaftaran: "",
  tayang: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

const kategoriAgenda = ref([]);
const kategoriLoading = ref(false);
const imagePreviewUrl = ref(null);
const fileInput = ref(null);
const isImageRemoved = ref(false);
const currentUser = ref({ id_pengguna: "", nama: "" });
const slugDebounceTimer = ref(null);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  id_kategori_agenda: yup.string().required("Kategori agenda wajib diisi."),
  id_organisasi: yup.string().required("Organisasi wajib diisi."),
  judul: yup.string().required("Judul wajib diisi."),
  judul_en: yup.string().nullable(),
  slug: yup
    .string()
    .required("Slug wajib diisi.")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
    ),
  konten: yup.string().required("Konten wajib diisi."),
  konten_en: yup.string().nullable(),
  tanggal_pelaksanaan: yup
    .string()
    .required("Tanggal pelaksanaan wajib diisi."),
  tempat_pelaksanaan: yup.string().nullable(),
  tanggal_batas_pendaftaran: yup
    .string()
    .nullable()
    .test(
      "not-after-pelaksanaan",
      "Tanggal batas pendaftaran tidak boleh lebih dari tanggal pelaksanaan.",
      function (value) {
        const { tanggal_pelaksanaan } = this.parent;
        if (!value || !tanggal_pelaksanaan) return true;
        return new Date(value) <= new Date(tanggal_pelaksanaan);
      },
    ),
  poster: yup
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
      formData.id_kategori_agenda = newData.id_kategori_agenda || "";
      formData.id_organisasi = newData.id_organisasi || "";
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      formData.id_pengguna =
        newData.id_pengguna || currentUser.value.id_pengguna;
      formData.judul = newData.judul || "";
      formData.judul_en = newData.judul_en || "";
      formData.slug = newData.slug || "";
      formData.konten = newData.konten || "";
      formData.konten_en = newData.konten_en || "";
      formData.poster = null;
      formData.tanggal_pelaksanaan = newData.tanggal_pelaksanaan
        ? newData.tanggal_pelaksanaan.substring(0, 10)
        : "";
      formData.tempat_pelaksanaan = newData.tempat_pelaksanaan || "";
      formData.tanggal_batas_pendaftaran = newData.tanggal_batas_pendaftaran
        ? newData.tanggal_batas_pendaftaran.substring(0, 10)
        : "";
      formData.tayang = newData.tayang || "Draft";
      formData.flash = newData.flash === "1" || newData.flash === true;
      imagePreviewUrl.value = newData.poster || null;
    } else {
      formData.id_kategori_agenda = "";
      formData.id_organisasi = "";
      formData.judul = "";
      formData.judul_en = "";
      formData.slug = "";
      formData.konten = "";
      formData.konten_en = "";
      formData.poster = null;
      formData.tanggal_pelaksanaan = "";
      formData.tempat_pelaksanaan = "";
      formData.tanggal_batas_pendaftaran = "";
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

async function fetchKategoriAgenda() {
  kategoriLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "nama_kategori_agenda",
      dir: "asc",
    };
    const response = await getKategoriAgenda(params);
    kategoriAgenda.value = response.data?.[0]?.data || [];
  } catch (error) {
    console.error("Gagal memuat kategori agenda:", error);
    toast.error("Gagal memuat daftar kategori agenda.");
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
  fetchKategoriAgenda();
});

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
    formData.poster = null;
    imagePreviewUrl.value =
      isEditMode.value && props.fieldToEdit ? props.fieldToEdit.poster : null;
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
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    formData.poster = compressedFile;
    imagePreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.poster = "";
    isImageRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.poster = "Gagal memproses gambar.";
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
  formData.poster = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.poster) {
    const isBlobPreview =
      imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      imagePreviewUrl.value = null;
      isImageRemoved.value = true;
    } else {
      imagePreviewUrl.value = props.fieldToEdit.poster;
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
  data.append("record[id_kategori_agenda]", formData.id_kategori_agenda);
  data.append("record[id_organisasi]", formData.id_organisasi);
  data.append("record[id_pengguna]", formData.id_pengguna);
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[slug]", formData.slug || "");
  data.append("record[konten]", formData.konten);
  data.append("record[konten_en]", formData.konten_en || "");
  data.append("record[tanggal_pelaksanaan]", formData.tanggal_pelaksanaan);
  data.append("record[tempat_pelaksanaan]", formData.tempat_pelaksanaan || "");
  data.append(
    "record[tanggal_batas_pendaftaran]",
    formData.tanggal_batas_pendaftaran || "",
  );
  data.append("record[tayang]", formData.tayang);
  data.append("record[flash]", formData.flash ? "1" : "0");

  if (formData.poster) {
    data.append("upload_poster", formData.poster);
  } else if (isImageRemoved.value) {
    data.append("record[poster]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_agenda;
      data.append("_method", "PUT");
      await updateAgenda(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addAgenda(data);
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
