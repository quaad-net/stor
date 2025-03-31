

import { IconButton } from '@mui/material';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import { useEffect, useState } from 'react';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BackspaceTwoToneIcon from '@mui/icons-material/BackspaceTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import './CommentModal.css' 



function CommentModal(props){
    const [comment, setComment] = useState('');

    useEffect(()=>{

        const modal = document.querySelector('#comment-modal');
        const close = document.querySelector('.comment-modal-close');

        function removeModal(e){
            if(e.key === 'Escape'){
                modal.style.display="none";
            }
        }

        function addListeners(){
            close.addEventListener('click', ()=>{ 
                modal.style.display = 'none';
            })
            document.addEventListener('click', (e)=>{
                if(e.target == modal){
                    modal.style.display = 'none';
                }
            })
            document.addEventListener('keydown', removeModal);
        }

        function removeListeners(){
            close.removeEventListener('click', ()=>{ 
                modal.style.display = 'none';
            })
            document.removeEventListener('click', (e)=>{
                if(e.target == modal){
                    modal.style.display = 'none';
                }
            })
            document.removeEventListener('keydown', removeModal);
        }

        addListeners();
        return removeListeners();

    }, [])

    function displayModal(){

        const modal = document.querySelector('#comment-modal');
        modal.style.display = "block";

        // Prev
        // const modal = document.querySelector('#comment-modal');
        // const close = document.querySelector('.comment-modal-close');
        // modal.style.display = "block";
        // close.addEventListener('click', ()=>{ 
        //     modal.style.display = 'none';
        // })
        // document.addEventListener('click', (e)=>{
        //     if(e.target == modal){
        //         modal.style.display = 'none';
        //     }
        // })
       
        // function removeModal(e){
        //     if(e.key === 'Escape'){
        //         modal.style.display="none";
        //     }
        // }
    
        // document.addEventListener('keydown', removeModal);
    }

    function displayMobileModal(){
        document.querySelector('.mobile-comment-modal').style.display = 'block'
    }

    function removeMobileModa(){

    }

    if(!props.mobileView === true){
        return(
            <>
                <IconButton sx={{color: 'white', marginLeft: '20px'}} disableRipple onClick={()=>{
                    displayModal();
                }}>
                    <InsertCommentOutlinedIcon/>
                </IconButton>
                <div className="modal" id="comment-modal" style={{display: 'none'}}>
                    <div className="comment-modal">
                        <div className="comment-modal-items">
                            <span className="comment-modal-close">&times;</span>
                            <textarea 
                                maxLength={300}
                                className='comment-modal-comment'
                                style={{msOverflowStyle: 'none', scrollbarWidth: 'none', '::WebkitScrollbar': {display: 'none'}}}
                                onChange={(e)=>{
                                    setComment(e.target.value)
                                }}
                            >
                            </textarea>
                            <div style={{marginLeft: '70px'}}>
                                <IconButton sx={{color: 'white', marginRight: '20px'}} onClick={()=>{
                                    document.querySelector('textarea').value = ''
                                }} >
                                    <PlaylistRemoveOutlinedIcon fontSize='large'/>
                                </IconButton >
                                <IconButton sx={{color: 'white'}} onClick={()=>{
                                    props.setUserComment(comment);
                                    document.querySelector('#comment-modal').style.display = 'none'
                                }} >
                                    <CheckOutlinedIcon fontSize='large'/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else{
        return(
            <>
                <IconButton sx={{color: 'white', marginLeft: '20px'}} disableRipple onClick={()=>{
                    document.querySelector('.mobile-comment-modal').style.display = 'block';
                }}>
                    <InsertCommentOutlinedIcon/>
                </IconButton>
                <div 
                    className='mobile-comment-modal'
                    style={{
                        display: 'none',
                        position: 'fixed', 
                        bottom: '0', 
                        width: '100vw', 
                        backgroundColor: 'rgba(22, 22, 22, 0.96)', 
                        borderRadius: '10px',
                        left: 0, 
                        height: '100vh'
                    }}>
                    <textarea 
                        maxLength={150}
                        className='comment-modal-comment mobile-comment-modal-comment'
                        style={{
                            msOverflowStyle: 'none', 
                            scrollbarWidth: 'none', 
                            '::WebkitScrollbar': {display: 'none'}, 
                            width: '80%',
                            marginLeft: '40px',
                            marginTop: '20px',
                            backgroundColor: 'rgb(22, 22, 22)',
                            color: 'white',
                            borderRadius: '50px',
                            padding:'25px'

                        } }
                    placeholder={'Comment...'}
                        onChange={(e)=>{
                            setComment(e.target.value)
                        }}
                    >
                    </textarea>
                    <div style={{width: '70px', marginLeft: '50px'}}>
                        <div style={{margin:'auto'}}>
                        <IconButton sx={{color: 'white', marginBottom: '20px', marginLeft:'25px'}} onClick={()=>{
                            document.querySelector('.mobile-comment-modal-comment').value = ''
                        }} >
                            <BackspaceTwoToneIcon fontSize='large'/>
                        </IconButton >
                        <IconButton sx={{color: 'white', marginBottom: '20px'}} onClick={()=>{
                            props.setUserComment(comment);
                            document.querySelector('.mobile-comment-modal').style.display = 'none';
                        }} >
                            <CheckCircleTwoToneIcon fontSize='large'/>
                        </IconButton>
                        <IconButton sx={{color: 'white', marginLeft: '-25px'}} onClick={()=>{
                            document.querySelector('.mobile-comment-modal').style.display = 'none';
                        }} >
                            <CancelTwoToneIcon fontSize='large'/>
                        </IconButton>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CommentModal;