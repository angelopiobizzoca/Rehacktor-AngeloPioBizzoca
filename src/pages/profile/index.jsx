import { useContext } from "react";
import SessionContext from "../../context/SessionContext";
import FavoritesContext from "../../context/FavoritesContext";
import { FaTrashAlt } from "react-icons/fa";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

export default function ProfilePage() {
  const { session } = useContext(SessionContext);
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  return (
<div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh' }}>

    <h2 className="text-cyber glow text-center pt-3">
          Hey {session?.user.user_metadata.first_name} 🖐
        </h2>
          <Container className="text-light">

        <details className="favorites-panel-cyber">
          <summary className="favorites-title-cyber pt-3">
            🎮 I tuoi giochi preferiti
          </summary>

          {favorites.length === 0 ? (
            <p className="text-cyber-muted">Non ci sono favoriti al momento...</p>
          ) : (
            <Row xs={1} md={2} className="g-3">
              {favorites.map((game) => (
                <Col key={game.id}>
                  <div className="favorite-card-cyber">
                    <div className="d-flex align-items-center gap-3">
                      <Image
                        src={game.game_image}
                        alt={game.game_name}
                        width={70}
                        height={70}
                        rounded
                      />
                      <span className="text-cyber">{game.game_name}</span>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="delete-btn-cyber"
                      onClick={() => removeFavorite(game.game_id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </details>
      </Container>
      </div>

      );

}
