import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../services/types";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "styled-components";
import { logout } from "../features/auth/authSlice";
import Loading from "../components/loading";
import User from "../components/user";
import RUser from "../components/userRemove";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [fsearch, setFsearch] = useState('');
  const [myFriends, setMyFriends] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [friendsFound, setFriendsFound] = useState([]);

  const { isLoggedIn, token, id } = useSelector((state: RootState) => state.auth);
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
      
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    if (fsearch === ''){
      setFriendsFound([])
    }
  }, [fsearch])

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/api/v1/user/getUserFriends", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        setMyFriends(response?.data?.user.friends)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])
  
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
      .then(() => {
        setLoading(true);
        axios
          .get("http://localhost:4000/api/v1/user/getUserFriends", {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((data) => {
            setMyFriends(data?.data?.user.friends)
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // const formData = new FormData();
  let changeImage = async (event: any) => {
    let imageFile = event.target.files[0];
    const formData = new FormData();
    console.log(id)
    console.log(imageFile)
    formData.append('userId', id ? id : '');
    formData.append('csvdata', imageFile);
    console.log('this is inside changeImage');
    for (var pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    axios
      .post("http://localhost:4000/api/v1/user/uploadExcelSheet", formData , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {

        setFriendsFound(response?.data?.data)
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.addEventListener('load', () => {
      if (reader.result) {
        console.log('hello')
      } else {
        alert('Error Occurred');
      }
    });
  };
  const remove_id = (_id: any) => {
    setLoading(true);
    axios
      .post("http://localhost:4000/api/v1/user/removeFriend", { userId:_id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          // You can add other headers here if needed
        }
      })
      .then((response) => {

        setLoading(true);
        axios
          .get("http://localhost:4000/api/v1/user/getUserFriends", {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => {
            setMyFriends(response?.data?.user.friends)
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  // formData.append('file', file);
  return (
    <HomeContainer>
      <Topbar>
        <Header>Facebook</Header>
        <LogoutButton onClick={() => handleLogout()} >Logout</LogoutButton>
      </Topbar>
      <BodyContainer>
        <Body>
          <div className="inside-body-search">
          <Input
            type="email"
            value={fsearch}
            onChange={(e) => {
              setFsearch(e.target.value)}}
            placeholder="Email"
            required
            />
            <form encType="multipart/form-data" action="/upload" onChange={(e) => changeImage(e)} method="POST">
                <input type="file" name="file" accept=".jpg, .jpeg, .png, .pdf" />
              {/* <Button type="submit">Submit</Button> */}
            </form>
            </div>
          <div className="fcontainer">
            {loading ? <><Loading /></> :
              <>
                {friendsFound.map((e: any) => {
                  return <User key={e._id} send_id={send_id} {...e}/>
                })}
              </>
            }
          </div>
        </Body>
        <Body>
          <div>Your friends</div>
          <div className="fcontainer">
            {loading ? <><Loading /></> :
              <>
                {myFriends.map((e: any) => {
                  return <RUser key={e._id} remove_id={remove_id} {...e} />
                })}
              </>
            }
          </div>
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
  color: white;

  /* border: 2px solid white; */
  .inside-body-search{
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding: 1rem;
  }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  width: 300px;
  font-size: 16px;
  height: 20px;
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;

// const Button = styled.button`
//    color: #ffffff;
//   background-color: #0f30b5;
//   padding: 8px 16px;
//   right: 5%;
//   border: none;
//   border-radius: 5px;
//   height: 40px;
//   cursor: pointer;
//   font-weight: 400;
//   transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
//   &:hover {
//     background-color: #000000;
//     border: 2px solid white;
//   }
// `
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
