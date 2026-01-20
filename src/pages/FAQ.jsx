import { Container } from "react-bootstrap";

function FAQ() {
  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Frequently Asked Questions</h2>

      <h6 className="fw-bold mt-3">How do I place an order?</h6>
      <p>
        Browse our collections, add items to your cart, and proceed to checkout
        to place your order.
      </p>

      <h6 className="fw-bold mt-3">What payment methods are accepted?</h6>
      <p>
        We accept Cash on Delivery, UPI, and Debit/Credit card payments.
      </p>

      <h6 className="fw-bold mt-3">Can I cancel my order?</h6>
      <p>
        Orders can be cancelled before they are shipped. Please contact support
        as soon as possible.
      </p>

      <h6 className="fw-bold mt-3">How can I track my order?</h6>
      <p>
        Once shipped, tracking details will be shared via email or SMS.
      </p>
    </Container>
  );
}

export default FAQ;
