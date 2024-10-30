import { create } from 'zustand';

interface noticeStore{
    selectedDevCategory: number | null;
    title: string;
    endDate: Date | null;
    career: string;
    employmentForm: string;
    recruitNumber: string;
    wage: string;
    task: string;
    condition: string;
    preference: string;
    selectedTechStack: number[];
    etc: string;
    

    setSelectedDevCategory: (selectedDevCategory: number | null) => void;
    setTitle: (title: string) => void;
    setEndDate: (endDate: Date | null) => void;
    setCareer: (career: string) => void;
    setEmploymentForm: (employmentForm: string) => void;
    setRecruitNumber: (recruitNumber: string) => void;
    setWage: (wage: string) => void;
    setTask: (task: string) => void;
    setCondition: (condition: string) => void;
    setPreference: (preference: string) => void;
    setEtc: (etc: string) => void;
    setSelectedTechStack: (selectedTechStack: number[]) => void;

    resetNotice: () => void;
}; 

const useNoticeStore = create<noticeStore>(set => ({
    selectedDevCategory: null,
    title: '',
    endDate: new Date(),
    career: '',
    employmentForm: '',
    recruitNumber: '',
    wage: '',
    task: '',
    condition: '',
    preference: '',
    etc: '',
    selectedTechStack: [],

    setSelectedDevCategory: (selectedDevCategory) => set(state => ({ ...state, selectedDevCategory})),
    setTitle: (title) => set(state => ({ ...state, title})),
    setEndDate: (endDate) => set(state => ({...state, endDate})),
    setEmploymentForm: (employmentForm) => set(state => ({ ...state, employmentForm})),
    setWage: (wage) => set(state => ({ ...state, wage})),
    setCareer: (career) => set(state => ({ ...state, career})),
    setRecruitNumber: (recruitNumber) => set(state => ({ ...state, recruitNumber})),
    setTask: (task) => set(state => ({...state, task})),
    setCondition: (condition) => set(state => ({ ...state, condition})),
    setPreference: (preference) => set(state => ({ ...state, preference})),
    setEtc: (etc) => set(state => ({ ...state, etc})),
    setSelectedTechStack: (selectedTechStack) => set(state => ({ ...state, selectedTechStack})),

    resetNotice: () => set(state => ({ ...state, 
        selectedDevCategory: null,
        title: '',
        endDate: new Date(),
        grade: '',
        employmentForm: '',
        recruitNumber: '',
        wage: '',
        career: '',
        task: '',
        condition: '',
        preference: '',
        etc: '',
        selectedTechStack: [],
    }))
    

}))
export default useNoticeStore;