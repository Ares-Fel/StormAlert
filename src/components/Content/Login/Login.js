import React, { Component, useState, useContext, useCallback } from "react";
import ReactDOM from "react-dom";
import { Redirect, withRouter } from "react-router";

import app from "../../../firebase-config";
import { AuthContext } from "../../../Auth";

import firebase from "firebase";
import { auth } from "reactfire";
import { Link } from "react-router-dom";

function Login() {
  const { currentUser } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState(false);

  const logo = "./assets/logo.png";
  const iconG = "./assets/google-icon.png";

  var provider = new firebase.auth.GoogleAuthProvider();
  const crearUsuarioAuth = app.functions().httpsCallable("crearUsuarioAuth");

  const loginGoogle = useCallback(async (event) => {
    app
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        app
          .firestore()
          .collection("users")
          .doc(localStorage.getItem("usuario"))
          .get()
          .then((usuario) => {
            if (usuario.exists) {
              localStorage.setItem("usuarioToken", true);
              window.location.replace("/");
            } else {
              window.location.replace("/registro");
            }
          });

        var credential = result.credential;
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
      })
      .catch((error) => {
        console.log("horror");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  });

  async function loginUser(event) {
    event.preventDefault();
    const { email, password } = event.target.elements;

    if (
      email.value.match(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )
    ) {
      console.log("object");
    } else {
      setErrorMsg(true);
    }

    await app
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((user) => {
        localStorage.setItem("usuarioToken", true);
        window.location.replace("/");
      })
      .catch(() => {
        app
          .firestore()
          .collection("users")
          .where("email", "==", email.value)
          .get()
          .then((snap) => {
            if (!snap.empty) {
              var idUser = "";
              snap.forEach((doc) => {
                idUser = doc.data().idUserAuth;
              });
              crearUsuarioAuth({
                idUserAuth: idUser,
                email: email.value,
                password: password.value,
              })
                .then(() => {
                  app
                    .auth()
                    .signInWithEmailAndPassword(email.value, password.value)
                    .then(() => {
                      localStorage.setItem("usuarioToken", true);
                      window.location.replace("/");
                    });
                })
                .catch((err) => console.log(err));
            } else {
              setErrorMsg(true);
            }
          });
      });
  }

  /*if (currentUser) {
    return <Redirect to="/"></Redirect>;
  }*/

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
              <b>Iniciar Sesión</b>
            </div>
            <p className="login-box-msg">
              Bienvenido a Storm Alert, por favor ingrese con los datos de su
              cuenta personal.
            </p>
            <form onSubmit={loginUser}>
              <div className="input-group mb-3">
                <input
                  name="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="far fa-id-card" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row mx-auto">
                {errorMsg ? (
                  <div className="col-12" style={{ textAlign: "center" }}>
                    <p className="mb-1" style={{ color: "red" }}>
                      Ingrese un correo registrado, compruebe que la contraseña
                      sea mayor a 6 caracteres.
                    </p>
                  </div>
                ) : null}
                <div className="col-12" style={{ textAlign: "center" }}>
                  <p className="mb-1">
                    <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
                  </p>
                </div>
                {/* /.col */}
                <div className="col-10 m-2 mx-auto">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{
                      background: "#0B3688",
                      border: "#0B3688",
                    }}
                  >
                    Iniciar Sesión
                  </button>
                </div>

                {/* /.col */}
              </div>
            </form>
            <div className="col-10 m-2 mx-auto">
              <button
                onClick={() => loginGoogle()}
                type="submit"
                className="btn btn-primary btn-block shadow"
                style={{
                  background: "rgb(255,255,255)",
                  borderColor: "rgba(0,0,0,0.2)",
                  boxShadow: "rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={iconG}
                  className="mr-3 mb-1"
                  style={{ width: 20 }}
                ></img>
                <span style={{ color: "rgba(0,0,0,0.8)" }}>
                  Iniciar Sesión con Google
                </span>
              </button>
            </div>
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

export default withRouter(Login);
