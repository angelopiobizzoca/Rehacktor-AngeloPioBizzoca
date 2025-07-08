import { useEffect, useState, useContext } from 'react';
import { supabase } from '../../pages/supabase/client-supabase';
import SessionContext from '../../context/SessionContext';

export default function Avatar({ url, size = 100, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { setSession } = useContext(SessionContext);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Errore nel download immagine: ', error.message);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Seleziona un\'immagine da caricare.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;


      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

  
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: filePath }
      });
      if (updateError) throw updateError;

    
      const { data: newSession, error: sessionError } = await supabase.auth.getSession();
      if (!sessionError && newSession?.session) {
        setSession(newSession.session);
      }


      if (onUpload) onUpload(event, filePath);
      downloadImage(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{
            height: size,
            width: size,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '3px 3px 8px black'
          }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{
            height: size,
            width: size,
            borderRadius: '50%',
            backgroundColor: '#444'
          }}
        />
      )}
      <label className="avatar-overlay-cyber pt-2" style={{ position: 'absolute', left: 0, right: 0, textAlign:'center', cursor: 'pointer' }}>
        <span style={{ fontSize: '0.9rem' }}>
          {uploading ? "Caricamento..." : "Cambia"}
        </span>
        <input
          type="file"
          accept="image/*"
          id="single"
          style={{ opacity: 0, position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, cursor: 'pointer' }}
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
