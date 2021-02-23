import React, { Component } from "react";
import ReactDOM from "react-dom";
import logo from "../logo.png";

function NuevaContraseña() {
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
              <b>Nueva Contaseña</b>
            </div>
            <p className="login-box-msg">
              Bienvenido a Storm Alert Recuperación, por favor ingrese su nueva
              contraseña.
            </p>
            <form action="/" method="">
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Ingrese nueva contaseña"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-key" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repita la contraseña"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <br></br>
              <div className="row">
                <br></br>
                <div className="col-3"></div>
                <div className="col-6">
                  <a
                    href="/login"
                    className="btn btn-primary btn-block"
                    style={{
                      background: "#0B3688",
                      border: "#0B3688",
                    }}
                  >
                    Guardar Cambios
                  </a>
                </div>
                <div className="col-3"></div>
                <br></br>
                <br></br>
                <div className="col-3"></div>
                <div className="col-6">
                  <a
                    href="/login"
                    className="btn btn-primary btn-block"
                    style={{
                      background: "#0B3688",
                      border: "#0B3688",
                    }}
                  >
                    Ir a Iniciar Sesión
                  </a>
                </div>
                <div className="col-3"></div>
                {/* /.col */}
              </div>
            </form>
            <br></br>
            <br></br>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(node, document.getElementById("login"));
}

export default NuevaContraseña;
