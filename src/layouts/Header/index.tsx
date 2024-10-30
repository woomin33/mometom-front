import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from 'react';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AUTH_PATH, BLOG_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, COMMUNITY_PATH, CORPORATION_MANAGEMENT_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, EMPLOYMENT_PATH, GROUP_PATH, MAIN_PATH, MAP_PATH, NOTICE_DETAIL_PATH, NOTICE_PATH, POST_DETAIL_PATH, POST_PATH, RESUME_MANAGEMENT_PATH, RESUME_PATH, SEARCH_PATH, USER_PATH } from 'constant';
import { Cookies, useCookies } from 'react-cookie';
import { useBoardStore, useLoginUserStore, useModalStateStore } from 'stores';
import { fileUploadRequest, getCategoryRequest, patchBoardRequest, postBoardRequest } from 'apis';
import { PatchBoardRequestDto, PostBoardRequestDto } from 'apis/request/board';
import { PatchBoardResponseDto, PostBoardResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { CategoryList } from 'types/interface';
import { GetCategoryResponseDto } from 'apis/response/category';

//          component: 헤더 레이아웃          //
export default function Header() {

  //          state: 게시물 상태          //
  const { title, content, boardImageFileList, boardVideoFileList, resetBoard } = useBoardStore();
  //          state: 로그인 유저 상태          //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  //          state: path 상태          //
  const { pathname } = useLocation();
  //          state: cookie 상태          //
  const [cookies, setCookie] = useCookies();
  //          state: 로그인 상태          //
  const [isLogin, setLogin] = useState<boolean>(false);
  //          state: 인증 페이지 상태          //
  const [isAuthPage, setAuthPage] = useState<boolean>(false);
  //          state: 메인 페이지 상태          //
  const [isMainPage, setMainPage] = useState<boolean>(false);
  //          state: 검색 페이지 상태          //
  const [isSearchPage, setSearchPage] = useState<boolean>(false);
  //          state: 게시물 상세 페이지 상태          //
  const [isBoardDetailPage, setBoardDetailPage] = useState<boolean>(false);
  //          state: 게시물 작성 페이지 상태          //
  const [isBoardWritePage, setBoardWritePage] = useState<boolean>(false);
  //          state: 게시물 수정 페이지 상태          //
  const [isBoardUpdatePage, setBoardUpdatePage] = useState<boolean>(false);
  //          state: 유저 페이지 상태          //
  const [isUserPage, setUserPage] = useState<boolean>(false);
  //          state: 블로그 페이지 상태          //
  const [isBlogPage, setBlogPage] = useState<boolean>(false);
  //          state: 협찬 페이지 상태          //
  const [isSponshipPage, setSponshipPage] = useState<boolean>(false);
  //          state: 커뮤니티 페이지 상태          //
  const [isCommunityPage, setCommunityPage] = useState<boolean>(false);
  //          state: 채용 페이지 상태          //
  const [isEmployPage, setEmployPage] = useState<boolean>(false);
  //          state: 공고 상세 페이지 상태          //
  const [isNoticePage, setNoticePage] = useState<boolean>(false);
  //          state: 지도 페이지 상태          //
  const [isMapPage, setMapPage] = useState<boolean>(false);
  //          state: 포스트 페이지 상태          //
  const [isPostDetailPage, setPostDetailPage] = useState<boolean>(false);
  //          state: 이력서 페이지 상태          //
  const [isResumePage, setResumePage] = useState<boolean>(false);
  
  
  //          state: 기업 관리 페이지 상태          //
  const [isCorporationManagementPage, setCorporationManagementPage] = useState<boolean>(false);
  //          state: 장소 등록 페이지 상태          //
  const [isLocationRegistrationPage, setLocationRegistrationPage] = useState<boolean>(false);
  //          state: 모임 페이지 상태          //
  const [isGroupPage, setGroupPage] = useState<boolean>(false);
  //          state: 모달 오픈 상태          //
  const { isModalOpen, setModalOpen } = useModalStateStore();
  
  

  //          function: 네비게이트 함수          //
  const navigate = useNavigate();

  //          event handler: 로고 클릭 이벤트 처리 함수          //
  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  }

  //          component: 네비게이션 바 컴포넌트          //
  const NavigationBar = () => {

    //          event handler: 블로그 버튼 클릭 이벤트 처리 함수          //
    const onBlogButtonClickHandler = () => {
      navigate(BLOG_PATH());
    }
    //          event handler: 협찬 버튼 클릭 이벤트 처리 함수          //
    const onGroupButtonClickHandler = () => {
      navigate(GROUP_PATH());
    }
    //          event handler: 커뮤니티 버튼 클릭 이벤트 처리 함수          //
    const onCommunityButtonClickHandler = () => {
      navigate(COMMUNITY_PATH());
    }
    //          event handler: 지도 버튼 클릭 이벤트 처리 함수          //
    const onMapButtonClickHandler = () => {
      if (!loginUser) {
        navigate(MAP_PATH());
        return;
      }
      const { email } = loginUser;
      navigate(MAP_PATH(email));
    }
    //          event handler: 채용 버튼 클릭 이벤트 처리 함수          //
    const onEmploymentButtonClickHandler = () => {
      navigate(EMPLOYMENT_PATH(0));
    }
    //          event handler: 채용 버튼 클릭 이벤트 처리 함수          //
    const onResumeButtonClickHandler = () => {
      if (!loginUser) {
        navigate(AUTH_PATH());
        return;
      }
      const { email } = loginUser;
      navigate(RESUME_PATH() + '/' + RESUME_MANAGEMENT_PATH(email));
    }
    
    //          render: 네비게이션 바 컴포넌트 렌더링          //
    if(isMainPage)
    return(
      <div className='header-middle-navigation-box'>
        <div className='header-middle-navigation-main' onClick={onBlogButtonClickHandler}>{'블로그'}</div>
        <div className='header-middle-navigation-main' onClick={onCommunityButtonClickHandler}>{'커뮤니티'}</div>
        <div className='header-middle-navigation-main' onClick={onGroupButtonClickHandler}>{'스터디'}</div>
        <div className='header-middle-navigation-main' onClick={onEmploymentButtonClickHandler}>{'채용'}</div>
        <div className='header-middle-navigation-main' onClick={onResumeButtonClickHandler}>{'이력서 관리'}</div>
      </div>
    )
    return(
      <div className='header-middle-navigation-box'>
        <div className='header-middle-navigation-blog' onClick={onBlogButtonClickHandler}>{'블로그'}</div>
        <div className='header-middle-navigation-sponship' onClick={onCommunityButtonClickHandler}>{'커뮤니티'}</div>
        <div className='header-middle-navigation-community' onClick={onGroupButtonClickHandler}>{'스터디'}</div>
        <div className='header-middle-navigation-map' onClick={onEmploymentButtonClickHandler}>{'채용'}</div>
        <div className='header-middle-navigation-group' onClick={onResumeButtonClickHandler}>{'이력서 관리'}</div>
      </div>
    )
  }

  //          component: 검색 버튼 컴포넌트          //
  const SearchButton = () => {

    //          state: 검색어 버튼 요소 참조 상태          //
    const searchButtonRef = useRef<HTMLDivElement | null>(null); 
    //          state: 검색 버튼 상태          //
    const [status, setStatus] = useState<boolean>(false);
    //          state: 검색어 상태          //
    const [word, setWord] = useState<string>('');
    //          state: 검색어 path variable 상태          //
    const { searchWord } = useParams();

    //          event handler: 검색 변경 이벤트 처리 함수          //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWord(value);
    };
    //          event handler: 검색어 키 이벤트 처리 함수          //
    const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      if(event.key !== 'Enter') return;
      if(!searchButtonRef.current) return;
      searchButtonRef.current.click();
    };
    //          event handler: 검색 버튼 클릭 이벤트 처리 함수          //
    const onSearchButtonClickHandler = () => {
      if(!status){
        setStatus(!status);
        return;
      }
      if(word === ''){
        setStatus(!status);
        return;
      }
      navigate(SEARCH_PATH(word));
      
    };

    //          effect: 검색어 path variable 변경 될때 마다 실행할 함수          //
    useEffect(() => {
      if (searchWord){
        setWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    if(!status)
    //          render: 검색 버튼 컴포넌트 렌더링 (클릭 false 상태)          //
    return (
    <div className='icon-button' onClick={onSearchButtonClickHandler}>
      <div className='icon search-light-icon'></div>
    </div>
    );
    //          render: 검색 버튼 컴포넌트 렌더링 (클릭 true 상태)          //
    return(
      <div className='header-search-input-box'>
        <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler} />
        <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
          <div className='icon search-light-icon'></div>
        </div>
      </div>
    );
  }

  //          component: 로그인 또는 마이페이지 버튼 컴포넌트          //
  const MyPageButton = () => {

    //          state: userEmail path variable 상태          //
    const { userEmail } = useParams();
    
    //          event handler: 마이페이지 버튼 클릭 이벤트 처리 함수          //
    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      const { email } = loginUser;
      navigate(USER_PATH(email));
    };
    //          event handler: 로그아웃 버튼 클릭 이벤트 처리 함수          //
    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      setCookie('accessToken', '', { path: MAIN_PATH(), expires: new Date() });
      navigate(MAIN_PATH());
    };
    //          event handler: 로그인 버튼 클릭 이벤트 처리 함수          //
    const onSignInButtonClickHandler = () => {
      navigate(AUTH_PATH());
    };


    //          render: 로그아웃 버튼 컴포넌트 렌더링          //
    if (isLogin && userEmail === loginUser?.email && isUserPage)
    return <div className='white-button' onClick={onSignOutButtonClickHandler}>{'로그아웃'}</div>;
    if(isLogin && !isMainPage)
    //          render: 마이페이지 버튼 컴포넌트 렌더링          //
    return <div className='mypage-button' onClick={onMyPageButtonClickHandler}>{'마이페이지'}</div>
    if(isLogin && isMainPage)
    return <div className='mypage-button-main'onClick={onMyPageButtonClickHandler}><span className='mypage-button-main-text'>{'마이페이지'}</span></div>
    //          render: 로그인 버튼 컴포넌트 렌더링          //
    return <div className='black-button' onClick={onSignInButtonClickHandler}>{'로그인'}</div>;
  };

  //          effect: path가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    setModalOpen(false);
    const isAuthPage = pathname.startsWith(AUTH_PATH());
    setAuthPage(isAuthPage);
    const isMainPage = pathname === MAIN_PATH();
    setMainPage(isMainPage);
    const isSearchPage = pathname.startsWith(SEARCH_PATH(''));
    setSearchPage(isSearchPage);
    const isBoardDetailPage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(''));
    setBoardDetailPage(isBoardDetailPage);
    const isBoardWritePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
    setBoardWritePage(isBoardWritePage);
    const isBoardUpdatePage = pathname.startsWith(BOARD_PATH() + '/' + BOARD_UPDATE_PATH(''));
    setBoardUpdatePage(isBoardUpdatePage);
    const isCommunityPage = pathname.startsWith(COMMUNITY_PATH());
    setCommunityPage(isCommunityPage);
    const isUserPage = pathname.startsWith(USER_PATH(''));
    setUserPage(isUserPage);
    const isBlogPage = pathname === BLOG_PATH();
    setBlogPage(isBlogPage);
    const isEmployPage = pathname.startsWith(EMPLOYMENT_PATH(''));
    setEmployPage(isEmployPage);
    const isNoticePage = pathname.startsWith(NOTICE_PATH() + '/' + NOTICE_DETAIL_PATH(''));
    setNoticePage(isNoticePage);
    const isCorporationManagementPage = pathname.startsWith(CORPORATION_PATH() + '/' + CORPORATION_MANAGEMENT_PATH(''));
    setCorporationManagementPage(isCorporationManagementPage);
    const isMapPage = pathname.startsWith(MAP_PATH(''));
    setMapPage(isMapPage);
    const isLocationRegistrationPage = pathname.startsWith(CORPORATION_PATH() + '/' + CORPORATION_REGISTRATION_PATH());
    setLocationRegistrationPage(isLocationRegistrationPage);
    const isPostDetailPage = pathname.startsWith(POST_PATH() + '/' + POST_DETAIL_PATH(''));
    setPostDetailPage(isPostDetailPage);
    const isResumePage = pathname.startsWith(RESUME_PATH() + '/' + RESUME_MANAGEMENT_PATH(''));
    setResumePage(isResumePage);


  }, [pathname]);

  //          effect: login user가 변경될 때 마다 실행될 함수          //
  useEffect(() => {
    setLogin(loginUser !== null);
  }, [loginUser]);

  //          component: 업로드 버튼 컴포넌트          //
  const UploadButton = () => {
    //          event handler: 업로드 버튼 클릭 이벤트 처리 함수          //
    const onUploadButtonClickHandler = () => {
      setModalOpen(true);
      
    }
    //          render: 업로드 버튼 컴포넌트 렌더링          //
    if(title && content)
    return <div className='black-button' onClick={onUploadButtonClickHandler}>{'업로드'}</div>
    //          render: 업로드 버튼 컴포넌트 렌더링          //
    return <div className='disable-button'>{'업로드'}</div>
  }

  //          render: 헤더 레이아웃 렌더링          //
  return (
    <div id='header'>
      <div className='h header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          {/* <div className='icon-box'>
            <div className='icon logo-dark-icon'></div>
          </div> */}
          {!isMainPage ?
          <div className='header-logo'>{'Momentom'}</div> :
          <div className='header-logo-white'>{'Momentom'}</div>
          }
        </div>
        <div className='header-middle-box'>
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage || isBlogPage || isMapPage || isEmployPage || isNoticePage|| isCorporationManagementPage || isCommunityPage || isPostDetailPage || isResumePage) && <NavigationBar />}
        </div>
        <div className='header-right-box'>
          {( isSearchPage || isBoardDetailPage || isBlogPage ) &&  <SearchButton />}
          {(isMainPage || isSearchPage || isBoardDetailPage || isUserPage || isBlogPage || isMapPage || isLocationRegistrationPage || isEmployPage ||isNoticePage || isCorporationManagementPage || isCommunityPage || isPostDetailPage || isResumePage) && <MyPageButton />}
          {(isBoardWritePage || isBoardUpdatePage) && <UploadButton />}
        </div>
      </div>
    </div>
  )
}
