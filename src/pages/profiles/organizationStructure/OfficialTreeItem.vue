<template>
  <div class="official-item">
    <div class="official-item-content">
      <i class="fa fa-bars handle me-2"></i>
      
      <img
        v-if="item.foto"
        :src="item.foto"
        alt="Foto"
        class="item-foto me-2"
        @click="showImage(item.foto)"
      />
      <div v-else class="item-foto-placeholder me-2">
        <i class="fa fa-user"></i>
      </div>
      
      <div class="item-details">
        <strong class="item-nama">{{ item.nama }}</strong>
        <div class="item-jabatan text-muted">{{ item.jabatan }}</div>
      </div>

      <div class="official-item-actions ms-auto">
        <button 
          class="btn btn-warning btn-sm" 
          title="Edit Pejabat" 
          @click.stop="emit('edit', item)"
        >
          <i class="fa fa-pencil"></i>
        </button>
        <button 
          class="btn btn-danger btn-sm" 
          title="Hapus Pejabat"
          @click.stop="emit('delete', item)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <vue-easy-lightbox
        :visible="lightboxVisible"
        :imgs="lightboxImgs"
        @hide="hideImage"
      ></vue-easy-lightbox>
    </Teleport>

    <draggable
      class="official-item-children"
      v-model="item.children"
      group="officials"
      item-key="idpejabat"
      handle=".handle"
      ghost-class="ghost"
    >
      <template #item="{ element }">
        <official-tree-item 
          :item="element" 
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import draggable from 'vuedraggable';
import VueEasyLightbox from 'vue-easy-lightbox';
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css';

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);
const lightboxVisible = ref(false);
const lightboxImgs = ref(''); 

function showImage(imageUrl) {
  lightboxImgs.value = imageUrl;
  lightboxVisible.value = true;
}

function hideImage() {
  lightboxVisible.value = false;
}
</script>

<style scoped>
.official-item {
  display: block;
  position: relative; 
}

.official-item-content {
  padding: 12px 15px;
  background-color: #ffffff !important;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 9px !important; 
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease-in-out;
  margin-top: 8px;
  position: relative; 
}

.official-item-content:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  & .official-item-actions {
    visibility: visible;
    opacity: 1;
  }
}

.item-foto {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #eee;
}

.item-foto-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e7f1ff; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #0d6efd; 
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-nama {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.item-jabatan {
  font-size: 0.875rem;
  color: #666;
}

.handle {
  cursor: move;
  color: #adb5bd;
  transition: color 0.2s;
}
.handle:hover {
  color: #555;
}

.official-item-actions {
  display: flex;
  gap: 5px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}

.official-item-actions .btn-sm {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
}

.official-item-children {
  position: relative;
  margin-left: 25px;
  padding-left: 30px;
  min-height: 10px;
}

.official-item-children::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #b6d4fe; 
}

.official-item-children > .official-item > .official-item-content::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -26px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid #b6d4fe; 
  z-index: 1;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #0d6efd;
  border-radius: 12px;
}
</style>