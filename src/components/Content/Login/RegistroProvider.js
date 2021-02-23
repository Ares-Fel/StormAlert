import React, { Component, useState, useContext } from "react";
import Swal from "sweetalert2";
import ReactDOM from "react-dom";
import app from "../../../firebase-config";
import { AuthContext } from "../../../Auth";

function RegistroProvider() {
  const logo = "./assets/logo.png";
  const { currentUser } = useContext(AuthContext);
  const usuarioId = localStorage.getItem("usuario");

  const [errorMsg, setErrorMsg] = useState(false);

  function resultDialog(estado) {
    if (estado == "error") {
      Swal.fire(
        "Error de Registro",
        "El usuario con este número de documento ya existe.",
        "error"
      );
    } else {
      Swal.fire({
        title: "Nuevo Registro",
        text: "Porfavor espere a que se habilite su cuenta.",
        confirmButtonText: `Ok`,
      }).then((res) => {
        localStorage.setItem("usuarioToken", true);
        window.location.replace("/");
      });
    }
  }
  function spinnerModal() {
    let timerInterval;
    Swal.fire({
      title: "Procesando registro",
      html: "Espere un momento por favor.",
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Swal.getTimerLeft();
            }
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }

  async function registrarUsuario(event) {
    event.preventDefault();
    const {
      tipoDoc,
      nroDoc,
      nombres,
      apellidos,
      cargo,
      empresa,
      email,
    } = event.currentTarget.elements;

    const crearUsuario = app.functions().httpsCallable("crearUsuarioGoogle");
    if (
      tipoDoc.value &&
      nroDoc.value &&
      nombres.value &&
      apellidos.value &&
      cargo.value &&
      empresa.value
    ) {
      console.log("object");
      spinnerModal();
      crearUsuario({
        tipoDoc: tipoDoc.value,
        nroDoc: nroDoc.value,
        nombres: nombres.value,
        apellidos: apellidos.value,
        cargo: cargo.value,
        empresa: empresa.value,
        email: currentUser.email,
        estado: "pending",
        connected: true,
        tipoUsuario: "Normal",
        idUserAuth: currentUser.uid,
        token: "",
      })
        .then((res) => {
          resultDialog("success");
        })
        .catch((error) => {
          console.log(error);
          resultDialog("error");
        });
    } else {
      setErrorMsg(true);
    }
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
              <b>Bienvenido</b>
              <br></br>
              <b>Ingrese sus datos</b>
            </div>
            <p className="login-box-msg">
              Para completar el registro, por favor ingrese los siguientes
              datos.
            </p>
            <form onSubmit={registrarUsuario}>
              <div className="input-group mb-3">
                <div className="input-group mb-3">
                  <select name="tipoDoc" className="custom-select form-control">
                    <option>DNI</option>
                    <option>Carnet de Extranjería</option>
                    <option>Pasaporte</option>
                  </select>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="nroDoc"
                  type="text"
                  className="form-control"
                  placeholder="Número de Documento"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="far fa-id-card" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="nombres"
                  type="text"
                  className="form-control"
                  placeholder="Nombres"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="apellidos"
                  type="text"
                  className="form-control"
                  placeholder="Apellidos"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="far fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="cargo"
                  type="text"
                  className="form-control"
                  placeholder="Cargo"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-briefcase" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="empresa"
                  type="text"
                  className="form-control"
                  placeholder="Empresa"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-industry" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="row mx-auto">
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
                    Registrarse
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
            <div className="col-10 m-2 mx-auto">
              <button
                onClick={() => window.location.replace("/")}
                type="button"
                className="btn btn-primary btn-block"
                style={{
                  background: "#0B3688",
                  border: "#0B3688",
                }}
              >
                Regresar
              </button>
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

export default RegistroProvider;
