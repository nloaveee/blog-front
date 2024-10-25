import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from 'layouts/Footer';
import Main from 'views/Main';
import Authentication from 'views/Authentication';
import Search from 'views/Search';
import User from 'views/User';
import BoardDetail from 'views/Board/Detail';
import BoardWrite from 'views/Board/Write';
import BoardUpdate from 'views/Board/Update';


//           component : Application 컴포넌트          //
function App() {

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
            <Route>

                
            </Route>
            <Route path='/' element={<Main/>}></Route>
            <Route path='/auth' element={<Authentication/>}></Route>
            <Route path='/search' element={<Search/>}></Route>
            <Route path='/user' element={<User/>}></Route>
            <Route path='/board'>
                <Route path='write' element={<BoardWrite />} />
                <Route path='detail/:boardId' element={<BoardDetail />} />
                <Route path='update/:boardId' element={<BoardUpdate />} />
            </Route>
        </Routes>
    );
}

export default App;