<script setup lang="ts">
import { FileJson, X, Star } from 'lucide-vue-next';
import { useEditor } from '../../store/useEditor';

const { files, referenceFileId, visibleFileIds } = useEditor();

const toggleVisibility = (id: string) => {
  if (visibleFileIds.value.has(id)) visibleFileIds.value.delete(id);
  else visibleFileIds.value.add(id);
};

const removeFile = (id: string) => {
  const idx = files.value.findIndex(f => f.id === id);
  if (idx !== -1) {
    files.value.splice(idx, 1);
    if (referenceFileId.value === id) {
      referenceFileId.value = files.value[0]?.id || null;
    }
    visibleFileIds.value.delete(id);
  }
};
</script>

<template>
  <div class="list-box">
    <div v-for="f in files" :key="f.id" class="item" :class="{ inactive: !visibleFileIds.has(f.id), reference: referenceFileId === f.id }">
      <div class="label-group">
        <span class="label" @click="toggleVisibility(f.id)">
          <FileJson :size="12" /> {{ f.name }}
        </span>
        <button 
          class="star-btn" 
          :class="{ active: referenceFileId === f.id }" 
          @click="referenceFileId = f.id"
          title="Set as Base Language"
        >
          <Star :size="12" :fill="referenceFileId === f.id ? '#fff' : 'none'" />
        </button>
      </div>
      <button class="remove" @click.stop="removeFile(f.id)"><X :size="12" /></button>
    </div>
  </div>
</template>
