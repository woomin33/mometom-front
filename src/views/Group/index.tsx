import React from 'react';
import './style.css';

//          component: 유저 화면 컴포넌트          //
export default function Group(){

    //          render: 유저 화면 컴포넌트 렌더링          //
    return (
        <div id='group'>
            <div className='group-left-container'>
                <div className='group-left-title'>{'내가 가입한 스터디'}</div>
                <nav className='group-left-menu'>
                    <ul className='group-menu'>
                        <li>
                            <a href='/'>{'리액트 스터디'}</a>
                        </li>
                        <li>
                            <a href='/'>{'스프링 스터디'}</a>
                        </li>
                    </ul>
                    <ul className='keyword'>

                    </ul>
                </nav>
            </div>
            <div className='group-right-container'>
                메인
            </div>
        </div>
    )
}
