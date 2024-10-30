export default interface PostBoardRequestDto{
    title: string;
    content: string;
    boardImageList: string[];
    boardVideoList: string[];
    selectedCategoryList : number[];
}