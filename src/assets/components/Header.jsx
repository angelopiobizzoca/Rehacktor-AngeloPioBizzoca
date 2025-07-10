import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import GenresDropdown from '../../assets/components/GenresDropdown';
import { Link, useNavigate } from 'react-router';
import { supabase } from "../../pages/supabase/client-supabase";
import SessionContext from '../../context/SessionContext';
import { useContext, useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

export default function Header() {
  const { session, setSession } = useContext(SessionContext);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const favoriteGameUI = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem',
    borderBottom: '1px solid #333',
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      setSession(null);
      alert('Signed out');
      navigate('/');
    }
  };

  const removeFavorite = async (game_id) => {
    setFavorites((prev) => prev.filter((game) => game.game_id !== game_id));
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session?.user.id);
      if (!error) setFavorites(data);
    };

    if (session) fetchFavorites();
  }, [session]);

  useEffect(() => {
    const downloadImage = async (path) => {
      try {
        const { data, error } = await supabase.storage.from('avatars').download(path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      } catch (error) {
        console.error('Errore nel download dell\'immagine: ', error.message);
      }
    };

    const avatarPath = session?.user?.user_metadata?.avatar_url;
    if (avatarPath) downloadImage(avatarPath);
  }, [session]);

  return (
    <Navbar style={{ backgroundColor: 'var(--bg-light)' }} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link}
          to="/" style={{ color: 'var(--primary)' }}>
          Rehacktor Gameshop
        </Navbar.Brand>

        <GenresDropdown />

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* <Nav.Link href="#" className="nav-services-btn">🎯 Servizi</Nav.Link> */}
            {!session ? (
              <>
                <Link to="/login" className="btn-cyberpunk">Login</Link>
                <Link to="/register" className="btn-cyberpunk ms-2">Register</Link>
              </>
            ) : (
              <NavDropdown
                title="👤 Account"
                id="account-dropdown"
                align="end"
                className="nav-dropdown-cyber dropdown-account-cyber pt-2"
                menuVariant="dark"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/account"
                  className="dropdown-item-cyber"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 0 5px black'
                      }}
                    />
                  )}
                  Hey, {session?.user.user_metadata.first_name}
                </NavDropdown.Item>

                <NavDropdown.Item as={Link} to="/profile" className="dropdown-item-cyber">
                  Preferiti
                </NavDropdown.Item>



                <NavDropdown.Divider />

                <NavDropdown.Item
                  as="button"
                  className="dropdown-item-cyber logout-item"
                  onClick={signOut}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
