import React from 'react';
import './style.css';
import blogImage from './assets/blog-info.png';
import communityImage from './assets/comunity.png'
import studyImage from './assets/study.png'
import employImage from './assets/employement.png'


//          component: 메인 화면 컴포넌트          //
export default function Main(){
    //          render: 메인 화면 컴포넌트 렌더링          //
    return (
        <div id='main'>
            <div className='main-image-box'></div>
            <div className='main-container'>
                <div className='main-info-box'>
                    <div className='main-info-text-box'>
                        <div className='main-info-title'>{'블로그'}</div>
                        <div className='main-info-text'>{'지식을 기록하고 공유하세요'}</div>
                        <div className='white-button-rectangle'>{'블로그 바로가기'}</div>
                    </div>
                    <img src={blogImage} className='image-box'></img>
                </div>
                <div className='main-info-box'>
                    <img src={communityImage} className='image-box'></img>
                    <div className='main-info-text-box'>
                        <div className='main-info-title'>{'커뮤니티'}</div>
                        <div className='main-info-text'>{'문제를 공유하고 함께 해결해나가세요'}</div>
                        <div className='white-button-rectangle'>{'커뮤니티 바로가기'}</div>
                    </div>
                </div>
                <div className='main-info-box'>
                    <div className='main-info-text-box'>
                        <div className='main-info-title'>{'스터디'}</div>
                        <div className='main-info-text'>{'같은 목표를 가진 사람들과 함께 성장하세요'}</div>
                        <div className='white-button-rectangle'>{'스터디 바로가기'}</div>
                    </div>
                    <img src={studyImage} className='image-box'></img>
                </div>
                <div className='main-info-box'>
                    <img src={employImage} className='image-box'></img>
                    <div className='main-info-text-box'>
                        <div className='main-info-title'>{'채용'}</div>
                        <div className='main-info-text'>{'당신에게 맞는 회사를 찾아 지원해보세요'}</div>
                        <div className='white-button-rectangle'>{'채용 바로가기'}</div>
                    </div>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
    )
}