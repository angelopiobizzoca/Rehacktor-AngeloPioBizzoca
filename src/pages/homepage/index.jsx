import { useState, useEffect } from "react";
import CardGame from '../../assets/components/CardGame';
import { Row, Col, Container } from 'react-bootstrap';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const initialUrl = `https://api.rawg.io/api/games?key=b14c9b9ef3c6412a8c11c0383ee9de61&dates=2024-01-01,2024-12-31&page=1`;

  const load = async () => {
    try {
      const response = await fetch(initialUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const json = await response.json();
      setData(json);
    } catch (error) {
      setError(error.message);
      setData(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh' }}>
      <h1 className="homepage-title-cyber text-center py-3">Rehacktor GameShop</h1>
      <Container>
        {error && <article className="text-danger text-center">{error}</article>}

        <Row>
          {data && data.results.map((game) => (
            <Col key={game.id} xs={12} md={6} lg={3} className="mb-4 d-flex">
              <div className="card-wrapper-cyber w-100 d-flex flex-column">
                <CardGame game={game} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
