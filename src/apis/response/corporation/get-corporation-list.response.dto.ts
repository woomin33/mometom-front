import { CorporationListItem } from "types/interface";
import ResponseDto from "../response.dto";


export default interface GetCorporationListResponseDto extends ResponseDto{
    corporationList: CorporationListItem[];
}