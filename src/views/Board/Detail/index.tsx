import React, { useEffect, useState } from 'react'
import './style.css'
import { CommentListItem, FavoriteListItem } from 'types/interface';
import { commentListMock, favoriteListMock } from 'mocks';
import FavoriteItem from 'components/FavoriteItem';
import CommnentItem from 'components/CommentItem';
import Pagination from 'components/Pagination';

//            component: 게시물 상세 화면 컴포넌트                  //
export default function BoardDetail() {


    //            component: 게시물 상세 상단 컴포넌트                  //
    const BoardDetailTop = () => {

        //            render:  게시물 상세 상단 렌더링                //
        return (
            <div id='board-detail-top'>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>{'오늘 점심 뭐먹지 맛있는거 먹고 싶은데 추천 부탁'}</div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-info-box'>
                            <div className='board-detail-writer-profile-image'></div>
                            <div className='board-detail-writer-nickname'>{'안녕하세요나는홍길동'}</div>
                            <div className='board-detail-info-divider'>{"\|"}</div>
                            <div className='board-detail-wirte-date'>{'2023.03.23'}</div>
                        </div>
                        <div className='icon-button'>
                            <div className='icon more-icon'></div>
                        </div>
                        <div className='board-detail-more-box'>
                            <div className='board-detail-update-button'>{'수정'}</div>
                            <div className='divider'></div>
                            <div className='board-detail-delete-button'>{'삭제'}</div>
                        </div>
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-top-text'>{'오늘 점심을 뭐먹을 지 너무 고민이 되는데 뭐 먹을까? 나 점심때 오늘 뭐먹을 지 너무 고민이 되는데 뭐 먹을까?'}</div>
                    <div className='board-detail-top-image'></div>
                </div>
            </div>
        );
    };

    //            component: 게시물 상세 하단 컴포넌트                  //
    const BoardDetailBottom = () => {

        const [favoriteList, setFavoriteList] = useState<FavoriteListItem[]>([]);
        const [commentList, setCommentList] = useState<CommentListItem[]>([]);

        useEffect(() => {
            setFavoriteList(favoriteListMock);
            setCommentList(commentListMock);
        }, []);

        //            render:  게시물 상세 하단 렌더링                //
        return (
            <div id='board-detail-bottom'>
                <div className='board-detail-bottom-button-box'>
                    <div className='board-detail-bottom-buttton-group'>
                        <div className='icon-button'>
                            <div className='icon favorite-fill-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`좋아요 ${12}`}</div>
                        <div className='icon-button'>
                            <div className='icon up-light-icon'></div>
                        </div>
                    </div>
                    <div className='board-detail-bottom-buttton-group'>
                        <div className='icon-button'>
                            <div className='icon comment-icon'></div>
                        </div>
                        <div className='board-detail-bottom-button-text'>{`댓글 ${12}`}</div>
                        <div className='icon-button'>
                            <div className='icon up-light-icon'></div>
                        </div>
                    </div>
                </div>
                <div className='board-detail-bottom-favorite-box'>
                    <div className='board-detail-bottom-favorite-container'>
                        <div className='board-detail-bottom-favorite-title'>{'좋아요'}<span className='emphasis'>{12}</span></div>
                        <div className='board-detail-bottom-favorite-contents'>
                            {favoriteList.map(item => <FavoriteItem favoriteListItem={item}/>)}
                        </div>
                    </div>
                </div>
                <div className='board-detail-bottom-comment-box'>
                    <div className='board-detail-bottom-comment-container'>
                        <div className='board-detail-bottom-comment-title'>{'댓글'}<span className='emphasis'>{12}</span></div>
                        <div className='board-detail-bottom-comment-list-container'>
                            {commentList.map(item => <CommnentItem commentListItem={item}/>)}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='board-detail-bottom-comment-pagination-box'>
                        <Pagination/>
                    </div>
                    <div className='board-detail-bottom-comment-input-container'>
                        <div className='board-detail-bottom-comment-input-container'>
                            <textarea className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요'/>
                            <div className='board-detail-bottom-comment-button-box'>
                                <div className='disable-button'>{'댓글달기'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    //            render:  게시물 상세 화면 렌더링                //
    return (
    <div id='board-detail-wrapper'>
        <div className='board-detail-container'>

        </div>
    </div>
    );
};
