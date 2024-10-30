import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import './style.css';
import { BOARD_PATH, BOARD_UPDATE_PATH, MAIN_PATH, USER_PATH } from "constant";
import { deleteBoardRequest, getBoardRequest, getCommentListRequest, getCorporationRequest, getFavoriteListRequest, increaseViewCountRequest, postCommentRequest, putFavoriteRequest } from "apis";
import { Board, CommentListItem, Corporation, FavoriteListItem } from "types/interface";
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



//          component: 기업 상세 화면 컴포넌트          //
export default function CorporationDetail(){

    //          state: 게시물 번호 path variable 상태          //
    const { corporationNumber } = useParams();
    //          state: 로그인 유저 상태          //
    const { loginUser }  = useLoginUserStore();
    //          state: 쿠키 상태          //
    const [cookies, setCookies] = useCookies();

    //          state: 등록자 여부 상태          //
    const [isRegister, setRegister] = useState<boolean>(false);

    //          state: 기업 상태          //
    const [corporation, setCorporation] = useState<Corporation | null>(null);

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

        const corporation: Corporation = { ...responseBody as GetCorporationResponseDto };
        setCorporation(corporation);

        if(!loginUser){
            setRegister(false);
            return;
        }
        const isRegister = loginUser.email === corporation.registerEmail;
        setRegister(isRegister);
        window.scrollTo(0, 0);
    }

    //          component: 기업 상세 상단 컴포넌트          //
    const CorporationDetailTop = () => {


        //          render: 기업 상세 상단 컴포넌트 렌더링          //
        return(
            <></>
        )
    }

    //          component: 기업 상세 하단 컴포넌트          //
    const CorporationDetailBottom = () => {

        //          render: 기업 상세 하단 컴포넌트 렌더링          //
        return(
            <></>
        )
    }

    //          effect: 기업 번호 path variable이 바뀔때 마다 실행할 함수         //
    useEffect(() => {
        if(!corporationNumber) {
            navigate(MAIN_PATH());
            return;
        }
    }, [corporationNumber]);

    //          render: 기업 상세 화면 컴포넌트 렌더링          //
    return (
        <div id='corporation-detail-wrapper'>
            <div className='corporation-detail-container'>
                <CorporationDetailTop />
                <CorporationDetailBottom />
            </div>
        </div>
    )
}