import { Route, Routes } from 'react-router-dom';
import './App.css';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import UserP from 'views/User';
import BoardDetail from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';
import Container from 'layouts/Container';
import { AUTH_PAHT, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_UPDATE_PATH, BOARD_WRITE_PATH, MAIN_PAHT, SEARCH_PATH, USER_PATH } from 'constant';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useLoginUserStore } from 'stores';
import { getSignInUserRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import GetSignInUserResponseDto from 'apis/response/user/get-sign-in-user.response.dto';
import { User } from 'types/interface';



//           component : Application 컴포넌트          //
function App() {
    
    //          state: 로그인 유저 전역 상태           //
    const { setLoginUser, resetLoginUser } = useLoginUserStore();
    //          state: cookie 상태           //
    const [cookies, setCookies] = useCookies();

    const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
        if (!responseBody) return;
        const { code } = responseBody;
        if (code === 'AF' || code === 'NU' || code === 'DBE' ) {
            resetLoginUser();
            return;
        } 

        const loginUser: User ={...(responseBody as GetSignInUserResponseDto)};
        setLoginUser(loginUser);
    }

    //           effect : accessToken cookie 값이 변경될 때 마다 실행할 함수             //
    useEffect(() => {
        if (!cookies.accessToken) {
            resetLoginUser();
            return;
        }
        getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
    }, [cookies.accessToken]);



    //           render : Application 컴포넌트 렌더링          //
    // description : 메인 화면 : '/' - Main //
    // description : 로그인 + 회원가입 화면 : '/auth' - Authentication //
    // description : 검색 화면 : '/search/:searchWord'  - Search //
    // description : 유저 페이지 : '/user/:userEmail'  - User //
    // description : 게시물 상세보기 : '/board/detail/:boardId'  - BoardDetail //
    // description : 게시물 작성하기 : '/board/write'  - BoardWrite //
    // description : 게시물 수정하기 : '/board/update/:boardId'  - BoardUpdate //
    return (
        <Routes>
            <Route element={<Container/>}>
                <Route path={MAIN_PAHT()} element={<Main/>}></Route>
                <Route path={AUTH_PAHT()} element={<Authentication/>}></Route>
                <Route path={SEARCH_PATH(':searchWord')} element={<Search/>}></Route>
                <Route path={USER_PATH(':userEmail')} element={<UserP/>}></Route>
                <Route path={BOARD_PATH()}>
                    <Route path={BOARD_WRITE_PATH()} element={<BoardWrite />} />
                    <Route path={BOARD_DETAIL_PATH(':boardId')} element={<BoardDetail />} />
                    <Route path={BOARD_UPDATE_PATH(':boardId')} element={<BoardUpdate />} />
                </Route>                
            </Route>
            <Route path='*' element={<h1>404 Not Fonund</h1>}/>
        </Routes>
    );
}

export default App;