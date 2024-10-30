import ResponseDto from '../response.dto';
import DevCategoryList from 'types/interface/devcategory.interface';

export default interface GetDevCategoryResponseDto extends ResponseDto{
    devCategoryList: DevCategoryList[];
}