<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { AlertTriangle } from 'lucide-vue-next';
import { useEditorStore } from '../../store/useEditor';

defineProps<{
  show: boolean;
}>();

const emit = defineEmits(['close']);

const editorStore = useEditorStore();
const { selectedKeys, filteredKeys } = storeToRefs(editorStore);
const { bulkDelete } = editorStore;

const handleConfirm = () => {
  bulkDelete();
  emit('close');
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card small">
      <div class="modal-body center">
        <div class="warn-icon"><AlertTriangle :size="32" /></div>
        <h3>Confirm Deletion</h3>
        <p>This will remove {{ selectedKeys.size || filteredKeys.length }} keys from <b>all</b> files based on the aligned structure. This cannot be undone.</p>
      </div>
      <footer class="modal-footer split">
        <button @click="$emit('close')" class="btn-outline">Cancel</button>
        <button @click="handleConfirm" class="btn-danger-solid">Delete Everywhere</button>
      </footer>
    </div>
  </div>
</template>
