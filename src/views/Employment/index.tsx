import React, { useEffect, useState } from 'react'
import './style.css';
import { getDevCategoryRequest, getNoticeListRequest, getTop5NoticeListRequest, getUserCorporationRequest } from 'apis';
import { Corporation, DevCategoryList, NoticeListItem } from 'types/interface';
import { ResponseDto } from 'apis/response';
import GetDevCategoryResponseDto from 'apis/response/category/get-devcategory.response.dto';
import { useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, CORPORATION_DETAIL_PATH, CORPORATION_MANAGEMENT_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, EMPLOYMENT_PATH, MAP_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import CorporationRegistration from 'views/Corporation/Registration';
import EmployItemMock from 'mocks/location-item.mock';
import LocationItem from 'components/CorporationItem';
import EmployItem from 'components/EmployItem';
import CorporationDetail from 'views/Corporation/Detail';
import { GetCorporationResponseDto } from 'apis/response/corporation';
import { GetNoticeListResponseDto } from 'apis/response/notice';
import GetTop5NoticeListResponseDto from 'apis/response/notice/get-top5-notice-list.response.dto';
import Top5Item from 'components/Top5Item';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import NoticeItem from 'components/NoticeItem/indes';



export default function Employment() {

  //          state: 로그인 유저 상태          //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  
  const sliderSettings = {
    dots: true, // 점 표시 여부
    infinite: true, // 무한 반복 여부
    speed: 500, // 슬라이드 전환 속도 (ms)
    slidesToShow: 1, // 한 번에 보여질 슬라이드 개수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 개수
    autoplay: true, // 자동 재생 여부
    autoplaySpeed: 3000, // 자동 재생 속도 (ms)
    initialSlide: 0
    
  };

 
  
  //          function: 네비게이트 함수          //
  const navigate = useNavigate();
  
  //          component: 채용 화면 상단 컴포넌트          //
  const EmployTop = () => {

    //           state: 주간 top5 공고 리스트 상태          //
    const [top5NoticeList, setTop5NoticeList] = useState<NoticeListItem[]>([]);

    //          function: get top 5 notice list response 처리 함수          //
    const getTop5NoticeResponse = (responseBody : GetTop5NoticeListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if (code === 'DBE') alert('데이터베이스 오류입니다');
      if (code !== 'SU') return; 

      const { top5List } = responseBody as GetTop5NoticeListResponseDto;
      console.log(top5List);
      setTop5NoticeList(top5List);
      console.log('top5받아옴');
      console.log(top5List);
    }
    //          effect: 첫 마운트 시 실행할 함수          //
    useEffect(() => {
      getTop5NoticeListRequest().then(getTop5NoticeResponse);
    }, []);

    //          render: 채용 화면 상단 컴포넌트 렌더링          //
    return(
      <div id='employ-top-wrapper'>
        <div className='employ-top-container'>
          <div className='employ-top-title'> {'이번주 인기 채용 공고'}</div>
          <div className='employ-top-contents'>
            {top5NoticeList && top5NoticeList.length != 0 ?
              <Slider {...sliderSettings}>
                {top5NoticeList && top5NoticeList.map(top5ListItem => <Top5Item key={top5ListItem.noticeNumber} top5ListItem={top5ListItem} />)}
              </Slider> :
              <div className='employ-top-none-content'>
                {'이번주에 등록된공고가 없습니다'}
              </div>
            
            }
            
          </div>
        </div>
      </div>
    )
  }

  //          component: 채용 화면 하단 컴포넌트          //
  const EmployBottom = () => {

    //          state: 개발 직군 카테고리 리스트 상태          //
    const [devCategoryList, setDevCategoryList] = useState<DevCategoryList[]>([]);
    //          state: 선택된 카테고리 리스트 상태          //
    const [selectedDevCategory, setSelectedDevCategory] = useState<number>(0);
    const { devCategoryNumber } = useParams();

    //          state: 장소 상태          //
    const [noticeListItems, setNoticeListItems] = useState<NoticeListItem[]>([]);


    //          function: get category response 처리 함수          //
    const getDevCategoryResponse = (responseBody : GetDevCategoryResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      
      const { devCategoryList } = responseBody as GetDevCategoryResponseDto;
      setDevCategoryList([{ categoryNumber: 0, categoryName: '전체' }, ...devCategoryList]);
    }
    //          function: get user corporation response 처리 함수          //
    const getUserCorporationResponse = (responseBody : GetCorporationResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'NC') {
        navigate(CORPORATION_PATH() + '/' + CORPORATION_REGISTRATION_PATH());
        return;
      };
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;

      const { corporationNumber } = responseBody as GetCorporationResponseDto;
      navigate(CORPORATION_PATH() + '/' + CORPORATION_MANAGEMENT_PATH(corporationNumber));
    }

    const getNoticeListResponse = (responseBody : GetNoticeListResponseDto | ResponseDto | null) => {
      if(!responseBody) return;
      const { code } = responseBody;
      if(code === 'DBE') alert('데이터베이스 오류입니다.');
      if(code !== 'SU') return;
      
      const { noticeListItems } = responseBody as GetNoticeListResponseDto;
      console.log(devCategoryNumber)
      console.log(noticeListItems)
      setNoticeListItems(noticeListItems);
      console.log(noticeListItems)
    }

    //          event handler: 카테고리 버튼 클릭 이벤트 처리 함수          //
    const onDevCategoryButtonClickHandler = (devCategoryNumber: number) => {
      navigate(EMPLOYMENT_PATH(devCategoryNumber));
    };

    //          event handler: 맵 버튼 클릭 이벤트 처리 함수          //
    const onMapButtonClickHandler = () => {
      if (!loginUser) {
        navigate(MAP_PATH());
        return;
      }
      const { email } = loginUser;
      navigate(MAP_PATH(email));
    }

    //          event handler: 맵 버튼 클릭 이벤트 처리 함수          //
    const onEmployButtonClickHandler = () => {
      
      if(loginUser) {
        getUserCorporationRequest(loginUser.email).then(getUserCorporationResponse);
      }
      else navigate(AUTH_PATH());
    }

    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
      if(!devCategoryNumber)return;
      setSelectedDevCategory(parseInt(devCategoryNumber));
      getDevCategoryRequest().then(getDevCategoryResponse);
      getNoticeListRequest(parseInt(devCategoryNumber)).then(getNoticeListResponse);
      
    }, []);

    

    //          render: 채용 화면 하단 컴포넌트 렌더링          //
    return(
      <div id='employ-bottom-wrapper'>
        <div className='employ-bottom-container'>
          <div className='employ-bottom-category-container'>
            <div className='employ-bottom-category-box'>
              <div className='employ-bottom-category-title'>{'개발 직무'}</div>
              <div className='employ-bottom-categorys'>
                {devCategoryList.map(devCategory => <div key={devCategory.categoryNumber} onClick={() => onDevCategoryButtonClickHandler(devCategory.categoryNumber)}
                  style={{backgroundColor: selectedDevCategory === devCategory.categoryNumber ? 'rgba(0, 0, 0, 0.2)' : 'white'}}
                className='dev-category'>{devCategory.categoryName}</div>)}
              </div>
            </div>
            <div className='employ-bottom-side-box'>
              <div className='icon-rect-button map-button' onClick={onMapButtonClickHandler}>
                <div className='icon-rect'>
                  <div className='icon map-light'></div>
                </div>
                <div className='icon-rect-title'>{'지도로 찾기'}</div>
              </div>
              <div className='icon-rect-button employ-button' onClick={onEmployButtonClickHandler}>
                <div className='icon-rect'>
                  <div className='icon employ-light'></div>
                </div>
                <div className='icon-rect-title'>{'채용 등록하기'}</div>
              </div>
            </div>
          </div>
          <div className='employ-bottom-employ-container'>
            <div></div>
            <div className='employ-bottom-employ-box'>
            {noticeListItems && 
              noticeListItems.map(noticeListItem => <EmployItem key={noticeListItem.noticeNumber} noticeItem={noticeListItem} />)
            }
            </div>
          </div>
        </div>
      </div>
    )
  }
  //          render: 채용 화면 컴포넌트 렌더링          //
  return (
    <div id='employ'>
      <EmployTop />
      <EmployBottom />
    </div>
  )
}
