import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { favoritesAPI } from '../services/api';
import { toast } from 'react-toastify';

function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      setFavorites(response.data);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container className="py-5">
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <FaHeart size={80} color="#bdc3c7" className="mb-3" />
            <h3>No Favorites Yet</h3>
            <p className="text-muted mb-4">
              Start adding your favorite items to keep track of products you love!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Browse Products
            </button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold">
          <FaHeart className="me-2 text-danger" />
          My Favorites ({favorites.length})
        </h2>
        <p className="text-muted">Your collection of favorite items</p>
      </div>

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {favorites.map((favorite) => (
          <Col key={favorite.id}>
            <ProductCard product={favorite.product_details} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Favorites;