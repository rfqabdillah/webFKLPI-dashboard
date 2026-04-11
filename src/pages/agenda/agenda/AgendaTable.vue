<template>
  <BaseTable
    title="Daftar Agenda"
    entityName="Agenda"
    :apiService="agendaApi"
    :FormModalComponent="AgendaFormModal"
    :DetailModalComponent="AgendaDetailModal"
    :columns="columns"
    primaryKey="id_agenda"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="created_at"
    initialSortDirection="desc"
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
            placeholder="Masukkan judul agenda"
          />
        </div>
        <div class="col-md-3">
          <label for="filterKategori" class="form-label text-dark fw-semibold"
            >Kategori</label
          >
          <input
            type="text"
            id="filterKategori"
            class="form-control"
            v-model="filters.nama_kategori_agenda"
            placeholder="Masukkan kategori"
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

    <template #cell(nama_kategori_agenda)="{ item }">
      <span v-if="item['kategori-agenda']">
        {{ item["kategori-agenda"].nama_kategori_agenda }}
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

    <template #cell(tanggal_pelaksanaan)="{ value }">
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
import { getAgenda, deleteAgenda } from "@/services/general/agenda/agenda";
import { formatDate } from "@/utils/formatDate";

const AgendaFormModal = defineAsyncComponent(() =>
  import("./AgendaFormModal.vue"),
);
const AgendaDetailModal = defineAsyncComponent(() =>
  import("./AgendaDetailModal.vue"),
);

const agendaApi = {
  get: getAgenda,
  delete: deleteAgenda,
};

const columns = [
  { key: "judul", label: "Judul", sortable: true },
  { key: "nama_kategori_agenda", label: "Kategori", sortable: true },
  { key: "nama_organisasi", label: "Organisasi", sortable: true },
  { key: "nama_pengguna", label: "Penulis", sortable: true },
  { key: "tanggal_pelaksanaan", label: "Tgl Pelaksanaan", sortable: true },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  judul: "",
  nama_kategori_agenda: "",
  nama_organisasi: "",
  tayang: "",
};
</script>
