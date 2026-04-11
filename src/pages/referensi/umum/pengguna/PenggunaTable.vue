<template>
  <BaseTable
    title="Daftar Pengguna"
    entityName="Pengguna"
    :apiService="penggunaApi"
    :FormModalComponent="PenggunaFormModal"
    :DetailModalComponent="PenggunaDetailModal"
    :columns="columns"
    primaryKey="id_pengguna"
    deleteItemNameKey="nama"
    :initialFilters="initialFilters"
    initialSortColumn="nama"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterUserName" class="form-label text-dark fw-semibold"
            >Nama Pengguna</label
          >
          <input
            type="text"
            id="filterUserName"
            class="form-control"
            v-model="filters.nama"
            placeholder="Masukkan nama pengguna"
          />
        </div>
        <div class="col-md-4">
          <label for="filterEmail" class="form-label text-dark fw-semibold"
            >Email</label
          >
          <input
            type="text"
            id="filterEmail"
            class="form-control"
            v-model="filters.email"
            placeholder="Masukkan email"
          />
        </div>
        <div class="col-md-4">
          <label for="filterPeran" class="form-label text-dark fw-semibold"
            >Peran</label
          >
          <select
            id="filterPeran"
            class="form-select"
            v-model="filters.nama_peran"
          >
            <option value="">Semua Peran</option>
            <option
              v-for="p in peranOptions"
              :key="p.id_peran"
              :value="p.nama_peran"
            >
              {{ p.nama_peran }}
            </option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(foto)="{ item }">
      <img
        v-if="item.foto"
        :src="item.foto"
        alt="Foto"
        style="
          width: 50px;
          height: 50px;
          cursor: pointer;
          border-radius: 50%;
          object-fit: cover;
        "
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

    <template #cell(nama_peran)="{ item }">
      <span v-if="item.peran && item.peran.nama_peran">
        {{ item.peran.nama_peran }}
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
import { defineAsyncComponent, ref, onMounted } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { getPengguna, deletePengguna } from "@/services/referensi/pengguna";
import { getPeran } from "@/services/referensi/peran";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import VueEasyLightbox from "vue-easy-lightbox";

const PenggunaFormModal = defineAsyncComponent(() =>
  import("./PenggunaFormModal.vue"),
);
const PenggunaDetailModal = defineAsyncComponent(() =>
  import("./PenggunaDetailModal.vue"),
);

const penggunaApi = {
  get: getPengguna,
  delete: deletePengguna,
};

const columns = [
  { key: "foto", label: "Foto", sortable: false },
  { key: "nama", label: "Nama", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "nama_peran", label: "Peran", sortable: true },
];

const initialFilters = {
  nama: "",
  email: "",
  nama_peran: "",
};

const peranOptions = ref([]);
const lightboxVisible = ref(false);
const lightboxImgs = ref("");

async function fetchPeran() {
  try {
    const response = await getPeran({
      limit: 50,
      sort: "nama_peran",
      dir: "asc",
    });
    peranOptions.value = response.data?.[0]?.data || [];
  } catch (error) {
    console.error("Gagal memuat daftar peran:", error);
  }
}

function showImage(imageUrl) {
  lightboxImgs.value = imageUrl;
  lightboxVisible.value = true;
}

function hideImage() {
  lightboxVisible.value = false;
}

onMounted(() => {
  fetchPeran();
});
</script>
