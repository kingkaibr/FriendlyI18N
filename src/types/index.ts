export interface I18nFile {
  name: string;
  id: string;
}

export type ModalType = 'edit' | 'add';

export interface EditorState {
  files: I18nFile[];
  referenceFileId: string | null;
  flatData: Record<string, Record<string, string>>;
  keyOrders: Record<string, string[]>;
  searchQuery: string;
  selectedKeys: Set<string>;
  visibleFileIds: Set<string>;
  isDraggingFiles: boolean;
}
