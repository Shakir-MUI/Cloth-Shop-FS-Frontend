import { useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTruck, FaBoxOpen } from 'react-icons/fa';
import Confetti from 'react-confetti';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const paymentMethod = location.state?.paymentMethod;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  const getPaymentMessage = () => {
    switch (paymentMethod) {
      case 'cod':
        return {
          title: 'Order Confirmed!',
          subtitle: 'Cash on Delivery',
          message: 'Your order has been successfully placed. Please keep the exact amount ready for when our delivery partner arrives.',
          icon: <FaBoxOpen size={80} color="#27ae60" />
        };
      case 'upi':
        return {
          title: 'Payment Successful!',
          subtitle: 'UPI Payment Completed',
          message: 'Your payment has been successfully processed via UPI. Your order is now being prepared for shipment.',
          icon: <FaCheckCircle size={80} color="#27ae60" />
        };
      case 'card':
        return {
          title: 'Payment Successful!',
          subtitle: 'Card Payment Completed',
          message: 'Your payment has been successfully processed. Your order is now being prepared for shipment.',
          icon: <FaCheckCircle size={80} color="#27ae60" />
        };
      default:
        return {
          title: 'Order Confirmed!',
          subtitle: '',
          message: 'Your order has been successfully placed.',
          icon: <FaCheckCircle size={80} color="#27ae60" />
        };
    }
  };

  const paymentInfo = getPaymentMessage();

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
        gravity={0.3}
      />
      
      <Container className="py-5">
        <Card 
          className="shadow-lg border-0 text-center" 
          style={{ 
            maxWidth: '700px', 
            margin: '0 auto',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Card.Body className="p-5">
            <div className="mb-4 animate__animated animate__bounceIn">
              {paymentInfo.icon}
            </div>

            <h1 className="display-4 fw-bold mb-2 animate__animated animate__fadeIn">
              {paymentInfo.title}
            </h1>

            {paymentInfo.subtitle && (
              <h4 className="mb-4 animate__animated animate__fadeIn" style={{ opacity: 0.9 }}>
                {paymentInfo.subtitle}
              </h4>
            )}

            <div 
              className="p-4 mb-4 animate__animated animate__fadeIn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p className="mb-2" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                {paymentInfo.message}
              </p>
            </div>

            <div 
              className="mb-4 p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '15px'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: '1.1rem' }}>Order Number:</span>
                <span className="fw-bold" style={{ fontSize: '1.2rem' }}>
                  {order.order_number}
                </span>
              </div>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ fontSize: '1.1rem' }}>Total Amount:</span>
                <span className="fw-bold" style={{ fontSize: '1.3rem' }}>
                  ₹{order.total_amount}
                </span>
              </div>

              {order.transaction_id && (
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontSize: '1.1rem' }}>Transaction ID:</span>
                  <span className="fw-bold" style={{ fontSize: '1rem' }}>
                    {order.transaction_id}
                  </span>
                </div>
              )}
            </div>

            <div className="d-flex align-items-center justify-content-center mb-4">
              <FaTruck size={30} className="me-2" />
              <p className="mb-0" style={{ fontSize: '1.1rem' }}>
                Your order will be delivered within 3-5 business days
              </p>
            </div>

            <div className="d-flex gap-3 justify-content-center">
              <Button
                variant="light"
                size="lg"
                onClick={() => navigate('/')}
                style={{
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontWeight: '600'
                }}
              >
                Continue Shopping
              </Button>
              
              <Button
                variant="outline-light"
                size="lg"
                onClick={() => navigate('/orders')}
                style={{
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontWeight: '600',
                  borderWidth: '2px'
                }}
              >
                View Orders
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Additional Info Card */}
        <Card 
          className="mt-4 shadow-sm" 
          style={{ maxWidth: '700px', margin: '20px auto', borderRadius: '15px' }}
        >
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>What happens next?</h5>
            <div className="d-flex align-items-start mb-3">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                1
              </div>
              <div>
                <h6 className="fw-bold mb-1">Order Confirmation</h6>
                <p className="text-muted mb-0">
                  You'll receive an email confirmation with your order details
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start mb-3">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                2
              </div>
              <div>
                <h6 className="fw-bold mb-1">Order Processing</h6>
                <p className="text-muted mb-0">
                  We'll prepare your order and get it ready for shipment
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start">
              <div 
                className="me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                3
              </div>
              <div>
                <h6 className="fw-bold mb-1">Delivery</h6>
                <p className="text-muted mb-0">
                  Your order will be delivered to your doorstep soon!
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default OrderSuccess;