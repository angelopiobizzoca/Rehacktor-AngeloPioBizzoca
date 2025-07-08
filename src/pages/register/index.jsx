import { useState } from "react";
import {
  ConfirmSchema,
  getErrors,
  getFieldError,
} from "../../lib/validationForm";

import { useNavigate } from "react-router";
import { supabase } from "../supabase/client-supabase";
import { Container, Row, Col } from "react-bootstrap";

export default function RegisterPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formState, setFormState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const { error, data } = ConfirmSchema.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      console.log(errors);
    } else {
      let { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName || "",
            last_name: data.lastName || "",
            username: data.username || "",
          },
        },
      });

      if (error) {
        alert("Signing up error!");
      } else {
        alert("Signed up!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }
    }
  };

  const onBlur = (property) => () => {
    const message = getFieldError(property, formState[property]);
    setFormErrors((prev) => ({ ...prev, [property]: message }));
    setTouchedFields((prev) => ({ ...prev, [property]: true }));
  };

  const isInvalid = (property) => {
    if (formSubmitted || touchedFields[property]) {
      return !!formErrors[property];
    }
    return undefined;
  };

  const setField = (property, valueSelector) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: valueSelector ? valueSelector(e) : e.target.value,
    }));
  };

  return (
    <Container className="page-wrapper-cyber d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col xs={12} md={6} lg={3} className="mx-auto">
          <div className="form-container-cyber">
            <form onSubmit={onSubmit} noValidate className="form-cyber">
              <h2 className="form-title-cyber">Registrati</h2>

              <label htmlFor="email">Email:</label>
              <input
                className="input-cyber"
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={setField("email")}
                onBlur={onBlur("email")}
                aria-invalid={isInvalid("email")}
                required
              />
              {formErrors.email && (
                <small className="error-cyber">{formErrors.email}</small>
              )}

              <label htmlFor="firstName">Nome:</label>
              <input
                className="input-cyber"
                type="text"
                id="firstName"
                name="firstName"
                value={formState.firstName}
                onChange={setField("firstName")}
                onBlur={onBlur("firstName")}
                aria-invalid={isInvalid("firstName")}
                required
              />
              {formErrors.firstName && (
                <small className="error-cyber">{formErrors.firstName}</small>
              )}

              <label htmlFor="lastName">Cognome:</label>
              <input
                className="input-cyber"
                type="text"
                id="lastName"
                name="lastName"
                value={formState.lastName}
                onChange={setField("lastName")}
                onBlur={onBlur("lastName")}
                aria-invalid={isInvalid("lastName")}
                required
              />
              {formErrors.lastName && (
                <small className="error-cyber">{formErrors.lastName}</small>
              )}

              <label htmlFor="username">Username:</label>
              <input
                className="input-cyber"
                type="text"
                id="username"
                name="username"
                value={formState.username}
                onChange={setField("username")}
                onBlur={onBlur("username")}
                aria-invalid={isInvalid("username")}
                required
              />
              {formErrors.username && (
                <small className="error-cyber">{formErrors.username}</small>
              )}

              <label htmlFor="password">Password:</label>
              <input
                className="input-cyber"
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={setField("password")}
                onBlur={onBlur("password")}
                aria-invalid={isInvalid("password")}
                required
              />
              {formErrors.password && (
                <small className="error-cyber">{formErrors.password}</small>
              )}

              <button type="submit" className="btn-accent mt-3">
                Registrati
              </button>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
