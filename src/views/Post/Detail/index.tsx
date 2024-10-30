import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import { useBoardStore, useLoginUserStore, useModalStateStore } from "stores";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from "constant";
import { useCookies } from "react-cookie";
import { CategoryList } from "types/interface";
import { PatchBoardResponseDto, PostBoardResponseDto } from "apis/response/board";
import { ResponseDto } from "apis/response";
import { GetCategoryResponseDto } from "apis/response/category";
import { fileUploadRequest, getCategoryRequest, getPostRequest, patchBoardRequest, postBoardRequest, postPostRequest } from "apis";
import { PatchBoardRequestDto, PostBoardRequestDto } from "apis/request/board";
import { Editor, Viewer } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr'
import { PostPostRequestDto } from 'apis/request/post';
import PostPostResponseDto from 'apis/response/post/post-post.response.dto';
import usePostStore from 'stores/post.store';
import GetPostResponseDto from 'apis/response/post/get-post.response.dto';
import Post from 'types/interface/post.interface';

//          component: 게시물 작성 화면 컴포넌트          //
export default function PostDeatil(){

    //          state: 로그인 유저 상태          //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    //          state: path 상태          //
    const { pathname } = useLocation();
    const { postNumber } = useParams();
    //          state: 작성자 여부 상태          //
    const [isWriter, setWriter] = useState<boolean>(false);
    
    
    //          state: 게시물 상태          //
    const [post, setPost] = useState<Post | null>(null);
        
    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    

   
   

    //          function: get post response 처리 함수          //
    const getPostResponse = (responseBody: GetPostResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 게시물입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            
            return;
        }

        const post: Post = { ...responseBody as GetPostResponseDto };
        setPost(post);
        console.log(post)
        if(!loginUser){
            setWriter(false);
            return;
        }
        const isWriter = loginUser.email === post.writerEmail;
        setWriter(isWriter);
        window.scrollTo(0, 0);
    }
    
   

    //          effect: 마운트시 시 실행할 함수          //
    useEffect(() => {
        if(!postNumber) return;
        getPostRequest(postNumber).then(getPostResponse);
    }, []);
    if(!post) return <></>
    //          render: 게시물 작성 화면 컴포넌트 렌더링          //
    return(
        <div id='post-detail-wrapper'>
            <div className='post-detail-container'>
                <div className='post-detail-title-box'>{post.title}</div>
                <Viewer initialValue={post.content} />
            </div>
        </div>
    )
}


 