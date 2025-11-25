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
        style="width: 50px; height: 50px; cursor: pointer; border-radius: 4px"
        @click="showImage(item.foto)"
      />
      <span v-else class="text-muted">-</span>
    </template>
    <template #cell(namaunitkerja)="{ item }">
      <span v-if="item['work-units']">
        {{ item["work-units"].namaunitkerja }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>
    <template #cell(pangkat)="{ item }">
      <span v-if="item['ranks']">
        {{ item["ranks"].pangkat }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>
    <template #cell(namajenjang)="{ item }">
      <span v-if="item['levels']">
        {{ item["levels"].jenjang }}
      </span>
      <span v-else class="text-muted">-</span>
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
</script>
