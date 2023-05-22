import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { styled } from "styled-components";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({...user});
  }
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({...user});
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);


  return (
    <>
      {init ? <AppRouter
                isLoggedIn={isLoggedIn}
                userObj={userObj}
                refreshUser={refreshUser}  
              /> : "로그인중..."}
      <Footer>&copy; {new Date().getFullYear()} happyhyep</Footer>
    </>
  );
}

export default App;

const Footer = styled.div`
  position: fixed;
  bottom: 0;
`