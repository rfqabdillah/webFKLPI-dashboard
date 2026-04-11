<template>
  <BaseDetailModal
    title="Detail Testimoni"
    :item-to-view="itemToView"
    :api-detail-fn="getDetailTestimoni"
    id-key="id_testimoni"
    @close="$emit('close')"
  >
    <template #detail="{ item }">
      <!-- User & Rating -->
      <div class="user-header mb-4">
        <img
          src="https://placehold.co/60x60/EBF4FF/7F9CF5?text=User"
          alt="Foto Default"
          class="user-photo"
        />
        <div class="user-info">
          <h5 class="user-name">{{ item.pengguna?.nama || "-" }}</h5>
          <div class="d-flex align-items-center gap-3">
            <div class="star-rating">
              <i
                v-for="star in 5"
                :key="star"
                class="fa fa-star"
                :class="
                  star <= (item.nilai || 0) ? 'text-warning' : 'text-muted'
                "
              ></i>
              <span class="rating-value">({{ item.nilai || 0 }}/5)</span>
            </div>
            <span
              class="badge"
              :class="{
                'bg-success': item.tayang === 'Tayang',
                'bg-warning': item.tayang !== 'Tayang',
              }"
            >
              {{ item.tayang === "Tayang" ? "Tayang" : "Draft" }}
            </span>
          </div>
          <small class="text-muted">{{ formatDate(item.created_at) }}</small>
        </div>
      </div>

      <!-- Konten -->
      <div class="testimoni-content">
        <p>{{ item.konten }}</p>
      </div>
    </template>
  </BaseDetailModal>
</template>

<script setup>
import BaseDetailModal from "@/components/base/BaseDetailModal.vue";
import { formatDate } from "@/utils/formatDate";
import { getDetailTestimoni } from "@/services/general/website/testimoni";

defineProps({
  itemToView: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.user-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.user-photo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #dee2e6;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #000;
}

.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.star-rating i {
  font-size: 14px;
}

.rating-value {
  margin-left: 4px;
  font-size: 0.85rem;
  color: #666;
}

.testimoni-content {
  background-color: #f8f9fa;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid #0d6efd;
}

.testimoni-content p {
  color: #000;
  margin: 0;
  line-height: 1.6;
  font-size: 1rem;
}
</style>
