import ResponseDto from '../response.dto';
import PostListItem from 'types/interface/post-list-item.interface';

export default interface GetPostListResponseDto extends ResponseDto{
    postList: PostListItem[];
}