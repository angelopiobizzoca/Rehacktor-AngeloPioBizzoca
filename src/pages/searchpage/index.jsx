import { useEffect } from "react";
import { useSearchParams } from "react-router";
import CardGame from "../../assets/components/CardGame";
import useFetchSolution from "../../pages/hook/useFetchSolution";
import { Container, Row, Col } from "react-bootstrap";

export default function SearchPage() {
  let [searchParams] = useSearchParams();
  const game = searchParams.get("query");

  const initialUrl = `https://api.rawg.io/api/games?key=b14c9b9ef3c6412a8c11c0383ee9de61&search=${game}`;

  const { loading, data, error, updateUrl } = useFetchSolution(initialUrl);

  useEffect(() => {
    updateUrl(initialUrl);
  }, [initialUrl, updateUrl]);

  return (
    <div className="genre-page-wrapper">
      <Container>
        <h2 className="homepage-title-cyber text-center py-5 neon-text flicker">
          Risultati per: {game} game
        </h2>

        {loading && <p className="text-white">Caricamento in corso...</p>}
        {error && <h1 className="text-danger">{error}</h1>}

        <Row className="gy-4">
          {data &&
            data.results.map((game) => (
              <Col key={game.id} xs={12} md={6} lg={3}>
                <div className="card-wrapper-cyber">
                  <CardGame game={game} />
                </div>
              </Col>
            ))
          }
        </Row>

      </Container>
    </div>
  );

}
