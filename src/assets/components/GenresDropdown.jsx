import { useState, useEffect } from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';

export default function GenresDropdown() {
  const [genres, setGenres] = useState(null);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const initialUrl = `https://api.rawg.io/api/genres?key=b14c9b9ef3c6412a8c11c0383ee9de61`;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(initialUrl);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setGenres(json);
      } catch (error) {
        setError(error.message);
        setGenres(null);
      }
    };
    load();
  }, []);

  const handleSelect = (genreSlug) => {
    navigate(`/games/${genreSlug}`);
    setShowDropdown(false);
  };

  return (
    <div
      className="d-flex justify-content-center my-4"
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Dropdown as={ButtonGroup} show={showDropdown}>
        <Dropdown.Toggle
          className="dropdown-btn-cyber pt-2"
          id="dropdown-genres"
        >
          🎮 Generi
        </Dropdown.Toggle>

        <Dropdown.Menu className="dropdown-menu-cyber">
          {error && <Dropdown.Item disabled>{error}</Dropdown.Item>}
          {genres &&
            genres.results.map((genre) => (
              <Dropdown.Item
                key={genre.id}
                onClick={() => handleSelect(genre.slug)}
              >
                {genre.name}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
