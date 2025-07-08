import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="footer-cyber border-top">
      <Container>
        <Row className="text-cyber text-center text-md-start align-items-center gy-3">
          <Col xs={12} md={4}>
            <strong className="footer-brand d-block text-md-start">🚀 Rehacktor Project</strong>
          </Col>
          <Col xs={12} md={4}>
            <p className="m-0 footer-credit text-md-center">&copy; Made by Angelo Bizzoca</p>
          </Col>
          <Col xs={12} md={4} className="text-md-end">
            <small className="footer-year">{new Date().getFullYear()} Rehacktor</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
