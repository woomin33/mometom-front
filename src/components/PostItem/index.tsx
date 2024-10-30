import React, { useEffect, useState } from 'react'
import './style.css';
import LocationItemList from 'types/interface/corporation-list-item.interface'
import { useNavigate } from 'react-router-dom';
import { NOTICE_DETAIL_PATH, NOTICE_PATH, POST_DETAIL_PATH, POST_PATH } from 'constant';
import { NoticeListItem } from 'types/interface';
import PostListItem from 'types/interface/post-list-item.interface';
import defaultProfileImage from 'assets/image/default-profile-image.png'

interface Props{
    postItem: PostListItem
}

//          component: Location Item 컴포넌트          //
export default function PostItem({ postItem }: Props) {

    //          properties          //
    const { postNumber, title, content, commentCount, viewCount, writeDatetime,
        writerEmail, writerNickname, writerProfileImage
    } = postItem;

    
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    const date = new Date('2024-06-17T16:42:39');
    const formattedDate = date.toLocaleDateString('ko-KR');
    

    
    //          event handler: 장소 클릭 이벤트 처리          //
    const onPostItemClickHanlder = () => {
        navigate(POST_PATH() + '/' + POST_DETAIL_PATH(postNumber));
    }
    //          render: Location Item 컴포넌트 렌더링          //
    
    return (
        <div className='post-item' >
            <div className='post-item-title'><span className='post-title' onClick={onPostItemClickHanlder}>{title}</span></div>
            <div className='post-item-reg-date'>{writeDatetime.substring(0, 10)}</div>
            <div className='post-item-view-count'>{viewCount}</div>
            <div className='post-item-comment-count'>{commentCount}</div>
            <div className='post-list-item-write-box'>
                <div className='board-list-item-nickname'>{writerNickname}</div>
                <div className='post-list-item-profile-box'>
                    <div className='post-list-item-profile-image' style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : defaultProfileImage})` }}></div>
                </div>
            </div>
        </div>
    )
}
