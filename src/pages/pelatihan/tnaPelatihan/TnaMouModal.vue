<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    size="lg"
    @close="closeModal"
    @save="submitForm"
    :show-save-button="!isDetailMode"
    :show-cancel-button="true"
  >
    <div v-if="isLoadingData" class="text-center p-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Memuat data...</p>
    </div>
    <div v-else>
      <form @submit.prevent="submitForm" v-if="!isDetailMode">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label fw-semibold">Tahun TNA</label>
            <input
              type="text"
              class="form-control"
              :value="tnaDetails.tahun"
              readonly
              disabled
            />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Perusahaan</label>
            <input
              type="text"
              class="form-control"
              :value="tnaDetails.nama_perusahaan || formData.id_perusahaan"
              readonly
              disabled
            />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Organisasi</label>
            <input
              type="text"
              class="form-control"
              :value="tnaDetails.nama_organisasi || formData.id_organisasi"
              readonly
              disabled
            />
          </div>
          <div class="col-md-6">
            <label class="form-label fw-semibold">Lembaga</label>
            <input
              type="text"
              class="form-control"
              :value="tnaDetails.nama_lembaga || formData.id_lembaga"
              readonly
              disabled
            />
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold"
              >Tanggal Mulai MoU <span class="text-danger">*</span></label
            >
            <input
              type="date"
              class="form-control"
              v-model="formData.tanggal_mou_mulai"
              :class="{
                'is-invalid': formErrors.tanggal_mou_mulai,
                'is-valid': wasValidated && !formErrors.tanggal_mou_mulai && formData.tanggal_mou_mulai,
                'shake': isShaking && formErrors.tanggal_mou_mulai
              }"
            />
            <div class="invalid-feedback" v-if="formErrors.tanggal_mou_mulai">
              {{ formErrors.tanggal_mou_mulai }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-semibold"
              >Tanggal Selesai MoU <span class="text-danger">*</span></label
            >
            <input
              type="date"
              class="form-control"
              v-model="formData.tanggal_mou_selesai"
              :class="{
                'is-invalid': formErrors.tanggal_mou_selesai,
                'is-valid': wasValidated && !formErrors.tanggal_mou_selesai && formData.tanggal_mou_selesai,
                'shake': isShaking && formErrors.tanggal_mou_selesai
              }"
            />
            <div class="invalid-feedback" v-if="formErrors.tanggal_mou_selesai">
              {{ formErrors.tanggal_mou_selesai }}
            </div>
          </div>

          <div class="col-md-12">
            <label class="form-label fw-semibold"
              >File MoU
              <span v-if="!mouData" class="text-danger">*</span></label
            >
            <input
              type="file"
              class="form-control"
              @change="handleDocumentUpload"
              accept=".pdf,.doc,.docx"
              :class="{
                'is-invalid': formErrors.file_mou,
                'is-valid': wasValidated && !formErrors.file_mou && (formData.file_mou || mouData),
                'shake': isShaking && formErrors.file_mou
              }"
              ref="documentFileInput"
            />
            <div class="form-text">
              Unggah file dokumen MoU (PDF/DOC)
              <span v-if="mouData && documentPreviewName" class="d-block">
                *Kosongkan jika tidak ingin mengubah dokumen.
              </span>
            </div>
            <div class="invalid-feedback" v-if="formErrors.file_mou">
              {{ formErrors.file_mou }}
            </div>

            <div v-if="documentPreviewName" class="mt-3">
              <label class="form-label fw-semibold mb-2 small"
                >File Terpilih</label
              >
              <div
                class="d-flex align-items-center justify-content-between p-2 border rounded-3 bg-white shadow-sm transition-all"
                style="border-color: #e9ecef !important"
              >
                <div class="d-flex align-items-center overflow-hidden">
                  <div
                    class="bg-white rounded-3 p-1 me-2 shadow-sm d-flex align-items-center justify-content-center flex-shrink-0"
                    style="width: 36px; height: 36px; border: 1px solid #f1f3f5"
                  >
                    <i
                      :class="
                        documentPreviewName.endsWith('.pdf')
                          ? 'fa fa-file-pdf-o text-danger'
                          : 'fa fa-file-word-o text-primary'
                      "
                      class="fs-5"
                    ></i>
                  </div>
                  <div class="overflow-hidden">
                    <p
                      class="text-truncate fw-semibold mb-0 text-dark"
                      style="font-size: 0.875rem"
                    >
                      {{ documentPreviewName }}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-light text-muted border-0 p-1 rounded-circle hover-danger-bg transition-all ms-2"
                  @click="removeDocument"
                  title="Hapus Dokumen"
                >
                  <i class="fa fa-trash-o fs-6"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div v-else>
        <!-- Detail Mode -->
        <div
          class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
        >
          <h5 class="mb-0">Detail MoU</h5>
          <button
            v-if="isAdmin"
            class="btn btn-warning btn-sm"
            @click="editMou"
            type="button"
          >
            <i class="fa fa-pencil me-1"></i> Edit MoU
          </button>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Tahun TNA</label>
            <p class="fw-medium">{{ mouData.tna?.tahun || "-" }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Tanggal Mulai MoU</label>
            <p class="fw-medium">{{ formatDate(mouData.tanggal_mou_mulai) }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Tanggal Selesai MoU</label>
            <p class="fw-medium">{{ formatDate(mouData.tanggal_mou_selesai) }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Perusahaan</label>
            <p class="fw-medium">
              {{ mouData.perusahaan?.nama_perusahaan || "-" }}
            </p>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Organisasi</label>
            <p class="fw-medium">{{ mouData.fklpi?.nama_organisasi || "-" }}</p>
          </div>
          <div class="col-md-6">
            <label class="form-label text-muted small mb-1">Lembaga</label>
            <p class="fw-medium">
              {{ mouData["uptp-uptd"]?.nama_lembaga || "-" }}
            </p>
          </div>
          <div class="col-12" v-if="mouData.file_mou">
            <label class="form-label text-muted small mb-1">File MoU</label>
            <div>
              <a
                :href="getFileUrl(mouData.file_mou)"
                target="_blank"
                class="btn btn-sm btn-outline-primary"
              >
                <i class="fa fa-download me-1"></i> Unduh Dokumen MoU
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseFormModal>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { getMou, addMou, updateMou } from "@/services/general/pelatihan/mou";
import { getDetailTna } from "@/services/general/website/tna";
import { useToast } from "vue-toastification";
import { userLevelAdministrator } from "@/constants/userLevels";

const props = defineProps({
  tnaItem: { type: Object, required: true },
});

const emit = defineEmits(["close", "save-successful"]);

const toast = useToast();

const isLoading = ref(false);
const isLoadingData = ref(true);
const isDetailMode = ref(false);
const isAdmin = ref(false);
const wasValidated = ref(false);
const isShaking = ref(false);

const documentPreviewName = ref(null);
const documentFileInput = ref(null);
const isDocumentRemoved = ref(false);

function editMou() {
  isDetailMode.value = false;
  formData.tanggal_mou_mulai = mouData.value?.tanggal_mou_mulai || "";
  formData.tanggal_mou_selesai = mouData.value?.tanggal_mou_selesai || "";
}

const tnaDetails = reactive({
  tahun: "-",
  nama_perusahaan: "-",
  nama_organisasi: "-",
  nama_lembaga: "-",
});

const formData = reactive({
  id_tna: "",
  id_perusahaan: "",
  id_organisasi: "",
  id_lembaga: "",
  tanggal_mou_mulai: "",
  tanggal_mou_selesai: "",
  file_mou: null,
});

const formErrors = reactive({
  tanggal_mou_mulai: "",
  tanggal_mou_selesai: "",
  file_mou: "",
});

const mouData = ref(null);

const modalTitle = computed(() => {
  if (mouData.value && !isDetailMode.value) return "Edit Data MoU";
  return isDetailMode.value ? "Detail MoU TNA" : "Input Data MoU";
});

// === Helper ===
function getFilenameFromUrl(url) {
  if (!url) return null;
  try {
    const path = new URL(url).pathname;
    const filename = path.substring(path.lastIndexOf("/") + 1);
    return decodeURIComponent(filename);
  } catch (e) {
    return url;
  }
}

onMounted(async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.data?.[0]?.id_peran === userLevelAdministrator) {
      isAdmin.value = true;
    }
  } catch (e) {
    console.error("Gagal membaca profil pengguna", e);
  }
  await fetchData();
});

async function fetchData() {
  isLoadingData.value = true;
  try {
    const idTna = props.tnaItem.id_tna;

    let tnaRecord = {};
    try {
      const tnaRes = await getDetailTna(idTna);
      tnaRecord = tnaRes.data?.data || {};
    } catch (e) {
      console.warn("Gagal mengambil detail TNA", e);
    }

    formData.id_tna = idTna;
    formData.id_perusahaan =
      tnaRecord.id_perusahaan || props.tnaItem.id_perusahaan || "";
    formData.id_organisasi = tnaRecord.id_organisasi || "";
    formData.id_lembaga = tnaRecord.id_lembaga || "";

    tnaDetails.tahun = tnaRecord.tahun || props.tnaItem.tahun || "-";
    tnaDetails.nama_perusahaan =
      tnaRecord.perusahaan?.nama_perusahaan ||
      props.tnaItem.nama_perusahaan ||
      "";
    tnaDetails.nama_organisasi = tnaRecord.organisasi?.nama_organisasi || "";
    tnaDetails.nama_lembaga = tnaRecord.lembaga?.nama_lembaga || "";

    // 2. Check if MoU exists
    try {
      const mouRes = await getMou({ filter: `id_tna=${idTna}` });
      const mouList = Array.isArray(mouRes.data)
        ? mouRes.data[0]?.data
        : mouRes.data?.data;

      if (mouList && mouList.length > 0) {
        isDetailMode.value = true;
        mouData.value = mouList[0];
        formData.tanggal_mou_mulai = mouData.value.tanggal_mou_mulai || "";
        formData.tanggal_mou_selesai = mouData.value.tanggal_mou_selesai || "";
        documentPreviewName.value = getFilenameFromUrl(mouData.value.file_mou);
      } else {
        isDetailMode.value = false;
        documentPreviewName.value = null;
      }
    } catch (e) {
      console.error("Error fetching mou details for TNA:", e);
    }
  } catch (error) {
    console.error("Error in fetching process:", error);
    toast.error("Gagal memuat data");
  } finally {
    isLoadingData.value = false;
  }
}

function getFileUrl(path) {
  if (!path) return "#";

  if (path.startsWith("http")) {
    return path;
  }

  return `/${path}`.replace(/\/{2,}/g, "/");
}

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

function handleDocumentUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    formData.file_mou = null;
    documentPreviewName.value = mouData.value
      ? getFilenameFromUrl(mouData.value.file_mou)
      : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.file_mou = "";
    return;
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung (Hanya PDF/DOC/DOCX).");
    resetToOriginal();
    formErrors.file_mou = "Format file tidak didukung.";
    return;
  }

  try {
    formData.file_mou = file;
    documentPreviewName.value = file.name;
    formErrors.file_mou = "";
    isDocumentRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses dokumen: " + error.message);
    resetToOriginal();
    formErrors.file_mou = "Gagal memproses dokumen.";
  }
}

function removeDocument() {
  if (documentFileInput.value) {
    documentFileInput.value.value = null;
  }
  formData.file_mou = null;

  if (mouData.value && mouData.value.file_mou) {
    const currentName = documentPreviewName.value;
    const originalName = getFilenameFromUrl(mouData.value.file_mou);

    if (currentName === originalName && !isDocumentRemoved.value) {
      documentPreviewName.value = null;
      isDocumentRemoved.value = true;
    } else {
      documentPreviewName.value = originalName;
      isDocumentRemoved.value = false;
    }
  } else {
    documentPreviewName.value = null;
    isDocumentRemoved.value = false;
  }
}

function validateForm() {
  let isValid = true;
  formErrors.tanggal_mou_mulai = "";
  formErrors.tanggal_mou_selesai = "";
  formErrors.file_mou = "";

  if (!formData.tanggal_mou_mulai) {
    formErrors.tanggal_mou_mulai = "Tanggal Mulai MoU wajib diisi";
    isValid = false;
  }
  if (!formData.tanggal_mou_selesai) {
    formErrors.tanggal_mou_selesai = "Tanggal Selesai MoU wajib diisi";
    isValid = false;
  } else if (
    formData.tanggal_mou_mulai &&
    new Date(formData.tanggal_mou_selesai) < new Date(formData.tanggal_mou_mulai)
  ) {
    formErrors.tanggal_mou_selesai =
      "Tanggal Selesai tidak boleh sebelum Tanggal Mulai";
    isValid = false;
  }
  if (!formData.file_mou && !mouData.value) {
    formErrors.file_mou = "File MoU wajib diunggah";
    isValid = false;
  }

  return isValid;
}

async function submitForm() {
  if (isDetailMode.value) return;

  if (!validateForm()) {
    isShaking.value = true;
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    return;
  }

  wasValidated.value = true;
  isLoading.value = true;
  try {
    const payload = new FormData();
    payload.append("record[id_tna]", formData.id_tna);
    payload.append("record[tanggal_mou_mulai]", formData.tanggal_mou_mulai);
    payload.append("record[tanggal_mou_selesai]", formData.tanggal_mou_selesai);
    if (formData.id_perusahaan)
      payload.append("record[id_perusahaan]", formData.id_perusahaan);
    if (formData.id_organisasi)
      payload.append("record[id_organisasi]", formData.id_organisasi);
    if (formData.id_lembaga)
      payload.append("record[id_lembaga]", formData.id_lembaga);

    if (formData.file_mou) {
      payload.append("upload_file_mou", formData.file_mou);
    } else if (isDocumentRemoved.value) {
      payload.append("record[file_mou]", "");
    }

    if (mouData.value && mouData.value.id_mou) {
      payload.append("_method", "PUT");
      await updateMou(mouData.value.id_mou, payload);
      toast.success("Data MoU berhasil diperbarui");
    } else {
      await addMou(payload);
      toast.success("Data MoU berhasil disimpan");
    }

    emit("save-successful");
  } catch (error) {
    console.error("Error saving MoU:", error);
    toast.error("Gagal menyimpan data MoU");
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  wasValidated.value = false;
  isShaking.value = false;
  emit("close");
}
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.hover-danger-bg:hover {
  background-color: #fff5f5 !important;
  color: #dc3545 !important;
  transform: scale(1.1);
}

.bg-light {
  background-color: #f8fafc !important;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.rounded-3 {
  border-radius: 0.75rem !important;
}

.shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
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
</style>
