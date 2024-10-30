import React, { ChangeEvent, KeyboardEvent, forwardRef } from 'react'
import './style.css';

//          interface: Corporation Input Box 컴포넌트 Properties          //
interface Props{
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    label: string;
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    error: boolean;
    

    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

//          component: Location Input Box 컴포넌트          //
const CorporationTextAreaBox = forwardRef<HTMLTextAreaElement, Props>((props: Props, ref) => {

    //          state: properties          //
    const{ icon, label, placeholder, value, error, message } = props;
    const{ onChange, onButtonClick, onKeyDown } = props;

    //          event handler: input 키 이벤트 처리 함수          //
    const onkeyDownHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }
    //          render: Location Input Box 컴포넌트 렌더링          //
    return (
        <div className='corporationTextareabox'>
            <div className='textareabox-label'>{label}</div>
            <div className={error ? 'textareabox-container-error' : 'textareabox-container'}>  
                <textarea ref={ref}  className='textarea' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onkeyDownHandler}/>
                {onButtonClick !== undefined && (
                    <div className='icon-button' onClick={onButtonClick}>
                        <div className={`icon ${icon}`}></div>
                    </div>
                )}
            </div>
        </div>
    )
});


export default CorporationTextAreaBox;