import { useEffect, useState } from "react";
import { Container, Card, Spinner, Table, Badge } from "react-bootstrap";
import { ordersAPI } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-4 shadow-sm">
            <Card.Body>
              {/* Order Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Order #{order.order_number}
                </h6>
                <Badge bg="info">
                  {order.order_status_display}
                </Badge>
              </div>

              <p className="mb-1">
                <strong>Payment Method:</strong>{" "}
                {order.payment_method_display}
              </p>

              <p className="mb-3">
                <strong>Total Amount:</strong> ₹{order.total_amount}
              </p>

              {/* Order Items Table */}
              <Table bordered responsive size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name}</td>
                      <td>₹{item.product_price}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Orders;
