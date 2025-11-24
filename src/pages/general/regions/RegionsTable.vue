<template>
  <div class="card border-0 shadow-sm">
    <div class="card-body">
      
      <div class="d-flex gap-2 mb-4">
        <button 
          type="button" 
          class="btn px-4 rounded-pill d-flex align-items-center transition-all"
          :class="activeTab === 'A' ? 'btn-primary shadow' : 'btn-outline-primary'"
          @click="activeTab = 'A'"
        >
          <i class="fa-solid fa-map-location-dot me-2"></i> 
          Provinsi
        </button>

        <button 
          type="button" 
          class="btn px-4 rounded-pill d-flex align-items-center transition-all"
          :class="activeTab === 'B' ? 'btn-primary shadow' : 'btn-outline-primary'"
          @click="activeTab = 'B'"
        >
          <i class="fa-solid fa-city me-2"></i> 
          Kabupaten
        </button>
      </div>

      <BaseTable
        :key="activeTab"
        :title="tableTitle"
        entityName="Wilayah" 
        :apiService="regionApi"
        :FormModalComponent="RegionFormModal"
        :columns="columns"
        primaryKey="idwilayah"
        deleteItemNameKey="namawilayah"
        :initialFilters="currentInitialFilters"
        initialSortColumn="kodewilayah"
        initialSortDirection="asc"
      >
        <template #filters="{ filters }">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="filterKodeWilayah" class="form-label text-dark fw-semibold">Kode Wilayah</label>
              <input
                type="text"
                id="filterKodeWilayah"
                class="form-control"
                v-model="filters.kodewilayah"
                placeholder="Cari kode wilayah"
              />
            </div>

            <div class="col-md-6">
              <label for="filterNamaWilayah" class="form-label text-dark fw-semibold">Nama Wilayah</label>
              <input
                type="text"
                id="filterNamaWilayah"
                class="form-control"
                v-model="filters.namawilayah"
                placeholder="Cari nama wilayah"
              />
            </div>
          </div>
        </template>
      </BaseTable>

    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, provide } from 'vue'; 
import BaseTable from '@/components/base/BaseTable.vue';
import { getRegions, deleteRegion } from '@/services/referensi/regions';

const RegionFormModal = defineAsyncComponent(() => 
  import('./RegionFormModal.vue') 
);

const regionApi = {
  get: getRegions,     
  delete: deleteRegion, 
};


const activeTab = ref('A');

//Kirim data tab ke formModal 
provide('activeTabType', activeTab);

const columns = [
  { key: 'kodewilayah', label: 'Kode', sortable: true },
  { key: 'namawilayah', label: 'Nama Wilayah', sortable: true },
];

const tableTitle = computed(() => {
  return activeTab.value === 'A' ? 'Daftar Wilayah Provinsi' : 'Daftar Wilayah Kabupaten';
});

const currentInitialFilters = computed(() => ({
  namawilayah: "",
  kodewilayah: "",
  tipewilayah: activeTab.value, 
}));
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>