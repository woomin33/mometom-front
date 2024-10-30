import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import BoardItem from 'components/BoardItem';
import { BoardListItem } from 'types/interface';
import Pagination from 'components/Pagination';
import { getCategoryRequest, getLatestBoardListRequest, getMostViewedBoardListRequest, getPopularityBoardListRequest } from 'apis';
import { usePagination } from 'hooks';
import { GetLatestBoardListResponseDto, GetMostViewedBoardListResponseDto, GetPopularityBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { useNavigate } from 'react-router-dom';
import { AUTH_PATH, BOARD_PATH, BOARD_WRITE_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { GetCategoryResponseDto } from 'apis/response/category';
import CategoryList from 'types/interface/category.interface';
import { PostCategoryRequestDto } from 'apis/request/category';

//          component: 블로그 화면 컴포넌트          //
export default function Blog(){

    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: 선택된 카테고리 리스트 상태          //
    const [selectedCategoryList, setSelectedCategoryList] = useState<number[]>([]);
    
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          component: 블러그 화면 상단 컴포넌트          //
    const BlogTop = () => {

        //          state: 카테고리 리스트 상태          //
        const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
        

        //          function: get category response 처리 함수          //
        const getCategoryResponse = (responseBody : GetCategoryResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { categoryList } = responseBody as GetCategoryResponseDto;
            setCategoryList(categoryList);
        }
        //          event handler: 글쓰기 버튼 클릭 이벤트 처리          //
        const onSideCardClickhandler = () => {
            if(loginUser) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
            else navigate(AUTH_PATH());
        }
        //          event handler: 카테고리 버튼 클릭 이벤트 처리 함수          //
        const onCategoryButtonClickHandler = (categoryNumber: number) => {

            const isSelected = selectedCategoryList.includes(categoryNumber);

            if(isSelected) {
                setSelectedCategoryList(selectedCategoryList.filter(num => num !== categoryNumber))
            }
            else{
                setSelectedCategoryList([...selectedCategoryList, categoryNumber]);
            }
        }
        //          effect: 첫 마운트 시 실행될 함수          //
        useEffect(() => {
            getCategoryRequest().then(getCategoryResponse);
        }, []);

        //          render: 블로그 화면 상단 컴포넌트 렌더링          //
        return(
            <div id='blog-top-wrapper'>
                <div className='blog-top-container'>
                    <div className='blog-top-category-box'>
                        <div className='blog-top-category-title'>{'카테고리'}</div>
                        <div className='blog-top-categorys'>
                            {categoryList.map(category => <div key={category.categoryNumber}onClick={() => onCategoryButtonClickHandler(category.categoryNumber)}
                            style={{backgroundColor: selectedCategoryList.includes(category.categoryNumber) ? 'rgba(0, 0, 0, 0.2)' : 'white'}}
                            className='category'>{category.categoryName}</div>)}
                        </div>
                    </div>
                    <div className='blog-top-side-box'>
                        <div className='blog-top-side-card' onClick={onSideCardClickhandler}>
                            <div className='blog-top-side-container'>
                                <div className='blog-top-side-text'>{'글쓰기'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //          component: 블러그 화면 하단 컴포넌트          //
    const BlogBottom = () => {

        //          state: 정렬 영역 요소 참조 상태          //
        const showOrdertRef = useRef<HTMLDivElement | null>(null);
        //          state: 페이지네이션 관련 상태          //
        const { currentPage, currentSection, viewList, viewPageList, totalSection, setCurrentPage, setCurrentSection, setTotalList} = usePagination<BoardListItem>(10);
        //          state: order 버튼 상태          //
        const [showOrder, setShowOrder] = useState<boolean>(false);
        //          state: 게시물 리스트 정렬 상태          //
        const [ orderBoardList, setOrderBoardList ] = useState<String>('최신');
        

        //          function: get latest board list response 처리 함수          //
        const getLatestBoardListResponse = (responseBody: GetLatestBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { latestList } = responseBody as GetLatestBoardListResponseDto;
            setTotalList(latestList);
        }
        //          function: get popularity board list response 처리 함수          //
        const getPopularityBoardListResponse = (responseBody: GetPopularityBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { popularityList } = responseBody as GetPopularityBoardListResponseDto;
            setTotalList(popularityList);
        }
        //          function: get mostviewed board list response 처리 함수          //
        const getMostViewedBoardListResponse = (responseBody: GetMostViewedBoardListResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { mostViewedList } = responseBody as GetMostViewedBoardListResponseDto;
            setTotalList(mostViewedList);
        }

        //          event handler: order 버튼 클릭 이벤트 처리          //
        const onOrderButtonClickHandler = () => {
            setShowOrder(!showOrder);
        }
        //          event handler: 정렬 박스 외부 영역 클릭 이벤트 처리          //
        const handleOutsideClose = (e: {target: any}) => {
            if(showOrder && (!showOrdertRef.current?.contains(e.target)&& !e.target.classList.contains('order-icon'))) setShowOrder(false);
        };
        //          event handler: 작성일 버튼 클릭 이벤트 처리          //
        const onWritedateButtonClickHandler = () => {
            setOrderBoardList('최신'); 
        }
        //          event handler: 좋아요 버튼 클릭 이벤트 처리          //
        const onFavoriteButtonClickHandler = () => {
            setOrderBoardList('인기');
        }
        //          event handler: 좋아요 버튼 클릭 이벤트 처리          //
        const onMostViewedButtonClickHandler = () => {
            setOrderBoardList('많이 본');
        }
        
        
        //          effect: 정렬 기준 변경 시 실행될 함수          //
        useEffect(() => {
            if(!orderBoardList) return;

            const requestBody : PostCategoryRequestDto = {
                selectedCategoryList
            }
            if(orderBoardList === '최신') getLatestBoardListRequest(requestBody).then(getLatestBoardListResponse);
            else if(orderBoardList === '인기') getPopularityBoardListRequest(requestBody).then(getPopularityBoardListResponse);
            else if(orderBoardList === '많이 본') getMostViewedBoardListRequest(requestBody).then(getMostViewedBoardListResponse);
            else return;
            
        }, [orderBoardList]);

        //          effect: 정렬 박스 외부 영역 클릭 시 실행할 함수          //
        useEffect(() => {
            document.addEventListener('click', handleOutsideClose);

            return () => document.removeEventListener('click', handleOutsideClose);
        }, [showOrder]);
        
        //          render: 블로그 화면 하단 컴포넌트 렌더링          //
        return(
            <div id='blog-bottom-wrapper'>
                <div className='blog-bottom-container'>
                    <div className='blog-bottom-title-box'>
                        <div className='blog-bottom-title-text'>{`${orderBoardList} 게시물`}</div>
                        <div className='icon-button' onClick={onOrderButtonClickHandler}>
                            <div className='icon order-icon'></div>
                        </div>
                        {showOrder &&
                        <div ref={showOrdertRef} className='blog-bottom-title-order-box'>
                            <div className='blog-bottom-title-order' onClick={onWritedateButtonClickHandler}>{'작성일'}</div>
                            <div className='divider'></div>
                            <div className='blog-bottom-title-order' onClick={onFavoriteButtonClickHandler}>{'좋아요'}</div>
                            <div className='divider'></div>
                            <div className='blog-bottom-title-order' onClick={onMostViewedButtonClickHandler}>{'조회순'}</div>
                        </div>
                        }

                    </div>
                    <div className='blog-bottom-contents-box'>
                        <div className='blog-bottom-current-contents'>
                            {viewList && viewList.map(boardListItem => <BoardItem key={boardListItem.boardNumber} boardListItem={boardListItem} />)}
                        </div>
                    </div>
                    <div className='blog-bottom-pagination-box'>
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
        )
    }
    //          render: 블로그 화면 컴포넌트 렌더링          //
    return (
        <div id='blog'>
            <BlogTop />
            <BlogBottom />
        </div>
    )
}