import ResponseDto from '../response.dto';
import TechniqueList from 'types/interface/technique.interface';

export default interface GetTechniqueResponseDto extends ResponseDto{
    techniqueList: TechniqueList[];
}