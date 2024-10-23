import React from 'react';
import './style.css';

    //           component :  Board List Item 컴포넌트        //
export default function BoardListItem() {

    //            render :  Board List Item 컴포넌트 렌더링       //
    return (
        <div className= 'board-list-item'>
            <div className= 'board-list-item-main-box'>
                <div className= 'board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(C:\Users\nloav\OneDrive\Desktop\cat-8266486_1280.jpg)`}}></div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>{'안녕하세요'}</div>
                        <div className='board-list-item-write-datetime'>{'2022.04.12'}</div>
                    </div>
                </div>
                <div className= 'board-list-item-middle'>
                    <div  className= 'board-list-item-title'>{'오늘 점심 뭐먹지 맛있는거 먹고 싶은데....'}</div>
                    <div  className= 'board-list-item-content'>{'오늘 점심을 뭐먹을 지 너무 고민이 되는데 뭐 먹을까? 오늘 점심을 뭐먹을 지 너무 고민이 되는데 뭐 먹을까?  오늘 점심을 뭐먹을 지 너무 고민이 되는데 뭐 먹을까?'}</div>
                </div>
                <div className= 'board-list-item-bottom'>
                    <div className= 'board-list-item-counts'>
                        {`댓글 0. 좋아요 0. 조회수 0`}
                    </div>
                </div>
            </div>
            <div className= 'board-list-item-image-box'>
                <div  className= 'board-list-item-image' style={{backgroundImage: `url(C:\Users\nloav\OneDrive\Desktop\cat-7245850_1280.jpg)`}}></div>
            </div>
        </div>
    )

}