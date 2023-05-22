import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import {ref, deleteObject} from "@firebase/storage";

const Hyenweet = ({userObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(userObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("이 트윗을 삭제하시겠습니까?");
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
        return(
            editing ? (
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
                            value="Update Tweet"
                        />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>

            ) : (
            <div>
                {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>삭제</button>
                        <button onClick={toggleEditing}>수정</button>
                    </>
                )}
            </div>
            )
        )
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
                </>
    )
}

export default Hyenweet;