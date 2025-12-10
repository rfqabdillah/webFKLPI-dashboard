<template>
  <BaseTable
    title="Daftar Jenis Kelamin"
    entityName="Jenis Kelamin"
    :apiService="genderApi"
    :FormModalComponent="GenderFormModal"
    :columns="columns"
    primaryKey="idjeniskelamin"
    deleteItemNameKey="namajeniskelamin"
    :initialFilters="initialFilters"
    initialSortColumn="namajeniskelamin"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterJenisKelamin"
            class="form-label text-dark fw-semibold"
            >Nama Jenis Kelamin</label
          >
          <input
            type="text"
            id="filterJenisKelamin"
            class="form-control"
            v-model="filters.namajeniskelamin"
            placeholder="Masukkan nama jenis kelamin"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deleteGender, getGenders } from "@/services/referensi/genders";

const GenderFormModal = defineAsyncComponent(() =>
  import("./GenderFormModal.vue")
);

const genderApi = {
  get: getGenders,
  delete: deleteGender,
};

const columns = [
  { key: "namajeniskelamin", label: "Jenis Kelamin", sortable: true },
];

const initialFilters = {
  namajeniskelamin: "",
};
</script>
