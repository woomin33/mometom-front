import PostListItem from "types/interface/post-list-item.interface";
import ResponseDto from "../response.dto";


export default interface GetSearchPosListResponseDto extends ResponseDto{
    searchList: PostListItem[];
}