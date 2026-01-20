import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { favoritesAPI, cartAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && product?.id) {
      checkFavorite();
    }
  }, [isAuthenticated, product?.id]);

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.check(product.id);
      setIsFavorite(response.data.is_favorite);
    } catch {
      // silent fail
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Please login to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        await favoritesAPI.remove(product.id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await favoritesAPI.add(product.id);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const addToCart = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Please login to add to cart");
      return;
    }

    setLoading(true);
    try {
      await cartAPI.addToCart({
        product_id: product.id,
        quantity: 1,
      });
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ SAFE IMAGE HANDLING */
  const imageUrl = product.display_image
    ? `http://localhost:8000${product.display_image}`
    : "https://via.placeholder.com/300";

  return (
    <Card className="h-100 product-card position-relative">
      <div className="position-relative">
        <Link to={`/product/${product.id}`}>
          <Card.Img
            variant="top"
            src={imageUrl}
            className="product-image"
            style={{
              height: "360px", // 🔼 increased from 300px
              objectFit: "cover",
            }}
          />
        </Link>

        <Button
          variant="light"
          className="position-absolute top-0 end-0 m-2"
          onClick={toggleFavorite}
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: 0,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {isFavorite ? (
            <FaHeart color="#e74c3c" size={20} />
          ) : (
            <FaRegHeart size={20} />
          )}
        </Button>

        {!product.in_stock && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
            Out of Stock
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Link
          to={`/product/${product.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card.Title className="fw-bold" style={{ fontSize: "1.1rem" }}>
            {product.name}
          </Card.Title>
        </Link>

        <Badge bg="info" className="mb-2 align-self-start">
          {product.category_name || "Category"}
        </Badge>

        <div className="mb-2">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              color={
                index < Math.round(product.average_rating || 0)
                  ? "#ffc107"
                  : "#e0e0e0"
              }
            />
          ))}
          <span className="ms-2 text-muted">
            ({product.total_reviews || 0} reviews)
          </span>
        </div>

        <div className="mb-2">
          <span className="text-muted">Size: </span>
          <Badge bg="secondary">{product.size}</Badge>
          <span className="ms-2 text-muted">Color: </span>
          <Badge bg="secondary">{product.color}</Badge>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <h4 className="mb-0 fw-bold text-dark">₹{product.price}</h4>

          <Button
            variant="primary"
            size="sm"
            onClick={addToCart}
            disabled={!product.in_stock || loading}
            style={{ borderRadius: "20px", padding: "8px 20px" }}
          >
            <FaShoppingCart className="me-1" />
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
