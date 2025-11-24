<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center p-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Memuat data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center p-5 text-danger">
          <i class="fa fa-exclamation-triangle fa-3x mb-3"></i>
          <h4>Terjadi Kesalahan</h4>
          <p>{{ error }}</p>
          <small class="text-muted" v-if="debugMessage">Detail: {{ debugMessage }}</small>
        </div>

        <!-- Data Loaded -->
        <div v-else-if="item">
          <!-- Slot untuk custom layout detail -->
          <slot name="detail" :item="item">
            <pre class="bg-light p-3 rounded small">{{ item }}</pre>
          </slot>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center text-muted p-4">
          Tidak ada data untuk ditampilkan.
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  title: { type: String, default: 'Detail Data' },
  itemToView: { type: Object, required: true }, // data dari tabel
  apiDetailFn: { type: Function, required: true }, // fungsi async yang return detail
  idKey: { type: String, default: 'id' } // nama field id
});

const emit = defineEmits(['close']);

const isLoading = ref(false);
const error = ref(null);
const debugMessage = ref('');
const item = ref(null);
const toast = useToast();

function closeModal() {
  emit('close');
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) closeModal();
}

async function fetchDetail() {
  const idValue = props.itemToView?.[props.idKey];
  if (!idValue) {
    error.value = `ID (${props.idKey}) tidak valid atau tidak ditemukan.`;
    return;
  }

  isLoading.value = true;
  error.value = null;
  debugMessage.value = '';
  try {
    const res = await props.apiDetailFn(idValue);
    const data = res?.data?.[0]?.data?.[0];
    if (!data) {
      error.value = 'Data detail tidak ditemukan.';
      debugMessage.value = JSON.stringify(res?.data);
      return;
    }
    item.value = data;
  } catch (err) {
    console.error(err);
    error.value = err.message || 'Gagal memuat detail data.';
    if (err.response) {
      debugMessage.value = `Status ${err.response.status}: ${JSON.stringify(err.response.data)}`;
    }
    toast.error('Gagal memuat detail data.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchDetail);

watch(() => props.itemToView, fetchDetail, { deep: true });
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
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0,0,0,.5);
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
</style>
