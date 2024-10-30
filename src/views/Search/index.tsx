import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import BoardItem from 'components/BoardItem';
import Pagination from 'components/Pagination';
import { getSearchBoardListRequest } from 'apis';
import { GetSearchBoardListResponseDto } from 'apis/response/board';
import { ResponseDto } from 'apis/response';
import { usePagination } from 'hooks';

//          component: 검색 화면 컴포넌트          //
export default function Search(){

    //          state: searchWord path variable 상태          //
    const { searchWord } = useParams();
    //          state: 이전 검색어 상태          //
    const [preSearchWord, setPreSearchWord] = useState<string | null>(null);
    //          state: 페이지네이션 관련 상태          //
    const { currentPage, currentSection, viewList, viewPageList, totalSection, setCurrentPage, setCurrentSection, setTotalList} = usePagination<BoardListItem>(10);
    //          state: 검색 게시물 개수 상태          //
    const [count, setCount] = useState<number>(0);
    //          state: 검색 게시물 리스트 상태          
    const [searchBoardList, setSearchBoardList] = useState<BoardListItem[]>([]);

    //          function: get search board list response 처리 함수          //
    const getSearchBoardListResponse = (responseBody: GetSearchBoardListResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code !== 'SU') return;

        if(!searchWord) return;
        const { searchList } = responseBody as GetSearchBoardListResponseDto;
        setTotalList(searchList);
        setCount(searchList.length);
        setPreSearchWord(searchWord); 

    }
    
    
    //          effect: 첫 마운트 시 실행될 함수          //
    useEffect(() => {
        console.log(searchWord)
        console.log(preSearchWord)
        if(!searchWord) return;
        getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
    }, [searchWord])
    //          render: 검색 화면 컴포넌트 렌더링          //
    if(!searchWord) return (<></>)
    return (
        <div id='search-wrapper'>
            <div className='search-container'>
                <div className='search-title-box'>
                    <div className='search-title'><span className='search-title-emphasis'>{searchWord}</span>{'에 대한 검색결과 입니다'}</div>
                    <div className='search-count'>{count}</div>
                </div>
                <div className='search-contents-box'>
                    {count === 0 ?
                    <div className='search-contents-nothing'>{'검색 결과가 없습니다'}</div> :
                    <div className='search-contents'>
                        {viewList.map(boardListItem => <BoardItem boardListItem={boardListItem} />)}
                    </div>
                    }
                </div>
                <div className='search-pagination-box'>
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