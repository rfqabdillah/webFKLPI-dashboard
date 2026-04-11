<template>
  <div class="col-sm-12">
    <TestimoniDetailModal
      v-if="showDetailModal"
      :item-to-view="selectedItem"
      @close="closeDetailModal"
    />

    <div class="card">
      <div class="card-header">
        <h3>Daftar Testimoni</h3>
      </div>

      <div class="card-body">
        <!-- Filter Toggle -->
        <div class="d-flex justify-content-end align-items-start mb-3">
          <button class="btn btn-outline-light txt-dark" @click="toggleFilter">
            <i
              :class="
                isFilterVisible
                  ? 'fa fa-angle-up me-2'
                  : 'fa fa-angle-down me-2'
              "
            ></i>
            <span
              >{{ isFilterVisible ? "Sembunyikan" : "Tampilkan" }} Filter</span
            >
          </button>
        </div>

        <!-- Filters -->
        <div
          v-if="isFilterVisible"
          class="border p-3 mb-3 rounded filter-section bg-light"
        >
          <div class="row g-3">
            <div class="col-md-4">
              <label for="filterKonten" class="form-label text-dark fw-semibold"
                >Konten</label
              >
              <input
                type="text"
                id="filterKonten"
                class="form-control"
                v-model="filters.konten"
                placeholder="Cari konten testimoni"
              />
            </div>
            <div class="col-md-4">
              <label for="filterTayang" class="form-label text-dark fw-semibold"
                >Status</label
              >
              <select
                id="filterTayang"
                class="form-select"
                v-model="filters.tayang"
              >
                <option value="">Semua Status</option>
                <option value="Draft">Draft</option>
                <option value="Tayang">Tayang</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="filterNilai" class="form-label text-dark fw-semibold"
                >Rating</label
              >
              <select
                id="filterNilai"
                class="form-select"
                v-model="filters.nilai"
              >
                <option value="">Semua Rating</option>
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-secondary" @click="resetFilters">
              <i class="fa fa-refresh me-2"></i> Reset Filter
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive signal-table">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th style="cursor: pointer" @click="sortBy('nilai')">
                  Rating
                  <i
                    v-if="sortColumn === 'nilai'"
                    :class="
                      sortDirection === 'asc'
                        ? 'fa fa-sort-asc'
                        : 'fa fa-sort-desc'
                    "
                  ></i>
                </th>
                <th>Isi Testimoni</th>
                <th>Pengguna</th>
                <th style="cursor: pointer" @click="sortBy('created_at')">
                  Tanggal
                  <i
                    v-if="sortColumn === 'created_at'"
                    :class="
                      sortDirection === 'asc'
                        ? 'fa fa-sort-asc'
                        : 'fa fa-sort-desc'
                    "
                  ></i>
                </th>
                <th style="cursor: pointer" @click="sortBy('tayang')">
                  Status
                  <i
                    v-if="sortColumn === 'tayang'"
                    :class="
                      sortDirection === 'asc'
                        ? 'fa fa-sort-asc'
                        : 'fa fa-sort-desc'
                    "
                  ></i>
                </th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" class="text-center p-5">
                  <div class="spinner-border text-primary" role="status"></div>
                  <p class="mt-2">Memuat data...</p>
                </td>
              </tr>

              <template v-else>
                <tr
                  v-for="(item, index) in itemsList"
                  :key="item.id_testimoni || index"
                >
                  <th scope="row">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </th>
                  <td>
                    <div class="star-rating">
                      <i
                        v-for="star in 5"
                        :key="star"
                        class="fa fa-star"
                        :class="
                          star <= parseInt(item.nilai || 0)
                            ? 'text-warning'
                            : 'text-muted'
                        "
                      ></i>
                    </div>
                  </td>
                  <td>
                    <span
                      class="text-truncate d-inline-block"
                      style="max-width: 280px"
                    >
                      {{ item.konten }}
                    </span>
                  </td>
                  <td>{{ item.pengguna?.nama || "-" }}</td>
                  <td>{{ formatDate(item.created_at) }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="{
                        'bg-success': item.tayang === 'Tayang',
                        'bg-warning text-dark': item.tayang !== 'Tayang',
                      }"
                    >
                      {{ item.tayang === "Tayang" ? "Tayang" : "Draft" }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <!-- View Detail Button -->
                      <button
                        class="btn btn-info btn-sm"
                        @click="openDetailModal(item)"
                        title="Lihat Detail"
                      >
                        <i class="fa fa-eye"></i>
                      </button>

                      <!-- Toggle Status Button -->
                      <button
                        v-if="item.tayang !== 'Tayang'"
                        class="btn btn-success btn-sm"
                        @click="setTayang(item, 'Tayang')"
                        :disabled="isUpdating === item.id_testimoni"
                        title="Tayangkan Testimoni"
                      >
                        <i
                          :class="
                            isUpdating === item.id_testimoni
                              ? 'fa fa-spinner fa-spin'
                              : 'fa fa-check'
                          "
                        ></i>
                      </button>
                      <button
                        v-else
                        class="btn btn-warning btn-sm"
                        @click="setTayang(item, 'Draft')"
                        :disabled="isUpdating === item.id_testimoni"
                        title="Ubah ke Draft"
                      >
                        <i
                          :class="
                            isUpdating === item.id_testimoni
                              ? 'fa fa-spinner fa-spin'
                              : 'fa fa-eye-slash'
                          "
                        ></i>
                      </button>

                      <!-- Delete Button -->
                      <button
                        class="btn btn-danger btn-sm"
                        @click="confirmDelete(item)"
                        title="Hapus Testimoni"
                      >
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="itemsList.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    Tidak ada data testimoni yang tersedia.
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <!-- Pagination -->
          <div
            class="d-flex justify-content-between align-items-center mt-3 flex-wrap pagination"
          >
            <div class="text-muted small">
              Menampilkan
              <strong>{{ startItem }}</strong
              >–<strong>{{ endItem }}</strong>
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
                <span
                  >dari <strong>{{ totalPages }}</strong></span
                >
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
import {
  ref,
  reactive,
  computed,
  onMounted,
  watch,
  defineAsyncComponent,
} from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { debounce } from "lodash-es";
import { formatDate } from "@/utils/formatDate";
import {
  getTestimoni,
  updateTestimoni,
  deleteTestimoni,
} from "@/services/general/website/testimoni";

const TestimoniDetailModal = defineAsyncComponent(() =>
  import("./TestimoniDetailModal.vue"),
);

const toast = useToast();

// === State ===
const itemsList = ref([]);
const isLoading = ref(false);
const isUpdating = ref(null);
const sortColumn = ref("created_at");
const sortDirection = ref("desc");
const currentPage = ref(1);
const perPage = ref(20);
const totalItems = ref(0);
const isFilterVisible = ref(false);
const showDetailModal = ref(false);
const selectedItem = ref(null);

const filters = reactive({
  konten: "",
  tayang: "",
  nilai: "",
});

// === Computed ===
const totalPages = computed(
  () => Math.ceil(totalItems.value / perPage.value) || 1,
);
const startItem = computed(() =>
  totalItems.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1,
);
const endItem = computed(() =>
  Math.min(currentPage.value * perPage.value, totalItems.value),
);

// === Lifecycle ===
onMounted(() => {
  fetchData();
});

// === Watcher ===
const debouncedFetch = debounce(() => {
  currentPage.value = 1;
  fetchData();
}, 500);

watch(filters, () => debouncedFetch(), { deep: true });

// === Methods ===
function openDetailModal(item) {
  selectedItem.value = item;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedItem.value = null;
}

async function fetchData() {
  isLoading.value = true;
  try {
    const filterParts = [];
    for (const key in filters) {
      if (filters[key]) {
        filterParts.push(`${key}=${filters[key]}`);
      }
    }
    const filterString = filterParts.join(",");

    const params = {
      page: currentPage.value,
      limit: perPage.value,
      order: `${sortColumn.value} ${sortDirection.value}`,
      filter: filterString,
    };

    const res = await getTestimoni(params);
    const responseBody = res.data?.[0] || {};
    const data = responseBody.data || [];
    const pagination = responseBody.meta?.pagination || {};

    itemsList.value = data;
    totalItems.value = pagination.total || data.length;
    perPage.value = pagination.per_page || 20;
  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat data testimoni");
  } finally {
    isLoading.value = false;
  }
}

async function setTayang(item, newStatus) {
  const id = item.id_testimoni;
  if (!id) return;
  isUpdating.value = id;

  try {
    const data = new FormData();
    data.append("record[tayang]", newStatus);
    data.append("_method", "PUT");

    await updateTestimoni(id, data);

    const index = itemsList.value.findIndex((t) => t.id_testimoni === id);
    if (index !== -1) {
      itemsList.value[index] = {
        ...itemsList.value[index],
        tayang: newStatus,
      };
    }

    toast.success(
      newStatus === "Tayang"
        ? "Testimoni berhasil ditayangkan"
        : "Testimoni berhasil diubah ke Draft",
    );
  } catch (err) {
    console.error("Error updating testimoni:", err);
    toast.error("Gagal mengubah status testimoni.");
  } finally {
    isUpdating.value = null;
  }
}

async function confirmDelete(item) {
  const result = await Swal.fire({
    title: "Hapus Testimoni",
    text: "Apakah Anda yakin ingin menghapus testimoni ini?",
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
      if (item.id_testimoni) {
        await deleteTestimoni(item.id_testimoni);
        toast.success("Testimoni berhasil dihapus");
        if (itemsList.value.length === 1 && currentPage.value > 1) {
          currentPage.value--;
        }
        fetchData();
      } else {
        toast.error("ID Testimoni tidak ditemukan");
      }
    } catch (err) {
      toast.error("Gagal menghapus testimoni");
    }
  }
}

function sortBy(column) {
  sortDirection.value =
    sortColumn.value === column && sortDirection.value === "asc"
      ? "desc"
      : "asc";
  sortColumn.value = column;
  fetchData();
}

function toggleFilter() {
  isFilterVisible.value = !isFilterVisible.value;
}

function resetFilters() {
  filters.konten = "";
  filters.tayang = "";
  filters.nilai = "";
  sortColumn.value = "created_at";
  sortDirection.value = "desc";
  currentPage.value = 1;
  fetchData();
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchData();
  }
}
</script>

<style scoped>
.star-rating i {
  font-size: 12px;
}

th {
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
  vertical-align: middle;
}

.btn-group .btn {
  display: inline-flex;
  align-items: center;
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
