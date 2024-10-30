import React from 'react'
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
export default function EmployItem({ noticeItem }: Props) {

    //          properties          //
    const { noticeNumber, title, endDate, registrationDate, applicationCount, corporationNumber,
        devCategoryNumber, devCategoryName, corporationImage, corporationName, techniques
    } = noticeItem;

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    //          event handler: 장소 클릭 이벤트 처리          //
    const onNoticeItemClickHanlder = () => {
        navigate(NOTICE_PATH() + '/' + NOTICE_DETAIL_PATH(noticeNumber));
    }
    //          render: Location Item 컴포넌트 렌더링          //
    return (
        <div className='employ-item' onClick={onNoticeItemClickHanlder}>

            <div className='employ-item-image-box'>
                <div className='employ-item-image' style={{ backgroundImage: `url(${corporationImage ? corporationImage : defaultProfileImage})` }}></div>
            </div>
            <div className='employ-item-introduction-box'>
                <div className='locemploytion-item-name'>{title}</div>
                <div className='employ-item-introduction'>{corporationName}</div>
            </div>
        </div>
    )
}
