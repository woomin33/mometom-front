import { create } from 'zustand';

interface PostStore{
    title: string;
    content: string;
   
    setTitle: (title: string) => void;
    setContent: (content: string) => void;

    resetPost: () => void;
};

const usePostStore = create<PostStore>(set => ({
    title: '',
    content: '',
    
    setTitle: (title) => set(state => ({ ...state, title})),
    setContent: (content) => set(state => ({ ...state, content})),
    
    resetPost: () => set(state => ({ ...state, title: '', content: '' })),

}))

export default usePostStore;
