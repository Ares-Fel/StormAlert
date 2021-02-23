import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import app from "../../firebase-config";

const Registro = () => {
  const [empresas, setEmpresas] = useState([])
  const [dniUser, setDniUser] = useState({ dni: "", name: "", first_name: "", last_name: "", cui: "", apellidos: "" })
  const [errorMsg, setErrorMsg] = useState(false)

  function getData() {
    app.firestore().collection("empresas").onSnapshot((snap) => {
      const docs = []
      snap.forEach(doc => {
        docs.push(doc.data().nombre)
      })
      setEmpresas(docs)
    })
  }

  function crearEmpresa() {
    const nuevaEmpresa = document.getElementById("nuevaEmpresa").value
    app.firestore().collection("empresas")
      .add({ nombre: nuevaEmpresa }).then(() => {
        document.getElementById("nuevaEmpresa").value = ""
      })
  }


  function getDni(event) {
    const tipoDoc = document.getElementById("dniSelect").value
    const nroDoc = document.getElementById("nroDoc").value

    if (tipoDoc == "DNI") {
      if (event.currentTarget.value.match(/^\d{8}(?:[-\s]\d{4})?$/)) {
        fetch("https://dni.optimizeperu.com/api/persons/" + nroDoc)
          .then((response) => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
            response.json().then(function (data) {
              console.log(data)
              setDniUser({ name: data.name, apellidos: data.first_name + " " + data.last_name })
            });
          })
          .catch(function (err) {
            console.log('Fetch Error: ', err);
          });
      } else {
        setDniUser({ name: "", apellidos: "" })
      }
    }
  }

  function resultDialog(estado) {
    if (estado == "error") {
      Swal.fire("Error de Registro", "El usuario ya está registrado", "error");
    } else {
      Swal.fire("Nuevo Registro", "El usuario se ha registrado", "success");
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
      password,
    } = event.currentTarget.elements;

    const crearUsuario = app.functions().httpsCallable("crearUsuario");

    if (tipoDoc.value && nroDoc.value && nombres.value && apellidos.value && cargo.value && email.value && password.value) {

      spinnerModal();
      crearUsuario({
        tipoDoc: tipoDoc.value,
        nroDoc: nroDoc.value,
        nombres: nombres.value,
        apellidos: apellidos.value,
        cargo: cargo.value,
        empresa: empresa.value,
        email: email.value,
        password: password.value,
        estado: "enabled",
        connected: false,
        tipoUsuario: "Normal",
        token: ""
      })
        .then((res) => {
          resultDialog("success");
          document.getElementById("btnCerrar").click()
        })
        .catch((error) => {
          resultDialog("error");
        });
    } else { setErrorMsg(true) }
  }

  function cancelButton(e) {
    document.getElementById("registerForm").reset()
    setDniUser({ dni: "", name: "", first_name: "", last_name: "", cui: "", apellidos: "" })
  }
  useEffect(() => {
    getData()
  }, [])

  const registro = (
    <div>
      <div className="card">
        <div className="card-body login-card-body">
          <div className="login-logo" style={{ color: "#0B3688" }}>
            <b></b>
          </div>
          <p className="login-box-msg">
            Ingrese los datos del nuevo usuario. Por favor, complete todos los
            campos que se solicitan.
          </p>
          <form id="registerForm" onSubmit={registrarUsuario}>
            <div className="input-group mb-3">
              <div className="input-group mb-3">
                <select id="dniSelect" name="tipoDoc" className="custom-select form-control">
                  <option>DNI</option>
                  <option>Carnet de Extranjería</option>
                  <option>Pasaporte</option>
                </select>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                id="nroDoc"
                name="nroDoc"
                type="text"
                className="form-control"
                placeholder="DNI/CE/PP"
                onChange={(e) => getDni(e)}
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
                defaultValue={dniUser.name}
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
                placeholder="Apellidos"
                defaultValue={dniUser.apellidos}
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
                placeholder="Cargo"
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
                />
                <button className="btn btn-success"
                  onClick={() => crearEmpresa()}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>

            </div>
            <div className="input-group mb-3">
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="far fa-envelope" />
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
            {errorMsg ? <div style={{ color: "red" }}>Revise que haya llenado todos los campos.</div> : null}
            <br></br>
            <br></br>
            <br></br>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
                onClick={(e) => cancelButton(e)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Usuario
              </button>
            </div>
          </form>
        </div>
        {/* /.login-card-body */}
      </div>
    </div>
  );
  return registro;
};

export default Registro;
