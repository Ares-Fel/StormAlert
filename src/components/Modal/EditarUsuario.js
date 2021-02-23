import React, { useEffect, useState } from "react";
import logo from "../logo.png";
import Swal from "sweetalert2";

import app from "../../firebase-config";

const EditarUsuario = (props) => {
  const [empresas, setEmpresas] = useState([])
  const [nuevaE, setNuevaE] = useState("")

  function getData() {
    app.firestore().collection("empresas").onSnapshot((snap) => {
      const docs = []
      snap.forEach(doc => {
        docs.push(doc.data().nombre)
      })
      setEmpresas(docs)
    })
  }

  function crearEmpresa(e) {
    e.preventDefault()
    app.firestore().collection("empresas")
      .add({ nombre: nuevaE })
  }

  function resultDialog(estado) {
    if (estado == "error") {
      Swal.fire(
        "Error al guardar",
        "No se ha podido guardar los cambios",
        "error"
      );
    } else {
      Swal.fire("Guardar Registro", "Los cambios se han guardado", "success");
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
        }, 500);
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

  function guardarUsuario(event) {
    event.preventDefault();
    const { nombres, apellidos, cargo, empresa } = event.currentTarget.elements;
    if (nombres.value && apellidos.value && cargo.value && empresa.value) {
      spinnerModal();
      app
        .firestore()
        .collection("users")
        .doc(props.datosUsuario.idUserAuth)
        .update({
          nombres: nombres.value,
          apellidos: apellidos.value,
          cargo: cargo.value,
          empresa: empresa.value,
        })
        .then(() => {
          resultDialog("succes")
          document.getElementById("btnCerrar").click()
        })
        .catch((e) => {
          resultDialog("error");
        });
    }

  }

  function cancelButton(e) {
    document.getElementById("registerForm").reset()
  }

  useEffect(() => {
    getData()
  }, [])

  const editar = (
    <div>
      <div className="card card-warning">
        <div className="card-header">
          <h3 className="card-title" style={{ color: "#0B3688" }}>
            Editar datos de {props.datosUsuario.nombres}{" "}
            {props.datosUsuario.apellidos}
          </h3>
        </div>
        <br></br>
        <p className="login-box-msg">
          Edite los campos del usuario. Por favor, asegúrese de que los campos
          no estén vacíos.
        </p>
        {/* /.card-header */}
        <div className="card-body">
          <form id="registerForm" onSubmit={guardarUsuario}>
            <div className="input-group mb-3">
              <div className="input-group mb-3">
                <select
                  disabled={true}
                  name="tipoDoc"
                  className="custom-select form-control"
                >
                  <option>DNI</option>
                  <option>Carnet de Extranjería</option>
                  <option>Pasaporte</option>
                </select>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                name="nroDoc"
                disabled={true}
                type="text"
                className="form-control"
                placeholder={props.datosUsuario.nroDoc}
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
                placeholder={props.datosUsuario.nombres}
                defaultValue={props.datosUsuario.nombres}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="far fa-user" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                name="apellidos"
                type="text"
                className="form-control"
                placeholder={props.datosUsuario.apellidos}
                defaultValue={props.datosUsuario.apellidos}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user" />
                </div>
              </div>
            </div>
            <br></br>
            <div className="input-group mb-3">
              <input
                name="cargo"
                type="text"
                className="form-control"
                placeholder={props.datosUsuario.cargo}
                defaultValue={props.datosUsuario.cargo}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-briefcase" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <div className="input-group mb-3">
                <select name="empresa" className="custom-select form-control">
                  {empresas.map((empresa, key) =>
                    <option value={empresa}>{empresa}</option>
                  )}
                </select>
                <input
                  id="nuevaEmpresa"
                  name="empresaNueva"
                  type="text"
                  className="form-control px-2 mx-3"
                  placeholder="Añada Nueva Empresa"
                  onChange={(e) => setNuevaE(e.currentTarget.value)}
                />
                <button className="btn btn-success"
                  onClick={(e) => crearEmpresa(e)}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
            {/*<div className="input-group mb-3">
              <input
                name="tipo"
                type="text"
                className="form-control"
                placeholder="Tipo de Usuario"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-user-tag" />
                </div>
              </div>
  </div>*/}
            <div className="input-group mb-3">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                disabled={true}
                value={props.datosUsuario.email}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="far fa-envelope" />
                </div>
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <div className="modal-footer justify-content-between">
              <button
                id="btnCerrar"
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onClick={(e) => cancelButton(e)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
        {/* /.card-body */}
      </div>
      {/* /.login-card-body */}
    </div>
  );
  return editar;
};

export default EditarUsuario;
