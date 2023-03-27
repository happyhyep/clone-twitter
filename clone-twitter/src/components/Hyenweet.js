import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React from "react";
import { useState, useEffect } from "react";

const Hyenweet = ({hyenweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(hyenweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("이 트윗을 삭제하시겠습니까?");
        if(ok) {
            const tweetTextRef = doc(dbService, "hyenweets", `${hyenweetObj.id}`);
            await deleteDoc(tweetTextRef);
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        const tweetTextRef =doc(dbService, "hyenweets", `${hyenweetObj.id}`);
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
                        <h4>{hyenweetObj.text}</h4>
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