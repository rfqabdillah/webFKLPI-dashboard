<template>
  <BaseTable
    title="Daftar Pegawai"
    entityName="Pegawai"
    :apiService="employmentApi"
    :FormModalComponent="EmploymentFormModal"
    :DetailModalComponent="EmploymentDetailModal"
    :columns="columns"
    primaryKey="idpengguna"
    deleteItemNameKey="nama"
    :initialFilters="initialFilters"
    initialSortColumn="nama"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama"
            placeholder="Masukkan nama pegawai"
          />
        </div>
      </div>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell(foto)="{ item }">
      <img
        v-if="item.foto"
        :src="item.foto"
        alt="Foto"
        style="width: 50px; height: 50px; cursor: pointer; border-radius: 50%"
        @click="showImage(item.foto)"
      />
      <div
        v-else
        class="d-inline-flex align-items-center justify-content-center text-white fw-bold"
        :style="{
          backgroundColor: getRandomColor(item.nama),
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          fontSize: '16px',
        }"
      >
        {{ getInitials(item.nama) }}
      </div>
    </template>

    <template #cell(namaunitkerja)="{ item }">
      <span>{{ getActiveUnitKerja(item) }}</span>
    </template>

    <template #cell(pangkat)="{ item }">
      <span>{{ getActivePangkat(item) }}</span>
    </template>
    <template #cell(namajenjang)="{ item }">
      <span>{{ getActiveJenjang(item) }}</span>
    </template>
  </BaseTable>
  <Teleport to="body">
    <vue-easy-lightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      @hide="hideImage"
    ></vue-easy-lightbox>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { formatDate } from "@/utils/formatDate";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import { getUsers, deleteUser } from "@/services/referensi/users";
import VueEasyLightbox from "vue-easy-lightbox";

const EmploymentFormModal = defineAsyncComponent(() =>
  import("./EmploymentFormModal.vue")
);
const EmploymentDetailModal = defineAsyncComponent(() =>
  import("./EmploymentDetailModal.vue")
);

const employmentApi = {
  get: getUsers,
  delete: deleteUser,
};

const columns = [
  { key: "foto", label: "Foto", sortable: true },
  { key: "nama", label: "Nama", sortable: true },
  { key: "namaunitkerja", label: "Unit Kerja", sortable: true },
  { key: "namajenjang", label: "Jenjang Jabatan", sortable: true },
  { key: "pangkat", label: "Pangkat", sortable: true },
];

const initialFilters = {
  nama: "",
};

const lightboxVisible = ref(false);
const lightboxImgs = ref("");

function showImage(imageUrl) {
  lightboxImgs.value = imageUrl;
  lightboxVisible.value = true;
}

function hideImage() {
  lightboxVisible.value = false;
}

/**
 * Get active unit kerja name
 * 1. Find user-work-unit with statusunitkerja === "Aktif"
 * 2. Get idunitkerja from active item
 * 3. Find matching work-unit and return namaunitkerja
 */
function getActiveUnitKerja(item) {
  const userWorkUnits = item["user-work-units"];
  const workUnits = item["work-units"];

  if (
    !userWorkUnits ||
    !Array.isArray(userWorkUnits) ||
    userWorkUnits.length === 0
  ) {
    return "-";
  }

  // Find the active user work unit
  const activeUserWorkUnit = userWorkUnits.find(
    (uwu) => uwu.statusunitkerja === "Aktif"
  );

  if (!activeUserWorkUnit) {
    // If no active, return the first one's name
    const firstIdUnitKerja = userWorkUnits[0]?.idunitkerja;
    const firstWorkUnit = workUnits?.find(
      (wu) => wu.idunitkerja === firstIdUnitKerja
    );
    return firstWorkUnit?.namaunitkerja || "-";
  }

  // Find the matching work unit reference data
  const matchingWorkUnit = workUnits?.find(
    (wu) => wu.idunitkerja === activeUserWorkUnit.idunitkerja
  );

  return matchingWorkUnit?.namaunitkerja || "-";
}

/**
 * Get active jenjang/jabatan name
 * 1. Find user-level with statusjenjang === "Aktif"
 * 2. Get idjenjang from active item
 * 3. Find matching level and return namajenjang
 */
function getActiveJenjang(item) {
  const userLevels = item["user-levels"];
  const levels = item["level"];

  if (!userLevels || !Array.isArray(userLevels) || userLevels.length === 0) {
    return "-";
  }

  // Find the active user level
  const activeUserLevel = userLevels.find((ul) => ul.statusjenjang === "Aktif");

  if (!activeUserLevel) {
    // If no active, return the first one's name
    const firstIdJenjang = userLevels[0]?.idjenjang;
    const firstLevel = levels?.find((l) => l.idjenjang === firstIdJenjang);
    return firstLevel?.namajenjang || "-";
  }

  // Find the matching level reference data
  const matchingLevel = levels?.find(
    (l) => l.idjenjang === activeUserLevel.idjenjang
  );

  return matchingLevel?.namajenjang || "-";
}

/**
 * Get active pangkat/rank name
 * 1. Find user-rank with status === "Aktif"
 * 2. Get idpangkat from active item
 * 3. Find matching rank and return formatted string (golongan/ruang-pangkat)
 */
function getActivePangkat(item) {
  const userRanks = item["user-ranks"];
  const ranks = item["ranks"];

  if (!userRanks || !Array.isArray(userRanks) || userRanks.length === 0) {
    return "-";
  }

  // Find the active user rank
  const activeUserRank = userRanks.find((ur) => ur.status === "Aktif");

  let matchingRank = null;

  if (!activeUserRank) {
    // If no active, use the first one
    const firstIdPangkat = userRanks[0]?.idpangkat;
    matchingRank = ranks?.find((r) => r.idpangkat === firstIdPangkat);
  } else {
    // Find the matching rank reference data
    matchingRank = ranks?.find((r) => r.idpangkat === activeUserRank.idpangkat);
  }

  if (!matchingRank) {
    return "-";
  }

  // Format: golongan/ruang-pangkat (e.g., IV/a-Pembina)
  const golongan = matchingRank.golongan || "";
  const ruang = matchingRank.ruang || "";
  const pangkat = matchingRank.pangkat || "";

  if (!golongan && !ruang && !pangkat) {
    return "-";
  }

  return `${golongan}/${ruang}-${pangkat}`;
}
</script>
