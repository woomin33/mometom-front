import { BoardListItem } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetMostViewedBoardListResponseDto extends ResponseDto{
    mostViewedList: BoardListItem[];
}