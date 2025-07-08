import { useState, useEffect, useContext } from "react";
import { supabase } from "../supabase/client-supabase";
import SessionContext from "../../context/SessionContext";
import Avatar from "../../assets/components/Avatar";
import { Link } from "react-router";

export default function AccountPage() {
    const { session } = useContext(SessionContext);

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [avatar_url, setAvatarUrl] = useState(null);

    useEffect(() => {
        let ignore = false;
        const getProfile = async () => {
            if (!session?.user)
                return
            setLoading(true);
            const { user } = session;

            const { data, error } = await supabase
                .from("profiles")
                .select("username, first_name, last_name, avatar_url")
                .eq("id", user.id)
                .single();

            if (!ignore) {
                if (error) {
                    console.warn(error);
                } else if (data) {
                    setUsername(data.username);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setAvatarUrl(data.avatar_url);
                }
            }

            setLoading(false);
        };

        getProfile();

        return () => {
            ignore = true;
        };
    }, [session]);

    const updateProfile = async (event, avatarUrl) => {
        event.preventDefault();

        setLoading(true);
        const { user } = session;

        const updates = {
            id: user.id,
            username,
            first_name,
            last_name,
            avatar_url: avatarUrl,
            updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) {
            alert(error.message);
        } else {
            setAvatarUrl(avatarUrl);
        }

        setLoading(false);
    };

    return (
  <div className="page-wrapper-cyber">
    <div className="form-container-cyber">
      <h2 className="form-title-cyber">Impostazioni profilo</h2>
      <form onSubmit={updateProfile} className="form-cyber">
        <div className="avatar-wrapper-cyber">
          <div className="avatar-container-cyber">
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(event, url) => {
                updateProfile(event, url);
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            className="input-cyber"
            value={session?.user?.email || ''}
            disabled
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="input-cyber"
            required
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="first_name">Nome</label>
          <input
            id="first_name"
            type="text"
            className="input-cyber"
            value={first_name || ''}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="last_name">Cognome</label>
          <input
            id="last_name"
            type="text"
            className="input-cyber"
            value={last_name || ''}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mt-3">
           <button
           type="submit" className="btn-accent" disabled={loading}>
            {loading ? 'Caricamento...' : 'Aggiorna'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
