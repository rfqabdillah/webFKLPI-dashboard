<template>
  <component
    :is="MenuFormModal"
    v-if="isFormModalVisible"
    :field-to-edit="itemBeingEdited"
    entity-name="Menu"
    @close="closeModal"
    @save-successful="handleSaveSuccessful"
  />

  <div class="col-sm-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3>Struktur Menu</h3>
        
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="openAddModal">
            <i class="fa fa-plus me-2"></i> Tambah Menu
          </button>
          <button 
            class="btn btn-primary" 
            @click="handleSaveStructure" 
            :disabled="isSavingTree"
          >
            <span v-if="isSavingTree" class="spinner-border spinner-border-sm" role="status"></span>
            <i v-else class="fa fa-save me-2"></i>
            Simpan Struktur
          </button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="isLoadingTree" class="text-center p-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Memuat struktur menu...</p>
        </div>
        <div v-else-if="menuTree.length === 0" class="text-center text-muted p-4">
          Tidak ada data menu untuk ditampilkan.
          <br>
          Silakan klik "Tambah Menu" untuk memulai.
        </div>

        <draggable
          v-else
          class="menu-tree-root"
          v-model="menuTree"
          group="menus"
          item-key="idmenu"
          handle=".handle"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <MenuTreeItem 
              :item="element" 
              @edit="openEditModal"
              @delete="confirmDelete"
            />
          </template>
        </draggable>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import draggable from 'vuedraggable';
import MenuTreeItem from './MenuTreeItem.vue'; 
import { getMenus, updateMenu, deleteMenu } from '@/services/general/website/settings/menu'; 

// === Komponen & State ===
const MenuFormModal = defineAsyncComponent(() =>
  import('./MenuFormModal.vue')
);
const toast = useToast();
const menuTree = ref([]);
const isLoadingTree = ref(false);
const isSavingTree = ref(false);

const isFormModalVisible = ref(false);
const itemBeingEdited = ref(null);

// === Method ===
function openAddModal() {
  itemBeingEdited.value = null;
  isFormModalVisible.value = true;
}
function openEditModal(item) {
  itemBeingEdited.value = { ...item }; 
  isFormModalVisible.value = true;
}
function closeModal() {
  isFormModalVisible.value = false;
  itemBeingEdited.value = null;
}
function handleSaveSuccessful() {
  closeModal();
  loadMenuTree();
}

async function confirmDelete(item) {
  const itemName = item.nama || 'data ini';
  const result = await Swal.fire({
    title: `Hapus Data`,
    text: `Apakah Anda yakin ingin menghapus menu "${itemName}"? Ini juga akan menghapus semua submenunya.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus',
    cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await deleteMenu(item.idmenu);
      toast.success(`Data ${itemName} berhasil dihapus`);
      loadMenuTree(); 
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  }
}

function buildTree(items, parentId = null) {
  const tree = [];
  const children = items
    .filter(item => {
      if (parentId === null) {
        return item.induk === null || item.induk === "";
      }
      return item.induk === parentId;
    })
    .sort((a, b) => {
      const urutanA = parseInt(a.urutan, 10) || 0;
      const urutanB = parseInt(b.urutan, 10) || 0;
      return urutanA - urutanB;
    }); 

  for (const item of children) {
    const grandchildren = buildTree(items, item.idmenu);
    if (grandchildren.length > 0) {
      item.children = grandchildren;
    } else {
      item.children = []; 
    }
    tree.push(item);
  }
  return tree;
}

async function loadMenuTree() {
  isLoadingTree.value = true;
  try {
    const res = await getMenus({ page: 1, limit: 9999, order: 'urutan asc' });
    
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    const flatMenuList = responseData?.data || [];
    
    menuTree.value = buildTree(flatMenuList, null);

  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat struktur menu");
  } finally {
    isLoadingTree.value = false;
  }
}

function flattenTree(items, parentId = null) {
  let flatList = [];
  items.forEach((item, index) => {
    const updatedItem = {
      ...item, 
      urutan: index + 1, 
      induk: parentId, 
    };
    delete updatedItem.children; 
    flatList.push(updatedItem);
    if (item.children && item.children.length > 0) {
      flatList = flatList.concat(flattenTree(item.children, item.idmenu));
    }
  });
  return flatList;
}

async function handleSaveStructure() {
  isSavingTree.value = true;
  try {
    const flattenedData = flattenTree(menuTree.value, null);
    const updatePromises = flattenedData.map(item => {
      const data = new FormData();

      data.append("record[nama]", item.nama);
      data.append("record[nama_en]", item.nama_en || "");
      data.append("record[link]", item.link || "");
      data.append("record[icon]", item.icon || "");
      data.append("record[target]", item.target);
      data.append("record[tayang]", item.tayang);
      data.append("record[urutan]", item.urutan);
      data.append("record[induk]", item.induk || ""); 
      data.append("_method", "PUT");
      
      return updateMenu(item.idmenu, data);
    });

    await Promise.all(updatePromises);
    toast.success("Struktur menu berhasil disimpan");
    await loadMenuTree();

  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.failed || err.message || "Terjadi kesalahan";
    toast.error(`Gagal menyimpan struktur menu: ${errorMessage}`);
  } finally {
    isSavingTree.value = false;
  }
}

// === Lifecycle ===
onMounted(() => {
  loadMenuTree();
});

</script>

<style scoped>
.menu-tree-root {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  min-height: 100px;
}

:deep(.ghost) {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #0d6efd;
}
:deep(.handle) {
  cursor: move;
  color: #adb5bd;
}
:deep(.menu-item-content) {
  padding: 10px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  gap: 8px;
}
:deep(.menu-item-children) {
  margin-left: 30px;
  padding-top: 5px;
  min-height: 10px; 
}
:deep(.item-icon) {
  width: 20px;
  text-align: center;
}
:deep(.menu-item-actions) {
  display: flex;
  gap: 5px;
}
:deep(.menu-item-actions .btn-sm) {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>