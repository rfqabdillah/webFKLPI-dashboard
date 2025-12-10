<template>
  <BaseTable
    title="Daftar Jenis Pengguna"
    entityName="Jenis Pengguna"
    :apiService="userTypeApi"
    :FormModalComponent="UserTypeFormModal"
    :columns="columns"
    primaryKey="idjenispengguna"
    deleteItemNameKey="namajenispengguna"
    :initialFilters="initialFilters"
    initialSortColumn="namajenispengguna"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterJenisPengguna"
            class="form-label text-dark fw-semibold"
            >Nama Jenis Pengguna</label
          >
          <input
            type="text"
            id="filterJenisPengguna"
            class="form-control"
            v-model="filters.namajenispengguna"
            placeholder="Masukkan nama jenis pengguna"
          />
        </div>
      </div>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { deleteUserType, getUserTypes } from "@/services/referensi/userTypes";

const UserTypeFormModal = defineAsyncComponent(() =>
  import("./UserTypeFormModal.vue")
);

const userTypeApi = {
  get: getUserTypes,
  delete: deleteUserType,
};

const columns = [
  { key: "namajenispengguna", label: "Jenis Pengguna", sortable: true },
];

const initialFilters = {
  namajenispengguna: "",
};
</script>
