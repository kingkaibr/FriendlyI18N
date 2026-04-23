import { ref, reactive } from 'vue';

export function useResizing() {
  const sidebarWidth = ref(280);
  const columnWidths = reactive<Record<string, number>>({ key: 280 });
  
  const isResizingSidebar = ref(false);
  const activeResizingCol = ref<string | null>(null);
  const startX = ref(0);
  const startWidth = ref(0);

  const startSidebarResize = (e: MouseEvent) => {
    isResizingSidebar.value = true;
    startX.value = e.clientX;
    startWidth.value = sidebarWidth.value;
    window.addEventListener('mousemove', onSidebarResize);
    window.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'ew-resize';
  };

  const onSidebarResize = (e: MouseEvent) => {
    if (isResizingSidebar.value) {
      sidebarWidth.value = Math.max(200, Math.min(600, startWidth.value + (e.clientX - startX.value)));
    }
  };

  const startColumnResize = (e: MouseEvent, id: string) => {
    activeResizingCol.value = id;
    startX.value = e.clientX;
    startWidth.value = columnWidths[id] || (id === 'key' ? 280 : 200);
    window.addEventListener('mousemove', onColumnResize);
    window.addEventListener('mouseup', stopResize);
    document.body.style.cursor = 'col-resize';
  };

  const onColumnResize = (e: MouseEvent) => {
    if (activeResizingCol.value) {
      columnWidths[activeResizingCol.value] = Math.max(80, startWidth.value + (e.clientX - startX.value));
    }
  };

  const stopResize = () => {
    isResizingSidebar.value = false;
    activeResizingCol.value = null;
    window.removeEventListener('mousemove', onSidebarResize);
    window.removeEventListener('mousemove', onColumnResize);
    window.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
  };

  return {
    sidebarWidth,
    columnWidths,
    startSidebarResize,
    startColumnResize
  };
}
