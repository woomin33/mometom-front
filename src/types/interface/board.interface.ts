export default interface Board{
    boardNumber: number;
    title: string;
    content: string;
    boardImageList: string[];
    boardVideoList: string[];
    writeDatetime: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
}
