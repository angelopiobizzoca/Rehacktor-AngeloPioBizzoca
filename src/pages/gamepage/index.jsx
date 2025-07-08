import { useState, useEffect } from "react";
import { useParams } from "react-router";
import ToggleFavorite from "../../assets/components/ToggleFavorite";
import Chatbox from "../chatbox";

export default function GamePage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const initialUrl = `https://api.rawg.io/api/games/${id}?key=b14c9b9ef3c6412a8c11c0383ee9de61`;

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
  }, [id]);

  return (
    <div className="game-detail-wrapper">
      {error && <h1>{error}</h1>}
      {data && (
        <div className="container py-5">
          <div className="row align-items-start g-4">

            <div className="col-12 col-md-5 text-center">
              <img
                src={data.background_image}
                alt={data.name}
                className="game-image-cyber"
              />
            </div>

            <div className="col-12 col-md-7">
              <h1 className="game-title-cyber mb-4 neon-text flicker">{data.name}</h1>

              <p className="text-white mb-2"><strong>Data d'uscita:</strong> {data.released}</p>

              <div className="rating-box-cyber mb-3">
                <strong className="text-white me-2">Rating:</strong> {data.rating}
                <svg
                  className="rating-star cyber-glow"
                  fill="var(--cyber-pink)"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>

              </div>

              <p className="text-white"><strong>Info sul gioco:</strong></p>
              <p className="text-white">{data.description_raw}</p>
              <ToggleFavorite data={data} />
              <div className="style-chatbox">
                <Chatbox data={data && data} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
