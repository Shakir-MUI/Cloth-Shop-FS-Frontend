import { Link, useNavigate } from "react-router-dom";
import {
  Navbar as BSNavbar,
  Nav,
  NavDropdown,
  Container,
  Badge,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { cartAPI } from "../services/api";

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, [isAuthenticated]);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      setCartCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <BSNavbar expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <BSNavbar.Brand as={Link} to="/">
          <FaUserShield className="me-2" />
          STYLON
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/cart" className="position-relative">
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <Badge bg="danger" className="cart-badge">
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>

                <Nav.Link as={Link} to="/favorites">
                  <FaHeart size={20} />
                </Nav.Link>

                <NavDropdown
                  title={
                    <span>
                      <FaUser className="me-1" />
                      {user?.username}
                    </span>
                  }
                  id="user-dropdown"
                >
                  <div className="profile-email">{user?.email}</div>

                  <NavDropdown.Divider />

                  {isAdmin && (
                    <>
                      <NavDropdown.Item as={Link} to="/admin">
                        <FaUserShield className="me-2" />
                        Admin Panel
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}

                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
