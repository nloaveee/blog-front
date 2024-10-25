export const MAIN_PAHT = () => '/';
export const AUTH_PAHT = () => '/auth';
export const SEARCH_PATH = (searchWord: string) => '/search/${searchWord}';
export const USER_PATH = (userEmail: string) => `/user/${userEmail}`;
export const BOARD_PATH = () => '/board';
export const BOARD_DETAIL_PATH = (boardId: string | number) => `detail/${boardId}`;
export const BOARD_WRITE_PATH = () => 'write';
export const BOARD_UPDATE_PATH = (boardId: string | number) => `update/${boardId}`;
