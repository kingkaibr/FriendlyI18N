<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { X } from 'lucide-vue-next';
import { useEditor } from '../../store/useEditor';
import type { ModalType } from '../../types';

const props = defineProps<{
  show: boolean;
  type: ModalType;
  initialKey?: string;
}>();

const emit = defineEmits(['close']);

const { files, flatData, allKeys, addKey, updateKey, referenceFileId } = useEditor();

const modalKey = ref('');
const modalValues = reactive<Record<string, string>>({});
const modalError = ref('');

watch(() => props.show, (isShown) => {
  if (isShown) {
    modalError.value = '';
    if (props.type === 'edit' && props.initialKey) {
      modalKey.value = props.initialKey;
      files.value.forEach(f => {
        modalValues[f.id] = flatData[f.id][props.initialKey!] || '';
      });
    } else {
      modalKey.value = '';
      files.value.forEach(f => modalValues[f.id] = '');
    }
  }
});

const handleSave = () => {
  if (!modalKey.value) {
    modalError.value = 'Key name is required';
    return;
  }
  
  if (props.type === 'add' && allKeys.value.includes(modalKey.value)) {
    modalError.value = 'Key already exists';
    return;
  }

  if (props.type === 'add') {
    addKey(modalKey.value, modalValues);
  } else {
    updateKey(modalKey.value, modalValues);
  }

  emit('close');
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card">
      <header class="modal-header">
        <h3>{{ type === 'add' ? 'Add New Key' : 'Edit Translation' }}</h3>
        <button @click="$emit('close')" class="icon-btn"><X :size="18" /></button>
      </header>
      <div class="modal-body">
        <div class="form-group">
          <label>I18N KEY</label>
          <input v-model="modalKey" placeholder="e.g. common.buttons.save" :disabled="type === 'edit'" class="key-input" />
          <span v-if="modalError" class="error-msg">{{ modalError }}</span>
        </div>
        <div class="lang-grid">
          <div v-for="f in files" :key="f.id" class="lang-row">
            <label>{{ f.name }} <span v-if="referenceFileId === f.id" class="badge">BASE</span></label>
            <textarea v-model="modalValues[f.id]" rows="2"></textarea>
          </div>
        </div>
      </div>
      <footer class="modal-footer">
        <button @click="$emit('close')" class="btn-outline">Cancel</button>
        <button @click="handleSave" class="btn-solid">Save Changes</button>
      </footer>
    </div>
  </div>
</template>
