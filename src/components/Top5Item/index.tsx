import React from 'react'
import './style.css';
import { NoticeListItem } from 'types/interface';
import { useNavigate } from 'react-router-dom';
import { NOTICE_DETAIL_PATH, NOTICE_PATH } from 'constant';

interface Props{
    top5ListItem: NoticeListItem
}

//          component: Top 5 List Item 컴포넌트          //
export default function Top5Item({ top5ListItem } : Props){

    //          properties          //
    const { noticeNumber, title, devCategoryName, techniques, corporationName, endDate, corporationImage} = top5ListItem;
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          event handler: 게시물 아이템 클릭 이벤트 처리 함수          //
    const onClickHandler = () => {
        navigate(NOTICE_PATH() + '/' + NOTICE_DETAIL_PATH(noticeNumber));
    }
    //          render: Top 5 List Item 컴포넌트 렌더링          //
    return(
        <div className='top-5-list-item' onClick={onClickHandler}>
            <div className='top-5-list-item-background' style={{ backgroundImage: `url(${corporationImage})` }}></div>
            <div className='top-5-list-item-main-box'>
                <div className='top-5-list-item-top'>
                    <div className='top-5-list-item-title'>{title}</div>
                    <div className='top-5-list-item-category'>{devCategoryName}</div>
                </div>
                <div className='top-5-list-item-middle'>
                    <div className='top-5-list-item-techniques'>{techniques}</div>
                </div>
                <div className='top-5-list-item-bottom'>
                    <div className='top-5-list-item-corporation-name'>{corporationName}</div>
                    <div className='top-5-list-item-endDate'>{`마감일 : ${endDate}`}</div>
                </div>
            </div>
        </div>
    )
}