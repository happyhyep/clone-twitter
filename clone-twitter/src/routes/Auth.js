import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";
import { useState } from "react";
import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";

function Auth () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    
    const onChange = (event) => {
        //console.log(event.target.name);
        const {
            target: {name, value},
        } = event;
        if(name === "email") {
            setEmail(value);
        }
        else if(name === "password") {
            setPassword(value);
        }
        };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            const auth = getAuth();
        if (newAccount) {
            data = await createUserWithEmailAndPassword(auth, email, password);
        } else {
            data = await signInWithEmailAndPassword(auth, email, password);
        }
        console.log(data);
        } catch (error) {
            setError(error.message)
        }
    }
    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onSocialClick = async(event) => {
        const{
            target:{name},
        }=event;

        let provider;
        const auth = getAuth();
        
        if(name === "google"){
            provider = new GoogleAuthProvider();
        }
        const data = await signInWithPopup(auth, provider);
        console.log(data);
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '12px'}}>
                    <TextInput
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={onChange}
                    />
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '12px'}}>
                    <TextInput
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <div style={{display: 'flex', justifyContent: 'center',  marginBottom: '15px'}}>
                    <SubmitInput type="submit" value={newAccount ? "회원가입" : "로그인"} />
                </ div>
                <div>
                    {!newAccount &&
                        <div onClick={onSocialClick} name="google" style={{display: 'flex', justifyContent: 'right', marginBottom: '10px', marginRight: '300px', fontSize: '10px', cursor: 'pointer'}}>Google Login</div>
                    }
                </div>
                <div onClick={toggleAccount} style={{display: 'flex', justifyContent: 'right', marginBottom: '20px', marginRight: '300px', fontSize: '10px', cursor: 'pointer'}}>
                    {newAccount ? "로그인하러가기" : "회원가입하러가기"}
                </div>
                {error && alert(error)}
            </form>
        </>
    )
}

export default Auth;

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

const Button = styled.button`
    width: 80px;
    height: 30px;
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
