import { BoardListItem } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetPopularityBoardListResponseDto extends ResponseDto{
    popularityList: BoardListItem[];
}