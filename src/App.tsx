import React, { useEffect, useState } from 'react';
import './App.css';
import InputBox from 'components/InputBox';
import { Route, Routes } from 'react-router-dom';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import UserP from 'views/User';
import Container from 'layouts/Container';
import { BLOG_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, COMMUNITY_PATH, CORPORATION_DETAIL_PATH, CORPORATION_MANAGEMENT_PATH, CORPORATION_PATH, CORPORATION_REGISTRATION_PATH, CORPORATION_UPDATE_PATH, EMPLOYMENT_PATH, GROUP_PATH, MAIN_PATH, MAP_PATH, NOTICE_DETAIL_PATH, NOTICE_PATH, NOTICE_REGISTRATION_PATH, NOTICE_UPDATE_PATH, POST_DETAIL_PATH, POST_PATH, POST_WRITE_PATH, RESUME_MANAGEMENT_PATH, RESUME_PATH, RESUME_WRITE_PATH } from 'constant';
import { AUTH_PATH } from 'constant';
import { SEARCH_PATH } from 'constant';
import { USER_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { User } from 'types/interface';
import BoardWrite from 'views/Board/Write';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import Blog from 'views/Blog';
import Sponship from 'views/Sponship';
import Group from 'views/Group';
import Map from 'views/Map';
import Community from 'views/Community';
import CorporationRegistration from 'views/Corporation/Registration';
import Employment from 'views/Employment';
import CorporationDetail from 'views/Corporation/Detail';
import CorporationManagement from 'views/Corporation/Management';
import NoticeRegistration from 'views/Notice/Registration';
import NoticeDetail from 'views/Notice/Detail';
import PostWrite from 'views/Post/Write';
import PostDeatil from 'views/Post/Detail';
import Resume from 'views/Resume/Management';
import ResumeWrite from 'views/Resume/Write';
import ResumeManagement from 'views/Resume/Management';



//          component: Application 컴포넌트          //
function App() {

  //          state: 로그인 유저 전역 상태          //
  const { setLoginUser, resetLoginUser } = useLoginUserStore();

  //          state: cookie 상태          //
  const [cookies, setCookie] = useCookies();

  //          function: get sign in user response 처리 함수          //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...responseBody as GetSignInUserResponseDto};
    setLoginUser(loginUser);
  }

  //          effect: accessToken cookie 값이 변경될 때 마다 실행할 함수          //
  useEffect(() => {
    if (!cookies.accessToken){
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  //          render: Application 컴포넌트 렌더링          //
  // description: 메인 화면 : '/' - Main //
  // description: 로그인 + 회원가입 화면 : '/auth' - Authentication //
  // description: 검색화면 : '/search/:word' - Search //
  // description: 유저 페이지 : 'user/:userEmail' - User //
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={AUTH_PATH()} element={<Authentication />} />
        <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
        <Route path={USER_PATH(':userEmail')} element={<UserP />} />
        <Route path={BOARD_PATH()}>
          <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
          <Route path={BOARD_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
          <Route path={BOARD_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
        </Route>
        <Route path={BLOG_PATH()} element={<Blog />} />
        <Route path={COMMUNITY_PATH()} element={<Community />} />
        <Route path={POST_PATH()}>
          <Route path={POST_WRITE_PATH()} element={<PostWrite />} />
          <Route path={POST_DETAIL_PATH(':postNumber')} element={<PostDeatil />} />
        </Route>
        <Route path={EMPLOYMENT_PATH(':devCategoryNumber')} element={<Employment />} />
        <Route path={MAP_PATH(':userEmail?')} element={<Map />} />
        <Route path={CORPORATION_PATH()}>
          <Route path={CORPORATION_REGISTRATION_PATH()} element={<CorporationRegistration />} />
          <Route path={CORPORATION_DETAIL_PATH(':corporationNumber')} element={<CorporationDetail />} /> 
          <Route path={CORPORATION_MANAGEMENT_PATH(':corporationNumber')} element={<CorporationManagement />} />
          <Route path={CORPORATION_UPDATE_PATH(':corporationNumber')} element={<BoardUpdate />} />
        </Route>
        <Route path={NOTICE_PATH()}>
          <Route path={NOTICE_REGISTRATION_PATH(':corporationNumber')} element={<NoticeRegistration />} />
          <Route path={NOTICE_DETAIL_PATH(':noticeNumber')} element={<NoticeDetail />} />
          
        </Route>
        <Route path={GROUP_PATH()} element={<Group />} />
        <Route path={RESUME_PATH()}>
          <Route path={RESUME_MANAGEMENT_PATH(':userEmail')} element={<ResumeManagement />} />
          <Route path={RESUME_WRITE_PATH()} element={<ResumeWrite />} />
        </Route>
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
