import React, { ChangeEvent, KeyboardEvent,useEffect,useRef, useState } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './style.css';
import CorporationInputBox from 'components/CorporationInputBox';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { CategoryList, ImageItem, MapPosition } from 'types/interface';
import { ResponseDto } from 'apis/response';
import { fileUploadRequest, postCorporationRequest } from 'apis';
import { useLoginUserStore } from 'stores';
import { useCookies } from "react-cookie";
import useCorporationStore from 'stores/corporation.store';
import CorporationTextAreaBox from 'components/CorporationTextareaBox';
import { PostCorporationResponseDto } from 'apis/response/corporation';
import { useLocation, useNavigate } from 'react-router-dom';
import { AUTH_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, USER_PATH } from 'constant';
import { PostCorporationRequestDto } from 'apis/request/corporation';


//          component: 기업 등록 화면 컴포넌트          //
export default function CorporationRegistration() {
  
    //          variable: Geocoder 객체 생성          //
    const geocoder = new kakao.maps.services.Geocoder();

    //          state: 카테고리 리스트 상태          //
    const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
    //          state: 로그인 유저 상태          //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    //          state: path 상태          //
    const { pathname } = useLocation();
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

    //          state: 장소 상태          //
    const { name, setName } = useCorporationStore();
    const { introduction, setIntroduction } = useCorporationStore();
    const { contactNumber, setContactNumber} = useCorporationStore();
    const { address, setAddress } = useCorporationStore();
    const { addressDetail, setAddressDetail } = useCorporationStore();
    const { latitude, setLatitude } = useCorporationStore();
    const { longitude, setLongitude} = useCorporationStore();
    const { corporationImageFileList, setCorporationImageFileList } = useCorporationStore();
    const { businessLicenseFile, setBusinessLicenseFile } = useCorporationStore();
    const { welfare, setWelfare } = useCorporationStore();
    const { content, setContent } = useCorporationStore();
    const { resetCorporation } = useCorporationStore();
    
    
    //          state: 지도  위치 상태          //
    const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);

    //          state: 이미지 입력 요소 참조 상태          //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 사업자 등록증 입력 요소 참조 상태          //
    const businessLicenseInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 이미지 미리보기 URL 상태          //
    const [imageUrls, setImageUrls ] = useState<ImageItem[]>([]);
    //          state: 사업자 등록증 미리보기 URL 상태          //
    const [businessLicenseUrl, setBusinessLicenseUrl] = useState<string | null>(null);
  

    

    //          state: 에러 상태          //
    const [error, setError] = useState<boolean>(false);

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    //          function: 다음 주소 검색 팝업 오픈 함수          //
    const open = useDaumPostcodePopup();
    
    //          function: 주소-좌표 변환 함수          //
    const addressToCoordinates = (address: string, callback: (coordinates: { lat: number, lng: number } | null) => void) => {

      geocoder.addressSearch(address, (result: any, status: any) => {
          if (status === 'OK') {
              const coords = { lat: result[0].y, lng: result[0].x };
              callback(coords);
              setLatitude(coords.lat);
              setLongitude(coords.lng);
          } else {
              callback(null);
          }
      });
    }
    //          functionL post corporation response 처리 함수          //
    const postCorporationResponse = (responseBody: PostCorporationResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
      if(code === 'VF') alert('제목과 내용은 필수입니다.');
      if(code !== 'SU') return;
      resetCorporation();

      if(!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    }

    //          event handler: 점포이름 변경 이벤트 처리          //
    const oncorporationNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setName(value);
    }
    //          event handler: 소개글 변경 이벤트 처리          //
    const  onIntroductionChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setIntroduction(value);
    }
    //          event handler: 연락처 변경 이벤트 처리          //
    const  onContactNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setContactNumber(value);
    }
    //          event handler: 주소 변경 이벤트 처리          //
    const onAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setAddress(value);
    }
    //          event handler: 상세주소 변경 이벤트 처리          //
    const onDetailAddressChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setError(false);
      const { value } = event.target;
      setAddressDetail(value);
    }
    //          event handler: 기업 소개 변경 이벤트 처리          //
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setContent(value);
    }
    //          event handler: 기업 소개 변경 이벤트 처리          //
    const onWelfareChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setError(false);
      const { value } = event.target;
      setWelfare(value);
    }
    
   
    
    //          event handler: 주소 버튼 클릭 이벤트 처리          //
    const onAddressButtonClickHandler = () => {
      open({ onComplete });
    }
    //          event handler: 점포이름 인풋 키 다운 이벤트 처리          //
    const oncorporationNameKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
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
    
    //          event handler: 주소 인풋 키 다운 이벤트 처리          //
    const onAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      addressToCoordinates(address, (coordinates) => {
        if (coordinates) {
            setMapPosition({
                center: coordinates,
                isPanto: true
            });
        }
        else{
          setMapPosition(null);
        }
      });
      if (!detailAddressRef.current) return;
      if(event.nativeEvent.isComposing) return;
      detailAddressRef.current.focus();
    }
    
    //          event handler: 상세주소 인풋 키 다운 이벤트 처리          //
    const onDetailAddressKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'Enter') return;
      if (!introductionRef.current) return;
    }

    //          event handler: 다음 주소 검색 완료 이벤트 처리          //
    const onComplete = (data: Address) => {
      const { address } = data;
      setAddress(address);
      addressToCoordinates(address, (coordinates) => {
        if (coordinates) {
            setMapPosition({
                center: coordinates,
                isPanto: true
            });
        }
        else{
          setMapPosition(null);
        }
      });
      if (!detailAddressRef.current) return;
      detailAddressRef.current.focus();
    }
    
    //          event handler: 이미지 업로드 버튼 클릭 이벤트 처리          //
    const onImageUploadButtonClickHandler = () => {
      if(!imageInputRef.current) return;
      imageInputRef.current.click();
    }

    //          event handler: 사업자 등록증 업로드 버튼 클릭 이벤트 처리          //
    const onBusinessLicenseUploadButtonClickHanlder = () => {
      if(!businessLicenseInputRef.current) return;
      businessLicenseInputRef.current.click();
    }

    //          event handler: 이미지 변경 이벤트 처리          //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      
      if(!event.target.files || !event.target.files.length) return;
        const files = Array.from(event.target.files || []);
        const imageUrls = files.map((files) => ({
          id: URL.createObjectURL(files),  // Use file URL as id
          src: URL.createObjectURL(files)
        }));
        setImageUrls((prevImages) => [...prevImages, ...imageUrls]);

        const newCorporationImageFileList = corporationImageFileList.map(item => item);
        newCorporationImageFileList.push(files[0]);
        setCorporationImageFileList(newCorporationImageFileList);

        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';
    }
    //          event handler: 사업자 등록증 변경 이벤트 처리          //
    const onBusinessLicenseChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setBusinessLicenseUrl(imageUrl);

        setBusinessLicenseFile(file);
      }
    }

    //          event handler: 이미지 닫기 버튼 클릭 이벤트 처리          //
    const onImageCloseButtonClickHandler = (deleteIndex: number) => {
      if(!imageInputRef.current) return;
        imageInputRef.current.value = '';

        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = corporationImageFileList.filter((file, index) => index !== deleteIndex);
        setCorporationImageFileList(newBoardImageFileList);
    }

    //           event handler: 사업자 등록증 이미지 닫기 버튼 클릭 이벤트 처리          //
    const onBusinessLicenseCloseButtonClickHandler = () => {
      setBusinessLicenseUrl(null);
    }
    

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
  
      const newImages = Array.from(imageUrls);
      const [movedImage] = newImages.splice(result.source.index, 1);
      newImages.splice(result.destination.index, 0, movedImage);
  
      setImageUrls(newImages);

      const newFileList = Array.from(corporationImageFileList);
      const [movedFile] = newFileList.splice(result.source.index, 1);
      newFileList.splice(result.destination.index, 0, movedFile);
      setCorporationImageFileList(newFileList);
    };

    //          event handler: 등록 버튼 클릭 이벤트 처리 함수          //
    const onRegistrationButtonClickHandler = async () => {
      const accessToken = cookies.accessToken;
      if(!accessToken) return;
      if(latitude === null || longitude === null || businessLicenseUrl === null) return;

      const corporationImageList: string[] = [];

      for(const image of corporationImageFileList){
          const data = new FormData();
          data.append('file', image);

          const url = await fileUploadRequest(data);
          if(url) {
            corporationImageList.push(url);
          }
      }

      let businessLicense: string = '';

      if(businessLicenseFile !== null){
        const data = new FormData();
        data.append('file', businessLicenseFile);

        const url = await fileUploadRequest(data);
        if(url) {
          businessLicense = url;
        }
      }

      
        const  requestBody : PostCorporationRequestDto = {
          name, introduction, content, address, addressDetail, latitude, longitude, welfare, businessLicense, contactNumber, corporationImageList
        }
        postCorporationRequest(requestBody, accessToken).then(postCorporationResponse);
      
      
      
    } 

   
    
    
    

    //          effect: 첫 마운트 시 실행할 함수          //
    useEffect(() => {
      window.scroll(0, 0);
      resetCorporation();
      if(address){
        addressToCoordinates(address, (coordinates) => {
          if (coordinates) {
              setMapPosition({
                  center: coordinates,
                  isPanto: true
              });
          }
          else{
            setMapPosition(null);
          }
        });
      }
      
    },[]);

    //          effect: 주소 변경 시 실행할 함수          //
    useEffect(() => {
      if(address) return
      setMapPosition(null);
    }, [address])

  
  
  //          render: 기업 등록 화면 컴포넌트 렌더링          //
  return (
    <div id='corporationRegistration'>
      <div className='corporationRegistration-one-wrapper'>
        <div className='corporationRegistration-one-container'>
          <div className='corporationRegistration-title'>{'기업정보 등록'}</div>
          <CorporationInputBox ref={corporationNameRef} label='기업명' type='text' placeholder='기업명을 입력해주세요' error={error} value={name} onChange={oncorporationNameChangeHandler} onKeyDown={oncorporationNameKeyDownHandler} />
          <CorporationInputBox ref={introductionRef} label='한줄소개' type='text' placeholder='간단한 소개글을 입력해주세요' error={error} value={introduction}  onChange={onIntroductionChangeHandler} onKeyDown={onIntroductionKeyDownHandler} />
          <CorporationInputBox ref={contactNumberRef} label='연락처' type='text' placeholder='연락처를 입력해주세요' error={error} value={contactNumber}  onChange={onContactNumberChangeHandler} onKeyDown={onContactNumberKeyDownHandler} />
          <CorporationInputBox ref={addressRef} label='주소' type='text' placeholder='주소를 입력해주세요' error={error} value={address}  icon='expand-right-light-icon' onChange={onAddressChangeHandler} onButtonClick={onAddressButtonClickHandler} onKeyDown={onAddressKeyDownHandler} />
          <CorporationInputBox ref={detailAddressRef} label='상세주소' type='text' placeholder='상세주소를 입력해주세요' error={error} value={addressDetail}  onChange={onDetailAddressChangeHandler} onKeyDown={onDetailAddressKeyDownHandler} />
          {mapPosition !== null &&
          <Map className='map' center={mapPosition.center} isPanto={mapPosition.isPanto} draggable={false} level={3}>
            <MapMarker position={mapPosition.center}>
            </MapMarker>
          </Map>
          }
          <CorporationTextAreaBox ref={contentRef} label='기업 소개' placeholder='기업을 소개해주세요' error={error} value={content} onChange={onContentChangeHandler} />
          <CorporationTextAreaBox ref={welfareRef} label='사내 복지' placeholder='제공하는 복지를 입력해주세요' error={error} value={welfare} onChange={onWelfareChangeHandler} />
          
          <div className='coroprationRegistration-one-main-image-container'>
            <div className='corporationRegistration-one-image-title'>{'이미지 등록'}</div>
            <div className='corporationRegistration-images'>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided) => (
                    <div className="images-list" {...provided.droppableProps} ref={provided.innerRef} >
                      {imageUrls.map((image, index) => (
                        <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided) => (
                          <div className="image-container" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                            <img src={image.src} alt={`uploaded-${index}`} className="image" />
                          </div>
                        )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {corporationImageFileList.length < 5 && 
                      <div className='image-registration-button' onClick={onImageUploadButtonClickHandler}>
                        <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onImageChangeHandler} />
                      </div>
                      }
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          <div className='corporationRegistration-one-corporation-box'>
            <div className='corporationRegistration-one-corporation-title'>{'사업자 등록'}</div>
            <div className='icon-button' onClick={onBusinessLicenseUploadButtonClickHanlder}>
              <div className='icon image-box-light-icon'>
                <input ref={businessLicenseInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onBusinessLicenseChangeHandler} />
              </div>
            </div>
            {businessLicenseUrl !== null &&
            <div className='board-write-file-box'>
              <img className='board-write-file' src={businessLicenseUrl} />
              <div className='icon-button file-close' onClick={() => onBusinessLicenseCloseButtonClickHandler()}>
                <div className='icon close-icon'></div>
              </div>
            </div>
            }
          </div>
          <div className='corporationRegistration-one-button-container'>
            <div className='black-button' >{'취소'}</div>
            <div className='black-button' onClick={onRegistrationButtonClickHandler} >{'등록하기'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


