<template>
  <div class="step-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0 text-primary">Riwayat Pendidikan</h6>
      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        @click="addItem"
      >
        <i class="fa fa-plus me-1"></i> Tambah Data
      </button>
    </div>

    <div
      v-if="modelValue.length === 0"
      class="text-center p-5 border rounded bg-light text-muted"
    >
      <i class="fa fa-graduation-cap fs-3 mb-2 d-block"></i>
      <span
        >Belum ada data pendidikan. Klik tombol <b>Tambah Data</b> untuk
        mengisi.</span
      >
    </div>

    <div v-else class="accordion" id="accordionPendidikan">
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="accordion-item mb-3 border shadow-sm"
      >
        <h2 class="accordion-header">
          <button
            class="accordion-button"
            :class="{ collapsed: !item.isOpen }"
            type="button"
            @click="toggleItem(index)"
          >
            <div
              class="d-flex w-100 justify-content-between align-items-center pe-3"
            >
              <span>
                <span class="badge bg-secondary me-2">#{{ index + 1 }}</span>
                <span class="fw-semibold">{{
                  item.namaperguruantinggi || "Pendidikan Baru"
                }}</span>
                <span v-if="item.tahunlulus" class="text-muted small ms-2"
                  >({{ item.tahunlulus }})</span
                >
              </span>
            </div>
          </button>
        </h2>

        <div class="accordion-collapse collapse" :class="{ show: item.isOpen }">
          <div class="accordion-body bg-white">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold"
                  >Jenjang Pendidikan <span class="text-danger">*</span></label
                >
                <select
                  class="form-select form-select-sm"
                  v-model="item.idjenjangpendidikan"
                  :class="{ 'is-invalid': errors[index]?.idjenjangpendidikan }"
                >
                  <option value="" disabled>Pilih Jenjang</option>
                  <option
                    v-for="opt in educationOptions"
                    :key="opt.idjenjangpendidikan"
                    :value="opt.idjenjangpendidikan"
                  >
                    {{ opt.namajenjangpendidikan }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ errors[index]?.idjenjangpendidikan }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label small fw-semibold"
                  >Nama Sekolah / Universitas
                  <span class="text-danger">*</span></label
                >
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="item.namaperguruantinggi"
                  :class="{ 'is-invalid': errors[index]?.namaperguruantinggi }"
                  placeholder="Contoh: Universitas Gadjah Mada"
                />
                <div class="invalid-feedback">
                  {{ errors[index]?.namaperguruantinggi }}
                </div>
              </div>

              <div class="col-md-8">
                <label class="form-label small fw-semibold"
                  >Program Studi / Jurusan</label
                >
                <input
                  type="text"
                  class="form-control form-control-sm"
                  v-model="item.programstudi"
                  placeholder="Contoh: Teknik Informatika"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-semibold"
                  >Tahun Lulus <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control form-control-sm"
                  v-model="item.tahunlulus"
                  placeholder="YYYY"
                  :class="{ 'is-invalid': errors[index]?.tahunlulus }"
                />
                <div class="invalid-feedback">
                  {{ errors[index]?.tahunlulus }}
                </div>
              </div>

              <div class="col-12">
                <label class="form-label small fw-semibold"
                  >Upload Ijazah (PDF/Image)</label
                >
                <input
                  type="file"
                  class="form-control form-control-sm"
                  @change="(e) => handleFile(e, index)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div v-if="item.filesk || item.fileijazah" class="mt-1">
                  <small class="text-success">
                    <i class="fa fa-check-circle me-1"></i>File tersimpan.
                    <a href="#" class="text-decoration-none ms-1">Lihat File</a>
                  </small>
                </div>
              </div>

              <div class="col-12 text-end mt-3 pt-3 border-top">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeItem(index)"
                >
                  <i class="fa fa-trash me-1"></i> Hapus Data Ini
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import * as yup from "yup";
import { getEducationLevels } from "@/services/referensi/educationLevels";
import { getUserEducation } from "@/services/general/personnel/userEducation"; // Asumsi service GET list by user ID

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  currentUserId: { type: String, default: "" }, // Menerima ID User dari Parent
});

const emit = defineEmits(["update:modelValue"]);

// State
const educationOptions = ref([]);
const errors = ref([]);
const isLoaded = ref(false);

// Schema Validasi (Yup)
const itemSchema = yup.object().shape({
  idjenjangpendidikan: yup.string().required("Jenjang wajib dipilih"),
  namaperguruantinggi: yup.string().required("Nama sekolah/PT wajib diisi"),
  tahunlulus: yup
    .number()
    .typeError("Tahun harus berupa angka")
    .required("Tahun lulus wajib diisi")
    .min(1900, "Tahun tidak valid")
    .max(new Date().getFullYear() + 5, "Tahun tidak valid"),
});

// Lifecycle
onMounted(() => {
  fetchOptions();
  // Jika mode Edit User langsung, load data
  if (props.currentUserId) {
    loadData(props.currentUserId);
  }
});

// Methods
async function fetchOptions() {
  try {
    // Sesuaikan dengan response API referensi Anda
    const res = await getEducationLevels({ limit: 100 });
    // Asumsi response: { data: [...] } atau { data: { data: [...] } }
    educationOptions.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (e) {
    console.error("Gagal load referensi pendidikan", e);
  }
}

// Exposed Method: Dipanggil Parent saat Tab Aktif
const loadData = async (userId) => {
  if (!userId || isLoaded.value) return; // Prevent double fetch

  try {
    const res = await getUserEducation({ id_pengguna: userId });
    // Mapping response API ke format local item
    const apiData = (
      Array.isArray(res.data) ? res.data : res.data.data || []
    ).map((d) => ({
      // Mapping field API -> V-Model
      idpenggunapendidikan: d.idpenggunapendidikan, // ID Primary Key (jika edit)
      idjenjangpendidikan: d.idjenjangpendidikan,
      namaperguruantinggi: d.namaperguruantinggi,
      programstudi: d.programstudi,
      tahunlulus: d.tahunlulus,
      fileijazah: d.fileijazah, // URL file lama

      // Internal state
      isOpen: false,
      fileRaw: null,
    }));

    // Gabungkan dengan data yang mungkin sudah diinput user (jika ada)
    const merged = [...apiData, ...props.modelValue];
    emit("update:modelValue", merged);
    isLoaded.value = true;
  } catch (e) {
    console.error("Gagal load riwayat pendidikan", e);
  }
};

function addItem() {
  const newItem = {
    idjenjangpendidikan: "",
    namaperguruantinggi: "",
    programstudi: "",
    tahunlulus: "",
    fileRaw: null,
    isOpen: true, // Auto open item baru
  };
  // Emit immutable update
  emit("update:modelValue", [...props.modelValue, newItem]);
}

function removeItem(index) {
  const newList = [...props.modelValue];
  newList.splice(index, 1);
  emit("update:modelValue", newList);
  // Hapus error terkait index tersebut agar tidak bergeser
  errors.value.splice(index, 1);
}

function toggleItem(index) {
  const item = props.modelValue[index];
  // Mutasi langsung object di dalam array diperbolehkan di Vue Reactivity (selama arraynya reaktif)
  // Tapi lebih aman emit full array update jika strict mode
  item.isOpen = !item.isOpen;
}

function handleFile(event, index) {
  const file = event.target.files[0];
  if (file) {
    props.modelValue[index].fileRaw = file;
  }
}

// Exposed Method: Validasi
async function validate() {
  errors.value = [];
  let isAllValid = true;

  if (props.modelValue.length === 0) return true; // Kosong boleh (skip)? Atau wajib minimal 1? Sesuaikan.

  for (let i = 0; i < props.modelValue.length; i++) {
    try {
      await itemSchema.validate(props.modelValue[i], { abortEarly: false });
      errors.value[i] = {};
    } catch (err) {
      isAllValid = false;
      const errObj = {};
      err.inner.forEach((e) => {
        errObj[e.path] = e.message;
      });
      errors.value[i] = errObj;
      props.modelValue[i].isOpen = true; // Buka accordion yang error
    }
  }
  return isAllValid;
}

// Expose method ke Parent
defineExpose({ validate, loadData });
</script>

<style scoped>
.step-wrapper {
  min-height: 300px;
}
.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0d6efd;
}
.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.125);
}
</style>
