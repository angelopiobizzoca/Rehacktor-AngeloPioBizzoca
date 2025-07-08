import { useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { supabase } from '../supabase/client-supabase';
import SessionContext from "../../context/SessionContext";
import RealtimeChat from "../../pages/realtimechat";

export default function Chatbox({ data }) {
  const { session } = useContext(SessionContext);

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { message } = Object.fromEntries(new FormData(form));

    if (!session?.user || !data?.id) {
      console.error("Errore: Utente non autenticato o ID del gioco non disponibile.");
      return;
    }

    if (typeof message === "string" && message.trim().length !== 0) {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            profile_id: session.user.id,
            profile_username: session.user.user_metadata.username,
            game_id: data.id,
            content: message.trim(),
          },
        ])
        .select();

      if (error) {
        console.error("Errore nell'invio del messaggio:", error);
      } else {
        form.reset();
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h4 className="mb-3 text-cyber glow">💬 Gamers Chat</h4>
          <RealtimeChat data={data} />
          <Form onSubmit={handleMessageSubmit}>
            <Form.Group className="d-flex gap-2">
              <Form.Control
                type="text"
                name="message"
                placeholder="Scrivi un messaggio..."
                className="chat-input-cyber"
                aria-label="Message input"
                required
              />
              <Button type="submit" className="btn-cyber">
                Invia
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
