<template>
  <BaseTable
    :title="noCard ? '' : 'Daftar Program Pelatihan'"
    entityName="Program Pelatihan"
    :apiService="programPelatihanApi"
    :FormModalComponent="isReadOnly ? null : ProgramPelatihanFormModal"
    :DetailModalComponent="ProgramPelatihanDetailModal"
    :columns="columns"
    primaryKey="id_program_pelatihan"
    deleteItemNameKey="nama_program"
    :initialFilters="initialFiltersWithKbji"
    :fixedFilters="fixedFilters"
    initialSortColumn="nama_program"
    initialSortDirection="asc"
    :isReadOnly="isReadOnly"
    :noCard="noCard"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label
            for="filterNamaProgram"
            class="form-label text-dark fw-semibold"
            >Nama Program</label
          >
          <input
            type="text"
            id="filterNamaProgram"
            class="form-control"
            v-model="filters.nama_program"
            placeholder="Masukkan nama program"
          />
        </div>
        <div class="col-md-4">
          <label for="filterKejuruan" class="form-label text-dark fw-semibold"
            >Kejuruan</label
          >
          <input
            type="text"
            id="filterKejuruan"
            class="form-control"
            v-model="filters.kejuruan"
            placeholder="Masukkan kejuruan"
          />
        </div>
      </div>
    </template>

    <template #cell(link)="{ item }">
      <a
        v-if="item.link"
        :href="item.link"
        target="_blank"
        class="btn btn-sm btn-outline-primary"
        title="Buka Link"
      >
        <i class="fa fa-external-link me-1"></i>Buka
      </a>
      <span v-else class="text-muted">-</span>
    </template>
  </BaseTable>
</template>

<script setup>
import { defineAsyncComponent, computed } from "vue";
import BaseTable from "@/components/base/BaseTable.vue";
import {
  getProgramPelatihan,
  deleteProgramPelatihan,
} from "@/services/referensi/programPelatihan";

const props = defineProps({
  kodeKbji: { type: String, default: "" },
  isReadOnly: { type: Boolean, default: false },
  noCard: { type: Boolean, default: false },
});

const ProgramPelatihanFormModal = defineAsyncComponent(() =>
  import("@/pages/referensi/programPelatihan/ProgramPelatihanFormModal.vue"),
);

const ProgramPelatihanDetailModal = defineAsyncComponent(() =>
  import("@/pages/referensi/programPelatihan/ProgramPelatihanDetailModal.vue"),
);

const programPelatihanApi = {
  get: getProgramPelatihan,
  delete: deleteProgramPelatihan,
};

const columns = [
  { key: "nama_program", label: "Nama Program", sortable: true },
  { key: "kode_program", label: "Kode", sortable: true },
  { key: "kejuruan", label: "Kejuruan", sortable: true },
  { key: "link", label: "Link", sortable: false },
];

const initialFilters = {
  nama_program: "",
  kejuruan: "",
};

const initialFiltersWithKbji = computed(() => ({
  ...initialFilters,
  kode_kbji: props.kodeKbji || "",
}));

const fixedFilters = computed(() => {
  const filters = {};
  if (props.kodeKbji) filters.kode_kbji = props.kodeKbji;
  return filters;
});
</script>
