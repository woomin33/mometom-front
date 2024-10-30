import axios from "axios";
import { SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { SignInResponseDto, SingUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import { GetSignInUserResponseDto, GetUserResponseDto, PatchUserProfileImageResponseDto } from "./response/user";
import { PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto } from "./request/board";
import { PostBoardResponseDto, GetBoardResponseDto, GetUserBoardListResponseDto, IncreaseViewCountResponseDto, GetFavoriteListResponseDto, GetCommentListResponseDto, PutFavoriteResponseDto, PostCommentResponseDto, DeleteBoardResponseDto, PatchBoardResponseDto, GetLatestBoardListResponseDto, GetPopularityBoardListResponseDto, GetMostViewedBoardListResponseDto, GetSearchBoardListResponseDto, GetUserBoardCategoryResponseDto } from "./response/board";
import { error } from "console";
import { GetCategoryResponseDto, GetSelectedCategoryResponseDto, GetTechniqueResponseDto } from "./response/category";
import { PostCategoryRequestDto } from "./request/category";
import { PostCorporationRequestDto } from "./request/corporation";
import { GetCorporationResponseDto, PostCorporationResponseDto, GetCorporationListResponseDto } from "./response/corporation";
import GetDevCategoryResponseDto from "./response/category/get-devcategory.response.dto";
import { GetNoticeListResponseDto, PostNoticeResponseDto } from "./response/notice";
import { PostNoticeRequestDto } from "./request/notice";
import { PatchUserProfileImageRequestDto } from "./request/user";
import GetTop5NoticeListResponseDto from "./response/notice/get-top5-notice-list.response.dto";
import GetNoticeResponseDto from "./response/notice/get-notice.response.dto";
import GetPostResponseDto from "./response/post/get-post.response.dto";
import PostPostResponseDto from "./response/post/post-post.response.dto";
import { GetSearchPostListRequestDto, PostPostRequestDto } from "./request/post";
import GetPostListResponseDto from "./response/post/get-post-list.response.dto";
import GetSearchPosListResponseDto from "./response/post/get-search-post-list.response.dto";
import { GetPopularListResponseDto } from "./response/search";
import { PostResumeRequestDto } from "./request/resume";
import { PostResumeResponseDto } from "./response/resume";
import GetUserResumeListResponseDto from "./response/resume/get-user-resume-list.response.dto";




const DOMAIN = 'http://localhost:4000';

const authorization = (accessToken: string) => {
    return { headers: { Authorization: `Bearer ${accessToken}` } }
};

const API_DOMAIN = `${DOMAIN}/api/v1`;

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (error.response) {
                console.log("Server responded with non-success status");
                console.log(error.response.data);
            } else if (error.request) {
                console.log("No response received from the server");
            } else {
                console.log("Error setting up the request", error.message);
            }
            
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SingUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (error.response) {
                console.log("Server responded with non-success status");
                console.log(error.response.data);
            } else if (error.request) {
                console.log("No response received from the server");
            } else {
                console.log("Error setting up the request", error.message);
            }
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_POPULARITY_BOARD_LIST_URL = () => `${API_DOMAIN}/board/popularity-list`;
const GET_MOSTVIEWED_BOARD_LIST_URL = () => `${API_DOMAIN}/board/mostviewed-list`;
const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-board-list/${email}`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord : string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord: ''}`;
const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;
const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`;
const DELETE_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const GET_USER_BOARD_CATEGORY_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-board-category/${email}`;


export const getBoardRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getLatestBoardListRequest = async (requestBody: PostCategoryRequestDto) => {
    const result = await axios.post(GET_LATEST_BOARD_LIST_URL(), requestBody)
        .then(response => {
            const responseBody: GetLatestBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getPopularityBoardListRequest = async (requestBody: PostCategoryRequestDto) => {
    const result = await axios.post(GET_POPULARITY_BOARD_LIST_URL(), requestBody)
        .then(response => {
            const responseBody: GetPopularityBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getMostViewedBoardListRequest = async (requestBody: PostCategoryRequestDto) => {
    const result = await axios.post(GET_MOSTVIEWED_BOARD_LIST_URL(), requestBody)
        .then(response => {
            const responseBody: GetMostViewedBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getUserBoardListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(email))
        .then(response => {
            const responseBody: GetUserBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getUserBoardCategoryListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_BOARD_CATEGORY_LIST_URL(email))
        .then(response => {
            const responseBody: GetUserBoardCategoryResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getSearchBoardListRequest = async (searchWord: string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord))
        .then(response => {
            console.log(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord ))
            const responseBody: GetSearchBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const increaseViewCountRequest = async (boardNumber: number | string) =>{
    const result = await axios.get(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    
    return result;
}

export const getFavoriteListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetFavoriteListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetCommentListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {

            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const patchBoardRequest =async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string) =>{
    const result = await axios.put(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PutFavoriteResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_URL(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result; 
}

const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user/`;
const PATCH_USER_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

export const getUserRequest = async (email: string) => {
    const result = await axios.get(GET_USER_URL(email))
        .then(response => {
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const patchUserProfileImageRequest = async (requestBody: PatchUserProfileImageRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_USER_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchUserProfileImageResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const FILE_DOMAIN = `${DOMAIN}/file`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const FILE_UPLOAD_LOCATION_URL = () => `${FILE_DOMAIN}/upload/location`;

const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' } };

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        })
    return result;
}

export const fileUploadLocationRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_LOCATION_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            
            return null;
        })
    return result;
}

const GET_CATEGORY_URL = () => `${API_DOMAIN}/category/blog`;
const GET_SELECTED_CATEGORY_URL = (boardNumber: number | string) => `${API_DOMAIN}/category/${boardNumber}/selected-category`;
const GET_DEVCATEGORY_URL = () => `${API_DOMAIN}/category/employ`;
const GET_TECHNIQUE_URL = () => `${API_DOMAIN}/category/notice`;

export const getCategoryRequest = async () => {
    const result = await axios.get(GET_CATEGORY_URL())
        .then(response => {
            const responseBody: GetCategoryResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getSelectedCategoryRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_SELECTED_CATEGORY_URL(boardNumber))
        .then(response => {
            const responseBody: GetSelectedCategoryResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getDevCategoryRequest = async () => {
    const result = await axios.get(GET_DEVCATEGORY_URL())
        .then(response => {
            const responseBody: GetDevCategoryResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTechniqueRequest = async () => {
    const result = await axios.get(GET_TECHNIQUE_URL())
        .then(response => {
            const responseBody: GetTechniqueResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


const GET_CORPORATION_URL = (corporationNumber: number | string) => `${API_DOMAIN}/corporation/${corporationNumber}`;
const GET_USER_CORPORATION_URL = (email: string) => `${API_DOMAIN}/corporation/user-corporation/${email}`;
const GET_CORPORATION_LIST_URL = () => `${API_DOMAIN}/corporation/corporation-list`;
const POST_CORPORATION_URL = () => `${API_DOMAIN}/corporation`;

export const getCorporationRequest = async (corporationNumber: number | string) => {
    const result = await axios.get(GET_CORPORATION_URL(corporationNumber))
        .then(response => {
            const responseBody: GetCorporationResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getUserCorporationRequest = async (email: string) => {
    const result = await axios.get(GET_USER_CORPORATION_URL(email))
        .then(response => {
            const responseBody: GetCorporationResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getCorporationListRequest = async () => {
    const result = await axios.get(GET_CORPORATION_LIST_URL())
        .then(response => {
            const responseBody: GetCorporationListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const postCorporationRequest = async (requestBody: PostCorporationRequestDto, accessToken: string) => {
    const result = await axios.post(POST_CORPORATION_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCorporationResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_NOTICE_URL = (noticeNumber: number | string) => `${API_DOMAIN}/notice/${noticeNumber}`;
const GET_NOTICE_LIST_URL = (devCategoryNumber: number | string) => `${API_DOMAIN}/notice/category/${devCategoryNumber}`;
const GET_DEV_NOTICE_LIST_URL = (noticeNumber: number | string, devCategoryName: number | string) => `${API_DOMAIN}/notice/devNoticeList/${noticeNumber}?devCategoryName=${devCategoryName}`;
const GET_TOP5_NOTICE_LIST_URL = () => `${API_DOMAIN}/notice/top-5`;
const POST_NOTICE_URL = (corporationNumber: number | string) => `${API_DOMAIN}/notice/${corporationNumber}`;


export const getNoticeRequest = async (noticeNumber: number | string) => {
    const result = await axios.get(GET_NOTICE_URL(noticeNumber))
        .then(response => {
            const responseBody: GetNoticeResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getNoticeListRequest = async (devCategoryNumber: number | string) => {
    const result = await axios.get(GET_NOTICE_LIST_URL(devCategoryNumber))
        .then(response => {
            const responseBody: GetNoticeListResponseDto = response.data;
            console.log(responseBody)
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getDevNoticeListRequest = async (noticeNumber : number | string, devCategoryName: number | string) => {
    const result = await axios.get(GET_DEV_NOTICE_LIST_URL(noticeNumber, devCategoryName))
        .then(response => {
            const responseBody: GetNoticeListResponseDto = response.data;
            console.log(responseBody)
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getTop5NoticeListRequest = async () => {
    const result = await axios.get(GET_TOP5_NOTICE_LIST_URL())
        .then(response => {
            const responseBody: GetTop5NoticeListResponseDto = response.data;
            console.log(responseBody)
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


export const postNoticeRequest = async (corporationNumber: number | string, requestBody: PostNoticeRequestDto, accessToken: string) => {
    const result = await axios.post(POST_NOTICE_URL(corporationNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostNoticeResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_POST_URL = (postNumber: number | string) => `${API_DOMAIN}/post/${postNumber}`;
const GET_POST_LIST_URL = () => `${API_DOMAIN}/post/post-list`;
const POST_POST_URL = () => `${API_DOMAIN}/post`;
const GET_SEARCH_POST_LIST_URL = (requestBody: GetSearchPostListRequestDto) => `${API_DOMAIN}/post/search-post-list`;


export const getPostRequest = async (postNumber: number | string) => {
    const result = await axios.get(GET_POST_URL(postNumber))
        .then(response => {
            const responseBody: GetPostResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getPostListRequest = async () => {
    const result = await axios.get(GET_POST_LIST_URL())
        .then(response => {
            const responseBody: GetPostListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const postPostRequest = async (requestBody: PostPostRequestDto, accessToken: string) => {
    const result = await axios.post(POST_POST_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostPostResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

export const getSearchPostListRequest = async (requestBody: GetSearchPostListRequestDto) => {
    const result = await axios.post(GET_SEARCH_POST_LIST_URL(requestBody), requestBody)
        .then(response => {
            const responseBody: GetSearchPosListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;

export const getPopularListRequest = async () => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}


const GET_USER_RESUME_LIST_URL = (email: string) => `${API_DOMAIN}/resume/user-resume-list/${email}`;
const POST_RESUME_URL = () => `${API_DOMAIN}/resume`;


export const getUserResumeListRequest = async (email: string) => {
    const result = await axios.get(GET_USER_RESUME_LIST_URL(email))
        .then(response => {
            const responseBody: GetUserResumeListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.reponse) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
}

export const postResumeRequest = async (requestBody: PostResumeRequestDto, accessToken: string) => {
    const result = await axios.post(POST_RESUME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostResumeResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {

            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        })
    return result;
}
