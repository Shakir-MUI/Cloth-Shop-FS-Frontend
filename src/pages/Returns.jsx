import { Container } from "react-bootstrap";

function Returns() {
  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Returns & Exchanges</h2>

      <p>
        Customer satisfaction is important to us. If you are not completely
        satisfied with your purchase, we offer a simple return and exchange
        policy.
      </p>

      <ul>
        <li>Returns are accepted within 7 days of delivery.</li>
        <li>Items must be unused, unwashed, and in original packaging.</li>
        <li>Refunds are processed after quality verification.</li>
        <li>Exchanges are subject to product availability.</li>
      </ul>

      <p>
        To initiate a return or exchange, please contact our support team with
        your order details.
      </p>
    </Container>
  );
}

export default Returns;
