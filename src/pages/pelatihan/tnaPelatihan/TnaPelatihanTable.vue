<template>
  <BaseTable
    title="Daftar TNA"
    entityName="TNA"
    :apiService="tnaKbjiApi"
    :FormModalComponent="TnaPelatihanFormModal"
    :columns="columns"
    primaryKey="id_tna"
    deleteItemNameKey="tahun"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="desc"
    deleteNote="<div class='mt-2 small text-muted'>Ini juga akan menghapus MoU nya.</div>"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterKodeKbji" class="form-label text-dark fw-semibold"
            >Nama Profesi</label
          >
          <input
            type="text"
            id="filterKodeKbji"
            class="form-control"
            v-model="filters.nama_kbji"
            placeholder="Masukkan nama profesi"
          />
        </div>
        <div class="col-md-4">
          <label for="filterTahun" class="form-label text-dark fw-semibold"
            >Tahun</label
          >
          <input
            type="text"
            id="filterTahun"
            class="form-control"
            v-model="filters.tahun"
            placeholder="Masukkan tahun"
          />
        </div>
        <div class="col-md-4">
          <label for="filterPerusahaan" class="form-label text-dark fw-semibold"
            >Perusahaan</label
          >
          <input
            type="text"
            id="filterPerusahaan"
            class="form-control"
            v-model="filters.nama_perusahaan"
            placeholder="Masukkan nama perusahaan"
          />
        </div>
      </div>
    </template>

    <template #cell(tahun)="{ item }">
      {{ item.tahun || "-" }}
    </template>

    <template #cell(nama_perusahaan)="{ item }">
      {{ item.nama_perusahaan || "-" }}
    </template>

    <template #cell(kbji_jumlah)="{ item }">
      <div v-if="item.kbjiList && item.kbjiList.length > 0">
        <div
          v-for="(kbji, idx) in item.kbjiList"
          :key="idx"
          class="d-flex align-items-center mb-1"
          :class="{ 'mb-0': idx === item.kbjiList.length - 1 }"
        >
          <div class="d-flex align-items-center">
            <button
              class="kbji-icon-btn d-flex align-items-center justify-content-center bg-primary text-white rounded me-2 flex-shrink-0 border-0"
              @click="openProgramModal(kbji.kode_kbji)"
              title="Lihat Program Pelatihan"
            >
              <i class="fa fa-list-ul"></i>
            </button>
            <span class="me-2">{{ kbji.kode_kbji }} - {{ kbji.nama_kbji }}</span>
            <span class="kbji-badge-pill badge rounded-pill bg-light border px-2">
              {{ kbji.jumlah }}
            </span>
          </div>
        </div>
      </div>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(mou)="{ item }">
      <button
        class="btn btn-sm btn-outline-primary"
        @click="openMouModal(item)"
        title="Kelola Data MoU"
      >
        <i class="fa fa-file-pdf-o"></i>
      </button>
    </template>
  </BaseTable>

  <TnaMouModal
    v-if="isMouModalVisible"
    :tna-item="selectedTnaItem"
    @close="handleMouModalClose"
    @save-successful="handleMouModalClose"
  />

  <!-- Modal Program Pelatihan -->
  <BaseFormModal
    v-if="isProgramModalVisible"
    title="Program Pelatihan Terkait"
    size="lg"
    :show-save-button="false"
    @close="closeProgramModal"
  >
    <ProgramPelatihanModal
      :kode-kbji="selectedKodeKbji"
      :is-read-only="true"
      :no-card="true"
    />
  </BaseFormModal>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import {
  getTnaKBJI,
  deleteTnaKBJI,
} from "@/services/general/pelatihan/tnaKBJI";
import { deleteTna } from "@/services/general/website/tna";
import { getMou, deleteMou } from "@/services/general/pelatihan/mou";

const TnaPelatihanFormModal = defineAsyncComponent(() =>
  import("./TnaPelatihanFormModal.vue"),
);

const TnaMouModal = defineAsyncComponent(() => import("./TnaMouModal.vue"));
const BaseFormModal = defineAsyncComponent(() => import("@/components/base/BaseFormModal.vue"));
const ProgramPelatihanModal = defineAsyncComponent(() => import("./programPelatihan/ProgramPelatihanModal.vue"));

const isMouModalVisible = ref(false);
const isProgramModalVisible = ref(false);
const selectedTnaItem = ref(null);
const selectedKodeKbji = ref("");

function openProgramModal(kode) {
  selectedKodeKbji.value = kode;
  isProgramModalVisible.value = true;
}

function closeProgramModal() {
  isProgramModalVisible.value = false;
  selectedKodeKbji.value = "";
}

function openMouModal(item) {
  selectedTnaItem.value = item;
  isMouModalVisible.value = true;
}

function handleMouModalClose() {
  isMouModalVisible.value = false;
  selectedTnaItem.value = null;
}

async function getGroupedTnaKBJI(params) {
  const res = await getTnaKBJI(params);
  const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
  const data = responseData?.data || [];

  const grouped = {};
  data.forEach((item) => {
    const key = item.id_tna;
    if (!grouped[key]) {
      grouped[key] = {
        id_tna: item.id_tna,
        tahun: item.tna?.tahun || "",
        id_perusahaan:
          item.tna?.id_perusahaan || item.perusahaan?.id_perusahaan || "",
        nama_perusahaan: item.perusahaan?.nama_perusahaan || "",
        kbjiList: [],
        _kbjiIds: [],
      };
    }
    if (item.kode_kbji) {
      grouped[key].kbjiList.push({
        id_tna_kbji: item.id_tna_kbji,
        kode_kbji: item.kode_kbji,
        nama_kbji: item.kbji?.nama_kbji || "",
        jumlah: item.jumlah || "0",
        tanggal_batas: item.tanggal_batas || "",
        deskripsi_pekerjaan: item.deskripsi_pekerjaan || "",
        persyaratan_minimum: item.persyaratan_minimum || "",
      });
    }
    grouped[key]._kbjiIds.push(item.id_tna_kbji);
  });

  const groupedArray = Object.values(grouped);

  if (Array.isArray(res.data)) {
    res.data[0].data = groupedArray;
    if (res.data[0].meta?.pagination) {
      res.data[0].meta.pagination.total = groupedArray.length;
    }
  } else if (res.data) {
    res.data.data = groupedArray;
  }

  return res;
}

async function deleteGroupedTnaKBJI(idTna) {
  try {
    const mouRes = await getMou({
      filter: `id_tna=${idTna}`,
      limit: 100,
    });
    const mouData = Array.isArray(mouRes.data) ? mouRes.data[0] : mouRes.data;
    const mous = mouData?.data || [];
    for (const mou of mous) {
      await deleteMou(mou.id_mou);
    }
  } catch (err) {
    console.error("Gagal menghapus MoU terkait:", err);
  }

  const res = await getTnaKBJI({
    filter: `id_tna=${idTna}`,
    limit: 100,
  });
  const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
  const kbjiItems = responseData?.data || [];

  for (const item of kbjiItems) {
    await deleteTnaKBJI(item.id_tna_kbji);
  }

  await deleteTna(idTna);
}

const tnaKbjiApi = {
  get: getGroupedTnaKBJI,
  delete: deleteGroupedTnaKBJI,
};

const columns = [
  { key: "tahun", label: "Tahun", sortable: true },
  { key: "nama_perusahaan", label: "Perusahaan", sortable: true },
  { key: "kbji_jumlah", label: "Profesi (Jumlah)", sortable: false },
  {
    key: "mou",
    label: "MoU",
    sortable: false,
    thClass: "text-center",
    tdClass: "text-center",
  },
];

const initialFilters = {
  nama_kbji: "",
  tahun: "",
  nama_perusahaan: "",
};
</script>

<style scoped>
.kbji-icon-btn {
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.kbji-icon-btn:hover {
  background-color: #0b5ed7 !important;
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kbji-badge-pill {
  color: #124373;
  border-color: #124373 !important;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: default;
}

.kbji-badge-pill:hover {
  background-color: #124373 !important;
  color: white !important;
  transform: translateY(-1px);
}

.kbji-entry {
  padding: 2px 0;
  line-height: 1.5;
}
</style>
