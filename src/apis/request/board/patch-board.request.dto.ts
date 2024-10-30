export default interface PatchBoardRequestDto{
    title: string;
    content: string;
    boardImageList: string[];
    boardVideoList: string[];
    selectedCategoryList : number[];
}