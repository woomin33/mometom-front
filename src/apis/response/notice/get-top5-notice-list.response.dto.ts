import { NoticeListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetTop5NoticeListResponseDto extends ResponseDto{
    top5List: NoticeListItem[];
}