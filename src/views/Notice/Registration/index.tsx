import React, { ChangeEvent, KeyboardEvent,useEffect,useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './style.css';
import CorporationInputBox from 'components/CorporationInputBox';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { CategoryList, DevCategoryList, ImageItem, MapPosition, OperationTime, Technique } from 'types/interface';
import { GetCategoryResponseDto, GetDevCategoryResponseDto, GetTechniqueResponseDto } from 'apis/response/category';
import { ResponseDto } from 'apis/response';
import { fileUploadLocationRequest, fileUploadRequest, getCategoryRequest, getDevCategoryRequest, getTechniqueRequest, postCorporationRequest, postNoticeRequest } from 'apis';
import { useLocationStore, useLoginUserStore } from 'stores';
import { useCookies } from "react-cookie";
import useCorporationStore from 'stores/corporation.store';
import CorporationTextAreaBox from 'components/CorporationTextareaBox';
import { PostCorporationResponseDto } from 'apis/response/corporation';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, USER_PATH } from 'constant';
import { PostCorporationRequestDto } from 'apis/request/corporation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'
import { ca, id, ko } from 'date-fns/locale';
import useNoticeStore from 'stores/notice.store';
import Select from 'react-dropdown-select';
import { PostNoticeRequestDto } from 'apis/request/notice';
import { PostNoticeResponseDto } from 'apis/response/notice';


//          component: 기업 등록 화면 컴포넌트          //
export default function NoticeRegistration() {
  
    //          variable: Geocoder 객체 생성          //
    const geocoder = new kakao.maps.services.Geocoder();

    //          state: 개발 직군 카테고리 리스트 상태          //
    const [devCategoryList, setDevCategoryList] = useState<DevCategoryList[]>([]);
    
    //          state: 로그인 유저 상태          //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    //          state: path 상태          //
    const { pathname } = useLocation();
    const { corporationNumber } = useParams();
    //          state: 쿠키 상태          //
    const [ cookies, setCookies ] = useCookies(); 

    
    
    
    
    
    //          state: 장소 이름 요소 참조 상태          //
    const corporationNameRef = useRef<HTMLInputElement | null>(null);
    //          state: 소개글 요소 참조 상태          //
    const introductionRef = useRef<HTMLInputElement | null>(null);
    //          state: 연락처 요소 참조 상태          //
    const contactNumberRef = useRef<HTMLInputElement | null>(null);
    //          state: 주소 요소 참조 상태          //
    const addressRef = useRef<HTMLInputElement | null>(null);
    //          state: 상세 주소 요소 참조 상태          //
    const detailAddressRef = useRef<HTMLInputElement | null>(null);
    //          state: 기업 소개 요소 참조 상태          //
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    //          state: 복지 요소 참조 상태          //
    const welfareRef = useRef<HTMLTextAreaElement | null>(null);

    const [ wageWay, setWageWay ] = useState<string>('연봉');
    const [techniqueList, setTechniqueList] = useState<Technique[]>([]);

    

    //          state: 공고 상태          //
    const { selectedDevCategory, setSelectedDevCategory } = useNoticeStore();
    const { title, setTitle } = useNoticeStore();
    const { endDate, setEndDate } = useNoticeStore();
    const { employmentForm, setEmploymentForm } = useNoticeStore();
    const { wage, setWage} = useNoticeStore();
    const { career, setCareer } = useNoticeStore();
    const { recruitNumber, setRecruitNumber } = useNoticeStore();
    const { task, setTask } = useNoticeStore();
    const { condition, setCondition } = useNoticeStore();
    const { preference, setPreference } = useNoticeStore();
    const { etc, setEtc } = useNoticeStore();
    const { selectedTechStack, setSelectedTechStack } = useNoticeStore();
    const { resetNotice } = useNoticeStore();
    

  //          state: 에러 상태          //
  const [error, setError] = useState<boolean>(false);

  const careerOption: string[] = [
    '신입',
    '경력',
    '경력무관'
  ];
  const employmentFormOption: string[] = [
    '정규직',
    '계약직',
    '아르바이트'
  ];
  const wageWayOption: string[] = [
    '연봉',
    '월급',
    '주급',
  ];
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    
    //          function: get category response 처리 함수          //
    const getDevCategoryResponse = (responseBody : GetDevCategoryResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      
      const { devCategoryList } = responseBody as GetDevCategoryResponseDto;
      setDevCategoryList(devCategoryList);
    }
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
    const postNoticeResponse = (responseBody: PostNoticeResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
      if(code === 'VF') alert('제목과 내용은 필수입니다.');
      if(code !== 'SU') return;
      resetNotice();

      if(!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    }

    //          event handler: 점포이름 변경 이벤트 처리          //
    const onTitleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setTitle(value);
    }
   
  
    //          event handler: 주소 변경 이벤트 처리          //
    const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      // setAddress(value);
    }
    //          event handler: 상세주소 변경 이벤트 처리          //
    const onDetailAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      // setAddressDetail(value);
    }
    //          event handler: 주요업무 변경 이벤트 처리          //
    const onTeskChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setTask(value);
    }
    //          event handler: 자격요건 변경 이벤트 처리          //
    const onConditionChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setCondition(value);
    }
    //          event handler: 우대사항 변경 이벤트 처리          //
    const onPreferenceChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setPreference(value);
    }
    //          event handler: 기타사항 변경 이벤트 처리          //
    const onEtcChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setEtc(value);
    }
    
   
    
    
    //          event handler: 점포이름 인풋 키 다운 이벤트 처리          //
    const onTitleKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (!introductionRef.current) return;
      if(event.nativeEvent.isComposing) return;
      introductionRef.current.focus();
    }
    
    //          event handler: 소개글 인풋 키 다운 이벤트 처리          //
    const onIntroductionKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (!contactNumberRef.current) return;
      if(event.nativeEvent.isComposing) return;
      contactNumberRef.current.focus();
    }

    //          event handler: 연락처 인풋 키 다운 이벤트 처리          //
    const onContactNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (!addressRef.current) return;
      if(event.nativeEvent.isComposing) return;
      addressRef.current.focus();
    }
    
  //          event handler: 등록 버튼 클릭 이벤트 처리 함수          //
  const onRegistrationButtonClickHandler = async () => {
    const accessToken = cookies.accessToken;
    if(!accessToken || !corporationNumber) return;

    if(selectedDevCategory !== null && endDate !== null){
      const  requestBody : PostNoticeRequestDto = {
        selectedDevCategory, title, endDate, career, employmentForm, recruitNumber, wage, task, condition, preference, etc, selectedTechStack
      }
      
      postNoticeRequest(corporationNumber, requestBody, accessToken).then(postNoticeResponse);
    }
      
      
  } 
  
  //          event handler: 테크 스택 변경 이벤트 처리          //
  const onTechStackChangeHandler = (selectedItems: any) => {
    const selectedTechNames = selectedItems.map((item: { techniqueNumber: any; }) => item.techniqueNumber);
    setSelectedTechStack(selectedTechNames);
  }
   
  //          event handler: 카테고리 버튼 클릭 이벤트 처리 함수          //
  const onDevCategoryButtonClickHandler = (devCategoryNumber: number) => {
    setSelectedDevCategory(devCategoryNumber);
  };

  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onAlwayRecruitChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
      setEndDate(null);
    }else{
      setEndDate(new Date);
    }
  }
  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onCareerRadioChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCareer(value);
  }
  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onEmploymentFormRadioChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmploymentForm(value);
  }
  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onWageWayChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setWageWay(value);
  }
  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onWageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setWage(value);
  }
  //          event handler: 상시 모집 체크박스 변경 이벤트 처리          //
  const onRecuritNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setRecruitNumber(value);
  }


    
  //          effect: 첫 마운트 시 실행할 함수          //
  useEffect(() => {
    resetNotice();
    getDevCategoryRequest().then(getDevCategoryResponse);
    getTechniqueRequest().then(getTechniqueResponse);
  },[]);

    

  
  
  //          render:공고 등록 화면 컴포넌트 렌더링          //
  return (
    <div id='noticeRegistration'>
      <div className='noticeRegistration-one-wrapper'>
        <div className='noticeRegistration-one-container'>
          <div className='noticeRegistration-title'>{'채용 공고 등록'}</div>
          <div className='noticeRegistration-category-box'>
            <div className='noticeRegistration-categorys'>
              {devCategoryList.map(devCategory => <div key={devCategory.categoryNumber} onClick={() => onDevCategoryButtonClickHandler(devCategory.categoryNumber)}
                style={{backgroundColor: selectedDevCategory === devCategory.categoryNumber ? 'rgba(0, 0, 0, 0.2)' : 'white'}}
              className='dev-category'>{devCategory.categoryName}</div>)}
            </div>
          </div>
          <CorporationInputBox ref={corporationNameRef} label='제목' type='text' placeholder='채용 공고의 제목을 입력해주세요' error={error} value={title} onChange={onTitleChangeHandler} onKeyDown={onTitleKeyDownHandler} />
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'기술스택 등록'}</div>
            <Select name='select' options={techniqueList} labelField='techniqueName' valueField='techniqueName' values={[]} multi onChange={onTechStackChangeHandler}></Select>
          </div>
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'마감일 등록'}</div>
            <div className='noticeRegistration-endDate-box'>
              <div className='noticeRegistration-DatePicker-title'>{'마감일 :'}</div>
              <DatePicker 
                selected={endDate} onChange={(date: Date) => setEndDate(date)} 
                locale={ko} dateFormat={'yyyy년 MM월 dd일'} selectsStart minDate={new Date()} startDate={new Date()} endDate={endDate}
              />
              <label><input type='checkbox' onChange={onAlwayRecruitChangeHandler}/>{'상시 모집'}</label>
            </div>
          </div>
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'경력 등록'}</div>
            <div className='noticeRegistration-endDate-box'>
              {careerOption.map((option) => (
              <label><input type='radio' value={option} checked={career === option} onChange={onCareerRadioChangeHandler} />{option}</label>
              ))}
            </div>
          </div>
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'고용형태 선택'}</div>
            <div className='noticeRegistration-endDate-box'>
              {employmentFormOption.map((option) => (
              <label><input type='radio' value={option} checked={employmentForm === option} onChange={onEmploymentFormRadioChangeHandler} />{option}</label>
              ))}
            </div>
          </div>
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'모집인원 등록'}</div>
            <div className='noticeRegistration-endDate-box'>
              <input type='text' value={recruitNumber} onChange={onRecuritNumberChangeHandler}></input><span>{'명'}</span>
            </div>
          </div>
          <div className='noticeRegistration-endDate-container'>
            <div className='noticeRegistration-endDate-title'>{'급여 등록'}</div>
            <div className='noticeRegistration-endDate-box'>
              <select value={wageWay} onChange={onWageWayChangeHandler}>
                {wageWayOption.map((option) =>(
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <input type='text' value={wage} onChange={onWageChangeHandler}></input><span>{'원'}</span>
            </div>
          </div>
          <CorporationTextAreaBox ref={contentRef} label='주요업무' placeholder='주요업무를 입력해주세요' error={error} value={task} onChange={onTeskChangeHandler} />
          <CorporationTextAreaBox ref={welfareRef} label='자격요건' placeholder='자격요건을 입력해주세요' error={error} value={condition} onChange={onConditionChangeHandler} />
          <CorporationTextAreaBox ref={welfareRef} label='우대사항' placeholder='우대사항을 입력해주세요' error={error} value={preference} onChange={onPreferenceChangeHandler} />
          <CorporationTextAreaBox ref={welfareRef} label='기타 유의사항' placeholder='유의사항을 입력해주세요' error={error} value={etc} onChange={onEtcChangeHandler} />
          
          <div className='noticeRegistration-one-button-container'>
            <div className='black-button' >{'취소'}</div>
            <div className='black-button' onClick={onRegistrationButtonClickHandler} >{'등록하기'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


