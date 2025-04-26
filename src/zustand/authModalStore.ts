import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useAuthModalStore;
