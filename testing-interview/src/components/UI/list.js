import React from 'react';
import style from './list.module.css';

const list = (props) => {
    return (
        <div className={style['list-container']}>
            <li>{props.listText}</li>
        </div>
    );
};

export default list;