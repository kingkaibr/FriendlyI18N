<script setup lang="ts">
import { ref } from 'vue';
import { Search, Plus, Maximize2, Star } from 'lucide-vue-next';
import { useEditor } from '../../store/useEditor';

const { 
  filteredKeys, 
  visibleFiles, 
  referenceFileId, 
  selectedKeys, 
  flatData,
  searchQuery,
  handleFileInput
} = useEditor();

defineProps<{
  columnWidths: Record<string, number>;
}>();

const emit = defineEmits(['add-key', 'edit-key', 'resize-col']);

const toggleKeySelection = (key: string) => {
  if (selectedKeys.value.has(key)) selectedKeys.value.delete(key);
  else selectedKeys.value.add(key);
};

const toggleSelectAll = () => {
  if (selectedKeys.value.size === filteredKeys.value.length) {
    selectedKeys.value.clear();
  } else {
    filteredKeys.value.forEach(k => selectedKeys.value.add(k));
  }
};

const autoResize = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
};
</script>

<template>
  <div class="grid-view">
    <div class="top-bar">
      <div class="search">
        <Search :size="14" />
        <input v-model="searchQuery" placeholder="Filter keys..." />
      </div>
      <div class="toolbar-btns">
        <button @click="$emit('add-key')" class="btn-solid">
          <Plus :size="14" /> Add Key
        </button>
        <label class="btn-outline">
          <Plus :size="14" /> Add Files
          <input type="file" multiple accept=".json" @change="handleFileInput" class="hidden" />
        </label>
      </div>
    </div>

    <div class="table-outer">
      <table class="table">
        <thead>
          <tr>
            <th width="40" class="sticky-x-idx sticky-y">
              <input type="checkbox" :checked="selectedKeys.size === filteredKeys.length && filteredKeys.length > 0" @change="toggleSelectAll" />
            </th>
            <th class="sticky-x-key sticky-y" :style="{ width: columnWidths.key + 'px' }">
              Key
              <div class="col-handle" @mousedown="$emit('resize-col', $event, 'key')"></div>
            </th>
            <th v-for="f in visibleFiles" :key="f.id" class="sticky-y" :style="{ width: columnWidths[f.id] + 'px' }" :class="{ 'ref-col': referenceFileId === f.id }">
              <div class="col-header-content">
                {{ f.name }}
                <Star v-if="referenceFileId === f.id" :size="10" fill="currentColor" />
              </div>
              <div class="col-handle" @mousedown="$emit('resize-col', $event, f.id)"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in filteredKeys" :key="k" :class="{ active: selectedKeys.has(k) }">
            <td class="sticky-x-idx">
              <input type="checkbox" :checked="selectedKeys.has(k)" @change="toggleKeySelection(k)" />
            </td>
            <td class="sticky-x-key">
              <div class="key-cell-content">
                <code>{{ k }}</code>
                <button class="icon-btn edit-key-btn" @click="$emit('edit-key', k)"><Maximize2 :size="12" /></button>
              </div>
            </td>
            <td v-for="f in visibleFiles" :key="f.id" :class="{ 'ref-cell': referenceFileId === f.id }">
              <textarea v-model="flatData[f.id][k]" rows="1" @input="autoResize"></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
