import React, { ChangeEvent, useRef, useState, KeyboardEvent, useEffect } from 'react'
import './style.css'
import { useNavigate, useParams } from 'react-router-dom'
import { MAIN_PAHT, SEARCH_PATH } from 'constant';

//           component : header layout 컴포넌트         //
export default function Header() {

    //           function : 네비게이트 함수         //
    const navigate = useNavigate();

    //           event handler : 로고 클릭 이벤트 처리 함수          //
    const onLogoClickHandler = () => {
        navigate(MAIN_PAHT());
    }

    //           component : 검색 버튼 컴포넌트          //
    const SearchButton = () => {

        //           state : 검색 버튼 요소 참조 상태          //
        const searchButtonRef = useRef<HTMLDivElement | null>(null);

        //           state : 검색 버튼 상태          //
        const [status, setStatus] = useState<boolean>(false);

        //           state : 검색 상태          //
        const [ word, setWord] = useState<string>('');

        //           state : 검색어 path variable 상태          //
        const { searchWord } = useParams();

        //           event handler : 검색 변경 이벤트 처리 함수          //
        const onSearchWordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setWord(value);
        }

        //           event handler : 검색 키 이벤트 처리 함수          //
        const onSearchWordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== 'Enter') return;
            if (!searchButtonRef.current) return;
            searchButtonRef.current.click();
        };

        //           event handler : 검색 버튼 클릭 이벤트 처리 함수          //
        const onSearchButtonClickHandler = () => {
            if(!status) {
                setStatus(!status);
                return;
            }
            navigate(SEARCH_PATH(word));
        };

        //          effect: 검색어 path variable 변경 될때 마다 실행될 함수           //
        useEffect (() => {
            if (searchWord) {
                setWord(searchWord);
                setStatus(true);
            } 
        },[searchWord]);

        

        if (!status)
        //           render : 검색 버튼 검포넌트 렌더링 (클릭 false 상태)          // 
        return (
            <div className='icon-button' onClick={onSearchButtonClickHandler}>
                <div className='icon search-light-icon'></div>
            </div>
        );
        //           render : 검색 버튼 검포넌트 렌더링 (클릭 true 상태)           //
        return (
            <div className='header-search-input-box'>
                <input className='header-search-input' type='text' placeholder='검색어를 입력해주세요.' value={word} onChange={onSearchWordChangeHandler} onKeyDown={onSearchWordKeyDownHandler}/>
                <div ref={searchButtonRef} className='icon-button' onClick={onSearchButtonClickHandler}>
                    <div className='icon search-light-icon'></div>
                </div>
            </div>
        );

    }

    //           render : header layout 렌더링          //
    return (
    <div id='header'>
        <div className='header-container'>
            <div className='header-left-box' onClick={onLogoClickHandler}>
                <div className='icon-box'>
                    <div className='icon logo-dark-icon'></div>
                </div>
                <div className='header-logo'>{'hyeon Board'}</div>
            </div>
            <div className='header-right-box'>
                <SearchButton/>
            </div>
        </div>
    </div>
    )
}
