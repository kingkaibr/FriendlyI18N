<script setup lang="ts">
import { useEditor } from '../../store/useEditor';
import { X } from 'lucide-vue-next';
import LanguageList from './LanguageList.vue';
import BulkActions from './BulkActions.vue';

const { files, allKeys, visibleFileIds, langFilterQuery } = useEditor();

defineProps<{
  width: number;
}>();

defineEmits(['resize-start', 'confirm-delete']);
</script>

<template>
  <aside class="sidebar" :style="{ width: width + 'px' }" v-if="files.length > 0">
    <div class="sidebar-content">
      <div class="header">
        <h2>FriendlyI18n</h2>
        <div class="stats">
          <span>{{ files.length }} langs</span>
          <span>{{ allKeys.length }} keys</span>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>LANGUAGES</h3>
          <div class="actions">
            <button @click="visibleFileIds.clear(); files.forEach(f => visibleFileIds.add(f.id))">All</button>
            <button @click="visibleFileIds.clear()">None</button>
          </div>
        </div>
        <div class="filter-group">
          <input 
            v-model="langFilterQuery" 
            placeholder="View only (e.g. en, pt, es)..." 
            class="lang-filter-input"
          />
          <button v-if="langFilterQuery" @click="langFilterQuery = ''" class="clear-filter">
            <X :size="12" />
          </button>
        </div>
        <LanguageList />
      </div>

      <div class="section fill">
        <div class="section-divider"></div>
        <div class="section-header">
          <h3>BULK TOOLS</h3>
        </div>
        <BulkActions @confirm-delete="$emit('confirm-delete')" />
      </div>
    </div>
    <div class="resizer" @mousedown="$emit('resize-start', $event)"></div>
  </aside>
</template>
