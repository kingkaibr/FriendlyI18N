import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import type { I18nFile } from '../types';
import JSZip from 'jszip';

export const useEditorStore = defineStore('editor', () => {
  // State
  const files = ref<I18nFile[]>([]);
  const referenceFileId = ref<string | null>(null);
  const flatData = reactive<Record<string, Record<string, string>>>({});
  const keyOrders = reactive<Record<string, string[]>>({});
  const searchQuery = ref('');
  const selectedKeys = ref<Set<string>>(new Set());
  const visibleFileIds = ref<Set<string>>(new Set());
  const isDraggingFiles = ref(false);
  const langFilterQuery = ref('');

  // Getters
  const allKeys = computed(() => {
    const keys = new Set<string>();
    let baseKeys: string[] = [];
    
    const refId = referenceFileId.value;
    if (refId && keyOrders[refId]) {
      baseKeys = [...keyOrders[refId]!];
    }

    Object.values(flatData).forEach(fileMap => {
      if (fileMap) {
        Object.keys(fileMap).forEach(k => keys.add(k));
      }
    });

    const extraKeys = Array.from(keys).filter(k => !baseKeys.includes(k)).sort();
    const sortedKeys = baseKeys.filter(k => keys.has(k));
    return [...sortedKeys, ...extraKeys];
  });

  const filteredKeys = computed(() => {
    const q = searchQuery.value.toLowerCase();
    if (!q) return allKeys.value;
    return allKeys.value.filter((k: string) => {
      if (k.toLowerCase().includes(q)) return true;
      return files.value.some(f => {
        const fileMap = flatData[f.id];
        return fileMap?.[k]?.toLowerCase().includes(q) ?? false;
      });
    });
  });

  const visibleFiles = computed(() => {
    const q = langFilterQuery.value.trim().toLowerCase();
    if (!q) return files.value.filter(f => visibleFileIds.value.has(f.id));
    const tokens = q.split(',').map(t => t.trim()).filter(t => !!t);
    return files.value.filter(f => tokens.some(token => f.name.toLowerCase().includes(token)));
  });

  // Helper Utilities (Private)
  const flatten = (obj: any, prefix = '', res: Record<string, string> = {}, order: string[] = []) => {
    if (!obj || typeof obj !== 'object') return { res, order };
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flatten(obj[key], fullKey, res, order);
      } else {
        res[fullKey] = String(obj[key] ?? '');
        order.push(fullKey);
      }
    }
    return { res, order };
  };

  const unflatten = (flat: Record<string, string>, order: string[]) => {
    const res: any = {};
    order.forEach(key => {
      if (flat[key] === undefined) return;
      const parts = key.split('.');
      let curr = res;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]!;
        if (!curr[part]) curr[part] = {};
        curr = curr[part];
      }
      const lastPart = parts[parts.length - 1]!;
      curr[lastPart] = flat[key];
    });
    return res;
  };

  // Actions
  const processFiles = async (fileList: FileList) => {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file || !file.name.endsWith('.json')) continue;
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        const id = 'f_' + Math.random().toString(36).substr(2, 9);
        files.value.push({ name: file.name, id });
        
        const { res, order } = flatten(json);
        flatData[id] = res;
        keyOrders[id] = order;
        visibleFileIds.value.add(id);

        if (file.name.toLowerCase().includes('pt') && !referenceFileId.value) {
          referenceFileId.value = id;
        }
      } catch (e) { console.error('Error loading file', e); }
    }
    if (files.value.length > 0 && !referenceFileId.value) {
      referenceFileId.value = files.value[0]?.id || null;
    }
  };

  const updateKey = (key: string, values: Record<string, string>) => {
    files.value.forEach(f => {
      const fileMap = flatData[f.id];
      if (fileMap) {
        fileMap[key] = values[f.id] || '';
      }
    });
  };

  const addKey = (key: string, values: Record<string, string>) => {
    files.value.forEach(f => {
      const fileMap = flatData[f.id];
      if (fileMap) {
        fileMap[key] = values[f.id] || '';
      }
    });
    const refId = referenceFileId.value;
    if (refId && keyOrders[refId]) {
      keyOrders[refId].push(key);
    }
  };

  const bulkDelete = (keysToDelete?: string[]) => {
    const targetKeys = keysToDelete || (selectedKeys.value.size > 0 ? Array.from(selectedKeys.value) : filteredKeys.value);
    targetKeys.forEach((k: string) => {
      files.value.forEach(f => {
        const fileMap = flatData[f.id];
        if (fileMap) delete fileMap[k];
        if (keyOrders[f.id]) keyOrders[f.id] = keyOrders[f.id]!.filter(ok => ok !== k);
      });
    });
    selectedKeys.value.clear();
  };

  const applyBulkAction = (action: string, payload: { prefix?: string, suffix?: string, find?: string, replace?: string } = {}) => {
    const keys = selectedKeys.value.size > 0 ? Array.from(selectedKeys.value) : filteredKeys.value;
    keys.forEach((k: string) => {
      files.value.forEach(f => {
        const fileMap = flatData[f.id];
        if (!fileMap) return;
        let val = fileMap[k] || '';
        if (action === 'prefix') val = (payload.prefix || '') + val;
        if (action === 'suffix') val = val + (payload.suffix || '');
        if (action === 'replace') val = val.split(payload.find || '').join(payload.replace || '');
        if (action === 'uppercase') val = val.toUpperCase();
        if (action === 'lowercase') val = val.toLowerCase();
        fileMap[k] = val;
      });
    });
  };

  const handleFileInput = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) await processFiles(target.files);
  };

  const exportProject = async () => {
    const zip = new JSZip();
    const currentUnionKeys = allKeys.value;
    files.value.forEach(f => {
      const fileMap = flatData[f.id];
      if (!fileMap) return;
      const syncData: Record<string, string> = {};
      currentUnionKeys.forEach((k: string) => {
        syncData[k] = fileMap[k] || ""; 
      });
      const data = unflatten(syncData, currentUnionKeys);
      zip.file(f.name, JSON.stringify(data, null, 2));
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `friendly_i18n_aligned_${new Date().getTime()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    files,
    referenceFileId,
    flatData,
    keyOrders,
    searchQuery,
    selectedKeys,
    visibleFileIds,
    isDraggingFiles,
    langFilterQuery,
    allKeys,
    filteredKeys,
    visibleFiles,
    processFiles,
    updateKey,
    addKey,
    bulkDelete,
    applyBulkAction,
    handleFileInput,
    exportProject
  };
});
