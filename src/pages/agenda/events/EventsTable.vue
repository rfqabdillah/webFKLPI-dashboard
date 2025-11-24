<template>
  <BaseTable
    title="Daftar Kegiatan"
    entityName="Agenda"
    :apiService="agendaApi"
    :FormModalComponent="AgendaFormModal"
    :DetailModalComponent="EventDetailModal"
    :columns="columns"
    primaryKey="idagenda"
    deleteItemNameKey="judul"
    :initialFilters="initialFilters"
    initialSortColumn="tglpelaksanaan"
    initialSortDirection="desc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
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
        <div class="col-md-4">
          <label for="filterKategori" class="form-label text-dark fw-semibold"
            >Kategori Agenda</label
          >
          <input
            type="text"
            id="filterKategori"
            class="form-control"
            v-model="filters.namakategoriagenda"
            placeholder="Masukkan nama kategori"
          />
        </div>
        <div class="col-md-4">
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

    <template #cell(tglpelaksanaan)="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell(tglbatasdaftar)="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell(namakategoriagenda)="{ item }">
      <span v-if="item['event-categories']">
        {{ item["event-categories"].namakategoriagenda }}
      </span>
      <span v-else class="text-muted">-</span>
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
import { getEvents, deleteEvent } from "@/services/general/events/events";
import { formatDate } from "@/utils/formatDate";

const AgendaFormModal = defineAsyncComponent(() =>
  import("./EventFormModal.vue")
);
const EventDetailModal = defineAsyncComponent(() =>
  import("./EventDetailModal.vue")
);

const agendaApi = {
  get: getEvents,
  delete: deleteEvent,
};

const columns = [
  { key: "judul", label: "Judul", sortable: true },
  { key: "tglpelaksanaan", label: "Tanggal Pelaksanaan", sortable: true },
  { key: "tglbatasdaftar", label: "Batas Pendaftaran", sortable: true },
  { key: "tmptpelaksanaan", label: "Tempat", sortable: true },
  { key: "namakategoriagenda", label: "Kategori Agenda", sortable: true },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  judul: "",
  namakategoriagenda: "",
  tayang: "",
};
</script>
