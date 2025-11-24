<template>
  <div class="col-sm-12">
    <component
      :is="FormModalComponent"
      v-if="isFormModalVisible"
      :field-to-edit="itemBeingEdited"
      :entity-name="entityName"
      @close="closeModal"
      @save-successful="handleSaveSuccessful"
    />

    <component
      :is="DetailModalComponent"
      v-if="isDetailModalVisible"
      :entity-name="entityName"
      :item-to-view="itemBeingViewed"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>{{ title }}</h3>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-end align-items-start mb-3">
          <div class="d-flex gap-2">
            <button class="btn btn-outline-light txt-dark" @click="toggleFilter">
              <i :class="isFilterVisible ? 'fa fa-angle-up me-2' : 'fa fa-angle-down me-2'"></i>
              <span>{{ isFilterVisible ? 'Sembunyikan' : 'Tampilkan' }} Filter</span>
            </button>
            <button v-if="isAdmin" class="btn btn-success" @click="openAddModal">
              <i class="fa fa-plus me-2"></i> Tambah Data
            </button>
          </div>
        </div>

        <div v-if="isFilterVisible" class="border p-3 mb-3 rounded filter-section bg-light">
          <slot name="filters" :filters="filters"></slot>

          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="resetFilters">
              <i class="fa fa-refresh me-2"></i> Reset Filter
            </button>
          </div>
        </div>

        <div class="table-responsive signal-table">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th 
                  v-for="col in columns" 
                  :key="col.key" 
                  @click="col.sortable ? sortBy(col.key) : null" 
                  :style="col.sortable ? { cursor: 'pointer' } : {}"
                >
                  {{ col.label }}
                  <sort-icon 
                    v-if="col.sortable" 
                    :column="col.key" 
                    :sort-column="sortColumn" 
                    :sort-direction="sortDirection" 
                  />
                </th>
                <th v-if="isAdmin">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="isLoading">
                <td :colspan="columns.length + (isAdmin ? 2 : 1)" class="text-center p-5">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="mt-2">Memuat data...</p>
                </td>
              </tr>

              <template v-else>
                <tr v-for="(item, index) in itemsList" :key="item[primaryKey]">
                  <th scope="row">{{ (currentPage - 1) * perPage + index + 1 }}</th>
                  <td v-for="col in columns" :key="col.key">
                    <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]">
                      {{ item[col.key] || '-' }}
                    </slot>
                  </td>
                  <td v-if="isAdmin">
                    <div class="btn-group">
                      <button v-if="DetailModalComponent" class="btn btn-info btn-sm" @click="openDetailModal(item)" title="Lihat Detail Data">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-warning btn-sm" @click="openEditModal(item)" title="Ubah Data">
                        <i class="fa fa-pencil"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" @click="confirmDelete(item)" title="Hapus Data">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="itemsList.length === 0">
                  <td :colspan="columns.length + (isAdmin ? 2 : 1)" class="text-center text-muted">
                    Tidak ada data yang cocok atau tersedia.
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap pagination">
            <div class="text-muted small">
              Menampilkan
              <strong>{{ startItem }}</strong>–<strong>{{ endItem }}</strong>
              dari
              <strong>{{ totalItems }}</strong> data
            </div>

            <div class="d-flex align-items-center gap-2">
              <button
                class="btn btn-primary btn-sm pagination-btn"
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                <i class="fa fa-chevron-left"></i>
              </button>

              <div class="d-flex align-items-center gap-1">
                <span>Hal</span>
                <input
                  type="number"
                  v-model.number="currentPage"
                  min="1"
                  :max="totalPages"
                  class="form-control form-control-sm text-center pagination-input"
                  @change="fetchData"
                />
                <span>dari <strong>{{ totalPages }}</strong></span>
              </div>

              <button
                class="btn btn-primary btn-sm pagination-btn"
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
              >
                <i class="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, defineAsyncComponent } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { debounce } from "lodash-es";
import SortIcon from './default/sortIcon.vue';

// === Props ===
const props = defineProps({
  title: { type: String, required: true },
  entityName: { type: String, default: 'Data' },
  apiService: { type: Object, required: true },
  FormModalComponent: { type: Object, required: true },
  DetailModalComponent: { type: Object, required: false, default: null },
  columns: { type: Array, required: true },
  primaryKey: { type: String, required: true },
  deleteItemNameKey: { type: String, required: true },
  initialFilters: { type: Object, default: () => ({}) },
  initialSortColumn: { type: String, default: 'id' },
  initialSortDirection: { type: String, default: 'asc' },
});

// === State ===
const toast = useToast();
const itemsList = ref([]);
const isLoading = ref(false);
const sortColumn = ref(props.initialSortColumn);
const sortDirection = ref(props.initialSortDirection);
const isFormModalVisible = ref(false);
const isDetailModalVisible = ref(false);
const currentPage = ref(1);
const perPage = ref(20); 
const totalItems = ref(0);
const itemBeingEdited = ref(null);
const itemBeingViewed = ref(null);
const isFilterVisible = ref(false);
const filters = reactive({ ...props.initialFilters });
const userRole = ref(null);

// === Computed ===
const isAdmin = computed(() => (userRole.value || "").toLowerCase() === "administrator");
const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value) || 1);
const startItem = computed(() => (totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1));
const endItem = computed(() =>
  Math.min(currentPage.value * perPage.value, totalItems.value)
);

// === Lifecycle ===
onMounted(() => {
  loadUserRole();
  fetchData();
});

// === Watcher untuk filter realtime ===
const debouncedFetch = debounce(() => {
  currentPage.value = 1;
  fetchData();
}, 500);

watch(filters, () => debouncedFetch(), { deep: true });

// === Methods ===
function loadUserRole() {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    userRole.value = userData?.data?.[0]?.nama_level || null;
  } catch {
    userRole.value = null;
  }
}

function openAddModal() {
  itemBeingEdited.value = null;
  isFormModalVisible.value = true;
}
function openEditModal(item) {
  itemBeingEdited.value = { ...item };
  isFormModalVisible.value = true;
}
function closeModal() {
  isFormModalVisible.value = false;
  itemBeingEdited.value = null;
}
function handleSaveSuccessful() {
  closeModal();
  fetchData();
}
function openDetailModal(item) {
  itemBeingViewed.value = { ...item };
  isDetailModalVisible.value = true;
}
function closeDetailModal() {
  isDetailModalVisible.value = false;
  itemBeingViewed.value = null;
}

async function fetchData() {
  isLoading.value = true;
  try {
    const filterParts = [];
    for (const key in filters) {
      if (filters[key]) {
        filterParts.push(`${key}=${encodeURIComponent(filters[key])}`);
      }
    }
    const filterString = filterParts.join(",");

    const params = {
      page: currentPage.value,
      limit: perPage.value,
      order: `${sortColumn.value} ${sortDirection.value}`,
      filter: filterString,
    };

    const res = await props.apiService.get(params);
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    const data = responseData?.data || [];
    const pagination = responseData?.meta?.pagination || {};

    itemsList.value = data;
    totalItems.value = pagination.total || data.length;
  } catch (err) {
    console.error(err);
    toast.error(`Gagal memuat data ${props.title}`);
  } finally {
    isLoading.value = false;
  }
}

async function confirmDelete(item) {
  const itemName = item[props.deleteItemNameKey] || 'data ini';
  const result = await Swal.fire({
    title: `Hapus Data`,
    text: `Apakah Anda yakin ingin menghapus "${itemName}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus',
    cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
      cancelButtonColor: "#efefef",
      confirmButtonColor: "#d33",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await props.apiService.delete(item[props.primaryKey]);
      toast.success(`Data ${itemName} berhasil dihapus`);
      if (itemsList.value.length === 1 && currentPage.value > 1) {
        currentPage.value--;
      }
      fetchData();
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  }
}

function sortBy(column) {
  sortDirection.value = sortColumn.value === column && sortDirection.value === "asc" ? "desc" : "asc";
  sortColumn.value = column;
  fetchData();
}

function toggleFilter() {
  isFilterVisible.value = !isFilterVisible.value;
}

function resetFilters() {
  Object.keys(filters).forEach(key => {
    filters[key] = props.initialFilters[key] || "";
  });
  sortColumn.value = props.initialSortColumn;
  sortDirection.value = props.initialSortDirection;
  currentPage.value = 1;
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchData();
  }
}
</script>

<style scoped>
th {
  cursor: pointer;
  white-space: nowrap;
}
th i.fa {
  margin-left: 5px;
  font-size: 0.8em;
  vertical-align: middle;
}
.filter-section {
  background-color: #f8f9fa;
}
.form-label {
  color: #000 !important;
}
.table td,
.table th {
  padding-right: 1.7rem;
}
:deep(.custom-sort th::before),
:deep(.custom-sort th::after) {
  display: none !important;
  content: none !important;
}
.btn-primary.btn-sm {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.btn-primary.btn-sm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.pagination .pagination-btn {
  padding: 2px 8px;
  font-size: 0.8rem;
  line-height: 1.2;
  border-radius: 4px;
  min-width: 32px;
}
.pagination .pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.pagination .pagination-input {
  width: 50px;
  padding: 3px 4px;
  font-size: 0.8rem;
  line-height: 1.2;
  height: 28px;
}
.pagination .btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  transition: background-color 0.2s ease;
}
.pagination .btn-primary:hover:not(:disabled) {
  background-color: #0b5ed7;
}
</style>