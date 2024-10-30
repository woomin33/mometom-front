import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { AUTH_PATH, POST_PATH, POST_WRITE_PATH } from 'constant';
import PostItem from 'components/PostItem';
import { getPopularListRequest, getPostListRequest, getSearchPostListRequest } from 'apis';
import GetPostListResponseDto from 'apis/response/post/get-post-list.response.dto';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';
import PostListItem from 'types/interface/post-list-item.interface';
import Pagination from 'components/Pagination';
import DatePicker from 'react-datepicker';
import { ca, id, ko } from 'date-fns/locale';
import { GetSearchPostListRequestDto } from 'apis/request/post';
import GetSearchPosListResponseDto from 'apis/response/post/get-search-post-list.response.dto';
import { GetPopularListResponseDto } from 'apis/response/search';

//          component: 유저 화면 컴포넌트          //
export default function Community(){

    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: 검색 상자 참조 상태          //
    const searchWordRef = useRef<HTMLInputElement | null>(null);
    //          state: 검색어 상태          //
    const [searchWord, setSearchWord] = useState<string>('');
    //          state: 검색 시작 날짜 상태          //
    const [startDate, setStartDate] = useState<Date | null>(null);
    //          state: 검색 종료 날짜 상태          //
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startDateString, setStartDateString] = useState<string>('');

    const [popularWordList, setPopularWordList] = useState<string[]>([]);
    
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    const [ postList, setPostList] = useState<PostListItem[]>([]);
    
    const { currentPage, currentSection, viewList, viewPageList, totalSection, totalPageList,setCurrentPage, setCurrentSection, setTotalList} = usePagination<PostListItem>(10);
    //          function: get post list response 처리 함수          //
    const getPostListResponse = (responseBody: GetPostListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;

        const { postList } = responseBody as GetPostListResponseDto;
        setPostList(postList);
        setTotalList(postList);
        console.log(postList)
    }
    //          function: get search post list response 처리 함수          //
    const getSearchPostListResponse = (responseBody: GetSearchPosListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;

        const { searchList } = responseBody as GetSearchPosListResponseDto;
        setPostList(searchList);
        setTotalList(searchList);
        
    }
    //          function: get popular list response 처리 함수          //
    const getPopularListResponse = (responseBody: GetPopularListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;

        const { popularWordList } = responseBody as GetPopularListResponseDto;
        setPopularWordList(popularWordList);
    }
    const formatDateToKST = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    //          event handler: 글쓰기 버튼 클릭 이벤트 처리          //
    const onWriteButtonClickHandler = () => {
        if(loginUser) navigate(POST_PATH() + '/' + POST_WRITE_PATH());
        else navigate(AUTH_PATH());
    }
    
    //          event handler: 검색 버튼 클릭 이벤트 처리          //
    const onSearchButtonClickHandler = () => {
        let startDateString = '';
        let endDateString = '';
        if(startDate){
            startDateString = `${formatDateToKST(startDate)} 00:00:00`;
            
        }

        if(endDate){
            endDateString = `${formatDateToKST(endDate)} 23:59:59`;
            
        }
        
        const  requestBody : GetSearchPostListRequestDto = {
            searchWord, startDate: startDateString , endDate: endDateString
        }
        getSearchPostListRequest(requestBody).then(getSearchPostListResponse);
        
    }
    //          event handler: 초기화 버튼 클릭 이벤트 처리          //
    const onClearButtonClickHanlder = () => {
        setSearchWord('');
        setStartDate(null);
        setEndDate(null);
    }
    //          event handler: 검색어 변경 이벤트 처리          //
    const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    }
    //          event handler: 인기 검색어 클릭 이벤트 처리          //
    const onPopularWordClickHandler = (word: string) => {
        let startDateString = '';
        let endDateString = '';
        setStartDate(null);
        setEndDate(null);
        setSearchWord(word);
        if(startDate){
            startDateString = `${formatDateToKST(startDate)} 00:00:00`;
            
        }
        if(endDate){
            endDateString = `${formatDateToKST(endDate)} 23:59:59`;
            
        }
        const  requestBody : GetSearchPostListRequestDto = {
            searchWord: word, startDate: startDateString , endDate: endDateString
        }
        getSearchPostListRequest(requestBody).then(getSearchPostListResponse);
    }
    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
        
        getPostListRequest().then(getPostListResponse);
        getPopularListRequest().then(getPopularListResponse);
        
    }, []);


    
    //          render: 유저 화면 컴포넌트 렌더링          //
    return (
        <div id='community'>
            <div className="community-wrapper">
                
                <div className='community-right-container'>
                    <div className='community-right-title-box'>
                        <div className='community-right-title'>{'커뮤니티'}</div>
                        <div className='black-button' onClick={onWriteButtonClickHandler}>{'질문하기'}</div>
                    </div>
                    <div className='community-right-content-box'>
                        <div className='community-search-box'>
                            <div className='community-search-main-box'>
                                <div className='community-date-box'>
                                    <div className='community-date-title'>{'기간설정'}</div>
                                    <DatePicker className='date-picker'
                                        selected={startDate} onChange={(date: Date) => setStartDate(date)} 
                                        locale={ko} dateFormat={'yyyy-MM-dd'}  
                                        
                                    /> ~
                                    <DatePicker className='date-picker'
                                        selected={endDate} onChange={(date: Date) => setEndDate(date)} 
                                        locale={ko} dateFormat='yyyy-MM-dd'  
                                    />
                                </div>
                                <input ref={searchWordRef} className='community-search-input' type='text' value={searchWord} placeholder={'검색어를 입력해주세요'} onChange={onSearchWordChangeHandler}></input>
                                <div className='community-search-button' onClick={onSearchButtonClickHandler}>{'검색'}</div>
                                <div className='community-clear-button' onClick={onClearButtonClickHanlder}>{'초기화'}</div>
                            </div>
                        </div>
                        <div className='community-post-info-box'>
                            <span className='yellow-circle'>•</span> 전체목록 <span className='bold-text'>{postList.length}</span>개, 페이지 <span className='bold-text'>{currentPage}</span>/{totalPageList.length}
                        </div>
                        <div className='community-post-container'>
                            <div className='community-post-head'>
                                <div className='head-number'>{'번호'}</div>
                                <div className='head-title'>{'제목'}</div>
                                <div className='head-reg-date'>{'등록일'}</div>
                                <div className='head-view-count'>{'조회수'}</div>
                                <div className='head-comment-count'>{'댓글수'}</div>
                                <div className='head-writer-info'>{'작성자'}</div>
                            </div>
                            <div className='community-post-box'>
                                {viewList && viewList.map((postListItem, index) => {
                                const overallIndex = (currentPage - 1) * 10 + index + 1;
                                const reverseIndex = postList.length - overallIndex + 1;
                                return(
                                <div className='community-post' key={postListItem.postNumber}>
                                    <div className='community-post-number'>{reverseIndex}</div>
                                <PostItem  postItem={postListItem} />
                                </div>
                                );
                                })}
                            </div>
                        </div>
                        <div className='community-pagination-box'>
                            <Pagination
                                currentPage={currentPage}
                                currentSection={currentSection}
                                setCurrentPage={setCurrentPage}
                                setCurrentSection={setCurrentSection}
                                viewPageList={viewPageList}
                                totalSection={totalSection}
                            />
                        </div>
                    </div>
                    
                </div>
                <div className='community-left-container'>
                    <div className='community-popular-word-box'>
                        <div className='community-popular-word-title'>{'인기 검색어'}</div>
                        <div className='community-popular-word-content'>
                            <div className='community-popular-words'>
                            {popularWordList.map(word => <div className='word-badge' onClick={() => onPopularWordClickHandler(word)}>{word}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className='community-popular-post-box'>
                        <div className='community-popular-post-title'>{'이번주 인기 글'}</div>
                        <div className='community-popular-post-content'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}