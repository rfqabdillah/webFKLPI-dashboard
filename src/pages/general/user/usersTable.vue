<template>
  <BaseTable
    title="Daftar Pengguna"
    entityName="Pengguna"
    :apiService="userApi"
    :FormModalComponent="UserFormModal"
    :DetailModalComponent="UserDetailModal"
    :columns="columns"
    primaryKey="idpengguna"
    deleteItemNameKey="nama"
    :initialFilters="initialFilters"
    initialSortColumn="nama"
    initialSortDirection="asc"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-6">
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
        <div class="col-md-6">
          <label for="filterUserLevel" class="form-label text-dark fw-semibold"
            >Level</label
          >
          <select
            id="filterUserLevel"
            class="form-select"
            v-model="filters.namalevel"
          >
            <option value="">Semua Level</option>
            <option
              v-for="role in roleOptions"
              :key="role.idlevel"
              :value="role.namalevel"
            >
              {{ role.namalevel }}
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
        style="width: 50px; height: 50px; cursor: pointer; border-radius: 4px"
        @click="showImage(item.foto)"
      />
      <span v-else class="text-muted">-</span>
    </template>

    <template #cell(namalevel)="{ item }">
      <span v-if="item['roles'] && item['roles'].length > 0">
        {{ item["roles"][0]?.namalevel }}
      </span>
      <span v-else class="text-muted">-</span>
    </template>

    <!-- <template #cell(namakejuruan)="{ item }">
      {{ item["vocational-fields"]?.namakejuruan || "-" }}
    </template> -->
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
import { deleteUser, getUsers } from "@/services/referensi/users";
import { getRoles } from "@/services/referensi/roles";
import vueEasyLightbox from "vue-easy-lightbox";
import { Teleport } from "vue";

const UserFormModal = defineAsyncComponent(() => import("./UserFormModal.vue"));

const UserDetailModal = defineAsyncComponent(() =>
  import("./UserDetailModal.vue")
);

const userApi = {
  get: getUsers,
  delete: deleteUser,
};

const columns = [
  { key: "foto", label: "Foto", sortable: true },
  { key: "nama", label: "Nama", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "namalevel", label: "Level", sortable: true },
];

const initialFilters = {
  nama: "",
  namalevel: "",
};

const roleOptions = ref([]);
const lightboxVisible = ref(false);
const lightboxImgs = ref("");

async function fetchRoles() {
  try {
    const response = await getRoles({ page: 1, limit: 100 });

    if (Array.isArray(response.data) && response.data.length > 0) {
      const rootData = response.data[0];
      if (rootData.data && Array.isArray(rootData.data)) {
        roleOptions.value = rootData.data;
      }
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
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
  fetchRoles();
});
</script>
