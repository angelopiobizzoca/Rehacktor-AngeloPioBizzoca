import { useNavigate } from 'react-router';
import LazyLoadGameImage from './LazyLoadGameImage';
import { Card, Button } from 'react-bootstrap';

export default function CardGame({ game }) {
  const navigate = useNavigate();

  const genres = game.genres?.map((genre) => genre.name).join(', ') || '';
  const image = game.background_image || game.game_image || '';
  const slug = game.slug || '';
  const released = game.released || '';

  const handleClick = () => {
    navigate(slug ? `/games/${slug}/${game.id}` : `/games/${game.id}`);
  };

  return (
    <Card
      style={{ backgroundColor: 'var(--primary)', color: 'var(--text)', borderColor: 'var(--border)' }}
      className="h-100 d-flex flex-column shadow-sm border-white"
    >
      <LazyLoadGameImage image={image} variant="top" />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="mt-2 text-muted">{game.name}</Card.Title>

        {genres && (
          <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
            {genres}
          </Card.Subtitle>
        )}

        {released && (
          <Card.Text className="mb-2 text-muted">Uscita: {released}</Card.Text>
        )}

        <div className="mt-auto">
          <Button className="btn-accent w-100" onClick={handleClick}>
            Dettagli
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
