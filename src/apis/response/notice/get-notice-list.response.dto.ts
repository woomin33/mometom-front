import { NoticeListItem } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetNoticeListResponseDto extends ResponseDto{
    noticeListItems: NoticeListItem[]
}