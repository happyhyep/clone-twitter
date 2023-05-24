import { authService, dbService } from "fbase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { styled } from "styled-components";

// for Profile import
const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event)=> {
        // 미 입력 방지
        event.preventDefault();

        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName: newDisplayName});
        }
        refreshUser();
    };

    const getMyTweets = async() => {
        const q = query(
            collection(dbService, "hyenweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, "=>", doc.data());
        });
    };



    useEffect(() => {
        getMyTweets();
    }, [])

    return (
        <>
            <form onSubmit={onSubmit} style={{marginTop: '30px', display: 'flex', justifyContent: 'center'}}>
                <TextInput
                    onChange={onChange}
                    type="text"
                    placeholder="사용자 이름을 입력하세요."
                    value={newDisplayName}
                />
            <SubmitInput type="submit" value="UPDATE" />
            </form>
            <div style={{position: 'fixed', bottom: '60px', right: '50px', display: 'flex', justifyContent: 'center'}}><LogOutButton onClick={onLogOutClick}>LOGOUT</LogOutButton></div>
        </>
    );

};

export default Profile;

const TextInput = styled.input`
    width: 300px;
    height: 30px;

    color: #77af9c;
    border: solid 1.4px #77af9c;
    border-radius: 10px;
    line-height: 30px;
    text-align: center;
`

const SubmitInput = styled.input`
    width: 80px;
    height: 30px;
    margin-left: 10px;
    background-color: #77af9c;
    color: #d7fff1;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    line-height: 30px;
    transition: 0.25s;
    border-radius: 15px;
    border: none;

    &:hover{
        cursor: pointer;
        letter-spacing: 2px;
        transform: scale(1.2);}
`
const LogOutButton = styled.button`
    width: 100px;
    height: 40px;

    color: #77af9c;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    line-height: 30px;
    transition: 0.25s;
    border-radius: 15px;
    border: solid 3px #77af9c;

    &:hover{
        cursor: pointer;
        letter-spacing: 2px;
        transform: scale(1.2);}
`

