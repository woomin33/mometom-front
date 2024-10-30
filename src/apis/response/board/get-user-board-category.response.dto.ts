import { Board } from "types/interface";
import ResponseDto from "../response.dto";
import UserBoardCategoryListItem from "types/interface/user-board-category-list-item.interface";

export default interface GetUserBoardCategoryResponseDto extends ResponseDto, Board{
    userBoardCategoryList: UserBoardCategoryListItem[];
}