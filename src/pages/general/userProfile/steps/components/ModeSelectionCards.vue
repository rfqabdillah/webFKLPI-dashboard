<template>
  <div class="selection-cards row g-4 justify-content-center mb-4">
    <div class="col-md-5 col-lg-4">
      <div
        class="selection-card"
        :class="{ active: hoveredCard === 'existing' }"
        @mouseenter="hoveredCard = 'existing'"
        @mouseleave="hoveredCard = null"
        @click="$emit('select-mode', 'existing')"
      >
        <div class="card-content">
          <div class="card-icon">
            <i class="fa fa-users"></i>
          </div>
          <h6 class="card-title">Gunakan Data yang Ada</h6>
          <p class="card-description">
            Pilih dari daftar pengguna yang sudah terdaftar
          </p>
          <div class="card-action">
            <i class="fa fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-5 col-lg-4">
      <div
        class="selection-card"
        :class="{ active: hoveredCard === 'new' }"
        @mouseenter="hoveredCard = 'new'"
        @mouseleave="hoveredCard = null"
        @click="$emit('select-mode', 'new')"
      >
        <div class="card-content">
          <div class="card-icon">
            <i class="fa fa-user-plus"></i>
          </div>
          <h6 class="card-title">Input Data Baru</h6>
          <p class="card-description">
            Isi formulir biodata untuk pengguna baru
          </p>
          <div class="card-action">
            <i class="fa fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineEmits(["select-mode"]);

const hoveredCard = ref(null);
</script>

<style scoped>
.selection-card {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.selection-card:hover {
  border-color: #0d6efd;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.1);
}

.selection-card.active {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 1rem;
}

.card-title {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}

.card-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.card-action {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.selection-card:hover .card-action {
  background: #0d6efd;
  color: #fff;
}
</style>
