import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

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
      <footer>&copy; {new Date().getFullYear()} happyhyep</footer>
    </>
  );
}

export default App;
