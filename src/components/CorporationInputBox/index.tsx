import React, { ChangeEvent, KeyboardEvent, forwardRef } from 'react'
import './style.css';

//          interface: Corporation Input Box 컴포넌트 Properties          //
interface Props{
    icon?: 'eye-light-off-icon' | 'eye-light-on-icon' | 'expand-right-light-icon';
    label: string;
    type: 'text' | 'textarea';
    placeholder: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    error: boolean;
    

    onButtonClick?: () => void;

    message?: string;

    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

//          component: Location Input Box 컴포넌트          //
const CorporationInputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

    //          state: properties          //
    const{ icon, label, type, placeholder, value, error, message } = props;
    const{ onChange, onButtonClick, onKeyDown } = props;

    //          event handler: input 키 이벤트 처리 함수          //
    const onkeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if(!onKeyDown) return;
        onKeyDown(event);
    }
    //          render: Location Input Box 컴포넌트 렌더링          //
    return (
        <div className='corporationInputbox'>
            <div className='inputbox-label'>{label}</div>
            <div className={error ? 'inputbox-container-error' : 'inputbox-container'}>  
                <input ref={ref} type={type} className='input' placeholder={placeholder} value={value} onChange={onChange} onKeyDown={onkeyDownHandler}/>
                {onButtonClick !== undefined && (
                    <div className='icon-button' onClick={onButtonClick}>
                        <div className={`icon ${icon}`}></div>
                    </div>
                )}
            </div>
        </div>
    )
});


export default CorporationInputBox;