import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { cartAPI } from "../services/api";
import { toast } from "react-toastify";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCartItems(response.data.cart_items || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateCart(cartId, { quantity: newQuantity });
      fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update cart");
    }
  };

  const removeItem = async (cartId) => {
    try {
      await cartAPI.removeFromCart(cartId);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await cartAPI.clearCart();
        fetchCart();
        toast.success("Cart cleared");
      } catch (error) {
        toast.error("Failed to clear cart");
      }
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <FaShoppingBag size={80} color="#bdc3c7" className="mb-3" />
            <h3>Your Cart is Empty</h3>
            <p className="text-muted mb-4">Add some items to get started!</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Shopping Cart ({cartItems.length} items)</h2>
        <Button variant="outline-danger" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          {cartItems.map((item) => {
            const imageUrl = item.product_details.display_image
              ? `http://localhost:8000${item.product_details.display_image}`
              : "https://via.placeholder.com/150";

            return (
              <Card key={item.id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <img
                        src={imageUrl}
                        alt={item.product_details.name}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </Col>
                    <Col md={4}>
                      <h5 className="fw-bold mb-1">
                        {item.product_details.name}
                      </h5>
                      <p className="text-muted mb-1">
                        Size: {item.product_details.size} | Color:{" "}
                        {item.product_details.color}
                      </p>
                      <p className="text-muted mb-0">
                        Brand: {item.product_details.brand}
                      </p>
                    </Col>
                    <Col md={2}>
                      <h5 className="text-primary mb-0">
                        ₹{item.product_details.price}
                      </h5>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label className="small">Quantity</Form.Label>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="mx-2 text-center"
                            style={{ width: "60px" }}
                            min="1"
                          />
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={2} className="text-end">
                      <h5 className="fw-bold mb-3">₹{item.subtotal}</h5>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash className="me-1" />
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "100px" }}>
            <Card.Body>
              <h4 className="fw-bold mb-4">Order Summary</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="fw-bold">₹{total}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success fw-bold">FREE</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h5 className="fw-bold">Total</h5>
                <h5 className="fw-bold text-primary">₹{total}</h5>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 mb-3"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline-primary"
                size="lg"
                className="w-100"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Cart;
