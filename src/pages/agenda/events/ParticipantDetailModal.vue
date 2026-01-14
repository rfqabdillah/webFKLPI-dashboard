<template>
  <BaseDetailModal
    title="Detail Data Peserta"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailUser"
    id-key="idpengguna"
    @close="$emit('close')"
    @loaded="processDetailItem"
  >
    <template #detail="{ item }">
      <div class="text-center mb-4">
        <img
          v-if="item.foto"
          :src="item.foto"
          alt="Foto Peserta"
          class="foto-peserta"
          @error="(e) => (e.target.style.display = 'none')"
        />
        <div
          v-else
          class="foto-peserta d-flex align-items-center justify-content-center text-white fw-bold"
          :style="{ backgroundColor: getRandomColor(item.nama) }"
        >
          <span style="font-size: 3rem">{{ getInitials(item.nama) }}</span>
        </div>
        <h2 class="nama-peserta mt-3">
          {{ item.gelardepan }} {{ item.nama || "Nama Peserta" }}
          {{ item.gelarbelakang }}
        </h2>
        <p class="text-muted">
          <i class="fa fa-id-badge me-1"></i>
          {{
            item.roles?.[0]?.namalevel ||
            item["user-types"]?.[0]?.namajenispengguna ||
            "Pengguna"
          }}
        </p>
        <span
          class="badge"
          :class="{
            'bg-success': item.status === 'Aktif',
            'bg-danger': item.status === 'Tidak Aktif',
          }"
        >
          {{ item.status || "Status" }}
        </span>
      </div>

      <hr />

      <!-- Biodata -->
      <div class="detail-section">
        <h4><i class="fa fa-user me-2"></i>Biodata Peserta</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>NIK</dt>
              <dd>{{ item.nik || "-" }}</dd>
              <dt>NIP</dt>
              <dd>{{ item.nip || "-" }}</dd>
              <dt>No. Karpeg</dt>
              <dd>{{ item.no_karpeg || "-" }}</dd>
              <dt>Jenis Kelamin</dt>
              <dd>{{ item.genders?.[0]?.namajeniskelamin || "-" }}</dd>
              <dt>Tempat Lahir</dt>
              <dd>{{ item.tempatlahir || "-" }}</dd>
              <dt>Tanggal Lahir</dt>
              <dd>{{ formatDate(item.tanggallahir) || "-" }}</dd>
            </dl>
          </div>

          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Email</dt>
              <dd>{{ item.email || "-" }}</dd>
              <dt>Telepon</dt>
              <dd>{{ item.telp || "-" }}</dd>
              <dt>Alamat</dt>
              <dd>{{ item.alamat || "-" }}</dd>
              <dt>Kabupaten</dt>
              <dd>{{ item.kodekabupaten || "-" }}</dd>
              <dt>Jenis Pengguna</dt>
              <dd>{{ item["user-types"]?.[0]?.namajenispengguna || "-" }}</dd>
              <dt>Profesi</dt>
              <dd>
                {{ item["employee-types"]?.[0]?.namajenispegawai || "-" }}
              </dd>
            </dl>
          </div>
        </div>

        <!-- Minat -->
        <dl v-if="item.minat" class="detail-list mt-3">
          <dt>Minat</dt>
          <dd>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(interest, index) in parseBubble(item.minat)"
                :key="index"
                class="badge bg-light text-primary border border-primary px-3 py-2"
              >
                {{ interest }}
              </span>
            </div>
          </dd>
        </dl>
      </div>

      <hr />

      <!-- Riwayat Unit Kerja (ASN) -->
      <div v-if="isASN" class="detail-section">
        <h4><i class="fa fa-building me-2"></i>Riwayat Unit Kerja</h4>
        <SimpleHistoryTable
          :items="riwayatUnitKerja"
          :columns="unitKerjaColumns"
          item-key="idpenggunaunitkerja"
          empty-icon="fa-building-o"
          empty-message="Belum ada riwayat unit kerja"
        />
      </div>

      <!-- Riwayat Perusahaan (Non-ASN) -->
      <div v-if="!isASN" class="detail-section">
        <h4><i class="fa fa-briefcase me-2"></i>Riwayat Perusahaan</h4>
        <SimpleHistoryTable
          :items="riwayatPerusahaan"
          :columns="perusahaanColumns"
          item-key="idpenggunaperusahaan"
          empty-icon="fa-briefcase"
          empty-message="Belum ada riwayat perusahaan"
        />
      </div>

      <!-- Riwayat Jabatan (hanya untuk ASN) -->
      <div v-if="isASN" class="detail-section">
        <h4><i class="fa fa-briefcase me-2"></i>Riwayat Jabatan</h4>
        <SimpleHistoryTable
          :items="riwayatJabatan"
          :columns="jabatanColumns"
          item-key="idepnggunajenjang"
          empty-icon="fa-briefcase"
          empty-message="Belum ada riwayat jabatan"
        />
      </div>

      <!-- Riwayat Pangkat (hanya untuk ASN) -->
      <div v-if="isASN" class="detail-section">
        <h4><i class="fa fa-star me-2"></i>Riwayat Pangkat</h4>
        <SimpleHistoryTable
          :items="riwayatPangkat"
          :columns="pangkatColumns"
          item-key="idpenggunapangkat"
          empty-icon="fa-star-o"
          empty-message="Belum ada riwayat pangkat"
        />
      </div>

      <!-- Riwayat Pendidikan -->
      <div class="detail-section">
        <h4><i class="fa fa-graduation-cap me-2"></i>Riwayat Pendidikan</h4>
        <SimpleHistoryTable
          :items="riwayatPendidikan"
          :columns="pendidikanColumns"
          item-key="idpenggunapendidikan"
          empty-icon="fa-graduation-cap"
          empty-message="Belum ada riwayat pendidikan"
        />
      </div>

      <!-- Riwayat Pelatihan -->
      <div class="detail-section">
        <h4><i class="fa fa-certificate me-2"></i>Riwayat Pelatihan</h4>
        <SimpleHistoryTable
          :items="riwayatPelatihan"
          :columns="pelatihanColumns"
          item-key="idpenggunapelatihan"
          empty-icon="fa-certificate"
          empty-message="Belum ada riwayat pelatihan"
        />
      </div>

      <!-- Riwayat Prestasi -->
      <div class="detail-section">
        <h4><i class="fa fa-trophy me-2"></i>Riwayat Prestasi</h4>
        <SimpleHistoryTable
          :items="riwayatPrestasi"
          :columns="prestasiColumns"
          item-key="idpenggunaprestasi"
          empty-icon="fa-trophy"
          empty-message="Belum ada riwayat prestasi"
        />
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import { ref } from "vue";
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import SimpleHistoryTable from "@/components/base/SimpleHistoryTable.vue";
import { getDetailUser } from "@/services/referensi/users";
import { formatDate } from "@/utils/formatDate";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import { parseBubble } from "@/utils/parseBubble";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

// === State ===
const riwayatUnitKerja = ref([]);
const riwayatPerusahaan = ref([]);
const riwayatJabatan = ref([]);
const riwayatPangkat = ref([]);
const riwayatPendidikan = ref([]);
const riwayatPelatihan = ref([]);
const riwayatPrestasi = ref([]);
const isASN = ref(true);

// === Column Definitions ===
const unitKerjaColumns = [
  {
    key: "_refData.namaunitkerja",
    label: "Unit Kerja",
    getValue: (item) => item._refData?.namaunitkerja || "-",
  },
  {
    key: "tglmulaiunitkerja",
    label: "Tanggal Mulai",
    width: "15%",
    type: "date",
  },
  {
    key: "tglselesaiunitkerja",
    label: "Tanggal Selesai",
    width: "15%",
    type: "date",
  },
  {
    key: "fileskunitkerja",
    label: "File SK",
    width: "10%",
    type: "file",
    class: "text-center",
    fileLabel: "Lihat",
  },
  {
    key: "statusunitkerja",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

const perusahaanColumns = [
  {
    key: "namaperusahaan",
    label: "Nama Perusahaan",
  },
  {
    key: "alamatperusahaan",
    label: "Alamat",
    width: "25%",
  },
  {
    key: "tglmulaiperusahaan",
    label: "Tanggal Mulai",
    width: "15%",
    type: "date",
  },
  {
    key: "tglselesaiperusahaan",
    label: "Tanggal Selesai",
    width: "15%",
    type: "date",
  },
  {
    key: "statusperusahaan",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

const jabatanColumns = [
  {
    key: "_refData.namajenjang",
    label: "Jenjang Jabatan",
    getValue: (item) => item._refData?.namajenjang || "-",
  },
  {
    key: "tglmulaijenjang",
    label: "Tanggal Mulai",
    width: "15%",
    type: "date",
  },
  {
    key: "tglselesaijenjang",
    label: "Tanggal Selesai",
    width: "15%",
    type: "date",
  },
  {
    key: "fileskjenjang",
    label: "File SK",
    width: "10%",
    type: "file",
    class: "text-center",
    fileLabel: "Lihat",
  },
  {
    key: "statusjenjang",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

const pangkatColumns = [
  {
    key: "_refData.pangkat",
    label: "Pangkat",
    getValue: (item) => item._refData?.pangkat || "-",
  },
  {
    key: "tglmulaipangkat",
    label: "Tanggal Mulai",
    width: "15%",
    type: "date",
  },
  {
    key: "tglselesaipangkat",
    label: "Tanggal Selesai",
    width: "15%",
    type: "date",
  },
  {
    key: "fileskpangkat",
    label: "File SK",
    width: "10%",
    type: "file",
    class: "text-center",
    fileLabel: "Lihat",
  },
  {
    key: "statuspangkat",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

const pendidikanColumns = [
  {
    key: "_refData.namajenjangpendidikan",
    label: "Jenjang",
    getValue: (item) => item._refData?.namajenjangpendidikan || "-",
  },
  { key: "programstudi", label: "Program Studi" },
  { key: "namaperguruantinggi", label: "Perguruan Tinggi" },
  {
    key: "tahunlulus",
    label: "Tahun Lulus",
    width: "12%",
    class: "text-center",
  },
];

const pelatihanColumns = [
  { key: "namapelatihan", label: "Nama Pelatihan" },
  {
    key: "filesertifikatpelatihan",
    label: "Sertifikat",
    width: "10%",
    type: "file",
    class: "text-center",
    fileLabel: "Lihat",
  },
  {
    key: "status",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

const prestasiColumns = [
  { key: "namaprestasi", label: "Nama Prestasi" },
  {
    key: "_refData.namaskala",
    label: "Skala",
    getValue: (item) => item._refData?.namaskala || "-",
  },
  { key: "namapenyelenggara", label: "Penyelenggara" },
  {
    key: "filesertifikat",
    label: "Sertifikat",
    width: "10%",
    type: "file",
    class: "text-center",
    fileLabel: "Lihat",
  },
  {
    key: "statusprestasi",
    label: "Status",
    width: "10%",
    type: "status",
    class: "text-center",
  },
];

// === Helper Functions ===
function uniqueByKey(array, key) {
  if (!Array.isArray(array)) return [];
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (keyValue && seen.has(keyValue)) {
      return false;
    }
    if (keyValue) seen.add(keyValue);
    return true;
  });
}

function combineRelationData(
  userRelations,
  referenceData,
  userKey,
  refKey,
  refIdKey
) {
  if (!Array.isArray(userRelations) || !Array.isArray(referenceData)) {
    return [];
  }

  const uniqueUserRelations = uniqueByKey(userRelations, userKey);

  const refMap = new Map();
  referenceData.forEach((item) => {
    if (item[refIdKey] && !refMap.has(item[refIdKey])) {
      refMap.set(item[refIdKey], item);
    }
  });

  return uniqueUserRelations.map((relation, index) => {
    const refId = relation[refKey];
    const refData = refMap.get(refId);
    return {
      ...relation,
      _refData: refData || null,
      _index: index,
    };
  });
}

function processDetailItem(item) {
  if (!item) return;

  // Cek tipe pengguna (ASN atau Non-ASN)
  const userType = item["user-types"]?.[0]?.namajenispengguna || "";
  isASN.value = !userType.toLowerCase().includes("non-asn");

  // Process Riwayat Unit Kerja (untuk ASN)
  riwayatUnitKerja.value = combineRelationData(
    item["user-work-units"] || [],
    item["work-units"] || [],
    "idpenggunaunitkerja",
    "idunitkerja",
    "idunitkerja"
  );

  // Process Riwayat Perusahaan (untuk Non-ASN)
  riwayatPerusahaan.value = (item["user-companies"] || []).map(
    (company, index) => ({
      ...company,
      _index: index,
    })
  );

  // Process Riwayat Jabatan
  riwayatJabatan.value = combineRelationData(
    item["user-levels"] || [],
    item["level"] || [],
    "idepnggunajenjang",
    "idjenjang",
    "idjenjang"
  );

  // Process Riwayat Pangkat
  riwayatPangkat.value = combineRelationData(
    item["user-ranks"] || [],
    item["ranks"] || [],
    "idpenggunapangkat",
    "idpangkat",
    "idpangkat"
  );

  // Process Riwayat Pendidikan
  riwayatPendidikan.value = combineRelationData(
    item["user-educations"] || [],
    item["education-levels"] || [],
    "idpenggunapendidikan",
    "idjenjangpendidikan",
    "idjenjangpendidikan"
  );

  // Process Riwayat Pelatihan
  const userTrainings = item["user-trainings"] || [];
  riwayatPelatihan.value = uniqueByKey(
    userTrainings,
    "idpenggunapelatihan"
  ).filter((t) => t.namapelatihan);

  // Process Riwayat Prestasi
  riwayatPrestasi.value = combineRelationData(
    item["user-achievments"] || [],
    item["scale"] || [],
    "idpenggunaprestasi",
    "idskala",
    "idskala"
  );
}
</script>

<style scoped>
.foto-peserta {
  display: block;
  margin: 0 auto;
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e9ecef;
}

.nama-peserta {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.detail-section {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.detail-grid-container {
  padding-top: 0.5rem;
}

.detail-list {
  margin-bottom: 0;
}

.detail-list dt {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.detail-list dd {
  color: #555;
  margin-bottom: 1rem;
  padding-left: 0;
}
</style>
