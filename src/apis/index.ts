import axios, { AxiosResponse } from 'axios';
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto } from './request/auth';
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from './response/auth';
import { ResponseDto } from './response';
import { getSignInUserResponseDto, GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from './response/user';
import { PatchBoardResquestDto, PostBoardRequestDto, PostCommentRequestDto } from './request/board';
import { PostBoardResponseDto, GetBoardResponseDto, IncreaseViewCountResponseDto, GetFavoriteListResponseDto, GetCommentListResponseDto, DeleteBoardResponseDto, PatchBoardResponseDto, GetLatestBoardListResponseDto, GetTop3BoardListResponseDto, GetSearchBoardListResponseDto, GetUserBoardListResponseDto } from './response/board';
import { GetPopularListResponseDto, GetRelationListResponseDto } from './response/search';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from './request/user';

const responseHandler = <T> (response : AxiosResponse<any, any>) => {
    const responseBody: T =response.data;
    return responseBody;
};

const errorHandler = (error: any) => {
    if (!error.response || !error.response.data) return null;
    const responseBody: ResponseDto = error.response.data;
    return responseBody;
};


const DOMAIN = 'http://localhost:8080';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const authorization = (accessToken: string) => {
    return { headers : { Authorization: `Bearer ${accessToken}`}}
};

export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`    
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;


export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
    .then(responseHandler<SignInResponseDto>)
    .catch (errorHandler);

    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
    .then (responseHandler<SignUpResponseDto>)
    .catch (errorHandler);

    return result;
}

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
    .then (responseHandler<IdCheckResponseDto>)
    .catch (errorHandler);
    return result;
};

export const EmailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
    .then (responseHandler<EmailCertificationResponseDto>)
    .catch (errorHandler);
    return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
    .then (responseHandler<CheckCertificationResponseDto>)
    .catch (errorHandler);
    return result;
};

const GET_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}`;

const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;
const GET_USER_BOARD_LIST_URL = (id: string) => `${API_DOMAIN}/board/user-board-list/${id}`;

const INCREASE_VIEW_COUNT_URL = (boardId : number | string) => `${API_DOMAIN}/board/${boardId}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}/comment-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const POST_COMMENT_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}/comment`;
const PATCH_BOARD_URL =  (boardId: number | string) => `${API_DOMAIN}/board/${boardId}`;
const PUT_FAVORITE_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}/favorite`;
const DELETE_BOARD_URL = (boardId: number | string) => `${API_DOMAIN}/board/${boardId}`;

export const getBoardRequest = async (boardId: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardId))
    .then(response => {
        const responseBody: GetBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 최근 게시물 불러오기 
export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
    .then(response => {
        const responseBody: GetLatestBoardListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
};

// top3 게시물 불러오기 
export const getTop3BoardListRequest = async () => {
    const result = await axios.get(GET_TOP_3_BOARD_LIST_URL())
    .then(response => {
        const responseBody: GetTop3BoardListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
};

// 검색 페이지 
export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord,preSearchWord))
    .then(response => {
        const responseBody: GetSearchBoardListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
};

export const getUserBoardListRequest = async (id:string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(id))
    .then(response => {
        const responseBody: GetUserBoardListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
};

export const IncreaseViewCountRequest = async (boardId: number | string) => {
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardId))
    .then(response => {
        const responseBody: IncreaseViewCountResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 상세 페이지 좋아요 리스트 불러오기
export const getFavoriteListRequest  = async (boardId : number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardId))
    .then(response => {
        const responseBody: GetFavoriteListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 상세 페이지 댓글 리스트 불러오기
export const getCommentListRequest  = async (boardId : number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardId))
    .then(response => {
        const responseBody: GetCommentListResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

export const postBoardRequest = async (requestBody : PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
    .then(response => {
        const responseBody: PostBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 상세 페이지 댓글 삭제
export const postCommentRequest = async (boardId : number | string, requestBody : PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardId), requestBody, authorization(accessToken))
    .then(response => {
        const responseBody: PostBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 수정
export const patchBoardRequest = async (boardId : number | string, requestBody: PatchBoardResquestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardId), requestBody, authorization(accessToken))
    .then(response => {
        const responseBody: PatchBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 상세 페이지 좋아요 삭제
export const PutFavoriteRequest = async (boardId : number | string, accessToken: string) => {
    const result = await axios.put(PUT_FAVORITE_URL(boardId), {}, authorization(accessToken))
    .then(response => {
        const responseBody: PostBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

// 게시물 삭제
export const deleteBoardRequest = async (boardId : number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardId), authorization(accessToken))
    .then(response => {
        const responseBody: DeleteBoardResponseDto =  response.data;
        return responseBody;
    })
    .catch(error => {
        if (!error.response) return null;
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    })
    return result;
}

const GET_POPULAR_LIST_URL = () =>`${API_DOMAIN}/search/popular-list`;
const GET_RELATION_LIST_URL = (searchWord : string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;

// 인기 검색어 리스트 가져오기 
export const getPopularListResquest = async ( ) => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
}

// 연관 검색어 리스트 가져오기 
export const getRelationListResquest = async ( searchWord : string ) => {
    const result = await axios.get(GET_RELATION_LIST_URL(searchWord))
        .then(response => {
            const responseBody: GetRelationListResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
};


const GET_USER_URL = (id:string) => `${API_DOMAIN}/user/${id}`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const PATCH_NICKNAME_URL = () =>  `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

export const getUserRequest = async (id : string) => {
    const result = await axios.get(GET_USER_URL(id))
        .then(response => {
            const responseBody: GetUserResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
};

export const getSignInUserRequest = async (accessToken : string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: getSignInUserResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
}

// 닉네임 수정
export const patchNicknameRequest = async (requestBody : PatchNicknameRequestDto, accessToken : string) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(),requestBody,authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
};

// 프로필 이미지 수정
export const patchProfileImageRequest = async (requestBody : PatchProfileImageRequestDto, accessToken : string) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(),requestBody,authorization(accessToken))
        .then(response => {
            const responseBody: PatchProfileImageResponseDto =  response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
        return result;
};


const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const multipartFormData = {headers : {'Content-Type' : 'multipart/form-data'}};

export const fileUplodRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string =  response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
        return result;
}