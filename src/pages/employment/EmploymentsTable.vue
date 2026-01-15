<template>
  <BaseTable
    title="Daftar Productivity Champions"
    entityName="Productivity Champions"
    :apiService="employmentApi"
    :FormModalComponent="EmploymentFormModal"
    :DetailModalComponent="EmploymentDetailModal"
    :columns="columns"
    primaryKey="idpengguna"
    deleteItemNameKey="nama"
    :initialFilters="initialFilters"
    initialSortColumn="nama"
    initialSortDirection="asc"
    @reset-filters="handleResetFilters"
  >
    <template #filters="{ filters }">
      <div class="row g-3">
        <div class="col-md-4">
          <label for="filterNama" class="form-label text-dark fw-semibold"
            >Nama</label
          >
          <input
            type="text"
            id="filterNama"
            class="form-control"
            v-model="filters.nama"
            placeholder="Masukkan nama"
          />
        </div>
        <div class="col-md-4">
          <label for="filterNIK" class="form-label text-dark fw-semibold"
            >NIK</label
          >
          <input
            type="text"
            id="filterNIK"
            class="form-control"
            v-model="filters.nik"
            placeholder="Masukkan NIK"
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
          <label for="filterProfesi" class="form-label text-dark fw-semibold"
            >Profesi</label
          >
          <select
            id="filterProfesi"
            class="form-select"
            v-model="filters.idjenispegawai"
          >
            <option value="">Semua Profesi</option>
            <option
              v-for="profesi in profesiOptions"
              :key="profesi.id"
              :value="profesi.id"
            >
              {{ profesi.nama }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label
            for="filterJenisPengguna"
            class="form-label text-dark fw-semibold"
            >Jenis Pengguna</label
          >
          <select
            id="filterJenisPengguna"
            class="form-select"
            v-model="filters.idjenispengguna"
          >
            <option value="">Semua Jenis Pengguna</option>
            <option
              v-for="jenis in jenisPenggunaOptions"
              :key="jenis.id"
              :value="jenis.id"
            >
              {{ jenis.nama }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="filterProvinsi" class="form-label text-dark fw-semibold"
            >Provinsi</label
          >
          <select
            id="filterProvinsi"
            class="form-select"
            v-model="selectedProvinsi"
            @change="handleProvinceChange(filters)"
          >
            <option value="">Semua Provinsi</option>
            <option
              v-for="prov in provinsiOptions"
              :key="prov.id"
              :value="prov.kode"
            >
              {{ prov.kode }} - {{ prov.nama }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label for="filterKabupaten" class="form-label text-dark fw-semibold"
            >Kabupaten</label
          >
          <select
            id="filterKabupaten"
            class="form-select"
            v-model="filters.kodekabupaten"
            :disabled="!selectedProvinsi || kabupatenLoading"
          >
            <option :value="selectedProvinsi || ''">
              {{
                kabupatenLoading
                  ? "Memuat..."
                  : selectedProvinsi
                  ? "Semua Kabupaten"
                  : "Pilih provinsi terlebih dahulu"
              }}
            </option>
            <option
              v-for="kab in kabupatenOptions"
              :key="kab.id"
              :value="kab.kode"
            >
              {{ kab.kode }} - {{ kab.nama }}
            </option>
          </select>
        </div>
      </div>
    </template>

    <template #cell(created_at)="{ value }">
      {{ formatDate(value) }}
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

    <template #cell(namaunitkerja)="{ item }">
      <span>{{ getActiveUnitKerja(item) }}</span>
    </template>

    <template #cell(pangkat)="{ item }">
      <span>{{ getActivePangkat(item) }}</span>
    </template>
    <template #cell(namajenjang)="{ item }">
      <span>{{ getActiveJenjang(item) }}</span>
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
import { formatDate } from "@/utils/formatDate";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import { getUsers, deleteUser } from "@/services/referensi/users";
import { getEmployeeTypes } from "@/services/referensi/employeeTypes";
import { getUserTypes } from "@/services/referensi/userTypes";
import { getRegions } from "@/services/referensi/regions";
import VueEasyLightbox from "vue-easy-lightbox";

const EmploymentFormModal = defineAsyncComponent(() =>
  import("./EmploymentFormModal.vue")
);
const EmploymentDetailModal = defineAsyncComponent(() =>
  import("./EmploymentDetailModal.vue")
);

const employmentApi = {
  get: getUsers,
  delete: deleteUser,
};

const columns = [
  { key: "foto", label: "Foto", sortable: true },
  { key: "nama", label: "Nama", sortable: true },
  { key: "namaunitkerja", label: "Unit Kerja", sortable: true },
  { key: "namajenjang", label: "Jenjang Jabatan", sortable: true },
  { key: "pangkat", label: "Pangkat", sortable: true },
];

const initialFilters = {
  nama: "",
  nik: "",
  email: "",
  idjenispegawai: "",
  idjenispengguna: "",
  kodekabupaten: "",
};

// Dropdown options
const profesiOptions = ref([]);
const jenisPenggunaOptions = ref([]);
const provinsiOptions = ref([]);
const kabupatenOptions = ref([]);
const kabupatenLoading = ref(false);
const selectedProvinsi = ref("");

// Fetch dropdown data
const fetchProfesiOptions = async () => {
  try {
    const response = await getEmployeeTypes({ limit: 100 });
    const data = response.data?.[0]?.data || response.data?.data || [];
    profesiOptions.value = data.map((item) => ({
      id: item.idjenispegawai,
      nama: item.namajenispegawai,
    }));
  } catch (error) {
    console.error("Error fetching profesi options:", error);
  }
};

const fetchJenisPenggunaOptions = async () => {
  try {
    const response = await getUserTypes({ limit: 100 });
    const data = response.data?.[0]?.data || response.data?.data || [];
    jenisPenggunaOptions.value = data.map((item) => ({
      id: item.idjenispengguna,
      nama: item.namajenispengguna,
    }));
  } catch (error) {
    console.error("Error fetching jenis pengguna options:", error);
  }
};

const fetchProvinsiOptions = async () => {
  try {
    const response = await getRegions({ filter: "tipewilayah=A", limit: 100 });
    const data = response.data?.[0]?.data || response.data?.data || [];
    provinsiOptions.value = data.map((item) => ({
      id: item.idwilayah,
      kode: item.kodewilayah,
      nama: item.namawilayah,
    }));
  } catch (error) {
    console.error("Error fetching provinsi options:", error);
  }
};

const fetchKabupatenOptions = async (provCode) => {
  kabupatenLoading.value = true;
  kabupatenOptions.value = [];
  try {
    const response = await getRegions({
      filter: `tipewilayah=B,kodewilayah=${provCode}`,
      limit: 500,
    });
    const data = response.data?.[0]?.data || response.data?.data || [];
    // Filter dengan dua format: (37.09) atau (3709)
    const filteredData = data.filter((item) => {
      const kode = item.kodewilayah;
      return (
        kode.startsWith(provCode + ".") ||
        (kode.startsWith(provCode) &&
          kode.length > provCode.length &&
          !kode.includes("."))
      );
    });
    kabupatenOptions.value = filteredData.map((item) => ({
      id: item.idwilayah,
      kode: item.kodewilayah,
      nama: item.namawilayah,
    }));
  } catch (error) {
    console.error("Error fetching kabupaten options:", error);
  } finally {
    kabupatenLoading.value = false;
  }
};

const handleProvinceChange = (filters) => {
  if (selectedProvinsi.value) {
    filters.kodekabupaten = selectedProvinsi.value;
    fetchKabupatenOptions(selectedProvinsi.value);
  } else {
    filters.kodekabupaten = "";
    kabupatenOptions.value = [];
  }
};

const handleResetFilters = () => {
  selectedProvinsi.value = "";
  kabupatenOptions.value = [];
};

onMounted(() => {
  fetchProfesiOptions();
  fetchJenisPenggunaOptions();
  fetchProvinsiOptions();
});

const lightboxVisible = ref(false);
const lightboxImgs = ref("");

function showImage(imageUrl) {
  lightboxImgs.value = imageUrl;
  lightboxVisible.value = true;
}

function hideImage() {
  lightboxVisible.value = false;
}

function getActiveUnitKerja(item) {
  const userWorkUnits = item["user-work-units"];
  const workUnits = item["work-units"];

  if (
    !userWorkUnits ||
    !Array.isArray(userWorkUnits) ||
    userWorkUnits.length === 0
  ) {
    return "-";
  }

  const activeUserWorkUnit = userWorkUnits.find(
    (uwu) => uwu.statusunitkerja === "Aktif"
  );

  if (!activeUserWorkUnit) {
    const firstIdUnitKerja = userWorkUnits[0]?.idunitkerja;
    const firstWorkUnit = workUnits?.find(
      (wu) => wu.idunitkerja === firstIdUnitKerja
    );
    return firstWorkUnit?.namaunitkerja || "-";
  }

  const matchingWorkUnit = workUnits?.find(
    (wu) => wu.idunitkerja === activeUserWorkUnit.idunitkerja
  );

  return matchingWorkUnit?.namaunitkerja || "-";
}

function getActiveJenjang(item) {
  const userLevels = item["user-levels"];
  const levels = item["level"];

  if (!userLevels || !Array.isArray(userLevels) || userLevels.length === 0) {
    return "-";
  }

  const activeUserLevel = userLevels.find((ul) => ul.statusjenjang === "Aktif");

  if (!activeUserLevel) {
    const firstIdJenjang = userLevels[0]?.idjenjang;
    const firstLevel = levels?.find((l) => l.idjenjang === firstIdJenjang);
    return firstLevel?.namajenjang || "-";
  }

  const matchingLevel = levels?.find(
    (l) => l.idjenjang === activeUserLevel.idjenjang
  );

  return matchingLevel?.namajenjang || "-";
}

function getActivePangkat(item) {
  const userRanks = item["user-ranks"];
  const ranks = item["ranks"];

  if (!userRanks || !Array.isArray(userRanks) || userRanks.length === 0) {
    return "-";
  }

  const activeUserRank = userRanks.find((ur) => ur.status === "Aktif");

  let matchingRank = null;

  if (!activeUserRank) {
    const firstIdPangkat = userRanks[0]?.idpangkat;
    matchingRank = ranks?.find((r) => r.idpangkat === firstIdPangkat);
  } else {
    matchingRank = ranks?.find((r) => r.idpangkat === activeUserRank.idpangkat);
  }

  if (!matchingRank) {
    return "-";
  }

  const golongan = matchingRank.golongan || "";
  const ruang = matchingRank.ruang || "";
  const pangkat = matchingRank.pangkat || "";

  if (!golongan && !ruang && !pangkat) {
    return "-";
  }

  return `${golongan}/${ruang}-${pangkat}`;
}
</script>
