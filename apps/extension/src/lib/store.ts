import { create } from "zustand";

interface ContentStore {
  webpageId: string | null;
  webpageTitle: string | null;
  setWebpageId: (id: string | null) => void;
  setWebpageTitle: (title: string | null) => void;
  setWebpage: (id: string | null, title: string | null) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  webpageId: null,
  webpageTitle: null,
  setWebpageId: (id) => set({ webpageId: id }),
  setWebpageTitle: (title) => set({ webpageTitle: title }),
  setWebpage: (id, title) => set({ webpageId: id, webpageTitle: title }),
}));
