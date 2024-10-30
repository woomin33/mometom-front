import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, NOTICE_PATH, NOTICE_REGISTRATION_PATH, USER_PATH } from "constant";
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getCorporationRequest, getFavoriteListRequest, increaseViewCountRequest, postCommentRequest, putFavoriteRequest } from "apis";
import { Board, CommentListItem, Corporation, FavoriteListItem, MapPosition } from "types/interface";
import { useNavigate, useParams } from "react-router-dom";
import { ResponseDto } from "apis/response";
import { useLoginUserStore } from "stores";
import { DeleteBoardResponseDto, GetBoardResponseDto, GetCommentListResponseDto, GetFavoriteListResponseDto, IncreaseViewCountResponseDto, PostCommentResponseDto, PutFavoriteResponseDto } from "apis/response/board";
import FavoriteItem from "components/FavoriteItem";
import CommentItem from "components/CommentItem";
import Pagination from "components/Pagination";
import defaultProfileImage from "assets/image/default-profile-image.png";

import dayjs from "dayjs";
import { useCookies } from "react-cookie";
import { PostCommentRequestDto } from "apis/request/board";
import { usePagination } from "hooks";
import { GetCorporationResponseDto } from "apis/response/corporation";
import useCorporationStore from "stores/corporation.store";
import { converUrlToFile, convertUrlsToFile } from "utils";
import { Map, MapMarker } from 'react-kakao-maps-sdk';



//          component: 기업 관리 화면 컴포넌트          //
export default function CorporationManagement(){
    
    //          variable: Geocoder 객체 생성          //
    const geocoder = new kakao.maps.services.Geocoder();

    //          state: 게시물 번호 path variable 상태          //
    const { corporationNumber } = useParams();
    //          state: 로그인 유저 상태          //
    const { loginUser }  = useLoginUserStore();
    //          state: 쿠키 상태          //
    const [cookies, setCookies] = useCookies();

    //          state: 기업 상태          //
    const [corporation, setCorporation] = useState<Corporation | null>(null);
    const { name, setName } = useCorporationStore();
    const { introduction, setIntroduction } = useCorporationStore();
    const { content, setContent } = useCorporationStore();
    const { address, setAddress } = useCorporationStore();
    const { addressDetail, setAddressDetail } = useCorporationStore();
    const { longitude, setLongitude } = useCorporationStore();
    const { latitude, setLatitude } = useCorporationStore();
    const { welfare, setWelfare } = useCorporationStore();
    const { contactNumber, setContactNumber } = useCorporationStore();
    const { businessLicenseFile, setBusinessLicenseFile } = useCorporationStore();
    const { corporationImageFileList, setCorporationImageFileList } = useCorporationStore();

    //          state: 기업 이미지 미리보기 URL 상태          //
    const [imageUrls, setImageUrls ] = useState<string[]>([]);
    //          state: 목록 선택 상태          //
    const [selectedNav, setSelectedNav] = useState<string>('기업 정보');
    const navItems: string[] = [
        '기업 정보',
        '채용 관리',
        '지원자 관리'
    ];
    //          state: 지도  위치 상태          //
    const [mapPosition, setMapPosition] = useState<MapPosition | null>(null);

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          function: get corporation response 처리 함수          //
    const getCorporationResponse = (responseBody: GetCorporationResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 기업입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }

        const { name, introduction, content, address, addressDetail, latitude, longitude, welfare,
            contactNumber, businessLicense, corporationImageList} = responseBody as GetCorporationResponseDto;
        const corporation: Corporation = { ...responseBody as GetCorporationResponseDto };
        setName(name);
        setIntroduction(introduction);
        setContent(content);
        setAddress(address);
        setAddressDetail(addressDetail);
        setLatitude(latitude);
        setLongitude(longitude);
        setWelfare(welfare);
        setContactNumber(contactNumber);
        converUrlToFile(businessLicense).then(businessLicenseFile => setBusinessLicenseFile(businessLicenseFile));
        convertUrlsToFile(corporationImageList).then(corporationImageFileList => setCorporationImageFileList(corporationImageFileList));
        setCorporation(corporation);

        setImageUrls(corporationImageList);
        setMapPosition({
            center: { lat: latitude, lng: longitude },
            isPanto: true
        });
        console.log(imageUrls)
        
        window.scrollTo(0, 0);
    }
    //          component: 기업 정보 컴포넌트          //
    const CorporationInfo = () => {
        return(
            <div className='corporation-info-box'>
                <div className='corporation-info-title'>{'기업명'}</div>
                <div className='corporation-info-content'>{name}</div>
                <div className='corporation-info-title'>{'소개'}</div>
                <div className='corporation-info-content'>{content}</div>
                <div className="image-container">
                {imageUrls.map((url, index) => (
                    <img className='image' key={index} src={url}  />
                ))}
                </div>
                <div className='corporation-info-title'>{'사내 복지'}</div>
                <div className='corporation-info-content'>{welfare}</div>
                <div className='corporation-info-title'>{'주소'}</div>
                <div className='corporation-info-content'>{`${address} (${addressDetail}) `}</div>
                <div className='corporation-map-box'>
                    {mapPosition !== null &&
                    <Map className='map' center={mapPosition.center} isPanto={mapPosition.isPanto} draggable={false} level={3}>
                        <MapMarker position={mapPosition.center}>
                        </MapMarker>
                    </Map>
                    }
                </div>
                            
                <div className='corporation-info-title'>{'연락처'}</div>
                <div className='corporation-info-content'>{contactNumber}</div>
            </div>
        )
    }
    //          component: 채용 관리 컴포넌트          //
    const EmployManagement = () => {

        //          event handler: 신규 채용 등록 버튼 클릭 인벤트 처리 함수          //
        const onNewEmployButtonClickHandler = () => {
            console.log(corporation)
            if(!corporation || !loginUser) return;
            navigate(NOTICE_PATH() + '/' + NOTICE_REGISTRATION_PATH(corporation.corporationNumber));
        }
        //          render: 채용 관리 컴포넌트 렌더링          //
        return(
            <div className='corporation-employ-box'>
                <div className='corporation-new-employ-button' onClick={onNewEmployButtonClickHandler}><span>{'신규 채용 등록'}</span></div>
                <div className='corporation-employing-container'>
                    <div className='corporation-employing-title'>{'진행중인 채용'}</div>
                    <div className='corporation-employing-box'></div>
                </div>
                <div className='corporation-employed-container'>
                    <div className='corporation-employed-title'>{'마감된 채용'}</div>
                    <div className='corporation-employed-box'></div>
                </div>
            </div>
        )
    }

    //          effect: 기업 번호 path variable이 바뀔때 마다 실행할 함수         //
    useEffect(() => {
        if(!corporationNumber) {
            navigate(MAIN_PATH());
            return;
        }
        getCorporationRequest(corporationNumber).then(getCorporationResponse);
    }, [corporationNumber]);

    //          render: 기업 상세 화면 컴포넌트 렌더링          //
    return (
        <div id='corporation-management-wrapper'>
            <div className='corporation-management-container'>
                <div className='corporation-management-top-container'>
                    <div className='corporation-management-top-box'>
                        <div className='corporation-main-image-box'>
                            <img className='corporation-main-image' src={imageUrls[0]}></img>   
                        </div>
                        <div className='corporation-management-top-title-card'>
                            <div className='corporation-management-top-name'>{name}</div>
                            <div className='corporation-management-top-introduction'>{introduction}</div>
                        </div>
                    </div>
                </div>
                <div className='corporation-management-bottom-container'>
                    <div className='corporation-management-bottom-nav-box'>
                        {navItems.map((item, index) => (
                        <div
                        key={index}
                        className='corporation-management-bottom-nav'
                        style={{
                            fontSize: selectedNav === item ? '24px' : '16px',
                            color: selectedNav === item ? 'black' : 'gray'
                        }}
                        onClick={() => setSelectedNav(item)}
                        >
                        {item}
                        </div>
                        ))}
                        <div className='corporation-management-bottom-nav corporation-delete'>{'기업삭제'}</div>
                    </div>
                    <div className='corporation-managemnt-bottom-content-container'>
                        {selectedNav === '기업 정보' &&  <CorporationInfo />}
                        {selectedNav === '채용 관리' &&  <EmployManagement />}
                    </div>
                </div>
            </div>
        </div>
    )
}