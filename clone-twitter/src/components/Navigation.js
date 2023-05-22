import { NavLink } from "react-router-dom";
import styled from "styled-components";
import profile from '../profile.png'

const Navigation = (userObj) => {
    return (
        <nav>
            <TopMenu>
                <NavText to='/'>🏠 happyhyep</NavText>
                <NavText to='/profile'> <img alt="profile" src={profile} style={{width: "50px", color: "rgb(234,130,99)"}}></img></NavText>
            </TopMenu>


        </nav>
    )
}
export default Navigation;

const TopMenu = styled.div`
    height: 8vh;
    display: flex;
    justify-content: space-between;
`

const NavText = styled(NavLink)`
    font-size: 23px;
    margin: 18px;

    text-decoration: none;
    color: rgb(234,130,99);
`