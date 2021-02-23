import React, { useContext, useState, useEffect } from "react";
import app from "../../firebase-config";

import { NavLink, Link } from "react-router-dom";
import "../Content/avatar.css";
import { AuthContext } from "../../Auth";

import Switch from "react-switch";
import { getDefaultNormalizer } from "@testing-library/react";

const Header = () => {
  const { currentUser, userData } = useContext(AuthContext);
  const [user, setUser] = useState()
  const logo = "./assets/logo.png";

  const usuarioId = localStorage.getItem("usuario");
  const notification = localStorage.getItem("notification")

  async function getData() {
    await app
      .firestore()
      .collection("users")
      .doc(usuarioId)
      .onSnapshot(snap => {
        setUser(snap.data())
      })


  }

  const signout = () => {
    app
      .firestore()
      .collection("users")
      .doc(usuarioId)
      .update({ token: "", connected: false })
      .then(() => {
        app.auth().signOut();
        localStorage.clear();
        window.location.replace("/login");
      });
  };

  async function offNotification(notification, id) {
    if (notification) {
      await app.firestore()
        .collection("users")
        .doc(usuarioId)
        .update({ notification: false })
    } else {
      await app.firestore()
        .collection("users")
        .doc(usuarioId)
        .update({ notification: true })
    }

  }
  useEffect(() => {
    getData()
  }, [])

  const header = (
    <>
      <nav
        className="main-header navbar navbar-expand-md navbar-light navbar-dark"
        style={{ backgroundColor: "#0B3688" }}
      >
        <div className="container">
          <a href="/" className="navbar-brand">
            <img
              src={logo}
              alt="StormAlert"
              className="img-circle elevation-3 mr-3"
              style={{ width: 50 }}
            />
            <span className="brand-text font-weight-light">StormAlert</span>
          </a>
          <button
            className="navbar-toggler order-1"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse order-1" id="navbarCollapse">
            {/* Left navbar links */}
            {userData.tipoUsuario == "Administrador" ? <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  <i className="fas fa-home mr-2"></i>
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/chat" className="nav-link">
                  <i className="fas fa-comments mr-2"></i>
                  Chat
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <NavLink to="/usuarios" className="nav-link">
                  <i className="fas fa-users-cog mr-2"></i>
                  Usuarios
                </NavLink>
              </li>
            </ul> : <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    <i className="fas fa-home mr-2"></i>
                    Inicio
                </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/chat" className="nav-link">
                    <i className="fas fa-comments mr-2"></i>
                    Chat
                </NavLink>
                </li>
              </ul>}

          </div>
          <div className="collapse navbar-collapse order-3" id="navbarCollapse">
            {/* Left navbar links */}
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown" style={{ borderRadius: 5, backgroundColor: "rgba(33,25,21,0.5)", padding: -10 }}>
                <div className="form-group">

                  <a className="nav-link" data-widget="control-sidebar" data-slide="true" href="#">
                    <div className="avatar2 small direct-chat-img mr-2">
                      {userData == "" ? <span>Cargando...</span>
                        : <span>{userData.nombres.charAt(0)}{userData.apellidos.charAt(0)}</span>}

                    </div>
                    <div className="row"><span className="col-md-12">{userData.nombres} {userData.apellidos}</span>
                      <div><i className="fa fa-circle text-success" /> {userData.connected?"Online":"Offline"}</div>
                    </div>
                  </a>
                </div>
              </li  >

            </ul>
          </div>
          {/* Right navbar links */}
        </div>
      </nav>
      <aside className="control-sidebar control-sidebar-dark">
        <br></br>
        <br></br>
        <div className="row mx-3">
          <div className="col-md-12 mb-4">
            <i className="fas fa-user-cog mr-2"></i>
            CONFIGURACIONES
            </div>
          <div className="col-md-12">
            <div className="mb-1">Activar notificaciones:</div>
            {user ? <Switch className="ml-3"
              onChange={() =>
                offNotification(user.notification, user.idUserAuth)
              }
              checked={user.notification}
            ></Switch> :
              <>Cargando...</>}
          </div>
          <br></br>
          <div className="col-md-12 mt-5 ml-4">
            <button className="btn btn-primary" onClick={() => signout()} style={{ width: 160 }} >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Cerrar Sessión
            </button>
          </div>
        </div>
      </aside>
    </>
  );
  return header;
};

export default Header;
