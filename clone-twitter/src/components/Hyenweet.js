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

    return(
        <div>
            {
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
                    <>
                        <h4>{userObj.text}</h4>
                        {userObj.attachmentURL && (
                            <img src={userObj.attachmentURL} width="300px" height="300px" />
                        )}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>삭제</button>
                                <button onClick={toggleEditing}>수정</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
}

export default Hyenweet;