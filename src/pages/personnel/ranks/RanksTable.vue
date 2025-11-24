<template>
  <BaseTable
    title="Daftar Pangkat"
    entityName="Pangkat" 
    :apiService="rankApi"
    :FormModalComponent="RankFormModal"
    :columns="columns"
    primaryKey="idpangkat"
    deleteItemNameKey="pangkat"
    :initialFilters="initialFilters"
    initialSortColumn="pangkat"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterRankName" class="form-label text-dark fw-semibold">Pangkat</label>
          <input
            type="text"
            id="filterRankName"
            class="form-control"
            v-model="filters.pangkat"
            placeholder="Masukkan nama pangkat"
          />
        </div>
        <div class="col-md-3">
          <label for="filterGroupName" class="form-label text-dark fw-semibold">Golongan</label>
          <input
            type="text"
            id="filterGroupName"
            class="form-control"
            v-model="filters.golongan"
            placeholder="Masukkan jenis golongan"
          />
        </div>
        <div class="col-md-3">
          <label for="filterSpaceName" class="form-label text-dark fw-semibold">Ruang</label>
          <input
            type="text"
            id="filterSpaceName"
            class="form-control"
            v-model="filters.ruang"
            placeholder="Masukkan jenis ruang"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import { deleteRank, getRanks } from '@/services/referensi/ranks';

const RankFormModal = defineAsyncComponent(() => 
  import('./RankFormModal.vue')
);

const rankApi = {
  get: getRanks,
  delete: deleteRank,
};

const columns = [
  { key: 'pangkat', label: 'Pangkat', sortable: true },
  { key: 'golongan', label: 'Golongan', sortable: true },
  { key: 'ruang', label: 'Ruang', sortable: true },
];

const initialFilters = {
  pangkat: "",
  golongan: "",
  ruang: "",
};
</script>
