<template>
  <BaseTable
    title="Daftar Jenjang Jabatan"
    entityName="Jenjang Jabatan"
    :apiService="rankApi"
    :FormModalComponent="PositionLevelFormModal"
    :columns="columns"
    primaryKey="idjenjang"
    deleteItemNameKey="namajenjang"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterPositionLevelName"
            class="form-label text-dark fw-semibold"
            >Jenjang Jabatan</label
          >
          <input
            type="text"
            id="filterPositionLevelName"
            class="form-control"
            v-model="filters.namajenjang"
            placeholder="Masukkan nama jenjang jabatan"
          />
        </div>
      </div>
    </template>
    <template #cell(namajenjangkategori)="{ item }">
      <span v-if="item['level-categories']">
        {{ item["level-categories"].namajenjangkategori }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import {
  deletePositionLevel,
  getPositionLevels,
} from "@/services/referensi/positionLevels";

const PositionLevelFormModal = defineAsyncComponent(() =>
  import("./PositionLevelFormModal.vue")
);

const rankApi = {
  get: getPositionLevels,
  delete: deletePositionLevel,
};

const columns = [
  { key: "namajenjang", label: "Nama Jenjang Jabatan", sortable: true },
  {
    key: "namajenjangkategori",
    label: "Kategori Jenjang Jabatan",
    sortable: true,
  },
];

const initialFilters = {
  namajenjang: "",
};
</script>
