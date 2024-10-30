import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { BoardListItem, User } from 'types/interface';
import defaultProfileImage from './assets/default-profile-image.png'
import { useNavigate, useParams } from 'react-router-dom';
import { fileUploadRequest, getUserBoardListRequest, getUserRequest, patchUserProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchUserProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { AUTH_PATH, MAIN_PATH } from 'constant';
import BoardItem from 'components/BoardItem';
import { useLoginUserStore } from 'stores';
import { GetUserBoardListResponseDto, PatchBoardResponseDto } from 'apis/response/board';
import { usePagination } from 'hooks';
import Pagination from 'components/Pagination';
import UserBoardCategoryListItem from 'types/interface/user-board-category-list-item.interface';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
import { useCookies } from 'react-cookie';
import { PatchBoardRequestDto } from 'apis/request/board';
import { PatchUserProfileImageRequestDto } from 'apis/request/user';

ChartJS.register(ArcElement, Tooltip, Legend);

//          component: 유저 화면 컴포넌트          //
export default function UserPage(){
    
    //          state: 마이 페이지 여부 상태          //
    const { userEmail } = useParams();
    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: 쿠키 상태          //
    const [ cookies, setCookies ] = useCookies(); 
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    //          state: 유저 정보 상태          //
    const [user, setUser] = useState<User | null>(null);
    //          state: 마이페이지 여부 상태          //
    const [isMypage, setMypage] = useState<boolean>(true);
    //          state: 유저 닉네임 상태          //
    const [nickname, setNickname] = useState<string>('');
    //          state: 유저 주소 상태          //
    const [email, setEmail] = useState<string>('');
    //          state: 유저 프로필 이미지 상태          //
    const [profileImage, setProfileImage] = useState<string | null>(null);
    //          state: 유저 주소 상태          //
    const [address, setAddress] = useState<string | null>(null);
    //          state: 유저 전화번호 상태          //
    const [telNumber, setTelNumber] = useState<string>('');
    //          state: 목록 선택 상태          //
    const [selectedNav, setSelectedNav] = useState<string>('게시글');
    const navItems: string[] = [
        '게시글',
        '게시글 통계',
        '개인 정보',
        '기업 관리'
    ];
    //          state: 유저 게시글 통계 데이터 상태          //
    const [data, setDate] = useState<UserBoardCategoryListItem[]>([]);
    
    //          function: get user response 처리 함수          //
    const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NU') alert('존재하지 않는 유저입니다.');
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') {
            navigate(MAIN_PATH());
            return;
        }

        const user = responseBody as GetUserResponseDto;
        console.log(user)
        setUser(user);
        setNickname(user.nickname);
        setAddress(user.address);
        setProfileImage(user.profileImage);
        setEmail(user.email);
        if(!userEmail) return;
        getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
        
    }
    //          state: 게시물 개수 상태          //
    const [count, setCount] = useState<number>(0);
    //          state: 게시물 리스트 상태          //
    const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);
    //          state: 페이지네이션 관련 상태          //
    const {
        currentPage, currentSection, viewList, viewPageList, totalSection, setCurrentPage, setCurrentSection, setTotalList
    } = usePagination<BoardListItem>(5);
    //          function: get user board list response 함수          //
    const getUserBoardListResponse = (responseBody: GetUserBoardListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'NU') {
            alert('존재하지 않는 유저입니다');
            navigate(MAIN_PATH());
            return;
        }
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;
        const { userBoardList } = responseBody as GetUserBoardListResponseDto;
        setTotalList(userBoardList);
        setCount(userBoardList.length);
    
    }
    //          effect://
    useEffect(() => {
        if(!userEmail) return;
        if(selectedNav === '게시글'){
            getUserBoardListRequest(userEmail).then(getUserBoardListResponse);
        }
    }, [selectedNav])
    
    //          component: 유저 화면 상단 컴포넌트          //
    const UserTop = () => {

        //          state: 이미지 파일 인풋 참조 상태          //
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        
        
        //          function: file upload response 처리 함수          //
        const fileUploadResponse = (profileImage: string | null) => {
            if(!profileImage) return;
            if(!cookies.accessToken) return;

            const requestBody : PatchUserProfileImageRequestDto = { profileImage };
            patchUserProfileImageRequest(requestBody, cookies.accessToken).then(patchUserProfileImageResponse);
        }
        //          function: patch user profile image response 처리 함수          //
        const patchUserProfileImageResponse = (responseBody : PatchUserProfileImageResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } =  responseBody;
            if(code === 'NU') {
                alert('존재하지 않는 유저입니다');
                navigate(MAIN_PATH());
                return;
            }
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            if(!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
            setMypage(true)
        
        }
        //          event handler: 프로필 이미지 박스 선택 이벤트 처리          //
        const onProfileBoxClickHandler = () => {
            if(!isMypage) return;
            if(!imageInputRef.current) return;
            imageInputRef.current.click();
        }
        //          event handler: 프로필 이미지 변경 이벤트 처리          //
        const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if(!event.target.files || !event.target.files.length) return;
            const file = event.target.files[0];
            const data = new FormData;
            data.append('file', file);

            fileUploadRequest(data).then(fileUploadResponse);
        }

        //          render: 유저 화면 상단 컴포넌트 렌더링          //
        if(!user) return(<></>);
        return(
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMypage ?
                    <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                        {user.profileImage !== null ?
                        <div className='user-top-profile-image' style={{backgroundImage: `url(${profileImage}` }}></div> :
                        <div className='user-top-my-profile-image-nothing-box'>
                            <div className='icon-box-large'>
                                <div className='icon image-box-white-icon'></div>
                            </div>
                        </div>
                        }
                        <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onProfileImageChangeHandler}/>
                    </div> :
                    <div className='user-top-profile-image-box' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMypage ?
                            <>
                            <div className='user-top-info-nickname'>{user.nickname}</div>
                            </> :
                            <div className='user-top-info-nickname'>{user.nickname}</div>
                            }
                        </div>
                        <div className='user-top-info-email'>{user.email}</div>
                    </div>
                </div>
            </div>
        );
    }

    //          component: 유전 화면 하단 컴포넌트          //
    const UserBottom = () => {

        //          component: 게시글 컴포넌트          //
        const Userboard = () => {
            
            
            //          render: 게시글 컴포넌트 렌더링          //
            return(
                <div className='user-board-box'>
                    <div className='user-board-contents-box'>
                        {count === 0 ?
                        <div className='user-board-contents-nothing'>{'게시글이 없습니다'}</div> :
                        <div className='user-board-contents'>
                            {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem} />)}
                        </div> 
                        }
                        <div className='user-board-pagination-box'>
                            {count !== 0 &&
                            <Pagination
                                currentPage={currentPage}
                                currentSection={currentSection}
                                setCurrentPage={setCurrentPage}
                                setCurrentSection={setCurrentSection}
                                viewPageList={viewPageList}
                                totalSection={totalSection}
                            />
                            }
                        </div>
                    </div>
                </div>
            )
        }
        //          component: 유저 게시글 통계 컴포넌트          //
        const UserBoardStats = () => {
            
            const dataEx = {
                labels: ['JavaScript/TypeScript', 'HTML/CSS', 'Python'],
                datasets: [
                {
                    label: '',
                    data: [2, 1, 1],
                    backgroundColor: [
                    'rgb(112, 128, 144)',
                    'rgb(70, 130, 180)',
                    'rgb(173, 201, 17)',
                    ],
                     hoverOffset: 4,
                },
                ],
            };
            const options = {
                plugins: {
                  legend: {
                    position: "right" as const,
                  },
                },
            };
            
            //          render: 유저 게시글 통계 컴포넌트 렌더링          //
            return(
                <div className='user-pie-chart-box'>
                    <Pie data={dataEx} options={options} />
                </div>
            );
        }
        
        //          render: 유저 화면 하단 컴포넌트 렌더링          //
        return(
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    <div className='user-bottom-side-box'>
                        {navItems.map((item, index) => (
                        <div
                        key={index}
                        className='user-bottom-side-nav'
                        style={{
                            backgroundColor: selectedNav === item ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 1)',
                            color: selectedNav === item ? 'white' : 'gray'
                        }}
                        onClick={() => setSelectedNav(item)}
                        >
                        {item}
                        </div>
                        ))}
                    </div>
                    <div className='user-bottom-main-box'>
                        {selectedNav === '게시글'&&
                        <Userboard />
                        }
                        {selectedNav === '게시글 통계'&&
                        <UserBoardStats />
                        }
                        
                    </div>
                </div>
            </div>
        );
    }
    //          effect: email path variable 변경 시 실행 할 함수          //
    useEffect(() => {
        if(!userEmail) return;
        getUserRequest(userEmail).then(getUserResponse);
        setSelectedNav('게시글');
        setMypage(userEmail === loginUser?.email);
        
        
    }, [userEmail]);
    
    
    
    //          render: 유저 화면 컴포넌트 렌더링          //
    return (
        <>
        
        <UserTop />
        <UserBottom />
        </>
    )
}