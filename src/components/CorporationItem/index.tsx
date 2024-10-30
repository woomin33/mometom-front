import React from 'react'
import './style.css';
import LocationItemList from 'types/interface/corporation-list-item.interface'
import defaultProfileImage from './main-image-1.png'
import { useNavigate } from 'react-router-dom';
import {  } from 'constant';
import CorporationListItem from 'types/interface/corporation-list-item.interface';

interface Props{
    corporationItem: CorporationListItem
}

//          component: Location Item 컴포넌트          //
export default function CorporationItem({ corporationItem }: Props) {

    //          properties          //
    const { corporationNumber, name, introduction, firstImage} = corporationItem;

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();
    
    //          event handler: 장소 클릭 이벤트 처리          //
    const onLocationItemClickHanlder = () => {
        
    }
    //          render: Location Item 컴포넌트 렌더링          //
    return (
        <div className='location-item' onClick={onLocationItemClickHanlder}>
            <div className='location-item-name-box'>
                <div className='location-item-name'>{name}</div>
                
            </div>
            <div className='location-item-image-box'>
                <div className='location-item-image' style={{ backgroundImage: `url(${firstImage ? firstImage : defaultProfileImage})` }}></div>
            </div>
            <div className='location-item-introduction-box'>
                <div className='location-item-introduction'>{introduction}</div>
            </div>
        </div>
    )
}
