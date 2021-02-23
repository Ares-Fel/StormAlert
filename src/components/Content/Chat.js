import React, { useEffect, useState, useContext } from "react";

import { store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
import "animate.css";

import "./avatar.css";
import app from "../../firebase-config";
import { AuthContext } from "../../Auth";
import Avatar from "./Avatar";

export default function Chat() {
  const logo = "./assets/logo.png"
  const [message, setMessage] = useState("");
  const [arraymsg, setArraymsg] = useState([]);

  const [users, setUsers] = useState([]);

  const { currentUser, userData } = useContext(AuthContext);

  async function getData() {
    app
      .firestore()
      .collection("users")
      .orderBy("connected", "desc").orderBy("nombres", "asc")
      .onSnapshot((snap) => {
        const docs = [];
        snap.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setUsers(docs);
      });

    await app
      .firestore()
      .collection("chat_general")
      .orderBy("time", "desc")
      .onSnapshot((snap) => {
        const docs = [];
        snap.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setArraymsg(docs);
      });
  }

  async function sendMessageEnter(event) {
    if (event.keyCode == 13) {
      document.getElementById("messageText").value = "";
      const fecha = Date.now().toString();
      if (message != "") {
        if (!message.match(/^[\s]+$/)) {
          await app.firestore().collection("chat_general").add({
            message: message,
            sendBy: currentUser.email,
            time: fecha,
            userUID: currentUser.uid,
            nombres: userData.nombres,
            apellidos: userData.apellidos,
          }).then(() => {
            app.firestore().collection("notification").doc("chat").set({
              msg: message, nombres: userData.nombres,
              apellidos: userData.apellidos,
            })
          });
        }
      }
    }
  }

  async function sendMessage(event) {

    console.log("object")
    document.getElementById("messageText").value = "";
    const fecha = Date.now().toString();
    if (message != "") {
      if (!message.match(/^[\s]+$/)) {
        await app.firestore().collection("chat_general").add({
          message: message,
          sendBy: currentUser.email,
          time: fecha,
          userUID: currentUser.uid,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
        }).then(() => {
          app.firestore().collection("notification").doc("chat").set({
            msg: message, nombres: userData.nombres,
            apellidos: userData.apellidos,
          })
        });
      }
    }
  }

  async function actionMessage(event) {
    await app
      .firestore()
      .collection("chat_general")
      .doc(event.currentTarget.id)
      .delete();
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

  useEffect(() => {

    getData();
    //notificationState();
    document.getElementById("chatCardBox").scrollIntoView(true)
  })
  const chat = (
    <>
      {/* Content Wrapper. Contains page content */}
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
        <div className="content">
          <div className="container">
            <div className="row">
              {/* /.col-md-6 */}
              <div className="col-lg-8">
                <div className="card direct-chat direct-chat-primary">
                  <div className="card-header">
                    <h3 className="card-title">Chat StormAlert</h3>
                    <div className="card-tools">
                      <span
                        data-toggle="tooltip"
                        title="3 New Messages"
                        className="badge badge-primary"
                      ></span>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                      >
                        <i className="fas fa-minus" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-toggle="tooltip"
                        title="Contacts"
                        data-widget="chat-pane-toggle"
                      >
                        <i className="fas fa-comments" />
                      </button>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div id="chatCardBox" className="card-body">
                    <div id="chatBox" className="direct-chat-messages" style={{ display: "flex", flexDirection: "column-reverse" }}>
                      {arraymsg.map((msg) => {
                        if (msg.userUID == currentUser.uid) {
                          return (
                            <div id={msg.userUID} className="direct-chat-msg right">
                              <div className="direct-chat-infos clearfix">
                                <span className="direct-chat-name float-right">
                                  {msg.nombres} {msg.apellidos}
                                </span>
                                <span className="direct-chat-timestamp float-left">
                                  {new Date(
                                    parseInt(msg.time)
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              {/* /.direct-chat-infos */}
                              <div className="avatar small direct-chat-img">
                                <span>
                                  {msg.nombres.charAt(0)}
                                  {msg.apellidos.charAt(0)}
                                </span>
                              </div>
                              <div className="direct-chat-text d-flex justify-content-end">
                                <div className="d-flex align-items-center">
                                  {msg.message}
                                </div>
                                <i
                                  type="button"
                                  className="d-flex align-items-center dropdown-toggle"
                                  data-toggle="dropdown"
                                  style={{ paddingLeft: "2%", width: "4%" }}
                                ></i>
                                <ul className="dropdown-menu">
                                  <li className="dropdown-item">
                                    <a
                                      id={msg.id}
                                      onClick={(e) => actionMessage(e)}
                                      href="#"
                                    >
                                      Eliminar
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              {/* /.direct-chat-text */}
                            </div>
                          );
                        } if (msg.userUID) {
                          return (
                            <div id={msg.userUID} className="direct-chat-msg">
                              <div className="direct-chat-infos clearfix">
                                <span className="direct-chat-name float-left">
                                  {msg.nombres} {msg.apellidos}
                                </span>
                                <span className="direct-chat-timestamp float-right">
                                  {new Date(
                                    parseInt(msg.time)
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              {/* /.direct-chat-infos */}
                              <div className="avatar2 small direct-chat-img">
                                <span>
                                  {msg.nombres.charAt(0)}
                                  {msg.apellidos.charAt(0)}
                                </span>
                              </div>
                              {/* /.direct-chat-img */}
                              <div className="direct-chat-text">
                                {msg.message}
                              </div>
                              {/* /.direct-chat-text */}
                            </div>
                          );
                        } else {
                          return (
                            <div id={msg.id} className="direct-chat-msg">
                              <div className="direct-chat-infos clearfix">
                                <span className="direct-chat-name float-left">
                                  {msg.sendBy}
                                </span>
                                <span className="direct-chat-timestamp float-right">
                                  {new Date(
                                    parseInt(msg.time)
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                              {/* /.direct-chat-infos */}
                              <img className="direct-chat-img" src={logo}>
                              </img>
                              {/* /.direct-chat-img */}
                              <div className="direct-chat-text"
                                style={{
                                  backgroundColor:
                                    msg.estado == 1 ? "rgba(128,128,128,0.7)"
                                      : msg.estado == 2 ? "rgba(0,,255,0,0.7)"
                                        : msg.estado == 3 ? "rgba(255,255,0,0.7)"
                                          : msg.estado == 4 ? "rgba(255,165,0,0.7)"
                                            : msg.estado == 5 ? "rgba(255,0,0,0.7)" : ""
                                }}>
                                {msg.detalle}. Cambio de estado.
                              </div>
                              {/* /.direct-chat-text */}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <div className="input-group">
                      <input
                        id="messageText"
                        type="text"
                        placeholder="Escribe aquí ..."
                        className="form-control"
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        onKeyUpCapture={(e) => sendMessageEnter(e)}
                      />
                      <span className="input-group-append">
                        <button
                          name="message"
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => sendMessage(e)}

                        >
                          <i className="fas fa-paper-plane mr-2" />
                            Enviar
                          </button>
                      </span>
                    </div>
                  </div>
                  {/* /.card-footer*/}
                </div>
              </div>
              {/* /.col-md-6 */}
              <div className="col-lg-4">
                <div className="card direct-chat direct-chat-primary">
                  <div className="card-header">
                    <h3 className="card-title">Usuarios StormAlert</h3>
                    <div className="card-tools">
                      <span
                        data-toggle="tooltip"
                        title="3 New Messages"
                        className="badge badge-primary"
                      ></span>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="collapse"
                      >
                        <i className="fas fa-minus" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-toggle="tooltip"
                        title="Contacts"
                        data-widget="chat-pane-toggle"
                      >
                        <i className="fas fa-address-book" />
                      </button>
                    </div>
                  </div>
                  {/* /.card-header */}
                  <div className="card-body">
                    {/* Conversations are loaded here */}
                    <div className="direct-chat-messages">
                      {/* Message. Default to the left */}
                      <div className="direct-chat-msg">
                        <ul className="contacts-list">
                          {users.map((user) => {
                            return (
                              <li key={user.nroDoc}>
                                <a href="#">
                                  <div className="avatar small direct-chat-img">
                                    <span>
                                      {user.nombres.charAt(0)}
                                      {user.apellidos.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="contacts-list-info">
                                    <span
                                      className="contacts-list-name"
                                      style={{ color: "#211915" }}
                                    >
                                      {user.nombres + " " + user.apellidos}
                                      <i
                                        className="fas fa-circle float-right"
                                        style={{
                                          color: user.connected
                                            ? "greenyellow"
                                            : "gray",
                                        }}
                                      />
                                    </span>
                                    <span className="contacts-list-msg">
                                      {user.cargo + " - " + user.empresa}
                                    </span>
                                  </div>
                                  {/* /.contacts-list-info */}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                        {/* /.contacts-list */}
                      </div>
                      {/*List Contacts */}
                    </div>
                    {/* /.direct-chat-pane */}
                  </div>
                  {/* /.card-footer*/}
                </div>
              </div>
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content */}
      </div>

      {/* /.content-wrapper */}
    </>
  );
  return chat;
}
