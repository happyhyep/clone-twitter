import { Link } from "react-router-dom";
import styled from "styled-components"

const Navigation = (userObj) => {
    console.log(userObj)
    return (
        <nav>
            <TopMenu>
                <Link to='/'>Home</Link>
                <Link to='/profile'>{userObj.userObj.displayName}의 Profile</Link>
            </TopMenu>


        </nav>
    )
}
export default Navigation;

const TopMenu = styled.div`
    display: flex;
`