import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import './style.css'
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { BoardListItem } from 'types/interface';
import { latestBoardListMock } from 'mocks';
import BoardItem from 'components/BoardItem';
import { BOARD_PATH, BOARD_WRITE_PATH, MAIN_PAHT, USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { fileUplodRequest, getUserRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { PatchProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';

//            component:  유저 화면 컴포넌트               //
export default function User() {

    //            state: useEmail path variable 상태              //
    const {userEmail} = useParams();
    //            state:  마이페이지 여부 상태              //
    const [isMyPage, setMyPage] = useState<boolean>(true);
    //            state:  로그인 유저 상태              //
    const {loginUser}= useLoginUserStore();
    //            state:  쿠키 상태              //
    const [cookies, setCookie]= useCookies();


    //            function : 네비게이트 함수      //
    const navigate = useNavigate();

    //            component:  유저 화면 상단 컴포넌트               //
    const UserTop = () => {

        //            state: 이메일 파일 인풋 참조 상태             //
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        //            state:  닉네임 변경 여부 상태              //
        const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
        //            state:  닉네임 상태              //
        const [nickname, setNickname] = useState<string>('');
        //            state: 변경 닉네임 상태              //
        const [changeNickname, setChangeNickname] = useState<string>('');
        //            state:  프로필 이미지 상태              //
        const [profileImage, setProfileImage] = useState<string | null>(null);

        //          function : get user response 처리 함수          //
        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const {code} = responseBody;
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
                navigate(MAIN_PAHT());
                return;
            }

            const {email, nickname, profileImage} = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImage(profileImage);
            const isMyPage = email === loginUser?.email;
            setMyPage(isMyPage);
        }

        //          function : file upload response 처리 함수          //
        const fileUplodResponse = (profileImage: string | null) => {
            if (!profileImage) return;
            if (!cookies.accessToken) return;

            const requestBody: PatchProfileImageRequestDto = {profileImage};
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
        };

        //          function : patch profile image response 처리 함수          //
        const patchProfileImageResponse = (responseBody:PatchProfileImageResponseDto | ResponseDto | null) => {
            if (!responseBody) return;

            const {code} = responseBody;
            if (code === 'AF') alert('로그인 인증에 실패했습니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다');
            if (code !== 'SU') return;

            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
        };

        //            event handler:  프로필 박스 클릭 이벤트 처리              //
        const onProfileBoxClickHandler = () => {
            if (!isMyPage) return;
            if (!imageInputRef.current) return;
            imageInputRef.current.click();
        }
        //            event handler:  닉네임 수정 버튼 클릭 이벤트 처리              //
        const onNicknameEditButtonClickHandler = () => {
            setChangeNickname(nickname);
            setNicknameChange(!isNicknameChange);
        }

        //            event handler:  프로필 이미지 변경  이벤트 처리              //
        const onProfileImageChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files.length) return;

            const file = event.target.files[0];
            const data = new FormData();
            data.append('file',file);

            fileUplodRequest(data).then(fileUplodResponse);
        };

        //            event handler:  닉네임 변경  이벤트 처리              //
        const onNicknameChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
            const {value} = event.target;
            setChangeNickname(value);
        }

        //            effect:  email path variable 변경시 실행 할 함수              //
        useEffect (() => {
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);

        },[userEmail]);

        //            render: 유저 화면 상단 렌더링                 //
        return (
            <div id='user-top-wrapper'>
                <div className='user-top-container'>
                    {isMyPage ? 
                    <div className='user-top-my-profile-image-box' onClick={onProfileBoxClickHandler}>
                        {
                            profileImage !== null ? 
                            <div className='user-top-profile-image' style={{backgroundImage: `url(${profileImage })`}}></div> :                            
                            <div className='icon-box-large'>
                                <div className='icon image-box-white-icon'></div>
                            </div>                            
                        }
                        
                        <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onProfileImageChangeHandler}/>
                    </div> :
                    <div className='user-top-profile-image-box' style={{backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})`}}></div>
                    }
                    <div className='user-top-info-box'>
                        <div className='user-top-info-nickname-box'>
                            {isMyPage ? 
                                <>
                                {isNicknameChange ?
                                <input className='user-top-info-nickname-input' type='text' size={changeNickname.length + 2} value={changeNickname}  onChange={onNicknameChangeHandler}/> :
                                    <div className='user-top-info-nickname'>{nickname}</div>
                                }
                                
                                <div className='icon-button' onClick={onNicknameEditButtonClickHandler}>
                                    <div className='icon edit-icon'></div>
                                </div> 
                                </> :
                                <div className='user-top-info-nickname'>{nickname}</div>                        
                            }

                        </div>
                        <div className='user-top-info-email'>{'email2@email.com'}</div>
                    </div>
                </div>
            </div>
        )
    }

    //            component:  유저 화면 하단 컴포넌트               //
    const UserBottom = () => {

    //            state:  게시물 개수 상태              //
    const [count, setCount] = useState<number>(2);
    //            state:  게시물 리스트 상태 (임시)              //
    const [userBoardList, setUserBoardList] = useState<BoardListItem[]>([]);

    //          event handler : side card 클릭 이벤트 처리       //
    const onSideCardClickHandler = () => {
        if (isMyPage) navigate(BOARD_PATH() + '/' + BOARD_WRITE_PATH());
        else if (loginUser) {
            navigate(USER_PATH(loginUser.email));
        }
    }


    //           effect : userEmail path variable이 변경될 때 마다 실행될 함수       //
    useEffect (()=> {
        setUserBoardList(latestBoardListMock);
    }, [userEmail]);


        //            render: 유저 화면 하단 렌더링                 //
        return (
            <div id='user-bottom-wrapper'>
                <div className='user-bottom-container'>
                    <div className='user-bottom-title'>{isMyPage ? '내 게시물 ' : '게시물 '}<span className='emphasis'>{count}</span></div>
                    <div className='user-bottom-contents-box'>
                        {count === 0 ?
                        <div className='user-bottom-contents-nothing'>{'게시물이 없습니다.'}</div> :
                        <div className='user-bottom-contents'>
                            {userBoardList.map(boardListItem => <BoardItem boardListItem={boardListItem} />)}
                        </div>
                        }
                        <div className='user-bottom-side-box'>
                            <div className='user-bottom-side-card' onClick={onSideCardClickHandler}>
                                <div className='user-bottom-side-container'>
                                    {isMyPage ?
                                    <>
                                        <div className='icon-box'>
                                            <div className='icon edit-icon'></div>
                                        </div>
                                        <div className='user-bottom-side-text'>{'글쓰기'}</div>
                                    </>:
                                    <>
                                        <div className='user-bottom-side-text'>{'내 게시물로 가기'}</div>
                                        <div className='icon-box'>
                                            <div className='icon arrow-right-icon'></div>
                                        </div>
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-bottom-pagination-box'></div>
                </div>
            </div>
        )
    }

    //            render: 유저 화면 렌더링                 //
    return (
    <>
        <UserTop />
        <UserBottom />
    </>
    )
}
