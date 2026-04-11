<template>
  <div class="menu-item">
    <div class="menu-item-content">
      <i class="fa fa-bars handle me-2"></i>

      <span>{{ item.nama_jabatan }}</span>

      <div class="menu-item-actions ms-auto">
        <button
          class="btn btn-warning btn-sm"
          title="Edit Jabatan"
          @click.stop="emit('edit', item)"
        >
          <i class="fa fa-pencil"></i>
        </button>
        <button
          class="btn btn-danger btn-sm"
          title="Hapus Jabatan"
          @click.stop="emit('delete', item)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>

    <draggable
      class="menu-item-children"
      v-model="item.children"
      group="jabatan"
      item-key="id_jabatan"
      handle=".handle"
      ghost-class="ghost"
    >
      <template #item="{ element }">
        <JabatanTreeItem
          :item="element"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import draggable from "vuedraggable";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);
</script>

<style scoped>
.menu-item {
  display: block;
  position: relative;
}

.menu-item-content {
  padding: 12px 15px;
  background-color: #ffffff !important;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px !important;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease-in-out;
  margin-top: 8px;
  position: relative;
}

.menu-item-content:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  & .menu-item-actions {
    visibility: visible;
    opacity: 1;
  }
}

.menu-item-content > span {
  font-weight: 600;
  color: #333;
}

.handle {
  cursor: move;
  color: #adb5bd;
  transition: color 0.2s;
}
.handle:hover {
  color: #555;
}

.menu-item-actions {
  display: flex;
  gap: 5px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
.menu-item-actions .btn-sm {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
}

.menu-item-children {
  position: relative;
  margin-left: 25px;
  padding-left: 30px;
  min-height: 10px;
}

.menu-item-children::before {
  content: "";
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #b6d4fe;
}

.menu-item-children > .menu-item > .menu-item-content::before {
  content: "";
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
