<template>
  <div class="step-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0 text-primary">Riwayat Pangkat</h6>
      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        @click="addItem"
      >
        <i class="fa fa-plus me-1"></i> Tambah Pangkat
      </button>
    </div>

    <div
      v-if="modelValue.length === 0"
      class="text-center p-5 border rounded bg-light text-muted"
    >
      <i class="fa fa-star fs-3 mb-2 d-block"></i>
      <span>Belum ada data pangkat.</span>
    </div>

    <div v-else class="accordion">
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
            <span class="badge bg-secondary me-2">#{{ index + 1 }}</span>
            <span class="fw-semibold">{{
              getRankName(item.idpangkat) || "Pangkat Baru"
            }}</span>
          </button>
        </h2>
        <div class="accordion-collapse collapse" :class="{ show: item.isOpen }">
          <div class="accordion-body bg-white">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label small fw-semibold"
                  >Pangkat / Golongan <span class="text-danger">*</span></label
                >
                <select
                  class="form-select form-select-sm"
                  v-model="item.idpangkat"
                  :class="{ 'is-invalid': errors[index]?.idpangkat }"
                >
                  <option value="" disabled>Pilih Pangkat</option>
                  <option
                    v-for="opt in rankOptions"
                    :key="opt.idpangkat"
                    :value="opt.idpangkat"
                  >
                    {{ opt.pangkat }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ errors[index]?.idpangkat }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-semibold"
                  >Tgl Mulai <span class="text-danger">*</span></label
                >
                <input
                  type="date"
                  class="form-control form-control-sm"
                  v-model="item.tglmulai"
                  :class="{ 'is-invalid': errors[index]?.tglmulai }"
                />
                <div class="invalid-feedback">
                  {{ errors[index]?.tglmulai }}
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-semibold">Tgl Selesai</label>
                <input
                  type="date"
                  class="form-control form-control-sm"
                  v-model="item.tglselesai"
                  :disabled="item.status === 'Aktif'"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-semibold">Status</label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="item.status"
                    true-value="Aktif"
                    false-value="Tidak Aktif"
                  />
                  <label class="form-check-label">{{ item.status }}</label>
                </div>
              </div>

              <div class="col-12">
                <label class="form-label small fw-semibold">File SK</label>
                <input
                  type="file"
                  class="form-control form-control-sm"
                  @change="(e) => handleFile(e, index)"
                  accept=".pdf,.jpg"
                />
                <div v-if="item.filesk && !item.fileRaw" class="mt-1">
                  <small class="text-success">File tersimpan.</small>
                </div>
              </div>

              <div class="col-12 text-end mt-2 pt-2 border-top">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeItem(index)"
                >
                  Hapus
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
import { ref, onMounted } from "vue";
import * as yup from "yup";
import { getRanks } from "@/services/referensi/ranks";
import { getUserRanks } from "@/services/general/personnel/userRanks";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  currentUserId: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const rankOptions = ref([]);
const errors = ref([]);
const isLoaded = ref(false);

const itemSchema = yup.object().shape({
  idpangkat: yup.string().required("Pangkat wajib dipilih"),
  tglmulai: yup.string().required("Tanggal mulai wajib diisi"),
});

onMounted(() => {
  fetchOptions();
  if (props.currentUserId) loadData(props.currentUserId);
});

async function fetchOptions() {
  try {
    const res = await getRanks({ limit: 100 });
    rankOptions.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (e) {
    console.error(e);
  }
}

const loadData = async (userId) => {
  if (!userId || isLoaded.value) return;
  try {
    const res = await getUserRanks({ id_pengguna: userId });
    const apiData = (
      Array.isArray(res.data) ? res.data : res.data.data || []
    ).map((d) => ({
      idpenggunapangkat: d.idpenggunapangkat,
      idpangkat: d.idpangkat,
      tglmulai: d.tglmulai,
      tglselesai: d.tglselesai,
      status: d.status,
      filesk: d.filesk,
      isOpen: false,
      fileRaw: null,
    }));
    emit("update:modelValue", [...apiData, ...props.modelValue]);
    isLoaded.value = true;
  } catch (e) {
    console.error(e);
  }
};

function getRankName(id) {
  const found = rankOptions.value.find((x) => x.idpangkat === id);
  return found ? found.pangkat : "";
}

function addItem() {
  emit("update:modelValue", [
    ...props.modelValue,
    {
      idpangkat: "",
      tglmulai: "",
      tglselesai: "",
      status: "Aktif",
      fileRaw: null,
      isOpen: true,
    },
  ]);
}

function removeItem(index) {
  const l = [...props.modelValue];
  l.splice(index, 1);
  emit("update:modelValue", l);
  errors.value.splice(index, 1);
}

function toggleItem(i) {
  props.modelValue[i].isOpen = !props.modelValue[i].isOpen;
}
function handleFile(e, i) {
  props.modelValue[i].fileRaw = e.target.files[0];
}

async function validate() {
  errors.value = [];
  let valid = true;
  for (let i = 0; i < props.modelValue.length; i++) {
    try {
      await itemSchema.validate(props.modelValue[i], { abortEarly: false });
      errors.value[i] = {};
    } catch (err) {
      valid = false;
      const o = {};
      err.inner.forEach((e) => (o[e.path] = e.message));
      errors.value[i] = o;
      props.modelValue[i].isOpen = true;
    }
  }
  return valid;
}

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
</style>
