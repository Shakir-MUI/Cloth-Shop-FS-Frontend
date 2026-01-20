import { Container } from "react-bootstrap";

function Contact() {
  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Contact Us</h2>

      <p>
        We’re here to help. If you have any questions, feedback, or need
        assistance, feel free to reach out to us.
      </p>

      <p>
        <strong>Email:</strong> support@stylon.com
      </p>
      <p>
        <strong>Phone:</strong> +91 90000 00000
      </p>
      <p>
        <strong>Business Hours:</strong> Monday to Saturday, 9:00 AM – 6:00 PM
      </p>

      <p>
        Our customer support team aims to respond to all queries within
        24–48 business hours.
      </p>
    </Container>
  );
}

export default Contact;
