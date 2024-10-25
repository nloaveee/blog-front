import React from 'react';
import './App.css';
import BoardItem from 'components/BoardItem';
import { commentListMock, latestBoardListMock, top3BoardListMock } from 'mocks';
import Top3Item from 'components/Top3Item';
import CommnentItem from 'components/CommentItem';

function App() {
    return (
        <>
            <div style={{padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {commentListMock.map(commentListItem => <CommnentItem commentListItem={commentListItem}/>)}
            </div>
        </>
    );
}

export default App;