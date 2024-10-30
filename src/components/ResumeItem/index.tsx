import React, { useEffect, useState } from 'react'
import './style.css';
import LocationItemList from 'types/interface/corporation-list-item.interface'
import defaultProfileImage from './main-image-1.png'
import { useNavigate } from 'react-router-dom';
import { NOTICE_DETAIL_PATH, NOTICE_PATH } from 'constant';
import { NoticeListItem } from 'types/interface';
import ResumeListItem from 'types/interface/resume-list.item.interface';

interface Props{
    resumeItem: ResumeListItem
}

//          component: Location Item 컴포넌트          //
export default function ResumeItem({ resumeItem }: Props) {

    //          properties          //
    const { resumeNumber, title, name, contanctNumber, mail, introduce, writeDatetime
        
    } = resumeItem;

    //          state: d-day 상태          //
    const [dDay, setDDay] = useState<number | null>(null);
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    //          event handler: 장소 클릭 이벤트 처리          //
    const onNoticeItemClickHanlder = () => {
        
    }
    //          render: Location Item 컴포넌트 렌더링          //
    
    return (
        <div className='resume-item' onClick={onNoticeItemClickHanlder}>
            <div className='resume-item-title'>{title}</div>
            <div className='resume-item-introduce'>{introduce}</div>
            <div className='resume-item-bottom-box'>
                <div className='resume-item-date'>{writeDatetime.substring(0, 10)}</div>
                <div className='resume-item-name'>{name}</div>
            </div>
        </div>
    )
}
