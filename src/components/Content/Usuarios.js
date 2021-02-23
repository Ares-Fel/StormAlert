import React, { useState, useContext, useEffect } from "react";
import { Pagination } from "./Pagination";
import Swal from "sweetalert2";
import { store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
import "animate.css";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Switch from "react-switch";

import app from "../../firebase-config";
import { AuthContext } from "../../Auth";
import Registro from "../Modal/Registro";
import EditarUsuario from "../Modal/EditarUsuario";

export default function Usuarios() {
  const { currentUser, userData } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [usersBuscar, setUsersBuscar] = useState([]);
  /***********Notification Toast************ */

  function notificationChat() {
    store.addNotification({
      title: "Wonderful!",
      message: "teodosii@react-notifications-component",
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
        showIcon: true
      }
    })
  }
  async function notificationState() {
    var audioAlarma = new Audio('./assets/alarm.mp3');
    var audioAviso = new Audio('./assets/aviso.mp3');
    var audioPrecaucion = new Audio('./assets/precaucion.mp3');
    var audioNoRD = new Audio('./assets/nodetectado.mp3');
    var audioFalla = new Audio('./assets/falla.mp3');

    await app.firestore().collection("sensor").orderBy("hora", "desc").limit(1).onSnapshot((snap) => {
      var estado = "";
      snap.forEach((doc) => {
        estado = doc.data().detalle
      });
      if (userData.notification) {
        store.addNotification({
          title: estado,
          message: "El estado se ha actualizado",
          type: estado == "Alarma" ? "danger"
            : estado == "Aviso" ? "warning"
              : estado == "Precaución" ? "default"
                : estado == "No Relámpago Detectado" ? "success"
                  : "info",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
            pauseOnHover: true,
            showIcon: true
          }
        })
      }
    })

  }

  /* **********Paginacion************ */

  const [currentPage, setCurrentPage] = React.useState(1);
  const [postPerPage] = React.useState(9);

  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }

  const indexLastPost = currentPage * postPerPage;
  const indexFirstPost = indexLastPost - postPerPage;
  const currentUsers = users.slice(indexFirstPost, indexLastPost);
  /* **********Paginacion************ */

  function confirmDialog(nombres, apellidos, id) {
    Swal.fire({
      title: "Eliminar usuario:\n" + nombres + " " + apellidos,
      text:
        "La siguiente acción eliminara todos los datos del usuario. ¿Esta seguro que desea continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        spinnerModal();
        const borrarUser = app.functions().httpsCallable("borrarUsuario")

        borrarUser({ idUserAuth: id }).then(() => {
          Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
        })
          .catch(() => {
            Swal.fire("Error!", "No se pudo eliminar al usuario.", "error");
          });
      }
    });
  }

  function spinnerModal() {
    let timerInterval;
    Swal.fire({
      title: "Procesando solicitud",
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

  async function getData() {
    app
      .firestore()
      .collection("users")
      .onSnapshot((snap) => {
        const docs = [];
        snap.forEach((doc) => {
          docs.push(doc.data());
        });
        setUsers(docs);
        setUsersBuscar(docs);
      });
  }

  function llenarData(id) {
    if (id) {
      app
        .firestore()
        .collection("users")
        .doc(id).onSnapshot((snap) => setUsuario(snap.data()));
    }
  }

  function cambiarEstado(estado, id) {
    if (estado == "enabled") {
      app
        .firestore()
        .collection("users")
        .doc(id)
        .update({ estado: "disabled" });
    }
    if (estado == "disabled") {
      app.firestore().collection("users").doc(id).update({ estado: "enabled" });
    }
  }

  function borrarUsuario(nombres, apellidos, id) {
    confirmDialog(nombres, apellidos, id);
  }

  function setAdmin(tipoUsuario, id) {
    if (tipoUsuario == "Administrador") {
      app
        .firestore()
        .collection("users")
        .doc(id)
        .update({ tipoUsuario: "Normal" });
    }
    if (tipoUsuario == "Normal") {
      app
        .firestore()
        .collection("users")
        .doc(id)
        .update({ tipoUsuario: "Administrador" });
    }

    //confirmDialog();
  }

  function buscar(e) {
    const valor = e.currentTarget.value.toLowerCase();
    const usuarios = usersBuscar.filter(
      (user) =>
        user.nombres.toLowerCase().search(valor) >= 0 ||
        user.apellidos.toLowerCase().search(valor) >= 0 ||
        //user.cargo.toLowerCase().search(valor) >= 0 ||
        user.empresa.toLowerCase().search(valor) >= 0 ||
        user.tipoDoc.toLowerCase().search(valor) >= 0 ||
        user.idUserAuth.toLowerCase().search(valor) >= 0 ||
        user.email.toLowerCase().search(valor) >= 0 ||
        user.tipoUsuario.toLowerCase().search(valor) >= 0
    );
    setUsers(usuarios);
  }

  useEffect(() => {
    getData();
    //notificationState();
  }, []);

  const usuarios = (
    <>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">
                  {" "}
                  {/*Top Navigation*/} <small></small>
                </h1>
              </div>
              {/* /.col */}
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="container">
          <div className="content">
            <div className="row">
              {/* /.col-md-6 */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <div className="row">
                      <input
                        type="text"
                        name="q"
                        onChange={(e) => buscar(e)}
                        className="form-control m-1 col-md-6"
                        placeholder="Buscar..."
                      />
                      <div className="col-md-6 row d-flex justify-content-end">
                        <button
                          className="btn bg-gradient-success m-1 col-md-5"
                          data-toggle="modal"
                          data-target="#modal-lg"
                        >
                          <i className="fas fa-user-plus mr-2"></i>
                          Agregar Usuario
                        </button>
                        {/*<button className="btn bg-gradient-success m-1 col-md-5">
                          <i className="fas fa-upload mr-2"></i>
                          Subir Excel
  </button>*/}
                      </div>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    <h3 className="card-title mb-2">
                      Tabla de Usuarios - {users.length} registrados
                    </h3>
                    <table
                      id="example2"
                      className="table table-bordered table-hover"
                    >
                      <thead>
                        <tr>
                          <th>Rol</th>
                          <th>Nombres y Apellidos</th>
                          <th>Cargo</th>
                          <th>Empresa</th>
                          <th>Nro. Documento</th>
                          <th>Correo</th>
                          <th>Admin.</th>
                          <th className="col-md-3" >Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map((user) => {
                          return (
                            <tr key={user.idUserAuth}>
                              <td>
                                {user.tipoUsuario == "Administrador" ? (
                                  <i className="fas fa-user-shield ml-2"></i>
                                ) : (
                                    <i className="far fa-user ml-2"></i>
                                  )}
                              </td>
                              <td>{user.nombres + " " + user.apellidos}</td>
                              <td>{user.cargo}</td>
                              <td>{user.empresa}</td>
                              <td>{user.nroDoc}</td>
                              <td>{user.email}</td>
                              <td>
                                <Switch
                                  onChange={() =>
                                    setAdmin(user.tipoUsuario, user.idUserAuth)
                                  }
                                  checked={user.tipoUsuario == "Administrador"}
                                ></Switch>
                              </td>
                              <td>
                                <div className="row">
                                  <div className="col-sm-12 col-md-4">
                                    <button
                                      id={user.idUserAuth}
                                      onClick={(e) => llenarData(user.idUserAuth)}
                                      className="btn btn-block bg-gradient-warning btn-sm"
                                      data-toggle="modal"
                                      data-target="#modal-lg-edit"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                  </div>
                                  <div className="col-sm-12 col-md-4">
                                    {user.estado == "enabled" ? (
                                      <Popup
                                        trigger={
                                          <button
                                            id={user.idUserAuth}
                                            className="btn btn-block bg-gradient-success btn-sm "
                                          >
                                            <i className="fas fa-check"></i>
                                          </button>
                                        }
                                        position="right center"
                                      >
                                        <div className="row">
                                          <div className="col-md-8">
                                            Esta acción deshabilitará al
                                            usuario.
                                          </div>
                                          <button
                                            onClick={() =>
                                              cambiarEstado(
                                                user.estado,
                                                user.idUserAuth
                                              )
                                            }
                                            className="btn btn-danger mr-1 col-md-3"
                                          >
                                            <i className="fas fa-ban"></i>
                                          </button>
                                        </div>
                                      </Popup>
                                    ) : user.estado == "disabled" ? (
                                      <Popup
                                        trigger={
                                          <button
                                            id={user.idUserAuth}
                                            className="btn btn-block bg-gradient-danger btn-sm "
                                          >
                                            <i className="fas fa-ban"></i>
                                          </button>
                                        }
                                        position="right center"
                                      >
                                        <div className="row">
                                          <div className="col-md-8">
                                            Esta acción habilitará al usuario.
                                          </div>
                                          <button
                                            onClick={() =>
                                              cambiarEstado(
                                                user.estado,
                                                user.idUserAuth
                                              )
                                            }
                                            className="btn btn-danger mr-1 col-md-3"
                                          >
                                            <i className="fas fa-check"></i>
                                          </button>
                                        </div>
                                      </Popup>
                                    ) : (
                                          <Popup
                                            trigger={
                                              <button
                                                id={user.idUserAuth}
                                                className="btn btn-block bg-gradient-danger btn-sm "
                                              >
                                                <i className="fas fa-check"></i>
                                              </button>
                                            }
                                            position="right center"
                                          >
                                            <div className="row">
                                              <div className="col-md-8">
                                                Esto acción deshabilitará al
                                                usuario.
                                          </div>
                                              <button
                                                onClick={() =>
                                                  cambiarEstado(
                                                    user.estado,
                                                    user.idUserAuth
                                                  )
                                                }
                                                className="btn btn-danger mr-1 col-md-3"
                                              >
                                                <i className="fas fa-ok"></i>
                                              </button>
                                            </div>
                                          </Popup>
                                        )}
                                  </div>
                                  <div className="col-sm-12 col-md-4">
                                    <button
                                      id={user.idUserAuth}
                                      onClick={(e) =>
                                        borrarUsuario(
                                          user.nombres,
                                          user.apellidos,
                                          user.idUserAuth
                                        )
                                      }
                                      className="btn btn-block bg-gradient-secondary btn-sm"
                                    >
                                      <i className="far fa-trash-alt"></i>
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Rol</th>
                          <th>Nombres y Apellidos</th>
                          <th>Cargo</th>
                          <th>Empresa</th>
                          <th>Nro. Documento</th>
                          <th>Correo</th>
                          <th>Admin.</th>
                          <th>Acción</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <Pagination
                      postPerPage={postPerPage}
                      totalPosts={users.length}
                      paginate={(number) => paginate(number)}
                    ></Pagination>
                  </div>
                </div>
                {/* /.card */}
              </div>
              {/* /.col-md-6 */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      {/*----------------- MODAL-------------------- */}
      <div className="modal fade" id="modal-lg">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div className="login-logo" style={{ color: "#0B3688" }}>
                Registro de Usuario
              </div>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <Registro></Registro>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
      </div>
      {/*----------------- MODAL EDITAR----------------- */}
      <div className="modal fade" id="modal-lg-edit">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <EditarUsuario datosUsuario={usuario}></EditarUsuario>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
      </div>
    </>
  );
  return usuarios;
}
