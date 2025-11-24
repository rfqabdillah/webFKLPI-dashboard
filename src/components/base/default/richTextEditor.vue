<template>
  <div class="editor-wrapper" :class="{ 'is-invalid': isInvalid }">
    <QuillEditor
      ref="quill"
      theme="snow"
      :options="editorOptions"
      v-model:content="internalContent"
      contentType="html"
      @update:content="onContentChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isInvalid: {
    type: Boolean,
    default: false
  },
  placeholder: { 
    type: String,
    default: 'Masukkan konten...' 
  }
});

const emit = defineEmits(['update:modelValue']);
const internalContent = ref(props.modelValue);
const editorOptions = {
  placeholder: props.placeholder,
  modules: {
    toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ['clean'],
    ['link', 'image', 'video']
  ]
  }
};

// Saat v-model dari luar berubah, update editor
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalContent.value) {
    internalContent.value = newValue;
  }
});

// Saat editor berubah, kirim (emit) data ke luar
function onContentChange(content) {
  // Jika editor dikosongkan, Quill terkadang menghasilkan '<p><br></p>'
  // Kita anggap ini sebagai string kosong.
  if (content === '<p><br></p>') {
    content = '';
  }
  emit('update:modelValue', content);
}
</script>

<style scoped>
/* * 1. Buat wrapper yang meniru input Bootstrap.
 * Ini adalah 'bingkai' luar untuk editor.
*/
.editor-wrapper {
  border: 1px solid #ced4da; /* Warna border default Bootstrap */
  border-radius: 0.375rem;  /* Radius default Bootstrap */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* * 2. Ini adalah bagian utamanya:
 * Saat elemen APAPUN di dalam .editor-wrapper di-fokus...
 * (misalnya, saat Anda mengklik area teks .ql-editor)
 * ...terapkan gaya 'focus' Bootstrap ke wrapper.
*/
.editor-wrapper:focus-within {
  border-color: #86b7fe; /* Warna border focus Bootstrap */
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Efek 'glow' biru */
}

/* * 3. Hapus border default Quill agar tidak tumpang tindih.
 * Kita menggunakan :deep() untuk menata gaya komponen anak.
*/

/* Atur Toolbar (bagian atas) */
:deep(.ql-toolbar.ql-snow) {
  border: none; /* Hapus border default */
  border-bottom: 1px solid #ced4da; /* Tambahkan garis pemisah */
  border-top-left-radius: 0.375rem; /* Cocokkan radius wrapper */
  border-top-right-radius: 0.375rem;
}

/* Atur Kontainer (area pengetikan, bagian bawah) */
:deep(.ql-container.ql-snow) {
  border: none; /* Hapus border default */
  border-bottom-left-radius: 0.375rem; /* Cocokkan radius wrapper */
  border-bottom-right-radius: 0.375rem;
}

/* Pastikan area editor memiliki tinggi minimum */
:deep(.ql-editor) {
  min-height: 200px;
}

/*
 * 4. Tambahkan style 'is-invalid' (border merah)
 * jika prop isInvalid bernilai true.
*/
.editor-wrapper.is-invalid {
  border-color: #dc3545; /* Warna 'danger' Bootstrap */
}

.editor-wrapper.is-invalid:focus-within {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25); /* Glow merah */
}

:deep(.editor-wrapper.is-invalid .ql-toolbar.ql-snow) {
  border-bottom-color: #dc3545;
}
</style>