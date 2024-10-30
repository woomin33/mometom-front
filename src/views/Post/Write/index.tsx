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
import { fileUploadRequest, getCategoryRequest, patchBoardRequest, postBoardRequest, postPostRequest } from "apis";
import { PatchBoardRequestDto, PostBoardRequestDto } from "apis/request/board";
import { Editor } from '@toast-ui/react-editor'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/ko-kr'
import { PostPostRequestDto } from 'apis/request/post';
import PostPostResponseDto from 'apis/response/post/post-post.response.dto';
import usePostStore from 'stores/post.store';

//          component: 게시물 작성 화면 컴포넌트          //
export default function PostWrite(){

    //          state: 로그인 유저 상태          //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    //          state: path 상태          //
    const { pathname } = useLocation();
    
    //          state: 이미지 ref          //
    const editorRef = useRef<Editor | null>(null);
    
    function EditorBox(){
        return(
            <Editor
                initialValue=""
                previewStyle="vertical"
                height="600px"
                initialEditType="wysiwyg"
                ref={editorRef}
                useCommandShortcut={false}
                language="ko-KR"
                hideModeSwitch={true}
                hooks={{ addImageBlobHook(blob, callback){
                    const formData = new FormData();
                    formData.append('file', blob);

                    fileUploadRequest(formData)
                    .then(url => {
                        if(!url) return;
                        callback(url); // 에디터에 URL 전달
                        console.log(url)
                    })
                    .catch(error => {
                        console.error('이미지 업로드 실패:', error);
                    });
                    } }}
            />
        )
    }

    
    //          state: 제목 영역 요소 참조 상태          //
    const titleRef = useRef<HTMLInputElement | null>(null);    


    //          state: 쿠키 상태          //
    const [ cookies, setCookies ] = useCookies(); 

    

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          functionL post post response 처리 함수          //
    const postPostResponse = (responseBody: PostPostResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if(code === 'DBE') alert('데이터베이스 오류입니다.');
        if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
        if(code === 'VF') alert('제목과 내용은 필수입니다.');
        if(code !== 'SU') return;

        if(!loginUser) return;
        const { email } = loginUser;
        navigate(USER_PATH(email));
        
    }

   

    //          event handler: 등록 버튼 클릭 이벤트 처리          //
    const onRegistrationButtonClickHandler = () => {
        const accessToken = cookies.accessToken;
        if(!accessToken) return;

        const title = titleRef.current?.value;
        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        const content = editorRef.current?.getInstance().getMarkdown();
        if (!content) {
            alert('본문을 입력해주세요.');
            return;
        }
        if(title === '' || content === '') return;
        const  requestBody : PostPostRequestDto = {
            title, content
            }
        postPostRequest(requestBody, accessToken).then(postPostResponse);
    }
   

    //          effect: 마운트시 시 실행할 함수          //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken){
            navigate(MAIN_PATH());
        } 
    }, []);
    //          render: 게시물 작성 화면 컴포넌트 렌더링          //
    return(
        <div id='post-write-wrapper'>
            <div className='post-write-container'>
                <div className='post-write-info'>
                    <div className='post-write-info-title'>{'질문하기'}</div>
                    <div className='post-write-reg-button' onClick={onRegistrationButtonClickHandler}>{'등록하기'}</div>
                </div>
                <div className='post-write-title-box'>
                    <div className='post-write-title'>{'제목'}</div>
                    <input ref={titleRef} className='post-write-title-input' type='text'  ></input>
                </div>
                <div className='post-write-content-box'>
                    <div className='post-write-content'>{'본문'}</div>
                    <EditorBox />
                </div>
            </div>
        </div>
    )
}


 