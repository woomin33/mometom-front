import React, { useEffect, useState } from 'react';
import './style.css';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { getDevNoticeListRequest, getNoticeRequest } from 'apis';
import { MAIN_PATH } from 'constant';
import { Notice, NoticeListItem } from 'types/interface';
import GetNoticeResponseDto from 'apis/response/notice/get-notice.response.dto';
import { ResponseDto } from 'apis/response';
import { GetNoticeListResponseDto } from 'apis/response/notice';
import NoticeItem from 'components/NoticeItem/indes';


//          component: 공고 상세 화면 컴포넌트          //
export default function NoticeDetail(){

    //          state: 로그인 유저 상태          //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    const { noticeNumber } = useParams();
    //          state: 게시물 상태          //
    const [notice, setNotice] = useState<Notice | null>(null);

    const [devNoticeList, setDevNoticeList] = useState<NoticeListItem[]>([]);

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    //          function: get notice response 처리 함수          //
    const getNoticeResponse = (responseBody: GetNoticeResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 게시물입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }

        const notice: Notice = { ...responseBody as GetNoticeResponseDto };
        setNotice(notice);
        console.log(notice)
        window.scrollTo(0, 0);
        getDevNoticeListRequest(notice.noticeNumber, notice.devCategoryName).then(getDevNoticeListResponse);
    }
    //          function: get dev notice list response 처리 함수          //
    const getDevNoticeListResponse = (responseBody: GetNoticeListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 게시물입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }
        const { noticeListItems } = responseBody as GetNoticeListResponseDto;
        setDevNoticeList(noticeListItems);
    }
        
    
    //          effect: 공고 번호 path variable이 바뀔때 마다 게시물 불러오기          //
    useEffect(() => {
        if(!noticeNumber){
            navigate(MAIN_PATH());
            return;
        }
        getNoticeRequest(noticeNumber).then(getNoticeResponse);
        
    }, [noticeNumber]);
    //          render: 공고 상세 화면 컴포넌트 렌더링          //
    if(!notice) return <div id='notice-detail-none'></div>
    return(
        <div id='notice-detail-wrapper'>
            <div className='notice-detail-container'>
                <div className='notice-detail-left-container'>
                    <div className='notice-detail-title-box'>
                        <div className='notice-detail-title'>{notice.title}</div>
                        <div className='notice-detail-devCatogory'>{notice.devCategoryName}</div>
                    </div>
                    <div className='notice-detail-option-box'>
                        <div className='notice-detail-employform-box'>{`근무 형태 : ${notice.employmentForm}`}</div>
                        <div className='notice-detail-career-box'>{`경력 : ${notice.career}`}</div>
                        <div className='notice-detail-recruitnumber-box'>{`모집인원 : ${notice.recruitNumber}`}</div>
                        {notice.wage ? 
                        <div className='notice-detail-wage-box'>{`급여 : ${notice.wage} 원`}</div> :
                        <div className='notice-detail-wage-box'>{`급여 : 면접 후 결정`}</div> 
                        }
                        </div>  
                    <div className='notice-detail-technique-box'>
                        <div className='notice-deatail-technique-title'>{'요구 기술'}</div>
                        <div className='notice-deatail-techniques'>
                            {notice.techniqueList.map((technique, index) => (
                            <div className='technique' key={index}>{technique}</div>
                            ))}
                        </div>
                    </div>
                    
                    <div className='notice-detail-task-box'>
                        <div className='notice-detail-task-title'>{'주요업무'}</div>
                        <div className='notice-detail-task'>{notice.task}</div>
                    </div>
                    <div className='notice-detail-condition-box'>
                        <div className='notice-detail-condition-title'>{'자격요건'}</div>
                        <div className='notice-detail-task'>{notice.condition}</div>
                    </div>
                    <div className='notice-detail-preference-box'>
                        <div className='notice-detail-condition-title'>{'우대사항'}</div>
                        <div className='notice-detail-task'>{notice.preference}</div>
                    </div>
                    <div className='notice-detail-welfate-box'>
                        <div className='notice-detail-welfate-title'>{'사내복지'}</div>
                        <div className='notice-detail-task'>{notice.welfare}</div>
                    </div>
                    <div className='notice-detail-etc-box'>
                        <div className='notice-detail-condition-title'>{'기타/유의사항'}</div>
                        <div className='notice-detail-task'>{notice.etc}</div>
                    </div>
                    {notice.corporationImageList.length >= 1 &&
                    <div className='notice-deatail-image-box'>
                        <div className='corporation-image-title'>{'기업 이미지'}</div>
                        <div className='corporation-images'>
                            {notice.corporationImageList.map((url, index) => (
                            <img className='corporation-image' key={index} src={url} alt={`Company Image ${index}`} />
                            ))}
                        </div>
                    </div>
                    }
                    <div className='notice-detail-corporation-box'>
                        <div className='notice-detail-corporation-name'>{notice.corporationName}</div>
                        <div className='notice-detail-corporation-introduction'>{notice.introduction}</div>
                        <div className='notice-detail-corporation-address'>{`${notice.address} (${notice.addressDeatil})`}</div>
                    </div>

                </div>
                <div className='notice-detail-right-container'>
                    <div className='notice-detail-right-top-box'>
                    {devNoticeList && 
                    devNoticeList.map(devNotice => <NoticeItem key={devNotice.noticeNumber} noticeItem={devNotice} />)
                    }
                    </div>
                    <div className='notice-detail-right-bottom-box'>
                        <div className='notice-detail-recruit-button'>{'지원하기'}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}