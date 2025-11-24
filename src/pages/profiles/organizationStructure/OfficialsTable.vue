<template>
  <component
    :is="OfficialFormModal"
    v-if="isFormModalVisible"
    :field-to-edit="itemBeingEdited"
    entity-name="Pejabat"
    @close="closeModal"
    @save-successful="handleSaveSuccessful"
  />

  <div class="col-sm-12">
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h3>Struktur Pejabat</h3>
        
        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="openAddModal">
            <i class="fa fa-plus me-2"></i> Tambah Pejabat
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
          <p class="mt-2">Memuat struktur pejabat...</p>
        </div>
        <div v-else-if="officialTree.length === 0" class="text-center text-muted p-4">
          Tidak ada data pejabat untuk ditampilkan.
          <br>
          Silakan klik "Tambah Pejabat" untuk memulai.
        </div>

        <draggable
          v-else
          class="official-tree-root"
          v-model="officialTree"
          group="officials"
          item-key="idpejabat"
          handle=".handle"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <OfficialTreeItem 
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
import OfficialTreeItem from './OfficialTreeItem.vue'; 
import { getOfficials, updateOfficial, deleteOfficial } from '@/services/general/website/profiles/officials'; 

// === Komponen & State ===
const OfficialFormModal = defineAsyncComponent(() =>
  import('./OfficialFormModal.vue')
);
const toast = useToast();
const officialTree = ref([]);
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
  loadOfficialTree();
}

async function confirmDelete(item) {
  const itemName = item.nama || 'data ini';
  const result = await Swal.fire({
    title: `Hapus Data`,
    text: `Apakah Anda yakin ingin menghapus "${itemName}"? Ini juga akan menghapus semua bawahannya.`,
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
      await deleteOfficial(item.idpejabat);
      toast.success(`Data ${itemName} berhasil dihapus`);
      loadOfficialTree(); 
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  }
}

function buildTree(items, parentId = null) {
  const tree = [];
  const children = items
    .filter(item => {
      const itemInduk = item.induk === null || item.induk === 0 || item.induk === "" ? null : item.induk;
      return itemInduk === parentId;
    })
    .sort((a, b) => {
      const urutanA = parseInt(a.urutan, 10) || 0;
      const urutanB = parseInt(b.urutan, 10) || 0;
      if (urutanA !== urutanB) {
        return urutanA - urutanB;
      }
      return (a.nama || '').localeCompare(b.nama || '');
    }); 

  for (const item of children) {
    const grandchildren = buildTree(items, item.idpejabat);
    if (grandchildren.length > 0) {
      item.children = grandchildren;
    } else {
      item.children = []; 
    }
    tree.push(item);
  }
  return tree;
}

async function loadOfficialTree() {
  isLoadingTree.value = true;
  try {
    const res = await getOfficials({ 
        page: 1, 
        limit: 9999, 
        sort: 'urutan', 
        dir: 'asc' 
    });
    
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    const flatOfficialList = responseData?.data || [];
    officialTree.value = buildTree(flatOfficialList, null);

  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat struktur pejabat");
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
    
    const children = updatedItem.children;
    delete updatedItem.children; 
    
    flatList.push(updatedItem);

    if (children && children.length > 0) {
      flatList = flatList.concat(flattenTree(children, item.idpejabat));
    }
  });
  return flatList;
}

// Menyimpan struktur baru
async function handleSaveStructure() {
  isSavingTree.value = true;
  try {
    const flattenedData = flattenTree(officialTree.value, null);
    const updatePromises = flattenedData.map(item => {
      const data = new FormData();

      data.append("record[urutan]", item.urutan);
      data.append("record[induk]", item.induk || ""); 
      data.append("_method", "PUT");
      
      return updateOfficial(item.idpejabat, data);
    });

    await Promise.all(updatePromises);
    toast.success("Struktur pejabat berhasil disimpan");
    await loadOfficialTree();

  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.failed || err.message || "Terjadi kesalahan";
    toast.error(`Gagal menyimpan struktur: ${errorMessage}`);
  } finally {
    isSavingTree.value = false;
  }
}

// === Lifecycle ===
onMounted(() => {
  loadOfficialTree();
});

</script>

<style scoped>
:deep(.ghost) {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #0d6efd;
}
:deep(.handle) {
  cursor: move;
  color: #adb5bd;
}
:deep(.official-item-content) {
  padding: 10px 12px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-top: 5px;
  gap: 8px;
}
:deep(.official-item-children) {
  margin-left: 30px;
  padding-top: 5px;
  min-height: 10px; 
}
:deep(.item-foto) {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #ccc;
}
:deep(.item-foto-placeholder) {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #adb5bd;
}
:deep(.item-details) {
  display: flex;
  flex-direction: column;
}
:deep(.item-nama) {
  font-size: 1rem;
}
:deep(.item-jabatan) {
  font-size: 0.85rem;
}
:deep(.official-item-actions) {
  display: flex;
  gap: 5px;
}
:deep(.official-item-actions .btn-sm) {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>