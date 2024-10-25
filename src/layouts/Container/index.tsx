import { Outlet, useLocation } from 'react-router-dom'
import Header from 'layouts/Header'
import Footer from 'layouts/Footer'
import React from 'react'
import { AUTH_PAHT } from 'constant';

//           component : Container layout 컴포넌트         //
export default function Container() {

    //           state: 현재 페이지 path name 상태           //
    const {pathname} = useLocation();

    //           render : Container layout 렌더링          //
    return (
        <>
            <Header/>
            <Outlet/>
            {pathname !== AUTH_PAHT() && <Footer/>}
            
        
        </>
    )
}
