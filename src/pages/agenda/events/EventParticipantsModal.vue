<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <ParticipantDetailModal
      v-if="isParticipantDetailVisible"
      :itemToView="selectedParticipant"
      @close="closeParticipantDetail"
    />

    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">Daftar Peserta Kegiatan</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          aria-label="Close"
        ></button>
      </div>

      <div class="modal-body">
        <div
          v-if="isLoading"
          class="text-center p-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center"
        >
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Memuat data peserta...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center p-5 text-danger">
          <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
          <h4>Terjadi Kesalahan</h4>
          <p>{{ error }}</p>
        </div>

        <!-- Data Loaded -->
        <div v-else-if="participants.length > 0">
          <!-- Event Title -->
          <div class="text-center mb-4">
            <h4 class="event-title">{{ eventTitle }}</h4>

            <!-- Statistics Badges -->
            <div class="stats-container">
              <span class="badge bg-primary">
                <i class="fa fa-users me-1"></i>
                Total: {{ participants.length }} peserta
              </span>
              <span
                class="badge badge-terdaftar"
                v-if="statsCount.terdaftar > 0"
              >
                <i class="fa fa-clock-o me-1"></i>
                Terdaftar: {{ statsCount.terdaftar }} peserta
              </span>
              <span class="badge badge-diterima" v-if="statsCount.diterima > 0">
                <i class="fa fa-thumbs-up me-1"></i>
                Diterima: {{ statsCount.diterima }} peserta
              </span>
            </div>
          </div>

          <hr />

          <!-- Participants Section -->
          <div class="detail-section">
            <h4><i class="fa fa-list-ul me-2"></i>Peserta Terdaftar</h4>

            <!-- Bulk Action Bar -->
            <div v-if="selectedParticipants.length > 0" class="bulk-action-bar">
              <div class="bulk-info">
                <i class="fa fa-check-square-o me-2"></i>
                <span>{{ selectedParticipants.length }} peserta dipilih</span>
              </div>
              <div class="bulk-actions">
                <select
                  v-model="bulkStatusId"
                  class="form-select form-select-sm bulk-status-select"
                >
                  <option value="">Pilih Status</option>
                  <option
                    v-for="status in statusOptions"
                    :key="status.idstatus"
                    :value="status.idstatus"
                  >
                    {{ status.namastatus }}
                  </option>
                </select>
                <button
                  class="btn btn-primary btn-sm"
                  :disabled="!bulkStatusId || isBulkUpdating"
                  @click="bulkUpdateStatus"
                >
                  <span
                    v-if="isBulkUpdating"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <i v-else class="fa fa-refresh me-1"></i>
                  Ubah Status
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  :disabled="isBulkUpdating"
                  @click="bulkDeleteParticipants"
                >
                  <i class="fa fa-trash me-1"></i>
                  Hapus Terpilih
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="clearSelection"
                >
                  <i class="fa fa-times me-1"></i>
                  Batal
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th style="width: 50px">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="isAllSelected"
                        :indeterminate="isIndeterminate"
                        @change="toggleSelectAll"
                        title="Pilih Semua"
                      />
                    </th>
                    <th style="width: 50px">No</th>
                    <th style="width: 80px">Foto</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th style="width: 80px">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(participant, index) in participants"
                    :key="
                      participant.idagendapengguna ||
                      participant.id_agenda_pengguna
                    "
                    :class="{ 'table-active': isSelected(participant) }"
                  >
                    <td>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="isSelected(participant)"
                        @change="toggleSelection(participant)"
                      />
                    </td>
                    <td>{{ index + 1 }}</td>
                    <td>
                      <div class="participant-avatar">
                        <img
                          v-if="getParticipantPhoto(participant)"
                          :src="getParticipantPhoto(participant)"
                          :alt="getParticipantName(participant)"
                          class="avatar-img"
                          @error="handleImageError($event, participant)"
                        />
                        <div v-else class="avatar-placeholder">
                          {{ getInitials(getParticipantName(participant)) }}
                        </div>
                      </div>
                    </td>
                    <td class="fw-medium">
                      {{ getParticipantName(participant) }}
                    </td>
                    <td>
                      <span class="text-muted">
                        {{ getParticipantEmail(participant) }}
                      </span>
                    </td>
                    <td>
                      <div
                        class="status-dropdown"
                        :class="{
                          'is-open':
                            openDropdownId === getParticipantId(participant),
                          'dropdown-up': shouldFlipUp(index),
                        }"
                      >
                        <!-- Current Status Badge Button -->
                        <button
                          type="button"
                          class="status-badge-btn"
                          :class="
                            getStatusBadgeClass(
                              getParticipantStatusId(participant),
                            )
                          "
                          :disabled="
                            isUpdatingStatus === getParticipantId(participant)
                          "
                          @click="toggleDropdown($event, participant, index)"
                        >
                          <span class="status-icon">
                            <i
                              :class="
                                getStatusIcon(
                                  getParticipantStatusId(participant),
                                )
                              "
                            ></i>
                          </span>
                          <span class="status-text">{{
                            getParticipantStatus(participant)
                          }}</span>
                          <span
                            class="dropdown-arrow"
                            v-if="
                              isUpdatingStatus !== getParticipantId(participant)
                            "
                          >
                            <i class="fa fa-chevron-down"></i>
                          </span>
                          <span
                            v-else
                            class="spinner-border spinner-border-sm"
                          ></span>
                        </button>

                        <!-- Backdrop handled globally now -->
                      </div>
                    </td>

                    <td>
                      <div class="btn-group">
                        <button
                          class="btn btn-info btn-sm"
                          @click="openParticipantDetail(participant)"
                          title="Lihat Detail Peserta"
                        >
                          <i class="fa fa-eye"></i>
                        </button>
                        <button
                          class="btn btn-danger btn-sm"
                          @click="confirmDeleteParticipant(participant)"
                          title="Hapus Peserta"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="text-center text-muted p-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center"
        >
          <i class="fa fa-user-times fa-3x mb-3" style="opacity: 0.5"></i>
          <h5>Belum Ada Peserta</h5>
          <p>Belum ada peserta yang mendaftar untuk kegiatan ini.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          Tutup
        </button>
      </div>
    </div>

    <!-- Global Teleported Dropdown -->
    <Teleport to="body">
      <div v-if="openDropdownId && activeDropdownParticipant">
        <!-- Backdrop -->
        <div class="dropdown-backdrop" @click="closeDropdown"></div>

        <!-- Dropdown Menu -->
        <div class="status-dropdown-menu fixed-dropdown" :style="dropdownStyle">
          <div
            v-for="status in statusOptions"
            :key="status.idstatus"
            class="status-dropdown-item"
            :class="[
              getStatusItemClass(status.idstatus),
              {
                'is-selected':
                  status.idstatus ===
                  getParticipantStatusId(activeDropdownParticipant),
              },
            ]"
            @click="selectStatus(activeDropdownParticipant, status.idstatus)"
          >
            <span class="item-icon">
              <i :class="getStatusIconByName(status.namastatus)"></i>
            </span>
            <span class="item-text">{{ status.namastatus }}</span>
            <span
              v-if="
                status.idstatus ===
                getParticipantStatusId(activeDropdownParticipant)
              "
              class="check-icon"
            >
              <i class="fa fa-check"></i>
            </span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useToast } from "vue-toastification";
import {
  getEventUsers,
  updateEventUser,
  deleteEventUser,
} from "@/services/general/eventUsers/eventUsers";
import Swal from "sweetalert2";
import { getStatuses } from "@/services/referensi/status";
import { getInitials } from "@/utils/avatarUtils";

const ParticipantDetailModal = defineAsyncComponent(() =>
  import("./ParticipantDetailModal.vue"),
);

const props = defineProps({
  eventData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const toast = useToast();

const isLoading = ref(false);
const error = ref(null);
const participants = ref([]);
const statusOptions = ref([]);
const isUpdatingStatus = ref(null);
const openDropdownId = ref(null);

const selectedParticipants = ref([]);
const bulkStatusId = ref("");
const isBulkUpdating = ref(false);

const isParticipantDetailVisible = ref(false);
const selectedParticipant = ref(null);

// Dropdown State
const activeDropdownParticipant = ref(null);
const dropdownPosition = ref({
  top: 0,
  left: 0,
  bottom: 0,
  placement: "bottom",
});

const eventTitle = computed(() => props.eventData?.judul || "Kegiatan");

const isAllSelected = computed(() => {
  return (
    participants.value.length > 0 &&
    selectedParticipants.value.length === participants.value.length
  );
});

const isIndeterminate = computed(() => {
  return (
    selectedParticipants.value.length > 0 &&
    selectedParticipants.value.length < participants.value.length
  );
});

const statsCount = computed(() => {
  const counts = { diterima: 0, terdaftar: 0, ditolak: 0, selesai: 0 };

  participants.value.forEach((p) => {
    const type = getStatusType(getParticipantStatus(p));
    if (counts[type] !== undefined) {
      counts[type]++;
    }
  });

  return counts;
});

const dropdownStyle = computed(() => {
  const style = {
    left: `${dropdownPosition.value.left}px`,
  };

  if (dropdownPosition.value.placement === "top") {
    style.bottom = `${dropdownPosition.value.bottom}px`;
  } else {
    style.top = `${dropdownPosition.value.top}px`;
  }

  return style;
});

function openParticipantDetail(participant) {
  const userId =
    participant.idpengguna ||
    participant.id_pengguna ||
    participant.users?.idpengguna ||
    participant.users?.id_pengguna;

  if (!userId) {
    toast.error("ID Pengguna tidak ditemukan.");
    return;
  }

  selectedParticipant.value = { idpengguna: userId };
  isParticipantDetailVisible.value = true;
}

function closeParticipantDetail() {
  isParticipantDetailVisible.value = false;
  selectedParticipant.value = null;
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedParticipants.value = [];
  } else {
    selectedParticipants.value = participants.value.map((p) =>
      getParticipantId(p),
    );
  }
}

function toggleSelection(participant) {
  const id = getParticipantId(participant);
  const index = selectedParticipants.value.indexOf(id);
  if (index === -1) {
    selectedParticipants.value.push(id);
  } else {
    selectedParticipants.value.splice(index, 1);
  }
}

function isSelected(participant) {
  return selectedParticipants.value.includes(getParticipantId(participant));
}

function clearSelection() {
  selectedParticipants.value = [];
  bulkStatusId.value = "";
}

async function bulkUpdateStatus() {
  if (!bulkStatusId.value || selectedParticipants.value.length === 0) {
    toast.error("Pilih status terlebih dahulu.");
    return;
  }

  isBulkUpdating.value = true;
  let successCount = 0;
  let failCount = 0;

  try {
    for (const participantId of selectedParticipants.value) {
      try {
        const formData = new FormData();
        formData.append("record[id_status]", bulkStatusId.value);
        formData.append("_method", "PUT");

        await updateEventUser(participantId, formData);
        updateLocalParticipantData(participantId, bulkStatusId.value);
        successCount++;
      } catch (err) {
        console.error("Error updating participant:", participantId, err);
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} peserta berhasil diperbarui.`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} peserta gagal diperbarui.`);
    }

    clearSelection();
  } finally {
    isBulkUpdating.value = false;
  }
}

async function bulkDeleteParticipants() {
  if (selectedParticipants.value.length === 0) return;

  const count = selectedParticipants.value.length;
  const result = await Swal.fire({
    title: "Hapus Peserta Terpilih",
    text: `Apakah Anda yakin ingin menghapus ${count} peserta yang dipilih?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: '<i class="fa fa-check me-2"></i> Ya, Hapus',
    cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    isBulkUpdating.value = true;
    let successCount = 0;
    let failCount = 0;

    try {
      const deletePromises = selectedParticipants.value.map((id) =>
        deleteEventUser(id)
          .then(() => ({ id, status: "fulfilled" }))
          .catch((err) => ({ id, status: "rejected", error: err })),
      );

      const results = await Promise.all(deletePromises);

      // Process results
      const deletedIds = [];
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          successCount++;
          deletedIds.push(res.id);
        } else {
          failCount++;
          console.error(`Gagal menghapus peserta ${res.id}:`, res.error);
        }
      });

      if (deletedIds.length > 0) {
        participants.value = participants.value.filter(
          (p) => !deletedIds.includes(getParticipantId(p)),
        );

        selectedParticipants.value = selectedParticipants.value.filter(
          (id) => !deletedIds.includes(id),
        );
      }

      if (successCount > 0) {
        toast.success(`${successCount} peserta berhasil dihapus.`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} peserta gagal dihapus.`);
      }

      if (successCount > 0) {
        Swal.fire(
          "Terhapus!",
          `${successCount} peserta telah dihapus.${
            failCount > 0 ? ` (${failCount} gagal)` : ""
          }`,
          "success",
        );
      }

      if (selectedParticipants.value.length === 0) {
        clearSelection();
      }
    } catch (err) {
      console.error("Critical error in bulk delete:", err);
      toast.error("Terjadi kesalahan saat menghapus peserta.");
    } finally {
      isBulkUpdating.value = false;
    }
  }
}

function toggleDropdown(event, participant, index) {
  const participantId = getParticipantId(participant);

  if (openDropdownId.value === participantId) {
    closeDropdown();
  } else {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const isLastTwo =
      participants.value.length > 2 && index >= participants.value.length - 2;

    const left = rect.left + rect.width / 2;

    if (isLastTwo) {
      const bottom = window.innerHeight - rect.top + 8;
      dropdownPosition.value = {
        top: 0,
        left,
        bottom,
        placement: "top",
      };
    } else {
      const top = rect.bottom + 8;
      dropdownPosition.value = {
        top,
        left,
        bottom: 0,
        placement: "bottom",
      };
    }

    activeDropdownParticipant.value = participant;
    openDropdownId.value = participantId;
  }
}

function closeDropdown() {
  openDropdownId.value = null;
  activeDropdownParticipant.value = null;
}

function selectStatus(participant, statusId) {
  closeDropdown();
  if (statusId !== getParticipantStatusId(participant)) {
    updateParticipantStatus(participant, statusId);
  }
}

function shouldFlipUp(index) {
  const totalRows = participants.value.length;
  return totalRows > 3 && index >= totalRows - 2;
}

function closeModal() {
  emit("close");
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) closeModal();
}

function handleImageError(e, participant) {
  e.target.style.display = "none";

  const placeholder = e.target.parentNode.querySelector(".avatar-placeholder");
  if (placeholder) {
    placeholder.style.display = "flex";
  }
}

function getParticipantPhoto(participant) {
  return participant.users?.foto || participant.pengguna?.foto || null;
}

function getParticipantName(participant) {
  return participant.users?.nama || participant.pengguna?.nama || "-";
}

function getParticipantEmail(participant) {
  return participant.users?.email || participant.pengguna?.email || "-";
}

function getParticipantStatus(participant) {
  const directName =
    participant.statuses?.namastatus ||
    participant["event-user-statuses"]?.nama_status ||
    participant.status_agenda_pengguna?.nama_status;

  if (directName) return directName;

  const statusId = getParticipantStatusId(participant);
  if (statusId && statusOptions.value.length > 0) {
    const status = statusOptions.value.find((s) => s.idstatus === statusId);
    if (status) return status.namastatus;
  }

  return "Terdaftar";
}

function getParticipantStatusId(participant) {
  return (
    participant.idstatus ||
    participant.id_status ||
    participant.statuses?.idstatus ||
    ""
  );
}

function getParticipantId(participant) {
  return participant.idagendapengguna || participant.id_agenda_pengguna;
}

function getStatusType(statusName) {
  const statusLower = (statusName || "").toLowerCase();
  if (statusLower.includes("selesai")) return "selesai";
  if (statusLower.includes("diterima")) return "diterima";
  if (statusLower.includes("ditolak") || statusLower.includes("batal"))
    return "ditolak";
  if (statusLower.includes("terdaftar")) return "terdaftar";
  return "default";
}

function updateLocalParticipantData(participantId, newStatusId) {
  const index = participants.value.findIndex(
    (p) => getParticipantId(p) === participantId,
  );

  if (index !== -1) {
    participants.value[index].idstatus = newStatusId;
    participants.value[index].id_status = newStatusId;

    const newStatus = statusOptions.value.find(
      (s) => s.idstatus === newStatusId,
    );
    if (newStatus) {
      if (!participants.value[index].statuses) {
        participants.value[index].statuses = {};
      }
      participants.value[index].statuses.namastatus = newStatus.namastatus;
      participants.value[index].statuses.idstatus = newStatusId;
    }
  }
}

function getStatusBadgeClass(statusId) {
  const status = statusOptions.value.find((s) => s.idstatus === statusId);
  if (!status) return "badge-default";

  const type = getStatusType(status.namastatus);
  return `badge-${type}`;
}

function getStatusItemClass(statusId) {
  const status = statusOptions.value.find((s) => s.idstatus === statusId);
  if (!status) return "";

  const type = getStatusType(status.namastatus);
  return type !== "default" ? `item-${type}` : "";
}

function getStatusIcon(statusId) {
  const status = statusOptions.value.find((s) => s.idstatus === statusId);
  if (!status) return "fa fa-circle-o";
  return getStatusIconByName(status.namastatus);
}

// Mapping tipe status ke icon
const STATUS_ICONS = {
  selesai: "fa fa-check-circle",
  diterima: "fa fa-thumbs-up",
  ditolak: "fa fa-times-circle",
  terdaftar: "fa fa-clock-o",
  default: "fa fa-circle-o",
};

function getStatusIconByName(statusName) {
  const type = getStatusType(statusName);
  return STATUS_ICONS[type] || STATUS_ICONS.default;
}

async function fetchParticipants() {
  const idAgenda = props.eventData?.idagenda || props.eventData?.id_agenda;

  if (!idAgenda) {
    error.value = "ID Agenda tidak valid.";
    console.error("Event data:", props.eventData);
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const params = {
      filter: `id_agenda=${idAgenda}`,
      limit: 100,
    };

    const res = await getEventUsers(params);

    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    const data = responseData?.data || [];

    participants.value = data;
  } catch (err) {
    console.error("Error fetching participants:", err);
    error.value = err.message || "Gagal memuat data peserta.";
    toast.error("Gagal memuat data peserta.");
  } finally {
    isLoading.value = false;
  }
}

async function fetchStatusOptions() {
  try {
    const res = await getStatuses({ limit: 100 });
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    statusOptions.value = responseData?.data || [];
  } catch (err) {
    console.error("Error fetching status options:", err);
  }
}

async function updateParticipantStatus(participant, newStatusId) {
  const participantId = getParticipantId(participant);

  if (!participantId) {
    toast.error("ID Peserta tidak ditemukan.");
    return;
  }

  if (!newStatusId) {
    toast.error("Status tidak valid.");
    return;
  }

  isUpdatingStatus.value = participantId;

  try {
    const formData = new FormData();
    formData.append("record[id_status]", newStatusId);
    formData.append("_method", "PUT");

    await updateEventUser(participantId, formData);
    updateLocalParticipantData(participantId, newStatusId);

    toast.success("Status peserta berhasil diperbarui.");
  } catch (err) {
    console.error("Error updating status:", err);
    toast.error(
      err.response?.data?.message || "Gagal memperbarui status peserta.",
    );
  } finally {
    isUpdatingStatus.value = null;
  }
}

async function confirmDeleteParticipant(participant) {
  const participantId = getParticipantId(participant);
  if (!participantId) {
    toast.error("ID Peserta tidak valid.");
    return;
  }

  const participantName = getParticipantName(participant);
  const result = await Swal.fire({
    title: "Hapus Peserta",
    text: `Apakah Anda yakin ingin menghapus "${participantName}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus',
    cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    isLoading.value = true;
    try {
      await deleteEventUser(participantId);

      participants.value = participants.value.filter(
        (p) => getParticipantId(p) !== participantId,
      );
      const selectedIndex = selectedParticipants.value.indexOf(participantId);
      if (selectedIndex !== -1) {
        selectedParticipants.value.splice(selectedIndex, 1);
      }

      toast.success("Peserta berhasil dihapus.");
      Swal.fire("Terhapus!", "Peserta telah dihapus.", "success");
    } catch (err) {
      console.error("Gagal menghapus peserta:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus peserta.");
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus peserta.", "error");
    } finally {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  fetchStatusOptions();
  fetchParticipants();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  min-height: 90vh;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 1rem;
  flex-shrink: 0;
}

.modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
}

.event-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.75rem;
}

.stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stats-container .badge {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}

.stats-container .badge-diterima {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  color: white;
}

.stats-container .badge-terdaftar {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: white;
}

.stats-container .badge-ditolak {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  color: white;
}

.stats-container .badge-selesai {
  background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%);
  color: white;
}

.detail-section {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  border-bottom: 2px solid #6c757d;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.bulk-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 8px;
  border: 1px solid #90caf9;
}

.bulk-info {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1565c0;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bulk-status-select {
  min-width: 150px;
}

.table .form-check-input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.table .form-check-input:checked {
  background-color: #1e88e5;
  border-color: #1e88e5;
}

.table-active {
  background-color: rgba(30, 136, 229, 0.1) !important;
}

.participant-avatar {
  width: 45px;
  height: 45px;
  position: relative;
}

.avatar-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.avatar-placeholder {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.table th {
  font-weight: 600;
  color: #333;
  background-color: #f8f9fa;
}

.table td {
  vertical-align: middle;
}

.bg-purple {
  background-color: #8e24aa !important;
  color: white;
}

.badge {
  font-size: 0.8em;
  padding: 0.5em 0.75em;
}

.status-dropdown {
  position: relative;
  display: inline-block;
}

.status-badge-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.status-badge-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.status-badge-btn .status-icon {
  font-size: 0.9rem;
}

.status-badge-btn .dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.status-dropdown.is-open .status-badge-btn .dropdown-arrow {
  transform: rotate(180deg);
}

.status-badge-btn.badge-terdaftar {
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
  color: white;
}

.status-badge-btn.badge-diterima {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  color: white;
}

.status-badge-btn.badge-ditolak {
  background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
  color: white;
}

.status-badge-btn.badge-selesai {
  background: linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%);
  color: white;
}

.status-badge-btn.badge-default {
  background: linear-gradient(135deg, #78909c 0%, #546e7a 100%);
  color: white;
}

.status-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 180px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 1100;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.status-dropdown-menu::before {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.status-dropdown-menu.fixed-dropdown {
  position: fixed;
  z-index: 9999;
  /* top and left set by inline style */
}

.status-dropdown-menu.dropdown-up {
  transform-origin: bottom center;
  animation: dropdownFadeInUp 0.2s ease-out;
}

.status-dropdown-menu.dropdown-up::before {
  top: auto;
  bottom: -6px;
  border-bottom: none;
  border-top: 8px solid white;
}

@keyframes dropdownFadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.status-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-dropdown-item:hover {
  transform: translateX(4px);
}

.status-dropdown-item.is-selected {
  font-weight: 600;
}

.status-dropdown-item .item-icon {
  width: 20px;
  text-align: center;
  font-size: 0.95rem;
}

.status-dropdown-item .item-text {
  flex: 1;
}

.status-dropdown-item .check-icon {
  font-size: 0.8rem;
}

/* Item Color Variants */
.status-dropdown-item.item-terdaftar {
  color: #1565c0;
}
.status-dropdown-item.item-terdaftar:hover,
.status-dropdown-item.item-terdaftar.is-selected {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.status-dropdown-item.item-diterima {
  color: #2e7d32;
}
.status-dropdown-item.item-diterima:hover,
.status-dropdown-item.item-diterima.is-selected {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

.status-dropdown-item.item-ditolak {
  color: #c62828;
}
.status-dropdown-item.item-ditolak:hover,
.status-dropdown-item.item-ditolak.is-selected {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.status-dropdown-item.item-selesai {
  color: #6a1b9a;
}
.status-dropdown-item.item-selesai:hover,
.status-dropdown-item.item-selesai.is-selected {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1099;
}

.status-badge-btn .spinner-border {
  width: 14px;
  height: 14px;
  border-width: 2px;
}
</style>
