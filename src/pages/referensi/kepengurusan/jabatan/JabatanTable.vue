<template>
  <component
    :is="JabatanFormModal"
    v-if="isFormModalVisible"
    :field-to-edit="itemBeingEdited"
    entity-name="Jabatan"
    @close="closeModal"
    @save-successful="handleSaveSuccessful"
  />

  <div class="col-sm-12">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h3>Struktur Jabatan</h3>

        <div class="d-flex gap-2">
          <button class="btn btn-success" @click="openAddModal">
            <i class="fa fa-plus me-2"></i> Tambah Jabatan
          </button>
          <button
            class="btn btn-primary"
            @click="handleSaveStructure"
            :disabled="isSavingTree"
          >
            <span
              v-if="isSavingTree"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            <i v-else class="fa fa-save me-2"></i>
            Simpan Struktur
          </button>
        </div>
      </div>

      <div class="card-body">
        <div v-if="isLoadingTree" class="text-center p-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2">Memuat struktur jabatan...</p>
        </div>
        <div
          v-else-if="jabatanTree.length === 0"
          class="text-center text-muted p-4"
        >
          Tidak ada data jabatan untuk ditampilkan.
          <br />
          Silakan klik "Tambah Jabatan" untuk memulai.
        </div>

        <draggable
          v-else
          class="jabatan-tree-root"
          v-model="jabatanTree"
          group="jabatan"
          item-key="id_jabatan"
          handle=".handle"
          ghost-class="ghost"
        >
          <template #item="{ element }">
            <JabatanTreeItem
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
import { defineAsyncComponent, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import draggable from "vuedraggable";
import JabatanTreeItem from "./JabatanTreeItem.vue";
import {
  getJabatan,
  updateJabatan,
  deleteJabatan,
} from "@/services/referensi/jabatan";

// === Komponen & State ===
const JabatanFormModal = defineAsyncComponent(() =>
  import("./JabatanFormModal.vue"),
);
const toast = useToast();
const jabatanTree = ref([]);
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
  loadJabatanTree();
}

async function confirmDelete(item) {
  const itemName = item.nama_jabatan || "data ini";
  const result = await Swal.fire({
    title: `Hapus Data`,
    text: `Apakah Anda yakin ingin menghapus jabatan "${itemName}"? Ini juga akan menghapus semua jabatan di bawahnya.`,
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
      await deleteJabatan(item.id_jabatan);
      toast.success(`Data ${itemName} berhasil dihapus`);
      loadJabatanTree();
    } catch (err) {
      toast.error("Gagal menghapus data");
    }
  }
}

function buildTree(items, parentId = null) {
  const tree = [];
  const children = items.filter((item) => {
    if (parentId === null) {
      return (
        item.induk === null ||
        item.induk === "" ||
        item.induk === 0 ||
        item.induk === "0"
      );
    }
    return String(item.induk) === String(parentId);
  });

  for (const item of children) {
    const grandchildren = buildTree(items, item.id_jabatan);
    if (grandchildren.length > 0) {
      item.children = grandchildren;
    } else {
      item.children = [];
    }
    tree.push(item);
  }
  return tree;
}

async function loadJabatanTree() {
  isLoadingTree.value = true;
  try {
    const res = await getJabatan({
      page: 1,
      limit: 9999,
      sort: "nama_jabatan",
    });

    let flatJabatanList = [];
    if (
      res.data &&
      Array.isArray(res.data) &&
      res.data[0] &&
      Array.isArray(res.data[0].data)
    ) {
      flatJabatanList = res.data[0].data;
    } else if (res.data && res.data.data) {
      flatJabatanList = res.data.data;
    } else if (Array.isArray(res.data)) {
      flatJabatanList = res.data;
    }

    jabatanTree.value = buildTree(flatJabatanList, null);
  } catch (err) {
    console.error(err);
    toast.error("Gagal memuat struktur jabatan");
  } finally {
    isLoadingTree.value = false;
  }
}

function flattenTree(items, parentId = null) {
  let flatList = [];
  items.forEach((item) => {
    const updatedItem = {
      ...item,
      induk: parentId,
    };
    const childrenToProcess = item.children || [];

    const itemToSend = { ...updatedItem };
    delete itemToSend.children;

    flatList.push(itemToSend);

    if (childrenToProcess.length > 0) {
      flatList = flatList.concat(
        flattenTree(childrenToProcess, item.id_jabatan),
      );
    }
  });
  return flatList;
}

async function handleSaveStructure() {
  isSavingTree.value = true;
  try {
    const flattenedData = flattenTree(jabatanTree.value, null);

    const updatePromises = flattenedData.map((item) => {
      const data = new FormData();
      data.append("record[nama_jabatan]", item.nama_jabatan);
      data.append("record[induk]", item.induk || "");
      data.append("_method", "PUT");

      return updateJabatan(item.id_jabatan, data);
    });

    await Promise.all(updatePromises);
    toast.success("Struktur jabatan berhasil disimpan");
    await loadJabatanTree();
  } catch (err) {
    console.error(err);
    const errorMessage =
      err.response?.data?.failed || err.message || "Terjadi kesalahan";
    toast.error(`Gagal menyimpan struktur jabatan: ${errorMessage}`);
  } finally {
    isSavingTree.value = false;
  }
}

// === Lifecycle ===
onMounted(() => {
  loadJabatanTree();
});
</script>

<style scoped>
.jabatan-tree-root {
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
