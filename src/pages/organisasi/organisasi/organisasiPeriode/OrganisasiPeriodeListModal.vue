<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content custom-large-modal" @click.stop>
      <div class="modal-header">
        <h5 class="modal-title">
          Periode Kepengurusan - {{ organisasi?.nama_organisasi }}
        </h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          aria-label="Close"
        ></button>
      </div>

      <div class="modal-body custom-scrollbar">
        <!-- Reusing the table and passing fixed filters so it always filters by this id_organisasi -->
        <OrganisasiPeriodeTable
          :fixedFilters="{
            id_organisasi: organisasi?.id_organisasi,
            _nama_organisasi: organisasi?.nama_organisasi,
          }"
        />
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">
          <i class="fa fa-arrow-left me-1"></i> Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import OrganisasiPeriodeTable from "./OrganisasiPeriodeTable.vue";

const props = defineProps({
  organisasi: { type: Object, required: true },
});

const emit = defineEmits(["close"]);

function closeModal() {
  emit("close");
}
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

.modal-content.custom-large-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 65vw;
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

.btn-close {
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;
  width: 1em;
  height: 1em;
  padding: 0.25em;
  cursor: pointer;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
</style>
