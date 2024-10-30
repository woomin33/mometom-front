import React, { useEffect, useState } from 'react'
import './style.css';
import LocationItemList from 'types/interface/corporation-list-item.interface'
import defaultProfileImage from './main-image-1.png'
import { useNavigate } from 'react-router-dom';
import { NOTICE_DETAIL_PATH, NOTICE_PATH } from 'constant';
import { NoticeListItem } from 'types/interface';

interface Props{
    noticeItem: NoticeListItem
}

//          component: Location Item 컴포넌트          //
export default function NoticeItem({ noticeItem }: Props) {

    //          properties          //
    const { noticeNumber, title, endDate, registrationDate, applicationCount, corporationNumber,
        devCategoryNumber, devCategoryName, corporationImage, corporationName, techniques
    } = noticeItem;

    //          state: d-day 상태          //
    const [dDay, setDDay] = useState<number | null>(null);
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    

    // Function: D-Day 계산 함수
    const calculateDDay = (endDate: string): number => {
        const today = new Date();
        const end = new Date(endDate);
        const timeDifference = end.getTime() - today.getTime();
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return dayDifference;
    };

    // Effect: 컴포넌트가 마운트될 때 D-Day 계산
    useEffect(() => {
        if(!noticeItem) return;
        if(!endDate) return;
        const dDayValue = calculateDDay(endDate);
        setDDay(dDayValue);
    }, [endDate]);

    
    //          event handler: 장소 클릭 이벤트 처리          //
    const onNoticeItemClickHanlder = () => {
        navigate(NOTICE_PATH() + '/' + NOTICE_DETAIL_PATH(noticeNumber));
    }
    //          render: Location Item 컴포넌트 렌더링          //
    
    return (
        <div className='notice-item' onClick={onNoticeItemClickHanlder}>
            <div className='notice-item-corporation-name'>{corporationName}</div>
            <div className='locemploytion-item-name'>{title}</div>
            <div className='notice-item-bottom-box'>
                <div className='notice-item-techniques'>{techniques}</div>
                <div className='notice-item-end-date'>
                    {dDay !== null && (
                        dDay > 0 ? `D-${dDay}` : dDay === 0 ? '오늘마감' : `D-${Math.abs(dDay)}`
                    )}
                </div>
            </div>
        </div>
    )
}
