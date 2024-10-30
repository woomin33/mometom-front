export default interface PostNoticeRequestDto{
    selectedDevCategory: number;
    title: string;
    endDate: Date;
    career: string;
    employmentForm: string;
    recruitNumber: string;
    wage: string | null;
    task: string | null;
    condition: string | null;
    preference: string | null;
    etc: string | null;
    selectedTechStack: number[];
}