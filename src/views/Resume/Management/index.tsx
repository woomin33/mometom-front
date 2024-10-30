import React, { useEffect, useState } from 'react';
import './style.css';
import { useLoginUserStore } from 'stores';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getUserBoardCategoryListRequest, getUserResumeListRequest } from 'apis';
import { GetUserBoardCategoryResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { MAIN_PATH, RESUME_PATH, RESUME_WRITE_PATH } from 'constant';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  } from 'chart.js';
import UserBoardCategoryListItem from 'types/interface/user-board-category-list-item.interface';
import ResumeItem from 'components/ResumeItem';
import GetUserResumeListResponseDto from 'apis/response/resume/get-user-resume-list.response.dto';
import ResumeListItem from 'types/interface/resume-list.item.interface';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

//          component: 이력서 화면 컴포넌트          //
export default function ResumeManagement(){
    //          state: 마이 페이지 여부 상태          //
    const { userEmail } = useParams();
    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: 쿠키 상태          //
    const [ cookies, setCookies ] = useCookies(); 
    //          state: 유저 보드 카테고리 상태          //
    const [data, setDate] = useState<UserBoardCategoryListItem[]>([]);

    const minCategoryCount = Math.min(...data.map(item => item.categoryCount));
    const maxCategoryCount = Math.max(...data.map(item => item.categoryCount));

    //          state: 게시물 리스트 상태          //
    const [userResumeList, setUserResumeList] = useState<ResumeListItem[]>([]);
    

    const chartData = {
        labels: data.map(item => item.categoryName),
        datasets: [
          {
            data: data.map(item => item.categoryCount),
            label: '내 게시글 통계',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          }
        ]
    };
    const options = {
        scales: {
            r: {
                min: 0,    // 최소값 설정
                max: maxCategoryCount,   // 최대값 설정
                ticks: {
                    stepSize: minCategoryCount // 간격 설정 (옵션)
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
            },          
        },
    };
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    //          function: get user board category response 처리 함수          //
    const getUserBoardCategoryResponse = (responseBody: GetUserBoardCategoryResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 게시물입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }

        const { userBoardCategoryList }= responseBody as GetUserBoardCategoryResponseDto;
        setDate(userBoardCategoryList);
    }
    //          function: get user board list response 함수          //
    const getUserResumeListResponse = (responseBody: GetUserResumeListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NU') {
            alert('존재하지 않는 유저입니다');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        const { userResumeList } = responseBody as GetUserResumeListResponseDto;
        setUserResumeList(userResumeList);
    }
    //          event handler: 이력서 등록 버튼 클릭 이벤트 처리 함수          //
    const onResumeWriteButtonClickHandler = () => {
        if(!userEmail) return;
        navigate(RESUME_PATH() + '/' + RESUME_WRITE_PATH());
    }
    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
        if(!userEmail) return;
        getUserBoardCategoryListRequest(userEmail).then(getUserBoardCategoryResponse);
        getUserResumeListRequest(userEmail).then(getUserResumeListResponse);
    }, [])
    //          render: 이력서 화면 컴포넌트 렌더링          //
    return (
        <div id='resume-wrapper'>
            <div className='resume-container'>
                <div className='resume-left-container'>
                    <div className='resume-left-chart-box'>
                        {/* <div className='resume-left-chart-title-box'>
                            <div className='resume-left-chart-title'>{'게시글 통계'}</div>
                        </div> */}
                        <div className='resume-left-chart'>
                            {data &&
                            <Radar data={chartData} options={options} />
                            }
                        </div>
                    </div>
                    <div className='resume-left-notice-box'>
                        <div className='resume-left-notice-title'>{'입사지원 현황'}</div>
                    </div>
                </div>
                <div className='resume-right-container'>
                    <div className='resume-right-top-box'>
                        <div className='resume-right-top-title'>{'이력서 목록'}</div>
                        <div className='black-button' onClick={onResumeWriteButtonClickHandler}>{'이력서 등록'}</div>
                    </div>
                    <div className='resume-right-resume-box'>
                        {userResumeList.map(resumeListItem => <ResumeItem resumeItem={resumeListItem} />)}
                        
                    </div>
                </div>
            </div>
        </div>
        
    )
}