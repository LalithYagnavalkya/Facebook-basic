import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../services/types";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { styled } from "styled-components";
import { logout } from "../features/auth/authSlice";
import { apiPrivate } from "../services/api";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (location.pathname === "/") {
      navigate("/calendar");
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      await apiPrivate.post("/api/auth/logout");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoggedIn) return <></>;
  return (
    <HomeContainer>
      <NavBar>
        <NavLink to="/calendar" $selected={location.pathname === "/calendar"}>
          Calendar
        </NavLink>
        <NavLink
          to="/appointments"
          $selected={location.pathname === "/appointments"}>
          Bookings
        </NavLink>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavBar>
      <Outlet />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const NavBar = styled.nav`
  display: flex;
  width: 100%;
  position: relative;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const NavLink = styled(Link)<{ $selected?: boolean }>`
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
  background-color: #dc3545;
  padding: 8px 16px;
  position: absolute;
  right: 5%;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #c82333;
  }
`;

export default Home;
