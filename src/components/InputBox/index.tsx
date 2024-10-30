import React, { ChangeEvent, KeyboardEvent, forwardRef } from 'react'
import './style.css';

//          interface: Input Box 컴포넌트 Properties          //
interface Props{
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: boolean;

    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//          component: Input Box 컴포넌트          //
const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    //          state: properties          //
    const{ label, type, placeholder, value, error, icon, message } = props;
    const{ onChange, onButtonClick, onKeyDown } = props;

    

    //          event handler: input 키 이벤트 처리 함수          //
    const onkeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }

    //          render: Input Box 컴포넌트 렌더링          //
    return (
        <div className='auth-inputbox'>
            <div className='auth-inputbox-lable'>{label}</div>
            <div className={error ? 'auth-inputbox-container-error' : 'auth-inputbox-container'}>
                <input ref={ref} type={type} className='auth-input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onkeyDownHandler}/>
                {onButtonClick !== undefined && (
                <div className='icon-button' onClick={onButtonClick}>
                    <div className={`icon ${icon}`}></div>
                </div>
                )}
            </div>
            {message !== undefined && <div className='auth-inputbox-message'>{message}</div>}
            
        </div>
    )
});

export default InputBox;
