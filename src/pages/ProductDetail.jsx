import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Form,
  Spinner,
  Carousel,
} from "react-bootstrap";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaArrowLeft,
} from "react-icons/fa";
import {
  productsAPI,
  cartAPI,
  favoritesAPI,
  reviewsAPI,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import ReviewCard from "../components/ReviewCard";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    loadProduct();
    loadReviews();
    if (isAuthenticated) checkFavorite();
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const res = await productsAPI.getById(id);
      setProduct(res.data);
    } catch {
      toast.error("Product not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await reviewsAPI.getProductReviews(id);
      setReviews(res.data);
    } catch {}
  };

  const checkFavorite = async () => {
    try {
      const res = await favoritesAPI.check(id);
      setIsFavorite(res.data.is_favorite);
    } catch {}
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login to add favorites");
      return;
    }
    try {
      if (isFavorite) {
        await favoritesAPI.remove(id);
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(id);
        setIsFavorite(true);
      }
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.warning("Please login to add to cart");
      navigate("/login");
      return;
    }
    try {
      await cartAPI.addToCart({ product_id: id, quantity });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.createReview(id, reviewData);
      toast.success("Review submitted");
      setShowReviewForm(false);
      loadReviews();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="text-center py-5">
        <h4>Product not found</h4>
      </Container>
    );
  }

  /* ---------- IMAGE HANDLING ---------- */
  const images = [product.image, product.image2, product.image3].filter(
    Boolean
  );

  const carouselImages =
    images.length > 0 ? images : ["https://via.placeholder.com/600"];

  const autoPlay = carouselImages.length > 1;

  /* ---------- UI ---------- */
  return (
    <Container className="py-5">
      <Button
        variant="outline-primary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </Button>

      <Row>
        {/* IMAGE SECTION */}
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Carousel
              activeIndex={activeIndex}
              onSelect={(i) => setActiveIndex(i)}
              interval={autoPlay ? 3000 : null}
              indicators={false}
            >
              {carouselImages.map((img, i) => (
                <Carousel.Item key={i}>
                  <div className="zoom-container">
                    <img
                      src={
                        img.startsWith("http")
                          ? img
                          : `http://localhost:8000${img}`
                      }
                      className="d-block w-100 zoom-image"
                      style={{
                        height: "600px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                      alt="product"
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Card>

          {/* THUMBNAILS */}
          {carouselImages.length > 1 && (
            <div className="d-flex gap-2 mt-3 justify-content-center">
              {carouselImages.map((img, i) => (
                <img
                  key={i}
                  src={
                    img.startsWith("http") ? img : `http://localhost:8000${img}`
                  }
                  onClick={() => setActiveIndex(i)}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 10,
                    cursor: "pointer",
                    border:
                      activeIndex === i
                        ? "3px solid #0d6efd"
                        : "2px solid #ddd",
                  }}
                  alt="thumb"
                />
              ))}
            </div>
          )}
        </Col>

        {/* DETAILS */}
        <Col md={6}>
          <Badge bg="info" className="mb-2">
            {product.category_name || "Category"}
          </Badge>
          <h2 className="fw-bold">{product.name}</h2>

          <div className="mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                color={
                  i < Math.round(product.average_rating || 0)
                    ? "#ffc107"
                    : "#ddd"
                }
              />
            ))}
            <span className="ms-2 text-muted">
              ({product.total_reviews} reviews)
            </span>
          </div>

          <h3 className="text-primary fw-bold mb-3">₹{product.price}</h3>

          <p>{product.description}</p>

          <Form.Group className="mb-3" style={{ width: 120 }}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button className="flex-grow-1" onClick={addToCart}>
              <FaShoppingCart className="me-2" /> Add to Cart
            </Button>
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              onClick={toggleFavorite}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </Button>
          </div>
        </Col>
      </Row>

      {/* REVIEWS */}
      <Row className="mt-5">
        <Col>
          <h3 className="fw-bold mb-3">Customer Reviews</h3>

          {isAuthenticated && (
            <Button
              className="mb-3"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </Button>
          )}

          {showReviewForm && (
            <Card className="mb-4">
              <Card.Body>
                <Form onSubmit={submitReview}>
                  <div className="mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar
                        key={s}
                        size={28}
                        style={{ cursor: "pointer" }}
                        color={s <= reviewData.rating ? "#ffc107" : "#ddd"}
                        onClick={() =>
                          setReviewData({ ...reviewData, rating: s })
                        }
                      />
                    ))}
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    required
                    placeholder="Write your review..."
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, comment: e.target.value })
                    }
                  />
                  <Button className="mt-3" type="submit">
                    Submit Review
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </Col>
      </Row>

      {/* ZOOM STYLE */}
      <style>{`
        .zoom-container {
          overflow: hidden;
        }
        .zoom-image {
          transition: transform 0.4s ease;
        }
        .zoom-container:hover .zoom-image {
          transform: scale(1.15);
        }
      `}</style>
    </Container>
  );
}

export default ProductDetail;
