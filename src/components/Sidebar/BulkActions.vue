<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ArrowRight, Trash2, Download } from 'lucide-vue-next';
import { useEditorStore } from '../../store/useEditor';

const editorStore = useEditorStore();
const { selectedKeys, filteredKeys } = storeToRefs(editorStore);
const { applyBulkAction, exportProject } = editorStore;

const bulkPrefix = ref('');
const bulkSuffix = ref('');
const bulkFind = ref('');
const bulkReplace = ref('');

const emit = defineEmits(['confirm-delete']);

const handleAction = (type: string) => {
  applyBulkAction(type, {
    prefix: bulkPrefix.value,
    suffix: bulkSuffix.value,
    find: bulkFind.value,
    replace: bulkReplace.value
  });
};
</script>

<template>
  <div class="tools">
    <div class="input-group">
      <input v-model="bulkPrefix" placeholder="Prefix" />
      <button @click="handleAction('prefix')"><ArrowRight :size="14" /></button>
    </div>
    <div class="input-group">
      <input v-model="bulkSuffix" placeholder="Suffix" />
      <button @click="handleAction('suffix')"><ArrowRight :size="14" /></button>
    </div>
    <div class="row">
      <button class="btn-outline" @click="handleAction('uppercase')">UPPER</button>
      <button class="btn-outline" @click="handleAction('lowercase')">lower</button>
    </div>
    <input v-model="bulkFind" placeholder="Find..." class="spacer" />
    <input v-model="bulkReplace" placeholder="Replace..." />
    <button @click="handleAction('replace')" class="btn-solid">Apply Replace</button>
    
    <div class="mt-auto">
      <button @click="$emit('confirm-delete')" class="btn-danger" :disabled="selectedKeys.size === 0 && filteredKeys.length === 0">
        <Trash2 :size="14" /> Delete Keys
      </button>
      <button @click="exportProject" class="btn-success">
        <Download :size="14" /> ZIP Export Aligned
      </button>
    </div>
  </div>
</template>
