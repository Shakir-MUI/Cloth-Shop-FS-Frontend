import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import { cartAPI, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'cod'
  });

  const [cardData, setCardData] = useState({
    card_number: '',
    card_name: '',
    expiry: '',
    cvv: ''
  });

  const [upiData, setUpiData] = useState({
    upi_id: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.data.count === 0) {
        toast.warning('Your cart is empty');
        navigate('/cart');
        return;
      }
      setCartItems(response.data.cart_items || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpiChange = (e) => {
    setUpiData({
      ...upiData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill all delivery details');
      return false;
    }

    if (formData.payment_method === 'card') {
      if (!cardData.card_number || !cardData.card_name || !cardData.expiry || !cardData.cvv) {
        toast.error('Please fill all card details');
        return false;
      }
    }

    if (formData.payment_method === 'upi') {
      if (!upiData.upi_id) {
        toast.error('Please enter UPI ID');
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simulate payment processing for UPI/Card
      if (formData.payment_method !== 'cod') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const orderData = {
        ...formData,
        transaction_id: formData.payment_method !== 'cod' 
          ? `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
          : ''
      };

      const response = await ordersAPI.create(orderData);
      
      toast.success('Order placed successfully!');
      navigate('/order-success', { 
        state: { 
          order: response.data.order,
          paymentMethod: formData.payment_method 
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <Form onSubmit={handlePlaceOrder}>
        <Row>
          <Col lg={8}>
            {/* Delivery Information */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4 className="fw-bold mb-4">Delivery Information</h4>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Pincode *</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="fw-bold mb-4">Payment Method</h4>
                
                <div className="mb-4">
                  <Form.Check
                    type="radio"
                    id="cod"
                    name="payment_method"
                    value="cod"
                    label={
                      <div className="d-flex align-items-center">
                        <FaMoneyBillWave size={24} className="me-2 text-success" />
                        <span className="fw-bold">Cash on Delivery</span>
                      </div>
                    }
                    checked={formData.payment_method === 'cod'}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <Form.Check
                    type="radio"
                    id="upi"
                    name="payment_method"
                    value="upi"
                    label={
                      <div className="d-flex align-items-center">
                        <FaMobileAlt size={24} className="me-2 text-primary" />
                        <span className="fw-bold">UPI Payment</span>
                      </div>
                    }
                    checked={formData.payment_method === 'upi'}
                    onChange={handleInputChange}
                  />
                  {formData.payment_method === 'upi' && (
                    <div className="mt-3 ps-4">
                      <Form.Group>
                        <Form.Label>UPI ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="upi_id"
                          placeholder="yourname@upi"
                          value={upiData.upi_id}
                          onChange={handleUpiChange}
                        />
                      </Form.Group>
                    </div>
                  )}
                </div>

                <div>
                  <Form.Check
                    type="radio"
                    id="card"
                    name="payment_method"
                    value="card"
                    label={
                      <div className="d-flex align-items-center">
                        <FaCreditCard size={24} className="me-2 text-info" />
                        <span className="fw-bold">Credit/Debit Card</span>
                      </div>
                    }
                    checked={formData.payment_method === 'card'}
                    onChange={handleInputChange}
                  />
                  {formData.payment_method === 'card' && (
                    <div className="mt-3 ps-4">
                      <Row>
                        <Col md={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="card_number"
                              placeholder="1234 5678 9012 3456"
                              value={cardData.card_number}
                              onChange={handleCardChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Cardholder Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="card_name"
                              placeholder="Name on card"
                              value={cardData.card_name}
                              onChange={handleCardChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiry"
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={handleCardChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={cardData.cvv}
                              onChange={handleCardChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm sticky-top" style={{ top: '100px' }}>
              <Card.Body>
                <h4 className="fw-bold mb-4">Order Summary</h4>
                
                <div className="mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span className="text-truncate" style={{ maxWidth: '200px' }}>
                        {item.product_details.name} x {item.quantity}
                      </span>
                      <span className="fw-bold">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
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
                  className="w-100"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default Checkout;