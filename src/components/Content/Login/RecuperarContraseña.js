import React, { Component } from "react";
import ReactDOM from "react-dom";
import app from "../../../firebase-config";

function RecuperarContraseña() {
  const logo = "./assets/logo.png";

  function restablecerPassword(event) {
    event.preventDefault();
    const { email } = event.target.elements;
    app
      .auth()
      .sendPasswordResetEmail(email.value)
      .then(function () {
        console.log("enviado");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const node = (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="">
            <img src={logo} style={{ width: 120 }} />
          </a>
        </div>
        {/* /.login-logo */}
        <div className="card">
          <div className="card-body login-card-body">
            <div className="login-logo" style={{ color: "#0B3688" }}>
              <b>Recuperar Contraseña</b>
            </div>
            <p className="login-box-msg">
              Bienvenido a Storm Alert Recuperación, por favor ingrese su
              correo.<br></br>
              Se le enviará un link de recuperación.
            </p>
            <form onSubmit={restablecerPassword}>
              <div className="input-group mb-3">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@correo.com"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <br></br>
              <div className="row mx-auto">
                <div className="col-10 m-2 mx-auto">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{
                      background: "#0B3688",
                      border: "#0B3688",
                    }}
                  >
                    Enviar
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
            <div className="col-10 m-2 mx-auto">
              <a
                href="/login"
                className="btn btn-primary btn-block"
                style={{
                  background: "#0B3688",
                  border: "#0B3688",
                }}
              >
                Regresar
              </a>
            </div>
            <br></br>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(node, document.getElementById("login"));
}

export default RecuperarContraseña;
