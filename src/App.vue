<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Upload } from 'lucide-vue-next';
import { useEditorStore } from './store/useEditor';
import { useResizing } from './composables/useResizing';
import type { ModalType } from './types';

// Components
import Sidebar from './components/Sidebar/Sidebar.vue';
import TranslationGrid from './components/Grid/TranslationGrid.vue';
import EditModal from './components/Modals/EditModal.vue';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal.vue';

const editorStore = useEditorStore();
const { 
  files, 
  isDraggingFiles
} = storeToRefs(editorStore);
const { processFiles, handleFileInput } = editorStore;

const { 
  sidebarWidth, 
  columnWidths, 
  startSidebarResize, 
  startColumnResize 
} = useResizing();

// Modal Local State
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const modalType = ref<ModalType>('add');
const activeKey = ref<string | undefined>(undefined);

const openEdit = (key?: string) => {
  modalType.value = key ? 'edit' : 'add';
  activeKey.value = key;
  showEditModal.value = true;
};
</script>

<template>
  <div 
    class="app" 
    @dragover.prevent="isDraggingFiles = true" 
    @dragleave.prevent="isDraggingFiles = false" 
    @drop.prevent="isDraggingFiles = false; if($event.dataTransfer?.files) processFiles($event.dataTransfer.files)"
  >
    <!-- Modal Layer -->
    <EditModal 
      :show="showEditModal" 
      :type="modalType" 
      :initial-key="activeKey" 
      @close="showEditModal = false" 
    />
    <DeleteConfirmModal 
      :show="showDeleteModal" 
      @close="showDeleteModal = false" 
    />

    <!-- Layout Parts -->
    <Sidebar 
      :width="sidebarWidth" 
      @resize-start="startSidebarResize" 
      @confirm-delete="showDeleteModal = true" 
    />

    <main class="main">
      <div v-if="files.length === 0" class="upload-area">
        <div class="drop-target" :class="{ active: isDraggingFiles }">
          <Upload :size="32" />
          <h3>Drag i18n JSON files here</h3>
          <p>Clean code, modular structure, global sync</p>
          <label class="btn-solid">
            Browse
            <input type="file" multiple accept=".json" @change="handleFileInput" class="hidden" />
          </label>
        </div>
      </div>

      <TranslationGrid 
        v-else
        :column-widths="columnWidths"
        @add-key="openEdit()"
        @edit-key="openEdit"
        @resize-col="startColumnResize"
      />
    </main>
  </div>
</template>
