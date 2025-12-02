<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="userForm">
      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-label fw-semibold"
            >Nama Lengkap <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control"
            v-model="formData.nama"
            :class="{ 'is-invalid': formErrors.nama }"
            placeholder="Nama lengkap"
            required
          />
          <div class="invalid-feedback">{{ formErrors.nama }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Gelar Depan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.gelardepan"
            placeholder="Dr."
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Gelar Belakang</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.gelarbelakang"
            placeholder="S.Kom"
          />
        </div>

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">NIK</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nik"
            placeholder="Nomor Induk Kependudukan"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Email <span class="text-danger">*</span></label
          >
          <input
            type="email"
            class="form-control"
            v-model="formData.email"
            :class="{ 'is-invalid': formErrors.email }"
            placeholder="email@instansi.go.id"
            required
          />
          <div class="invalid-feedback">{{ formErrors.email }}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">No. Telepon</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.telp"
            placeholder="08xxxxxxxx"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">NIP</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nip"
            placeholder="NIP"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">No. Karpeg</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.no_karpeg"
            placeholder="Kartu Pegawai"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Level / Role <span class="text-danger">*</span></label
          >
          <select
            class="form-select"
            v-model="formData.idlevel"
            :class="{ 'is-invalid': formErrors.idlevel }"
            required
          >
            <option value="" disabled>Pilih Level</option>
            <option
              v-for="role in roleOptions"
              :key="role.idlevel"
              :value="role.idlevel"
            >
              {{ role.namalevel }}
            </option>
          </select>
          <div class="invalid-feedback">{{ formErrors.idlevel }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold d-block">Status Akun</label>
          <div class="form-check form-switch mt-2">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="statusSwitch"
              v-model="formData.status"
              true-value="Aktif"
              false-value="Tidak Aktif"
            />
            <label class="form-check-label" for="statusSwitch">
              {{ formData.status || "Tidak Aktif" }}
            </label>
          </div>
          <div class="invalid-feedback d-block" v-if="formErrors.status">
            {{ formErrors.status }}
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tempat Lahir</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tempatlahir"
            placeholder="Kota kelahiran"
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tanggal Lahir</label>
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggallahir"
          />
        </div>

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">Alamat Lengkap</label>
          <textarea
            class="form-control"
            v-model="formData.alamat"
            placeholder="Alamat domisili"
          ></textarea>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Provinsi</label>
          <select
            class="form-select"
            v-model="formData.kodepropinsi"
            :disabled="regionsLoading"
          >
            <option value="" disabled>
              {{ regionsLoading ? "Memuat..." : "Pilih Provinsi" }}
            </option>
            <template v-if="!regionsLoading">
              <option
                v-for="prov in provinceOptions"
                :key="prov.idwilayah"
                :value="prov.kodewilayah"
              >
                {{ prov.kodewilayah }} - {{ prov.namawilayah }}
              </option>
            </template>
          </select>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Kabupaten</label>
          <select
            class="form-select"
            v-model="formData.kodekabupaten"
            :disabled="!formData.kodepropinsi || kabupatenLoading"
          >
            <option value="" disabled>
              {{
                kabupatenLoading
                  ? "Memuat..."
                  : formData.kodepropinsi
                  ? "Pilih Kabupaten"
                  : "Silakan pilih Provinsi terlebih dahulu"
              }}
            </option>
            <template v-if="!kabupatenLoading">
              <option
                v-for="kab in kabupatenOptions"
                :key="kab.idwilayah"
                :value="kab.kodewilayah"
              >
                {{ kab.kodewilayah }} - {{ kab.namawilayah }}
              </option>
            </template>
          </select>
        </div>

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">Upload Foto</label>
          <input
            type="file"
            class="form-control"
            @change="handlePhotoUpload"
            accept="image/*"
            :class="{ 'is-invalid': formErrors.foto }"
            ref="fileInput"
          />
          <div class="invalid-feedback">{{ formErrors.foto }}</div>
          <small v-if="isEditMode" class="form-text text-muted"
            >Kosongkan jika tidak ingin mengubah foto.</small
          >

          <div
            class="mt-3"
            v-if="photoPreviewUrl || (isEditMode && formData.foto)"
          >
            <div class="position-relative d-inline-block">
              <div v-if="photoPreviewUrl">
                <img
                  :src="photoPreviewUrl"
                  alt="Preview Foto Baru"
                  class="img-thumbnail shadow-sm"
                  style="
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    background-color: #f8f9fa;
                  "
                />
              </div>
              <div v-else-if="isEditMode && formData.foto">
                <img
                  :src="formData.foto"
                  alt="Foto Saat Ini"
                  class="img-thumbnail shadow-sm"
                  style="
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    background-color: #f8f9fa;
                  "
                />
              </div>

              <button
                type="button"
                class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                style="
                  width: 24px;
                  height: 24px;
                  padding: 0;
                  border: 2px solid white;
                "
                @click="removePhoto"
                title="Hapus Foto"
              >
                <i class="fa fa-times" style="font-size: 12px"></i>
              </button>
            </div>
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
import { addUser, updateUser } from "@/services/referensi/users";
import { getRoles } from "@/services/referensi/roles";
import { getRegions } from "@/services/referensi/regions";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from "@/utils/imageCompressor";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pengguna" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const roleOptions = ref([]);
const rolesLoading = ref(false);
const provinceOptions = ref([]);
const kabupatenOptions = ref([]);
const regionsLoading = ref(false);
const kabupatenLoading = ref(false);

const formData = reactive({
  idlevel: "",
  email: "",
  // password: "",
  nama: "",
  gelardepan: "",
  gelarbelakang: "",
  nik: "",
  telp: "",
  tempatlahir: "",
  tanggallahir: "",
  alamat: "",
  kodepropinsi: "",
  kodekabupaten: "",
  nip: "",
  no_karpeg: "",
  status: "Aktif",
  foto: null,
});

const formErrors = reactive({
  idlevel: "",
  email: "",
  // password: "",
  nama: "",
  foto: "",
  status: "",
});

const selectedPhotoFile = ref(null);
const photoPreviewUrl = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi."),
  email: yup
    .string()
    .email("Format email salah")
    .required("Email wajib diisi."),
  idlevel: yup.string().required("Level wajib dipilih."),
  status: yup.string().required("Status wajib dipilih."),
  // password: yup
  //   .string()
  //   .test("required-on-create", "Password wajib diisi", function (value) {
  //     if (!props.fieldToEdit && !value) return false;
  //     return true;
  //   }),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Lifecycle ===
onMounted(() => {
  fetchRolesData();
  fetchProvinces();
});

onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
});

async function fetchRolesData() {
  rolesLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namalevel",
      dir: "asc",
    };

    const response = await getRoles(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        roleOptions.value = response.data[0].data;
      } else {
        roleOptions.value = response.data;
      }
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      roleOptions.value = response.data.data;
    } else {
      console.warn("Struktur data role tidak terduga:", response.data);
      roleOptions.value = [];
    }
  } catch (error) {
    console.error("Gagal memuat data roles:", error);
    toast.error("Gagal memuat daftar level/role.");
  } finally {
    rolesLoading.value = false;
  }
}

async function fetchProvinces() {
  regionsLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 100,
      sort: "kodewilayah",
      dir: "asc",
      filter: "tipewilayah=A",
    };

    const response = await getRegions(params);
    if (response.data && Array.isArray(response.data)) {
      const rootData = response.data[0];
      if (rootData.data) {
        provinceOptions.value = rootData.data;
      }
    } else if (response.data && response.data.data) {
      provinceOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal memuat data provinsi:", error);
    toast.error("Gagal memuat daftar provinsi.");
  } finally {
    regionsLoading.value = false;
  }
}

async function fetchKabupaten(provCode) {
  if (!provCode) {
    kabupatenOptions.value = [];
    return;
  }
  kabupatenLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 500,
      sort: "kodewilayah",
      dir: "asc",
      filter: `tipewilayah=B,kodewilayah=${provCode}`,
    };

    const response = await getRegions(params);
    if (response.data && Array.isArray(response.data)) {
      const rootData = response.data[0];
      if (rootData.data) {
        kabupatenOptions.value = rootData.data;
      }
    } else if (response.data && response.data.data) {
      kabupatenOptions.value = response.data.data;
    }

    // Fix for mismatched data formats (e.g. "3201" vs "32.01")
    if (formData.kodekabupaten && kabupatenOptions.value.length > 0) {
      const currentVal = String(formData.kodekabupaten);
      const exists = kabupatenOptions.value.some(
        (k) => k.kodewilayah === currentVal
      );

      if (!exists) {
        // Try to match by removing dots
        const cleanCurrent = currentVal.replace(/\./g, "");
        const match = kabupatenOptions.value.find(
          (k) => k.kodewilayah.replace(/\./g, "") === cleanCurrent
        );
        if (match) {
          formData.kodekabupaten = match.kodewilayah;
        }
      }
    }
  } catch (error) {
    console.error("Gagal memuat data kabupaten:", error);
    toast.error("Gagal memuat daftar kabupaten.");
  } finally {
    kabupatenLoading.value = false;
  }
}

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    selectedPhotoFile.value = null;
    if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = null;
    isPhotoRemoved.value = false;
    if (fileInput.value) fileInput.value.value = null;

    if (newData) {
      formData.idlevel = newData.idlevel;
      formData.email = newData.email;
      // formData.password = "";
      formData.nama = newData.nama;
      formData.telp = newData.telp;
      formData.nik = newData.nik;
      formData.gelardepan = newData.gelardepan;
      formData.gelarbelakang = newData.gelarbelakang;
      formData.alamat = newData.alamat;
      formData.kodekabupaten = newData.kodekabupaten;
      if (newData.kodekabupaten) {
        const kode = String(newData.kodekabupaten);
        formData.kodepropinsi = kode.includes(".")
          ? kode.split(".")[0]
          : kode.substring(0, 2);

        // Explicitly fetch kabupaten to ensure options are loaded
        fetchKabupaten(formData.kodepropinsi);
      } else {
        formData.kodepropinsi = "";
      }
      formData.nip = newData.nip;
      formData.no_karpeg = newData.no_karpeg;
      formData.tempatlahir = newData.tempatlahir;
      formData.tanggallahir = newData.tanggallahir;
      formData.foto = newData.foto;
      formData.status = newData.status || "Aktif";
    } else {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      formData.status = "Aktif";
      formData.foto = null;
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true }
);

watch(
  () => formData.kodepropinsi,
  (newProv) => {
    if (!newProv) {
      formData.kodekabupaten = "";
      kabupatenOptions.value = [];
      return;
    }
    // Jika ganti provinsi, reset kabupaten
    if (formData.kodekabupaten && !formData.kodekabupaten.startsWith(newProv)) {
      formData.kodekabupaten = "";
    }
    fetchKabupaten(newProv);
  }
);

// ===  Methods ===
function closeModal() {
  emit("close");
}

function handleError(error) {
  errorMessage.value = error.response?.data?.message || "Gagal menyimpan data.";
  toast.error(errorMessage.value);
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = isEditMode.value ? formData.foto : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.foto = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.foto = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    selectedPhotoFile.value = compressedFile;
    photoPreviewUrl.value = URL.createObjectURL(compressedFile);

    formErrors.foto = "";
    isPhotoRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.foto = "Gagal memproses gambar.";
  } finally {
    isLoading.value = false;
  }
}

function removePhoto() {
  const isBlobPreview =
    photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:");

  if (isBlobPreview) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  selectedPhotoFile.value = null;

  if (isEditMode.value && formData.foto) {
    if (!isBlobPreview) {
      photoPreviewUrl.value = null;
      formData.foto = null;
      isPhotoRemoved.value = true;
    } else {
      photoPreviewUrl.value = null;
      isPhotoRemoved.value = false;
    }
  } else {
    photoPreviewUrl.value = null;
    isPhotoRemoved.value = false;
  }
}

async function validateForm() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    return false;
  }
}

async function submitForm() {
  if (!(await validateForm())) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();

  data.append("record[idlevel]", formData.idlevel);
  data.append("record[email]", formData.email);
  data.append("record[nama]", formData.nama);
  data.append("record[telp]", formData.telp || "");
  data.append("record[nik]", formData.nik || "");
  data.append("record[gelardepan]", formData.gelardepan || "");
  data.append("record[gelarbelakang]", formData.gelarbelakang || "");
  data.append("record[alamat]", formData.alamat || "");
  data.append("record[kodekabupaten]", formData.kodekabupaten || "");
  data.append("record[nip]", formData.nip || "");
  data.append("record[no_karpeg]", formData.no_karpeg || "");
  data.append("record[tempatlahir]", formData.tempatlahir || "");
  data.append("record[tanggallahir]", formData.tanggallahir || "");
  data.append("record[status]", formData.status);

  // if (formData.password) {
  //   data.append("record[password]", formData.password);
  // }

  if (selectedPhotoFile.value) {
    data.append(
      "upload_foto",
      selectedPhotoFile.value,
      selectedPhotoFile.value.name
    );
  } else if (isPhotoRemoved.value) {
    data.append("record[foto]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idpengguna;
      data.append("_method", "PUT");
      await updateUser(fieldId, data);
      toast.success(`Data berhasil diperbarui`);
    } else {
      await addUser(data);
      toast.success(`Data berhasil ditambah`);
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
