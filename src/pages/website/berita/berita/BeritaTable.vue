<template>
  <BaseTable
    title="Daftar Berita"
    entityName="Berita"
    :apiService="newsApi"
    :FormModalComponent="NewsFormModal"
    :DetailModalComponent="NewsDetailModal"
    :columns="columns"
    primaryKey="id_berita"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="judul"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-3">
          <label for="filterJudul" class="form-label text-dark fw-semibold"
            >Judul</label
          >
          <input
            type="text"
            id="filterJudul"
            class="form-control"
            v-model="filters.judul"
            placeholder="Masukkan judul berita"
          />
        </div>
        <div class="col-md-3">
          <label
            for="filterKategoriBerita"
            class="form-label text-dark fw-semibold"
            >Kategori Berita</label
          >
          <input
            type="text"
            id="filterKategoriBerita"
            class="form-control"
            v-model="filters.nama_kategori_berita"
            placeholder="Masukkan Kategori Berita"
          />
        </div>
        <div class="col-md-3">
          <label for="filterOrganisasi" class="form-label text-dark fw-semibold"
            >Organisasi</label
          >
          <input
            type="text"
            id="filterOrganisasi"
            class="form-control"
            v-model="filters.nama_organisasi"
            placeholder="Masukkan nama organisasi"
          />
        </div>
        <div class="col-md-3">
          <label for="filterStatus" class="form-label text-dark fw-semibold"
            >Status Tayang</label
          >
          <select
            id="filterStatus"
            class="form-select"
            v-model="filters.tayang"
          >
            <option value="">Semua Status</option>
            <option value="Tayang">Tayang</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(nama_kategori_berita)="{ item }">
      <span v-if="item['kategori-berita']">
        {{ item["kategori-berita"].nama_kategori_berita }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_organisasi)="{ item }">
      <span v-if="item.fklpi && item.fklpi.nama_organisasi">
        {{ item.fklpi.nama_organisasi }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(nama_pengguna)="{ item }">
      <span v-if="item.pengguna && item.pengguna.nama">
        {{ item.pengguna.nama }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell(tayang)="{ value }">
      <span
        class="badge"
        :class="{
          'bg-success': value === 'Tayang',
          'bg-warning': value === 'Draft',
          'bg-light text-dark': value !== 'Tayang' && value !== 'Draft',
        }"
      >
        {{ value || "N/A" }}
      </span>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import { formatDate } from "@/utils/formatDate";
import { deleteBerita, getBerita } from "@/services/general/website/berita";

const NewsFormModal = defineAsyncComponent(() =>
  import("./BeritaFormModal.vue"),
);
const NewsDetailModal = defineAsyncComponent(() =>
  import("./BeritaDetailModal.vue"),
);

const newsApi = {
  get: getBerita,
  delete: deleteBerita,
};

const columns = [
  { key: "judul", label: "Judul", sortable: true },
  { key: "nama_kategori_berita", label: "Kategori", sortable: true },
  { key: "nama_organisasi", label: "Organisasi", sortable: true },
  { key: "nama_pengguna", label: "Penulis", sortable: true },
  { key: "created_at", label: "Tanggal", sortable: true },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  judul: "",
  nama_kategori_berita: "",
  nama_organisasi: "",
  tayang: "",
};
</script>
