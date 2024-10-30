import React from 'react';
import './style.css';

//          component: 푸터 레이아웃          //
export default function Footer() {
  //          render: 푸터 레이아웃 렌더링          //
  return (
    <div id='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo-box'>
            {/* <div className='icon-box'>
              <div className='icon logo-light-icon'></div>
            </div> */}
            <div className='footer-logo-text'>{ 'Momentom' }</div>
          </div>
          
          <div className='footer-link-box'>
            <div className='footer-email-link'>{ 'woomin013@gmail.com' }</div>
            <div className='icon-button'>
              <div className='icon github-icon'></div>
            </div>
            <div className='icon-button'>
            <div className='icon naver-blog-icon'></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
