import ResponseDto from '../response.dto';
import ResumeListItem from 'types/interface/resume-list.item.interface';

export default interface GetUserResumeListResponseDto extends ResponseDto{
    userResumeList: ResumeListItem[];
}