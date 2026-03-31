import React from 'react';
import style from './Button.module.css'

const Button = (props) => {
    return (
        <div className={style['button-container']}>
            <button onClick={()=>props.onButtonClick()}>{props.buttonText}</button>
        </div>
    );
};

export default Button;