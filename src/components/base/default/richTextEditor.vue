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
import { ref, watch } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  isInvalid: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Masukkan konten...",
  },
});

const emit = defineEmits(["update:modelValue"]);
const internalContent = ref(props.modelValue);
const editorOptions = {
  placeholder: props.placeholder,
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link"],
    ],
  },
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== internalContent.value) {
      internalContent.value = newValue;
    }
  }
);

function onContentChange(content) {
  if (content === "<p><br></p>") {
    content = "";
  }
  emit("update:modelValue", content);
}
</script>

<style scoped>
.editor-wrapper {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.editor-wrapper:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

:deep(.ql-toolbar.ql-snow) {
  border: none;
  border-bottom: 1px solid #ced4da;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

:deep(.ql-container.ql-snow) {
  border: none;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

:deep(.ql-editor) {
  min-height: 200px;
}

.editor-wrapper.is-invalid {
  border-color: #dc3545;
}

.editor-wrapper.is-invalid:focus-within {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

:deep(.editor-wrapper.is-invalid .ql-toolbar.ql-snow) {
  border-bottom-color: #dc3545;
}
</style>
