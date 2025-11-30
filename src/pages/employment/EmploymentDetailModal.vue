<template>
  <BaseDetailModal
    title="Detail Data Pegawai"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailUser"
    id-key="idpengguna"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- Header: Foto & Nama -->
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
          {{ item.roles?.namalevel || "Level" }}
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
            </dl>
          </div>
        </div>
      </div>

      <hr />

      <!-- Riwayat Unit Kerja -->
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
                :key="uk.idpenggunaunitkerja"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ uk["work-units"]?.namaunitkerja || "-" }}</td>
                <td>{{ formatDate(uk.tglmulai) }}</td>
                <td>{{ uk.tglselesai ? formatDate(uk.tglselesai) : "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="uk.filesk"
                    :href="uk.filesk"
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
                      'bg-success': uk.status === 'Aktif',
                      'bg-secondary': uk.status !== 'Aktif',
                    }"
                  >
                    {{ uk.status || "-" }}
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

      <!-- Riwayat Jabatan -->
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
                :key="jab.idpenggunajenjang"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ jab["position-levels"]?.namajenjang || "-" }}</td>
                <td>{{ formatDate(jab.tglmulai) }}</td>
                <td>{{ jab.tglselesai ? formatDate(jab.tglselesai) : "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="jab.filesk"
                    :href="jab.filesk"
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
                      'bg-success': jab.status === 'Aktif',
                      'bg-secondary': jab.status !== 'Aktif',
                    }"
                  >
                    {{ jab.status || "-" }}
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

      <!-- Riwayat Pangkat -->
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
                :key="pkt.idpenggunapangkat"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ pkt.ranks?.pangkat || "-" }}</td>
                <td>{{ formatDate(pkt.tglmulai) }}</td>
                <td>{{ pkt.tglselesai ? formatDate(pkt.tglselesai) : "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="pkt.filesk"
                    :href="pkt.filesk"
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
                      'bg-success': pkt.status === 'Aktif',
                      'bg-secondary': pkt.status !== 'Aktif',
                    }"
                  >
                    {{ pkt.status || "-" }}
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

      <!-- Riwayat Pendidikan -->
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
                :key="pdk.idpenggunapendidikan"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  {{ pdk["education-levels"]?.namajenjangpendidikan || "-" }}
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

      <!-- Riwayat Pelatihan -->
      <div class="detail-section">
        <h4><i class="fa fa-certificate me-2"></i>Riwayat Pelatihan</h4>
        <div v-if="riwayatPelatihan.length > 0" class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th width="5%">No</th>
                <th>Nama Pelatihan</th>
                <th>Penyelenggara</th>
                <th width="12%">Tanggal Mulai</th>
                <th width="12%">Tanggal Selesai</th>
                <th width="10%">Sertifikat</th>
                <th width="10%">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(plt, index) in riwayatPelatihan"
                :key="plt.idpenggunapelatihan"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ plt.namapelatihan || "-" }}</td>
                <td>{{ plt.namapenyelenggara || "-" }}</td>
                <td>{{ formatDate(plt.tglmulai) }}</td>
                <td>{{ plt.tglselesai ? formatDate(plt.tglselesai) : "-" }}</td>
                <td class="text-center">
                  <a
                    v-if="plt.filesertifikat"
                    :href="plt.filesertifikat"
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

      <!-- Riwayat Prestasi -->
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
                :key="prs.idpenggunaprestasi"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ prs.namaprestasi || "-" }}</td>
                <td>{{ prs.scales?.namaskala || "-" }}</td>
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
                      'bg-success': prs.status === 'Aktif',
                      'bg-secondary': prs.status !== 'Aktif',
                    }"
                  >
                    {{ prs.status || "-" }}
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

      <!-- Info Sistem -->
      <hr />
      <div class="detail-section">
        <h4><i class="fa fa-clock-o me-2"></i>Informasi Sistem</h4>
        <div class="row detail-grid-container">
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Dibuat Pada</dt>
              <dd>{{ formatDate(item.created_at) || "-" }}</dd>
              <dt>Terakhir Login</dt>
              <dd>{{ formatDate(item.lastlogin) || "Belum pernah login" }}</dd>
            </dl>
          </div>
          <div class="col-md-6">
            <dl class="detail-list">
              <dt>Diupdate Pada</dt>
              <dd>{{ formatDate(item.updated_at) || "-" }}</dd>
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
import { getUserWorkUnits } from "@/services/general/personnel/userWorkUnits";
import { getUserLevels } from "@/services/general/personnel/userLevels";
import { getUserRanks } from "@/services/general/personnel/userRanks";
import { getUserEducations } from "@/services/general/personnel/userEducation";
import { getUserTrainings } from "@/services/general/personnel/userTrainings";
import { getUserAchievements } from "@/services/general/personnel/userAchievments";
import { formatDate } from "@/utils/formatDate";

const props = defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

// State untuk riwayat
const riwayatUnitKerja = ref([]);
const riwayatJabatan = ref([]);
const riwayatPangkat = ref([]);
const riwayatPendidikan = ref([]);
const riwayatPelatihan = ref([]);
const riwayatPrestasi = ref([]);

// Load semua riwayat saat ada itemToView
watch(
  () => props.itemToView,
  async (newItem) => {
    if (newItem && newItem.idpengguna) {
      await loadAllRiwayat(newItem.idpengguna);
    }
  },
  { immediate: true }
);

async function loadAllRiwayat(userId) {
  try {
    // Load Unit Kerja
    const ukRes = await getUserWorkUnits({ id_pengguna: userId });
    riwayatUnitKerja.value = extractData(ukRes).filter(
      (d) => d.idpengguna === userId
    );

    // Load Jabatan
    const jabRes = await getUserLevels({ id_pengguna: userId });
    riwayatJabatan.value = extractData(jabRes).filter(
      (d) => d.idpengguna === userId
    );

    // Load Pangkat
    const pktRes = await getUserRanks({ id_pengguna: userId });
    riwayatPangkat.value = extractData(pktRes).filter(
      (d) => d.idpengguna === userId
    );

    // Load Pendidikan
    const pdkRes = await getUserEducations({ id_pengguna: userId });
    riwayatPendidikan.value = extractData(pdkRes).filter(
      (d) => d.idpengguna === userId
    );

    // Load Pelatihan
    const pltRes = await getUserTrainings({ id_pengguna: userId });
    riwayatPelatihan.value = extractData(pltRes).filter(
      (d) => d.idpengguna === userId
    );

    // Load Prestasi
    const prsRes = await getUserAchievements({ id_pengguna: userId });
    riwayatPrestasi.value = extractData(prsRes).filter(
      (d) => d.idpengguna === userId
    );
  } catch (error) {
    console.error("Error loading riwayat:", error);
  }
}

function extractData(response) {
  let rawData = [];
  if (Array.isArray(response.data)) {
    if (response.data[0] && response.data[0].data) {
      rawData = response.data[0].data;
    } else if (response.data.length > 0) {
      rawData = response.data;
    }
  } else if (response.data && response.data.data) {
    rawData = response.data.data;
  }
  return rawData;
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
  border-bottom: 2px solid #0d6efd;
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

/* Empty State */
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
