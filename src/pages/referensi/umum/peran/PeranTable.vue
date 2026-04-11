<template>
  <BaseTable
    title="Daftar Peran"
    entityName="Peran"
    :apiService="peranApi"
    :FormModalComponent="PeranFormModal"
    :columns="columns"
    primaryKey="id_peran"
    deleteItemNameKey="nama_peran"
    :initialFilters="initialFilters"
    initialSortColumn="nama_peran"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterNamaPeran" class="form-label text-dark fw-semibold"
            >Peran</label
          >
          <input
            type="text"
            id="filterNamaPeran"
            class="form-control"
            v-model="filters.nama_peran"
            placeholder="Masukkan nama peran"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deletePeran, getPeran } from "@/services/referensi/peran";

const PeranFormModal = defineAsyncComponent(() =>
  import("./PeranFormModal.vue"),
);

const peranApi = {
  get: getPeran,
  delete: deletePeran,
};

const columns = [{ key: "nama_peran", label: "Nama Peran", sortable: true }];

const initialFilters = {
  nama_peran: "",
};
</script>
