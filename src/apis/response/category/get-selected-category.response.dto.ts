import CategoryList from 'types/interface/category.interface';
import ResponseDto from '../response.dto';

export default interface GetSelectedCategoryResponseDto extends ResponseDto{
    selectedCategoryList: CategoryList[];
}