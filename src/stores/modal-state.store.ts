import { create } from "zustand";

interface modalStateStore{
    isModalOpen: boolean;
    setModalOpen: (isModalOpen: boolean) => void;
}   

const useModalStateStore = create<modalStateStore>(set => ({
    isModalOpen: false,
    setModalOpen: (isModalOpen) => set(state => ({ ...state, isModalOpen})),
}))

export default useModalStateStore;