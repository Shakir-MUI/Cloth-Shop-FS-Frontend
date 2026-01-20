import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="custom-footer">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <div className="footer-section">
              <h5>About STYLON</h5>
              <p className="text-light">
                Your premier destination for fashionable clothing. We offer the latest trends in professional, party, classic, street, daily, and traditional wear.
              </p>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="social-icon">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="social-icon">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="social-icon">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </Col>

          <Col md={4} className="mb-4">
            <div className="footer-section">
              <h5>Quick Links</h5>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/products" className="footer-link">Shop</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </Col>

          <Col md={4} className="mb-4">
            <div className="footer-section">
              <h5>Customer Service</h5>
              <Link to="/shipping" className="footer-link">Shipping Information</Link>
              <Link to="/returns" className="footer-link">Returns & Exchanges</Link>
              <Link to="/faq" className="footer-link">FAQ</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col className="text-center">
            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <p className="mb-0 text-light">
              © {new Date().getFullYear()} STYLON. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;