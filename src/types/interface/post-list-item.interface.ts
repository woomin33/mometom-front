export default interface PostListItem{
    postNumber: number;
    title: string;
    content: string;
    commentCount: number;
    viewCount: number;
    writeDatetime: string;
    writerEmail : string;
    writerNickname: string;
    writerProfileImage: string | null;
}