import React, { useEffect, useRef, useState } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import './style.css';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryList, DevCategoryList, CorporationListItem, MapPosition, User } from 'types/interface';
import { getCategoryRequest, getCorporationListRequest, getDevCategoryRequest, getUserRequest } from 'apis';
import { GetUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { locationItemMock } from 'mocks';
import LocationItem from 'components/CorporationItem';
import { GetCategoryResponseDto, GetDevCategoryResponseDto } from 'apis/response/category';
import { AUTH_PATH, CORPORATION_DETAIL_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH } from 'constant';
import { GetCorporationListResponseDto } from 'apis/response/corporation';
import EmployItemMock from 'mocks/location-item.mock';
import CorporationItem from 'components/CorporationItem';


//          component: 지도 화면 컴포넌트          //
export default function MapPage(){
    
    //          variable: Geocoder 객체 생성          //
    const geocoder = new kakao.maps.services.Geocoder();
    //          variable: 초기 지도 위치          //
    const initialPositionDefault: MapPosition = {
        center: { lat: 37.488850983898075, lng: 126.77861205932714 },
        isPanto: true
    };
    
    //          state: userEmail path variable 상태          //
    const { userEmail } = useParams();
    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: 로그인 유저 주소 상태          //
    const [address, setAddress] = useState<string>();
    //          state: 지도 초기 위치 상태          //
    const [initialPosition, setInitialPosition] = useState<MapPosition>(initialPositionDefault);
    //          state: 장소 상태          //
    const [corporationList, setCorporationList] = useState<CorporationListItem[]>([]);
    //          state: 사이드바 상태          //
    const [showside, setShowside] = useState<boolean>(false);
    //          state: 카테고리 리스트 보기 상태          //
    const [showLoacationList, setShowLocationList] = useState<boolean>(true);
    //          state: 카테고리 리스트 상태          //
    const [devCategoryList, setDevCategoryList] = useState<DevCategoryList[]>([]);
    //          state: 선택된 카테고리 리스트 상태          //
    const [selectedDevCategory, setSelectedDevCategory] = useState<number>(0);
        

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          function: get category response 처리 함수          //
    const getDevCategoryResponse = (responseBody : GetDevCategoryResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
  
        
        const { devCategoryList } = responseBody as GetDevCategoryResponseDto;
        setDevCategoryList([{ categoryNumber: 0, categoryName: '전체' }, ...devCategoryList]);
      }
  
      
    //          function: 주소-좌표 변환 함수          //
    const addressToCoordinates = (address: string, callback: (coordinates: { lat: number, lng: number } | null) => void) => {

        geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === 'OK') {
                const coords = { lat: result[0].y, lng: result[0].x };
                callback(coords);
            } else {
                callback(null);
            }
        });
    }
    
    //          function: get location list response 처리 함수          //
    const getCorporationListResponse = (responseBody: GetCorporationListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NU') return;
        if(code === 'DBE') return;
        if(code !== 'SU') return;

        const { corporationList } = responseBody as GetCorporationListResponseDto;
        setCorporationList(corporationList);
        console.log(corporationList);
    }
    //          function: get user response 처리 함수          //
    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NU') return;
        if(code === 'DBE') return;
        if(code !== 'SU') return;

        const { nickname, address } = responseBody as GetUserResponseDto;
        setAddress(address);
        addressToCoordinates(address, (coordinates) => {
            if (coordinates) {
                setInitialPosition({
                    center: coordinates,
                    isPanto: true
                });
            }
        });
    }

    //          event handler: 사이드바 버튼 클릭 이벤트 처리         //
    const onSideBarButtonClickHandler = () => {
        setShowside(!showside);
    }
    
    //          event handler: 카테고리 버튼 클릭 이벤트 처리 함수          //
    const onDevCategoryButtonClickHandler = (devCategoryNumber: number) => {
        setSelectedDevCategory(devCategoryNumber);
      };
    //          event handler: 카테고리 리스트 보기 체크박스 변경 이벤트 처리          //
    const onLocationListCheckboxChangeHandler = () => {
        setShowLocationList(!showLoacationList);
    }
    //          event handler: 신규 장소 등록 버튼 클릭 이벤트 처리          //
    const onLocationRegistrationButtonClickHandler = () => {
        if(loginUser) navigate(CORPORATION_PATH() + '/' + CORPORATION_REGISTRATION_PATH());
        else navigate(AUTH_PATH());
    }
    //          event handler: 장소 클릭 이벤트 처리          //
    const onLocationItemClickHandler = () => {
        navigate(CORPORATION_DETAIL_PATH(7));
    }
    //          effect : 첫 마운트 시 실행할 함수          //
    useEffect(() => {
        getDevCategoryRequest().then(getDevCategoryResponse);
        getCorporationListRequest().then(getCorporationListResponse);
        if(!userEmail || !loginUser) return;
        getUserRequest(userEmail).then(getUserResponse);
        //setLocationList(EmployItemMock);
        
    }, [loginUser]);

    const mapRef = useRef<kakao.maps.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
          const map = mapRef.current;
    
          const markers = corporationList.map((item) => {
            return new kakao.maps.Marker({
              position: new kakao.maps.LatLng(item.latitude, item.longitude),
            });
          });
    
          // Create a MarkerClusterer instance
          const clusterer = new kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 10, // Minimum zoom level to trigger clustering
          });
    
          // Add markers to the clusterer
          clusterer.addMarkers(markers);
        }
      }, [corporationList]);


    //          render: 지도 화면 컴포넌트 렌더링          //
    return (
        <div id='map-wrapper'>
            <div className='map-container'>
                
                <Map id='map' center={initialPosition.center} isPanto={initialPosition.isPanto} level={3} onCreate={(map) => { mapRef.current = map; }}>
                    <MapMarker position={initialPosition.center} >
                    </MapMarker>
                    {/* {corporationList.map(corporationListItem => (
                    <MapMarker
                        key={corporationListItem.corporationNumber}
                        position={{ lat: corporationListItem.latitude, lng: corporationListItem.longitude }}
                    />
                    
                    ))} */}
                </Map>
                <div className='map-controler'>
                    <div className= 'map-sidebar' style={{marginLeft: showside ? '0px' : '-260px', transition: 'margin-left 0.5s ease'}}>
                        <div className='map-sidebar-container'>
                            <div className='map-sidebar-search-container'>
                                <div className='map-sidebar-search-title'>{'검색'}</div>
                                <div className='map-sidebar-search-box'>
                                    <input className='map-sidebar-search-input' type='text' placeholder='검색어를 입력해주세요.' />
                                    <div className='icon-button'>
                                        <div className='icon side-close-icon'></div>
                                    </div>
                                </div>
                            </div> 
                            <div className='map-sidebar-category-title'>{'카테고리'}</div>
                            <div className='map-sidebar-categoty-box'>
                                <div className='map-sidebar-categorys'>
                                    {devCategoryList.map(devCategory => <div key={devCategory.categoryNumber} onClick={() => onDevCategoryButtonClickHandler(devCategory.categoryNumber)}
                                    style={{backgroundColor: selectedDevCategory === devCategory.categoryNumber ? 'rgba(0, 0, 0, 0.2)' : 'white'}}
                                    className='rect-category'>{devCategory.categoryName}</div>)}
                                </div>
                            </div>
                            <label className='map-sidebar-location-check-box-container'> 
                                <input className='map-sidebar-location-check-box' type='checkbox' checked={showLoacationList} onChange={onLocationListCheckboxChangeHandler}></input>
                                <span className='map-sidebar-location-check-box-title'> {'장소 리스트 켜기'}</span>
                            </label>
                            <div className='map-sidebar-location-register-button' onClick={onLocationRegistrationButtonClickHandler}>{'신규 장소 등록'}</div>
                        </div>
                        <div className='map-sidebar-button' onClick={onSideBarButtonClickHandler}>
                            {!showside ?
                                <div className='icon-box-side icon menu-expand-right'></div> :
                                <div className='icon-box-side icon menu-expand-left'></div> 
                            }
                        </div>
                    </div>
                    {showLoacationList && (
                    <div className='location-list-container'>
                        {corporationList.map(corporationListItem => <CorporationItem key={corporationListItem.corporationNumber} corporationItem={corporationListItem} />)}
                    </div>
                    )}
                    
                </div>
                 
            </div>    
        </div>
    )
}