import { useContext, useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { supabase } from "../../pages/supabase/client-supabase";
import SessionContext from "../../context/SessionContext";
import { Link } from "react-router"; 

export default function ToggleFavorite({ data }) {
  const { session } = useContext(SessionContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session?.user?.id) return;

      const { data: favs, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Errore nel recupero dei preferiti:", error);
      } else {
        setFavorites(favs || []);
      }
    };

    fetchFavorites();
  }, [session]);

  const isFavorite = () =>
    favorites.some(
      (el) => +el.game_id === +data?.id && el.user_id === session?.user.id
    );

  const addFavorite = async () => {
    if (!data?.id || !session?.user?.id) return;

    const favoriteData = {
      user_id: session.user.id,
      game_id: data.id,
      game_name: data.name,
      game_image: data.background_image,
    };

    const { data: inserted, error } = await supabase
      .from("favorites")
      .insert([favoriteData])
      .select();

    if (error) {
      console.error("Errore nell'aggiunta del preferito:", error);
    } else if (inserted?.length > 0) {
      setFavorites((prev) => [...prev, ...inserted]);
    }
  };

  const removeFavorite = async () => {
    if (!data?.id || !session?.user?.id) return;

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("game_id", data.id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Errore nella rimozione del preferito:", error);
    } else {
      setFavorites((prev) =>
        prev.filter(
          (el) => !(+el.game_id === +data.id && el.user_id === session.user.id)
        )
      );
    }
  };

  

return (
  <div className="d-flex justify-content-center align-items-center my-2">
    {session?.user ? (
      isFavorite() ? (
        <button
          onClick={removeFavorite}
          aria-label="Rimuovi dai preferiti"
          className="btn-fav-cyber active"
        >
          <FaHeart />
        </button>
      ) : (
        <button
          onClick={addFavorite}
          aria-label="Aggiungi ai preferiti"
          className="btn-fav-cyber"
        >
          <FaRegHeart />
        </button>
      )
    ) : (
      <span className="text-white access small text-center">
        Accedi per aggiungere ai preferiti
      </span>
    )}
  </div>
);


}
