import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";
import { useState } from "react";
import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";

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
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" value={newAccount ? "create Account" : "Log In"} />
                {error ? alert(error):""}
            </form>
            <div>
                <button>Continue with Google</button>
            </div>
        </div>
    )
}

export default Auth;