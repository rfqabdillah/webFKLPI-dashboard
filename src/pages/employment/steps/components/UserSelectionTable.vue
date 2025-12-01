<template>
  <div class="existing-user-section">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0">
        <i class="fa fa-search me-2"></i>Pilih Pengguna Existing
      </h6>
      <button class="btn btn-outline-secondary btn-sm" @click="$emit('back')">
        <i class="fa fa-arrow-left me-1"></i> Kembali
      </button>
    </div>

    <div class="user-selection-interface">
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0">
              <i class="fa fa-search text-muted"></i>
            </span>
            <input
              type="text"
              class="form-control border-start-0 ps-0"
              placeholder="Cari berdasarkan nama, NIP, atau email"
              v-model="searchQuery"
              @input="onSearch"
            />
          </div>
        </div>
      </div>

      <div class="table-responsive border rounded">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th style="width: 50px" class="text-center">#</th>
              <th>Nama Pegawai</th>
              <th>NIP / NIK</th>
              <th>Email</th>
              <th style="width: 100px" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center py-4">
                <div
                  class="spinner-border text-primary spinner-border-sm"
                  role="status"
                ></div>
                <span class="ms-2 text-muted">Memuat data...</span>
              </td>
            </tr>
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">
                <i class="fa fa-info-circle me-1"></i>
                {{
                  searchQuery
                    ? "Tidak ada pengguna yang cocok."
                    : "Belum ada data pengguna."
                }}
              </td>
            </tr>
            <tr
              v-else
              v-for="(user, index) in filteredUsers"
              :key="user.idpengguna"
            >
              <td class="text-center">{{ index + 1 }}</td>
              <td>
                <div class="d-flex align-items-center">
                  <div v-if="user.foto" class="me-2">
                    <img
                      :src="user.foto"
                      class="rounded-circle"
                      style="width: 32px; height: 32px; object-fit: cover"
                      alt="Foto"
                    />
                  </div>
                  <div
                    v-else
                    class="avatar-circle me-2 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                    style="width: 32px; height: 32px; font-size: 12px"
                  >
                    {{ user.nama ? user.nama.charAt(0).toUpperCase() : "?" }}
                  </div>
                  <div>
                    <div class="fw-bold">{{ user.nama }}</div>
                    <div class="small text-muted">
                      {{ user.jabatan || "-" }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="small">{{ user.nip || "-" }}</div>
                <div class="small text-muted">{{ user.nik || "-" }}</div>
              </td>
              <td>{{ user.email }}</td>
              <td class="text-center">
                <button
                  class="btn btn-primary btn-sm"
                  @click="$emit('select-user', user)"
                >
                  Pilih
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="d-flex justify-content-between align-items-center mt-2 text-muted small"
      >
        <div>Menampilkan {{ filteredUsers.length }} data</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { getUsers } from "@/services/referensi/users";
import { useToast } from "vue-toastification";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["back", "select-user"]);
const toast = useToast();

const searchQuery = ref("");
const users = ref([]);
const loading = ref(false);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter((user) => {
    return (
      user.nama?.toLowerCase().includes(query) ||
      user.nip?.toLowerCase().includes(query) ||
      user.nik?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });
});

function onSearch() {
  // Search is handled by computed property
}

async function fetchUsers() {
  loading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "nama", dir: "asc" };
    const response = await getUsers(params);

    if (response.data && Array.isArray(response.data)) {
      if (
        response.data.length > 0 &&
        response.data[0].data &&
        Array.isArray(response.data[0].data)
      ) {
        users.value = response.data[0].data;
      } else {
        users.value = response.data;
      }
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      users.value = response.data.data;
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat daftar pengguna.");
    users.value = [];
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal && users.value.length === 0) {
      fetchUsers();
    }
  }
);

onMounted(() => {
  if (props.show) {
    fetchUsers();
  }
});
</script>

<style scoped>
.existing-user-section {
  /* Add any specific styles here */
}
</style>
