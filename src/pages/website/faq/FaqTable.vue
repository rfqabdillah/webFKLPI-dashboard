<template>
  <BaseTable
    title="Daftar Pertanyaan Umum"
    entityName="Pertanyaan Umum"
    :apiService="FaqApi"
    :FormModalComponent="FaqFormModal"
    :columns="columns"
    primaryKey="id_faq"
    deleteItemNameKey="pertanyaan"
    :initialFilters="initialFilters"
    initialSortColumn="pertanyaan"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterPertanyaan" class="form-label text-dark fw-semibold"
            >Pertanyaan</label
          >
          <input
            type="text"
            id="filterPertanyaan"
            class="form-control"
            v-model="filters.pertanyaan"
            placeholder="Masukkan pertanyaan"
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
import { deleteFaq, getFaq } from "@/services/general/website/faq";

const FaqFormModal = defineAsyncComponent(() => import("./FaqFormModal.vue"));

const FaqApi = {
  get: getFaq,
  delete: deleteFaq,
};

const columns = [
  { key: "pertanyaan", label: "Pertanyaan", sortable: true },
  { key: "jawaban", label: "Jawaban", sortable: false },
  { key: "tayang", label: "Status", sortable: true },
];

const initialFilters = {
  pertanyaan: "",
  tayang: "",
};
</script>
