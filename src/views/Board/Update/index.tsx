import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import './style.css';
import { useBoardStore, useLoginUserStore, useModalStateStore } from "stores";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AUTH_PATH, BOARD_DETAIL_PATH, BOARD_PATH, BOARD_WRITE_PATH, MAIN_PATH, USER_PATH } from "constant";
import { useCookies } from "react-cookie";
import { fileUploadRequest, getBoardRequest, getCategoryRequest, getSelectedCategoryRequest, patchBoardRequest, postBoardRequest } from "apis";
import { GetBoardResponseDto, PatchBoardResponseDto, PostBoardResponseDto } from "apis/response/board";
import { ResponseDto } from "apis/response";
import { convertUrlsToFile } from "utils";
import { GetCategoryResponseDto, GetSelectedCategoryResponseDto } from "apis/response/category";
import { PatchBoardRequestDto, PostBoardRequestDto } from "apis/request/board";
import { CategoryList } from "types/interface";

//          component: 게시물 수정 화면 컴포넌트          //
export default function BoardUpdate(){

    //          state: 제목 영역 요소 참조 상태          //
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    //          state: 본문 영역 요소 참조 상태          //
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    //          state: 이미지 입력 요소 참조 상태          //
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    //          state: 비디오 입력 요소 참조 상태          //
    const videoInputRef = useRef<HTMLInputElement | null>(null);

    //          state: 게시물 번호 path variable 상태          //
    const { boardNumber } = useParams();

    //          state: 게시물 상태          //
    const { title, setTitle } = useBoardStore();
    const { content, setContent } = useBoardStore();
    const { boardImageFileList, setBoardImageFileList } = useBoardStore();
    const { boardVideoFileList, setBoardVideoFileList } = useBoardStore();
    const { resetBoard } = useBoardStore();
    //          state: 로그인 유저 상태          //
    const { loginUser } = useLoginUserStore();
    //          state: path 상태          //
    const { pathname } = useLocation();
    //          state: 모달 오픈 상태          //
    const { isModalOpen, setModalOpen } = useModalStateStore();

    //          state: 쿠키 상태          //
    const [ cookies, setCookies ] = useCookies(); 

    //          state: 게시물 이미지 미리보기 URL 상태          //
    const [imageUrls, setImageUrls ] = useState<string[]>([]);
    //          state: 게시물 비디오 미리보기 URL 상태          //
    const [videoUrls, setVideoUrls ] = useState<string[]>([]);

    //          function: 네비게이트 함수          //
    const navigate = useNavigate();

    //          function: get board response 처리 함수          //
    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        if(!responseBody) return;
        const { code } = responseBody;
        if( code === 'NB') alert('존재하지 않는 게시물입니다.');
        if( code === 'DBE') alert('데이터베이스 오류입니다.');
        if( code !== 'SU'){
            navigate(MAIN_PATH());
            return;
        }
        
        const { title, content, boardImageList, boardVideoList, writerEmail } = responseBody as GetBoardResponseDto;
        setTitle(title);
        setContent(content);
        convertUrlsToFile(boardImageList).then(boardImageFileList => setBoardImageFileList(boardImageFileList));
        setImageUrls(boardImageList);
        convertUrlsToFile(boardVideoList).then(boardVideoFileList => setBoardVideoFileList(boardVideoFileList));
        setVideoUrls(boardVideoList);

        if(!loginUser || loginUser.email !== writerEmail){
            navigate(MAIN_PATH());
            return;
        }

        if(!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;

    }

    //          event handler: 제목 변경 이벤트 처리          //
    const onTitleChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setTitle(value);

        if(!titleRef.current)return;
        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }

    //          event handler: 내용 변경 이벤트 처리          //
    const onContentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);

        if(!contentRef.current)return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }

    //          event handler: 이미지 변경 이벤트 처리          //
    const onImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = boardImageFileList.map(item => item);
        newBoardImageFileList.push(file);
        setBoardImageFileList(newBoardImageFileList);

        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';
    }

    //          event handler: 이미지 업로드 버튼 클릭 이벤트 처리          //
    const onImageUploadButtonClickHandler = () => {
        if(!imageInputRef.current) return;
        imageInputRef.current.click();
    }
    //          event handler: 이미지 닫기 버튼 클릭 이벤트 처리          //
    const onImageCloseButtonClickHandler = (deleteIndex: number) => {
        if(!imageInputRef.current) return;
        imageInputRef.current.value = '';

        const newImageUrls = imageUrls.filter((url, index) => index !== deleteIndex);
        setImageUrls(newImageUrls);

        const newBoardImageFileList = boardImageFileList.filter((file, index) => index !== deleteIndex);
        setBoardImageFileList(newBoardImageFileList);
    }
    //          event handler: 비디오 변경 이벤트 처리          //
    const onVideoChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files || !event.target.files.length) return;
        const file = event.target.files[0];

        const videoUrl = URL.createObjectURL(file);
        const newvideoUrls = videoUrls.map(item => item);
        newvideoUrls.push(videoUrl);
        setVideoUrls(newvideoUrls);

        const newBoardVideoFileList = boardVideoFileList.map(item => item);
        newBoardVideoFileList.push(file);
        setBoardVideoFileList(newBoardVideoFileList);

        if(!videoInputRef.current) return;
        videoInputRef.current.value = '';
    }
    //          event handler: 비디오 업로드 버튼 클릭 이벤트 처리          //
    const onVideoUploadButtonClickHandler = () => {
        console.log("hhhhh");
        if(!videoInputRef.current) {
            return;
        }
        videoInputRef.current.click();
    }
    //          event handler: 비디오 닫기 버튼 클릭 이벤트 처리          //
    const onVideoCloseButtonClickHandler = (deleteIndex: number) => {
        if(!videoInputRef.current) return;
        videoInputRef.current.value = '';

        const newVideoUrls = videoUrls.filter((url, index) => index !== deleteIndex);
        setVideoUrls(newVideoUrls);

        const newBoardVideoFileList = boardVideoFileList.filter((file, index) => index !== deleteIndex);
        setBoardVideoFileList(newBoardVideoFileList);
    }

    //          effect: 마운트시 시 실행할 함수          //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if(!accessToken){
            navigate(MAIN_PATH());
            return;
        } 
        if(!boardNumber) return;
        getBoardRequest(boardNumber).then(getBoardResponse);
        
    }, [boardNumber]);

    //          component: 업로드 모달 컴포넌트          //
    const UploadModal = () => {

        //          state: 게시물 번호 path variable 상태          //
        const { boardNumber } = useParams();
        //          state: 카테고리 리스트 상태          //
        const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
        //          state: 선택된 카테고리 리스트 상태          //
        const [selectedCategoryList, setSelectedCategoryList] = useState<number[]>([]);
        
        

        //          functionL post board response 처리 함수          //
        const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code === 'AF' || code === 'NU') navigate(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수입니다.');
            if(code !== 'SU') return;

            resetBoard();
            if(!loginUser) return;
            const { email } = loginUser;
            navigate(USER_PATH(email));
        }
        //          function: patch board response 처리 함수          //
        const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code === 'AF' || code === 'NU' || code === 'NB' || code === 'NP') navigate(AUTH_PATH());
            if(code === 'VF') alert('제목과 내용은 필수입니다.');
            if(code !== 'SU') return;

            if(!boardNumber) return;
            navigate(BOARD_PATH() + '/' + BOARD_DETAIL_PATH(boardNumber));
        }
        //          function: get category response 처리 함수          //
        const getCategoryResponse = (responseBody : GetCategoryResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { categoryList } = responseBody as GetCategoryResponseDto;
            setCategoryList(categoryList);
        }
        //          function: get selected category response 처리 함수          //
        const getSelectedCategoryResponse = (responseBody: GetSelectedCategoryResponseDto | ResponseDto | null) => {
            if(!responseBody) return;
            const { code } = responseBody;
            if(code === 'DBE') alert('데이터베이스 오류입니다.');
            if(code !== 'SU') return;

            const { selectedCategoryList } = responseBody as GetSelectedCategoryResponseDto;
            const selectedCategoryNumberList: number[]  = selectedCategoryList.map(category => category.categoryNumber);

            setSelectedCategoryList(selectedCategoryNumberList);
        }
        //          event handler: 카테고리 버튼 클릭 이벤트 처리 함수          //
        const onCategoryButtonClickHandler = (categoryNumber: number) => {

            const isSelected = selectedCategoryList.includes(categoryNumber);

            if(isSelected) {
                setSelectedCategoryList(selectedCategoryList.filter(num => num !== categoryNumber))
            }
            else{
                setSelectedCategoryList([...selectedCategoryList, categoryNumber]);
            }
        }

        //          event handler: 확인 버튼 클릭 이벤트 처리 함수          //
        const onYesButtonClickHandler = async () => {
            const accessToken = cookies.accessToken;
            if(!accessToken) return;

            const boardImageList: string[] = [];

            for(const image of boardImageFileList){
                const data = new FormData();
                data.append('file', image);

                const url = await fileUploadRequest(data);
                if(url) {
                boardImageList.push(url);
                }
            }

            const boardVideoList: string[] = [];

            for(const video of boardVideoFileList){
                const data = new FormData();
                data.append('file', video);

                const url = await fileUploadRequest(data);
                if(url) {
                boardVideoList.push(url);
                }
            }

            const isWriterPage = pathname === BOARD_PATH() + '/' + BOARD_WRITE_PATH();

            if(isWriterPage){
                const  requestBody : PostBoardRequestDto = {
                title, content, boardImageList, boardVideoList, selectedCategoryList,
                }
                postBoardRequest(requestBody, accessToken).then(postBoardResponse);
            }
            else{
                if(!boardNumber) return;
                const requestBody : PatchBoardRequestDto = {
                title, content, boardImageList, boardVideoList, selectedCategoryList
                }
                patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
            }
        }
        //          event handler: 취소 버튼 클릭 이벤트 처리 함수          //
        const onCloseButtonClickHandler = () => {
            setModalOpen(!isModalOpen);
        }
        //          effect: 첫 마운트 시 실행될 함수          //
        useEffect(() => {
            if(!boardNumber) return;
            getSelectedCategoryRequest(boardNumber).then(getSelectedCategoryResponse);
            getCategoryRequest().then(getCategoryResponse);
        }, []);

        //          render: 업로드 모달 컴포넌트 렌더링          //
        return(
        <div className='modal-wrapper'>
            <div className='modal-container'>
            <div className='modal-content-box'>
                <div className='modal-top'>
                <div className='modal-top-title'>
                    <div className='modal-top-main-title'>{'어떤 카테고리를 지정하실지 선택해주세요'}</div>
                    <div className='modal-top-sub-title'>{'(중복 선택 가능) | 선택하지 않을 시 기타로 분류됩니다'}</div>
                    </div>
                <div className='icon-button' onClick={onCloseButtonClickHandler}>
                    <div className='icon close-icon'></div>
                </div>
                </div>
                <div className='modal-middle'>
                <div className='modal-middle-categorys'>
                    {categoryList.map(category => <div key={category.categoryNumber} onClick={() => onCategoryButtonClickHandler(category.categoryNumber)}
                     style={{backgroundColor: selectedCategoryList.includes(category.categoryNumber) ? 'rgba(0, 0, 0, 0.2)' : 'white'}}
                      className='category'>{category.categoryName}</div>)}
                </div>
                </div>
                <div className='modal-bottom'>
                <div className='black-button' onClick={onYesButtonClickHandler}>{'확인'}</div>
                <div className='black-button' onClick={onCloseButtonClickHandler}>{'취소'}</div>
                </div>
            </div>
            </div>
        </div>
        ); 
    }

    //          render: 게시물 수정 화면 컴포넌트 렌더링          //
    return(
        <div id='board-update-wrapper'>
            <div className='board-update-container'>
                <div className='board-update-box'>
                    <div className='option-box'>
                        <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                            <div className='icon image-box-light-icon'>
                                <input ref={imageInputRef} type='file' accept='image/*' style={{display: 'none'}} onChange={onImageChangeHandler} />
                            </div>
                        </div>
                        <div className='icon-button' onClick={onVideoUploadButtonClickHandler}>
                            <div className='icon video-box-light-icon'>
                                <input ref={videoInputRef} type='file' accept='video/*' style={{display: 'none'}} onChange={onVideoChangeHandler} />
                            </div>
                        </div>
                    </div>
                    <div className='board-update-title-box'>
                        <textarea ref={titleRef} className='board-update-title-textarea' rows={1} placeholder='제목' value={title} onChange={onTitleChangeHandler} />
                    </div>
                    <div className='divider'></div>
                    <div className='board-update-content-box'>
                        <textarea ref={contentRef} className='board-update-content-textarea' value={content} placeholder='본문' onChange={onContentChangeHandler} />
                    </div>

                    <div className='board-update-files-box'>
                        {imageUrls.map((imageUrl, index) => 
                        <div className='board-update-file-box'>
                            <img className='board-update-file' src={imageUrl} />
                            <div className='icon-button file-close' onClick={() => onImageCloseButtonClickHandler(index)}>
                                <div className='icon close-icon'></div>
                            </div>
                        </div>
                        )}
                    </div>

                    <div className='board-update-files-box'>
                        {videoUrls.map((videoUrl, index) =>
                        <div className='board-update-file-box'>
                            <video src={videoUrl} controls />
                            <div className='icon-button file-close' onClick={() => onVideoCloseButtonClickHandler(index)}>
                                <div className='icon close-icon'></div>
                            </div>
                        </div>
                        )}
                    </div>
                    
                </div>
            </div>
            {isModalOpen && <UploadModal />}
        </div>
    )
}