import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import {ref, deleteObject} from "@firebase/storage";
import { styled } from "styled-components";

const Hyenweet = ({userObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(userObj.text);
    const [isImageClicked, setIsImageClicked] = useState(false);

    const onDeleteClick = async () => {
        const ok = window.confirm("이 글과 사진을 삭제하시겠습니까?");
        if(ok) {
            const tweetTextRef = doc(dbService, "hyenweets", `${userObj.id}`);
            await deleteDoc(tweetTextRef);

            const urlRef = ref(storageService, userObj.attachmentURL);
            await deleteObject(urlRef);
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        const tweetTextRef =doc(dbService, "hyenweets", `${userObj.id}`);
        await updateDoc(tweetTextRef, {
            text: newTweet,
        });
        setEditing(false);
    }

    const onChange = (event) => {
        const {
            target:{value},
        } = event;
        setNewTweet(value);
    }

    const imageClick = () => {
        setIsImageClicked(!isImageClicked);
    }

    return(
                <>
                    {userObj.attachmentURL && (
                    <img 
                    alt="pic"
                    style={{
                        width: '335px',
                        height: '335px',
                        margin: 'auto',
                        marginLeft: '20px',
                        marginRight: '20px',
                        marginBottom: '20px',
                        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.8)',
                        cursor: 'pointer'
                    }}
                         src={userObj.attachmentURL} width="300px" height="300px" onClick={imageClick}></img>
                    )}
                    {isOwner && isImageClicked && (
                        <>
                            <Button onClick={onDeleteClick}>삭제</Button>
                            <Button onClick={toggleEditing}>수정</Button>
                        </>
                    )}        
                    {
                        editing && 
                        <>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="수정할 글을 작성하세요."
                                    value={newTweet} required
                                    onChange={onChange}
                                />
                                <input
                                    type="submit"
                                    value="Update"
                                />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    }
                         
                </>
    )
}

export default Hyenweet;

const Button = styled.button`
    width: 30px;
    height: 20px;
    background-color: #77af9c;
    color: #d7fff1;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-size: 5px;
    text-align: center;
    line-height: 20px;
    transition: 0.25s;
    border-radius: 15px;
    border: none;

    &:hover{
        cursor: pointer;
        transform: scale(1.2);}
`