import { useState, useEffect } from "react";
import { useParams } from "react-router";
import CardGame from '../../assets/components/CardGame';
import { Row, Col, Container } from 'react-bootstrap';

export default function GenrePage() {
  const { genre } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const initialUrl = `https://api.rawg.io/api/games?key=b14c9b9ef3c6412a8c11c0383ee9de61&genres=${genre}&page=1`;

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
  }, [genre]);

  return (
    <div className="genre-page-wrapper">
      <h2 className="homepage-title-cyber text-center py-5 neon-text flicker">
        Welcome to {genre} page
      </h2>
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
