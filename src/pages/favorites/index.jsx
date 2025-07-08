import { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { supabase } from '../supabase/client-supabase';
import SessionContext from '../../context/SessionContext';
import CardGame from '../../assets/components/CardGame';

const RAWG_API_KEY = 'b14c9b9ef3c6412a8c11c0383ee9de61';

export default function FavoritesPage() {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Errore nel recupero dei preferiti:', error.message);
          setLoading(false);
          return;
        }

        const detailedGames = await Promise.all(
          data.map(async (fav) => {
            try {
              const res = await fetch(`https://api.rawg.io/api/games/${fav.game_id}?key=${RAWG_API_KEY}`);
              if (!res.ok) {
                console.warn(`Impossibile recuperare dettagli per gioco id: ${fav.game_id}`);
                return {
                  id: fav.game_id,
                  name: fav.game_name,
                  background_image: fav.game_image,
                };
              }
              const details = await res.json();
              return {
                id: fav.game_id,
                name: fav.game_name,
                background_image: fav.game_image,
                genres: details.genres,
                released: details.released,
              };
            } catch (fetchError) {
              console.error('Errore fetch dettagli gioco:', fetchError);
              return {
                id: fav.game_id,
                name: fav.game_name,
                background_image: fav.game_image,
              };
            }
          })
        );

        setFavorites(detailedGames);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session, navigate]);

  return (
    <div style={{ backgroundColor: 'var(--bg-home)', minHeight: '100vh' }}>
      <h1 className="homepage-title-cyber text-center py-3">I tuoi giochi preferiti</h1>
      <Container>
        {loading && <p className="text-center">Caricamento...</p>}
        {!loading && favorites.length === 0 && (
          <p className="text-center text-white">Non hai ancora aggiunto giochi ai preferiti.</p>
        )}

        <Row>
          {favorites.map((game) => (
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
