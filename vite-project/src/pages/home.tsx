import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../services/types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { logout } from "../features/auth/authSlice";
import { api, apiPrivate } from "../services/api";
import Loading from "../components/loading";
import User from "../components/user";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [fsearch, setFsearch] = useState('');
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [friendsFound, setFriendsFound] = useState([]);

  const { isLoggedIn, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (location.pathname === "/") {
      navigate("/home");;
    }
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .post("http://localhost:4000/api/v1/user/searchFriends", { fsearch },{
        headers: {
          Authorization: `Bearer ${token}`,
          // You can add other headers here if needed
        }
      })
      .then((response) => {
        
        setFriendsFound(response?.data?.user)
        console.log(response?.data?.user)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fsearch])

  const handleLogout = async () => {
    try {
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const send_id = async (_id:any) => {
    setLoading(true);
    axios
      .post("http://localhost:4000/api/v1/user/addFriend", { _id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          // You can add other headers here if needed
        }
      })
      .then((response) => {

        // setFriendsFound(response?.data?.user)
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <HomeContainer>
      <Topbar>
        <Header>Facebook</Header>
        <LogoutButton onClick={() => handleLogout()} >Logout</LogoutButton>
      </Topbar>
      <BodyContainer>
        <Body>
          <Input
            type="email"
            value={fsearch}
            onChange={(e) => setFsearch(e.target.value)}
            placeholder="Email"
            required
          />
          <div className="fcontainer">
            {loading ? <><Loading /></> :
              <>
                {friendsFound.map((e: any) => {
                  return <User key={e._id} send_id={send_id} {...e}/>
                })}``
              </>
            }
          </div>
        </Body>
        <Body>
          Your Friends
        </Body>
      </BodyContainer>


    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
 min-height: 80%;
  width: 90vw;
 `;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  width: 300px;
  font-size: 16px;
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;


const Topbar = styled.div`
  display: flex;
  width: 90vw;
  position: relative;
  padding-top: 2rem;
  padding-left: 1rem;

`;
const Header = styled.h1`
  margin-bottom: 2rem;
  color: #ffffff;
  font-size: 24px;
`;
const NavLink = styled(Link) <{ $selected?: boolean }>`
  color: ${({ $selected }) => ($selected ? "#ffffff" : "#000000")};
  background-color: ${({ $selected }) => ($selected ? "#007bff" : "#f0f0f0")};
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background-color: ${({ $selected }) => ($selected ? "#0056b3" : "#d9d9d9")};
  }
`;

const LogoutButton = styled.button`
  color: #ffffff;
  background-color: #c92535;
  border: 2px solid  #c92535;
  padding: 8px 16px;
  position: absolute;
  right: 5%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    background-color: #000000;
    border: 2px solid white;
  }
`;

export default Home;
