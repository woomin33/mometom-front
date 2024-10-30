import React, { ChangeEvent, KeyboardEvent,useEffect,useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './style.css';
import CorporationInputBox from 'components/CorporationInputBox';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { CategoryList, DevCategoryList, ImageItem, MapPosition, OperationTime, Technique } from 'types/interface';
import { GetCategoryResponseDto, GetDevCategoryResponseDto, GetTechniqueResponseDto } from 'apis/response/category';
import { ResponseDto } from 'apis/response';
import { fileUploadLocationRequest, fileUploadRequest, getCategoryRequest, getDevCategoryRequest, getTechniqueRequest, postCorporationRequest, postNoticeRequest, postResumeRequest } from 'apis';
import { useLocationStore, useLoginUserStore } from 'stores';
import { useCookies } from "react-cookie";
import useCorporationStore from 'stores/corporation.store';
import CorporationTextAreaBox from 'components/CorporationTextareaBox';
import { PostCorporationResponseDto } from 'apis/response/corporation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, RESUME_MANAGEMENT_PATH, RESUME_PATH, USER_PATH } from 'constant';
import { PostCorporationRequestDto } from 'apis/request/corporation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'
import { ca, id, ko } from 'date-fns/locale';
import useNoticeStore from 'stores/notice.store';
import Select from 'react-dropdown-select';
import { PostNoticeRequestDto } from 'apis/request/notice';
import { PostNoticeResponseDto } from 'apis/response/notice';
import InputBox from 'components/InputBox';
import { PostResumeRequestDto } from 'apis/request/resume';
import { PostResumeResponseDto } from 'apis/response/resume';


//          component: 기업 등록 화면 컴포넌트          //
export default function ResumeWrite() {
  
  

  //          state: 개발 직군 카테고리 리스트 상태          //
  const [devCategoryList, setDevCategoryList] = useState<DevCategoryList[]>([]);
    
  //          state: 로그인 유저 상태          //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  //          state: path 상태          //
  const { pathname } = useLocation();

  //          state: 쿠키 상태          //
  const [ cookies, setCookies ] = useCookies(); 

  //          state: 이력서 제목 상태          //
  const [resumeTitle, setResumeTitle] = useState<string>('');
  //          state: 이름 상태          //
  const [name, setName] = useState<string>('');
  //          state: 전화번호 상태          //
  const [contactNumber, setContactNumber] = useState<string>('');
  //          state: 메일 상태          //
  const [mail, setMail] = useState<string>('');
  //          state: 소개 상태          //
  const [introduce, setIntroduce] = useState<string>('');
  //          state: 소개 상태          //
  const [workExperience, setWorkExperience] = useState<string>('');
  //          state: 소개 상태          //
  const [project, setProject] = useState<string>('');
  //          state: 소개 상태          //
  const [otherDetail, setOtherDetail] = useState<string>('');
    
    
    
  //          state: 장소 이름 요소 참조 상태          //
  const corporationNameRef = useRef<HTMLInputElement | null>(null);
  //          state: 소개글 요소 참조 상태          //
  const introductionRef = useRef<HTMLInputElement | null>(null);
  //          state: 연락처 요소 참조 상태          //
  const contactNumberRef = useRef<HTMLInputElement | null>(null);
  //          state: 주소 요소 참조 상태          //
    const addressRef = useRef<HTMLInputElement | null>(null);
    
    //          state: 이미지 파일 인풋 참조 상태          //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 이미지 파일 상태          //
    const [imageFile, setImageFile] = useState<File | null>(null);
    //          state: 이미지 미리보기 URL 상태          //
    const [imageUrl, setImageUrl ] = useState<string>('');

    
    const [techniqueList, setTechniqueList] = useState<Technique[]>([]);
    
    const [selectedTechStack, setSelectedTechStack ] = useState<number[]>([]);
    const [ selectedDevCategory, setSelectedDevCategory ] = useState<number>();
    //          state: 에러 상태          //
    const [error, setError] = useState<boolean>(false);

  //          function: 네비게이트 함수          //
  const navigate = useNavigate();
    
    
    
  //          function: get technique response 처리 함수          //
  const getTechniqueResponse = (responseBody : GetTechniqueResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code !== 'SU') return;

      
    const { techniqueList } = responseBody as GetTechniqueResponseDto;
    setTechniqueList(techniqueList);
  }
  //          functionL post notice response 처리 함수          //
  const postResumeResponse = (responseBody: PostResumeResponseDto | ResponseDto | null) => {
    if(!responseBody) return;
    const { code } = responseBody;
    if(code === 'DBE') alert('데이터베이스 오류입니다.');
    if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
    if(code === 'VF') alert('제목과 내용은 필수입니다.');
    if(code !== 'SU') return;

    if(!loginUser) return;
    const { email } = loginUser;
    navigate(RESUME_PATH() + '/' + RESUME_MANAGEMENT_PATH(email));
  }

  //          event handler: 이미지 업로드 버튼 클릭 이벤트 처리          // 
  const onImageUploadButtonClickHandler = () => {
    if(!imageInputRef.current) return;
    imageInputRef.current.click();
  }
  //          event handler: 이미지 변경 이벤트 처리          //
  const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if(!event.target.files || !event.target.files.length) return;
    const file = event.target.files[0];

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);

    
    setImageFile(file);

    if(!imageInputRef.current) return;
    imageInputRef.current.value = '';
  }
    
  //          event handler: 이력서 제목 변경 이벤트 처리          //
  const onResumeTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setResumeTitle(value);
  }
  //          event handler: 이력서 제목 인풋 키 다운 이벤트 처리          //
  const onResumeTitleKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

  };
  //          event handler: 이름 변경 이벤트 처리          //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setName(value);
  }
  //          event handler: 이름 인풋 키 다운 이벤트 처리          //
  const onNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

  };
  //          event handler: 연락처 변경 이벤트 처리          //
  const onContactNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setContactNumber(value);
  }
  //          event handler: 연락처 인풋 키 다운 이벤트 처리          //
  const onContactNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

  };
  //          event handler: 메일 변경 이벤트 처리          //
  const onMailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setError(false);
    const { value } = event.target;
    setMail(value);
  }
  //          event handler: 메일 인풋 키 다운 이벤트 처리          //
  const onMailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

  };
  //          event handler: 자격요건 변경 이벤트 처리          //
  const onIntroduceChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setError(false);
    const { value } = event.target;
    setIntroduce(value);
  }
  //          event handler: 자격요건 변경 이벤트 처리          //
  const onWorkExperienceChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setError(false);
    const { value } = event.target;
    setWorkExperience(value);
  }
  //          event handler: 자격요건 변경 이벤트 처리          //
  const onProjectChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setError(false);
    const { value } = event.target;
    setProject(value);
  }
  //          event handler: 자격요건 변경 이벤트 처리          //
  const onOtherDetailChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setError(false);
    const { value } = event.target;
    setOtherDetail(value);
  }
  //          event handler: 테크 스택 변경 이벤트 처리          //
  const onTechStackChangeHandler = (selectedItems: any) => {
    const selectedTechNames = selectedItems.map((item: { techniqueNumber: any; }) => item.techniqueNumber);
    setSelectedTechStack(selectedTechNames);
  }
    
   
  //          event handler: 등록 버튼 클릭 이벤트 처리 함수          //
  const onRegistrationButtonClickHandler = async () => {
    const accessToken = cookies.accessToken;
    if(!accessToken || !imageFile) return;

    let image: string = '';

    
    const data = new FormData();
    data.append('file', imageFile);

    const url = await fileUploadRequest(data);
    if(url) {
      image = url;
    }
    
    
    const  requestBody : PostResumeRequestDto = {
      title: resumeTitle, name, contactNumber, mail, introduce, workExperience, project, otherDetail, selectedTechStack, image
    }
      
      console.log(requestBody)
      postResumeRequest(requestBody, accessToken).then(postResumeResponse);
  }  
  
   
    



    
  //          effect: 첫 마운트 시 실행할 함수          //
  useEffect(() => {
    getTechniqueRequest().then(getTechniqueResponse);
  },[]);

    

  
  
  //          render:공고 등록 화면 컴포넌트 렌더링          //
  return (
    <div id='resume-write-wrapper'>
      <div className='resume-write-wrapper'>
        <div className='resume-write-container'>
          <div className='resume-write-title'>{'신규 이력서 등록'}</div>
          <div className='resume-top-box'>
            <div className='resume-top-left-box'>
              <div className='resume-write-title-box'>
                <InputBox label='' type='text' placeholder='이력서제목을 입력해주세요.' error={error} value={resumeTitle} onChange={onResumeTitleChangeHandler} onKeyDown={onResumeTitleKeyDownHandler} />
              </div>
              <div className='resume-write-info-box'>
                <div className='resume-image-box' onClick={onImageUploadButtonClickHandler}>
                  <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onImageChangeHandler}/>
                  {imageUrl &&
                  <img className='image' src={imageUrl} />
                  }
                  {!imageUrl &&
                  <div className='none-image-box'>
                    <div className='icon-rect'>
                      <div className='icon puls-icon'></div>
                    </div>
                    <div className='none-image-title'>{'사진을 첨부해주세요'}</div>
                  </div>
                  }
                </div>
                <div className='resume-write-info'>
                  <InputBox label='' type='text' placeholder='이름을 입력해주세요.' error={error} value={name} onChange={onNameChangeHandler} onKeyDown={onNameKeyDownHandler} />
                  <div className='resume-write-phone-number-box'>
                    <div className='icon-rect'>
                      <div className={'icon phone-icon'}></div>
                    </div>
                    <InputBox label='' type='text' placeholder='전화번호를 입력해주세요.' error={error} value={contactNumber} onChange={onContactNumberChangeHandler} onKeyDown={onContactNumberKeyDownHandler} />
                  </div>
                  <div className='resume-write-phone-number-box'>
                    <div className='icon-rect'>
                      <div className={'icon mail-icon'}></div>
                    </div>
                    <InputBox label='' type='text' placeholder='메일주소를 입력해주세요.' error={error} value={mail} onChange={onMailChangeHandler} onKeyDown={onMailKeyDownHandler} />
                  </div>
                </div>
              </div>
            </div>
            <div className='resume-top-right-box'>
                  <div className='resume-top-right-title'>{'게시글 통계 그래프가 자동으로 삽입됩니다'}</div>
            </div>
          </div>
          
          
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'기술스택 등록'}</div>
            <Select name='select' options={techniqueList} labelField='techniqueName' valueField='techniqueName' values={[]} multi onChange={onTechStackChangeHandler}></Select>
          </div>
          <div className='resume-write-introduce-box'>
            <div className='resume-write-introduce-title'>{'Introduce'}</div>
            <textarea className='resume-write-introduce' onChange={onIntroduceChangeHandler}></textarea>
          </div>
          <div className='resume-write-introduce-box'>
            <div className='resume-write-introduce-title'>{'Work Experience'}</div>
            <textarea className='resume-write-introduce' onChange={onWorkExperienceChangeHandler}></textarea>
          </div>
          <div className='resume-write-introduce-box'>
            <div className='resume-write-introduce-title'>{'Project'}</div>
            <textarea className='resume-write-introduce' onChange={onProjectChangeHandler}></textarea>
          </div>
          <div className='resume-write-introduce-box'>
            <div className='resume-write-introduce-title'>{'Other Deatil'}</div>
            <textarea className='resume-write-introduce' onChange={onOtherDetailChangeHandler}></textarea>
          </div>
          
          <div className='noticeRegistration-button-container'>
            <div className='black-button' >{'취소'}</div>
            <div className='black-button' onClick={onRegistrationButtonClickHandler} >{'등록하기'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


