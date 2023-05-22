import React from "react";
import { useNavigate } from "react-router-dom";
import Hyenweet from "./Hyenweet";

const HyenweetPhoto = ({userObj, isOwner}) => {
    const navigate = useNavigate();
    const imageClick = () => {
        return(
            <div style={{zIndex: "10rem"}}>
                <img src={userObj.attachmentURL}></img>
                <Hyenweet userObj={userObj} attachmentURL={userObj.attachmentURL}/>
            </div>
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

export default HyenweetPhoto;