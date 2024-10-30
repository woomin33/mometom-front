import CategoryList from 'types/interface/category.interface';
import ResponseDto from '../response.dto';

export default interface GetCategoryResponseDto extends ResponseDto{
    categoryList: CategoryList[];
}