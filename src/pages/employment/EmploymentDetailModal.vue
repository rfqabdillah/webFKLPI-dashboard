<template>
  <BaseDetailModal
    title="Detail Data Pegawai"
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
          alt="Foto Pegawai"
          class="foto-pegawai"
          onerror="this.src='https://placehold.co/200x200/EBF4FF/7F9CF5?text=Foto'"
        />
        <img
          v-else
          src="https://placehold.co/200x200/EBF4FF/7F9CF5?text=Foto"
          alt="Foto Default"
          class="foto-pegawai"
        />
        <h2 class="nama-pegawai mt-3">
          {{ item.gelardepan }} {{ item.nama || "Nama Pegawai" }}
          {{ item.gelarbelakang }}
        </h2>
        <p class="text-muted">
          <i class="fa fa-id-badge me-1"></i>
          {{ item.roles?.[0]?.namalevel || "Level" }}
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
        <h4><i class="fa fa-user me-2"></i>Biodata Pegawai</h4>
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
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <div class="detail-section">
        <h4><i class="fa fa-building me-2"></i>Riwayat Unit Kerja</h4>
        <div v-if="riwayatUnitKerja.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Unit Kerja</th>
                <th width="15%">Tanggal Mulai</th>
                <th width="15%">Tanggal Selesai</th>
                <th width="10%">File SK</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(uk, index) in riwayatUnitKerja"
                :key="uk.idpenggunaunitkerja || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ uk._refData?.namaunitkerja || "-" }}</td>
                <td>{{ formatDate(uk.tglmulaiunitkerja) }}</td>
                <td>
                  {{
                    uk.tglselesaiunitkerja
                      ? formatDate(uk.tglselesaiunitkerja)
                      : "-"
                  }}
                </td>
                <td class="text-center">
                  <a
                    v-if="uk.fileskunitkerja"
                    :href="uk.fileskunitkerja"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fa fa-external-link"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': uk.statusunitkerja === 'Aktif',
                      'bg-secondary': uk.statusunitkerja !== 'Aktif',
                    }"
                  >
                    {{ uk.statusunitkerja || "-" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-building-o fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat unit kerja</p>
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-briefcase me-2"></i>Riwayat Jabatan</h4>
        <div v-if="riwayatJabatan.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Jenjang Jabatan</th>
                <th width="15%">Tanggal Mulai</th>
                <th width="15%">Tanggal Selesai</th>
                <th width="10%">File SK</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(jab, index) in riwayatJabatan"
                :key="jab.idepnggunajenjang || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ jab._refData?.namajenjang || "-" }}</td>
                <td>{{ formatDate(jab.tglmulaijenjang) }}</td>
                <td>
                  {{
                    jab.tglselesaijenjang
                      ? formatDate(jab.tglselesaijenjang)
                      : "-"
                  }}
                </td>
                <td class="text-center">
                  <a
                    v-if="jab.fileskjenjang"
                    :href="jab.fileskjenjang"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fa fa-external-link"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': jab.statusjenjang === 'Aktif',
                      'bg-secondary': jab.statusjenjang !== 'Aktif',
                    }"
                  >
                    {{ jab.statusjenjang || "-" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-briefcase fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat jabatan</p>
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-star me-2"></i>Riwayat Pangkat</h4>
        <div v-if="riwayatPangkat.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Pangkat</th>
                <th width="15%">Tanggal Mulai</th>
                <th width="15%">Tanggal Selesai</th>
                <th width="10%">File SK</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(pkt, index) in riwayatPangkat"
                :key="pkt.idpenggunapangkat || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ pkt._refData?.pangkat || "-" }}</td>
                <td>{{ formatDate(pkt.tglmulaipangkat) }}</td>
                <td>
                  {{
                    pkt.tglselesaipangkat
                      ? formatDate(pkt.tglselesaipangkat)
                      : "-"
                  }}
                </td>
                <td class="text-center">
                  <a
                    v-if="pkt.fileskpangkat"
                    :href="pkt.fileskpangkat"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fa fa-external-link"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': pkt.statuspangkat === 'Aktif',
                      'bg-secondary': pkt.statuspangkat !== 'Aktif',
                    }"
                  >
                    {{ pkt.statuspangkat || "-" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-star-o fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat pangkat</p>
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-graduation-cap me-2"></i>Riwayat Pendidikan</h4>
        <div v-if="riwayatPendidikan.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Jenjang</th>
                <th>Program Studi</th>
                <th>Perguruan Tinggi</th>
                <th width="12%">Tahun Lulus</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(pdk, index) in riwayatPendidikan"
                :key="pdk.idpenggunapendidikan || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  {{ pdk._refData?.namajenjangpendidikan || "-" }}
                </td>
                <td>{{ pdk.programstudi || "-" }}</td>
                <td>{{ pdk.namaperguruantinggi || "-" }}</td>
                <td class="text-center">{{ pdk.tahunlulus || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-graduation-cap fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat pendidikan</p>
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-certificate me-2"></i>Riwayat Pelatihan</h4>
        <div v-if="riwayatPelatihan.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Nama Pelatihan</th>
                <th width="10%">Sertifikat</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(plt, index) in riwayatPelatihan"
                :key="plt.idpenggunapelatihan || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ plt.namapelatihan || "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="plt.filesertifikatpelatihan"
                    :href="plt.filesertifikatpelatihan"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fa fa-external-link"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': plt.status === 'Aktif',
                      'bg-secondary': plt.status !== 'Aktif',
                    }"
                  >
                    {{ plt.status || "-" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-certificate fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat pelatihan</p>
        </div>
      </div>

      <div class="detail-section">
        <h4><i class="fa fa-trophy me-2"></i>Riwayat Prestasi</h4>
        <div v-if="riwayatPrestasi.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Nama Prestasi</th>
                <th>Skala</th>
                <th>Penyelenggara</th>
                <th width="10%">Sertifikat</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(prs, index) in riwayatPrestasi"
                :key="prs.idpenggunaprestasi || index"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ prs.namaprestasi || "-" }}</td>
                <td>{{ prs._refData?.namaskala || "-" }}</td>
                <td>{{ prs.namapenyelenggara || "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="prs.filesertifikat"
                    :href="prs.filesertifikat"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fa fa-external-link"></i>
                  </a>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <span
                    class="badge"
                    :class="{
                      'bg-success': prs.statusprestasi === 'Aktif',
                      'bg-secondary': prs.statusprestasi !== 'Aktif',
                    }"
                  >
                    {{ prs.statusprestasi || "-" }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="empty-state">
          <i class="fa fa-trophy fa-3x text-muted mb-3"></i>
          <p class="text-muted mb-0">Belum ada riwayat prestasi</p>
        </div>
      </div>

      <hr />
      <div class="detail-section">
        <h4><i class="fa fa-clock-o me-2"></i>Informasi Sistem</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Dibuat Pada</dt>
              <dd>{{ formatDate(item.created_at) || "-" }}</dd>
              <dt>Diupdate Pada</dt>
              <dd>{{ formatDate(item.updated_at) || "-" }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Email Terverifikasi</dt>
              <dd>
                {{
                  item.email_verified_at
                    ? formatDate(item.email_verified_at)
                    : "Belum terverifikasi"
                }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import { ref, watch } from "vue";
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { getDetailUser } from "@/services/referensi/users";
import { formatDate } from "@/utils/formatDate";

const props = defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

// === State ===
const riwayatUnitKerja = ref([]);
const riwayatJabatan = ref([]);
const riwayatPangkat = ref([]);
const riwayatPendidikan = ref([]);
const riwayatPelatihan = ref([]);
const riwayatPrestasi = ref([]);
const detailItem = ref(null);

// === Helper Functions ===

/**
 * Remove duplicates from array based on a key
 */
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

/**
 * Combine user relation data with reference data
 * e.g., combine user-work-units with work-units by matching idunitkerja
 */
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

  // Remove duplicates from user relations
  const uniqueUserRelations = uniqueByKey(userRelations, userKey);

  // Create a map of reference data by ID
  const refMap = new Map();
  referenceData.forEach((item, index) => {
    if (item[refIdKey] && !refMap.has(item[refIdKey])) {
      refMap.set(item[refIdKey], item);
    }
  });

  // Combine data
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

/**
 * Process detail item and extract riwayat data
 */
function processDetailItem(item) {
  if (!item) return;

  detailItem.value = item;

  // Process Riwayat Unit Kerja
  const userWorkUnits = item["user-work-units"] || [];
  const workUnits = item["work-units"] || [];
  riwayatUnitKerja.value = combineRelationData(
    userWorkUnits,
    workUnits,
    "idpenggunaunitkerja",
    "idunitkerja",
    "idunitkerja"
  );

  // Process Riwayat Jabatan (user-levels with level)
  const userLevels = item["user-levels"] || [];
  const levels = item["level"] || [];
  riwayatJabatan.value = combineRelationData(
    userLevels,
    levels,
    "idepnggunajenjang",
    "idjenjang",
    "idjenjang"
  );

  // Process Riwayat Pangkat (user-ranks with ranks)
  const userRanks = item["user-ranks"] || [];
  const ranks = item["ranks"] || [];
  riwayatPangkat.value = combineRelationData(
    userRanks,
    ranks,
    "idpenggunapangkat",
    "idpangkat",
    "idpangkat"
  );

  // Process Riwayat Pendidikan (user-educations with education-levels)
  const userEducations = item["user-educations"] || [];
  const educationLevels = item["education-levels"] || [];
  riwayatPendidikan.value = combineRelationData(
    userEducations,
    educationLevels,
    "idpenggunapendidikan",
    "id_jenjang_pendidikan",
    "idjenjangpendidikan"
  );

  // Process Riwayat Pelatihan
  const userTrainings = item["user-trainings"] || [];
  riwayatPelatihan.value = uniqueByKey(
    userTrainings,
    "idpenggunapelatihan"
  ).filter(
    (t) => t.namapelatihan // Only include trainings with a name
  );

  // Process Riwayat Prestasi (user-achievments with scale)
  const userAchievements = item["user-achievments"] || [];
  const scales = item["scale"] || [];
  riwayatPrestasi.value = combineRelationData(
    userAchievements,
    scales,
    "idpenggunaprestasi",
    "idskala",
    "idskala"
  );
}
</script>

<style scoped>
.foto-pegawai {
  display: block;
  margin: 0 auto;
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e9ecef;
}

.nama-pegawai {
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

.table {
  font-size: 0.9rem;
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-color: #dee2e6;
  vertical-align: middle;
}

.table tbody td {
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.empty-state i {
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}
</style>
