export default interface Post{
    postNumber: number;
    title: string;
    content: string;
    writeDatetime: string;
    writerEmail: string;
    writerNickname: string;
    writerProfileImage: string | null;
}
