import { create } from 'zustand';

interface BoardStore{
    title: string;
    content: string;
    boardImageFileList: File[];
    boardVideoFileList: File[];
    //selectedCategoryList: number[];
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setBoardImageFileList: (boardImageFileList: File[]) => void;
    setBoardVideoFileList: (boardVideoFileList: File[]) => void;
    //setSelectedCategoryList: (selectedCategoryList: number[]) => void;
    resetBoard: () => void;
};

const useBoardStore = create<BoardStore>(set => ({
    title: '',
    content: '',
    boardImageFileList: [],
    boardVideoFileList: [],
    //selectedCategoryList: [],
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    setBoardImageFileList: (boardImageFileList) => set(state => ({ ...state, boardImageFileList})),
    setBoardVideoFileList: (boardVideoFileList) => set(state => ({ ...state, boardVideoFileList})),
    //setSelectedCategoryList: (selectedCategoryList) => set(state => ({ ...state, selectedCategoryList})), 
    resetBoard: () => set(state => ({ ...state, title: '', content: '', boardImageFileList: [], boardVideoFileList: [] })),

}))

export default useBoardStore;
