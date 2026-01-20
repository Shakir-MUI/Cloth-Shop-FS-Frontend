import { Container } from "react-bootstrap";

function Shipping() {
  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Shipping Information</h2>

      <p>
        STYLON offers reliable and timely shipping to ensure your orders reach
        you safely and efficiently.
      </p>

      <ul>
        <li>Orders are processed within 1–2 business days.</li>
        <li>Standard delivery time is 3–7 business days.</li>
        <li>Shipping charges, if applicable, are displayed at checkout.</li>
        <li>Free shipping may be available on selected orders.</li>
      </ul>

      <p>
        Once your order is shipped, you will receive a confirmation message with
        tracking details.
      </p>
    </Container>
  );
}

export default Shipping;
