import React, { useContext, useEffect } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Login from "../Content/Login/Login";
import NuevaContraseña from "../Content/NuevaContraseña";
import RecuperarContraseña from "../Content/Login/RecuperarContraseña";
import Inicio from "../Content/Inicio/Inicio";
import Chat from "../Content/Chat";
import Usuarios from "../Content/Usuarios";
import Layout from "../Layout/Layout";
import Registro from "../Modal/Registro";

import { store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
import "animate.css";

import { AuthContext } from "../../Auth";
import appe from "../../firebase-config";
import PageNotFound from "../Content/PageNotFound";
import PageDisabled from "../Content/PageDisabled";
import PagePending from "../Content/PagePending";
import RegistroProvider from "../Content/Login/RegistroProvider";

export default function App() {
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    appe
      .messaging()
      .getToken({
        vapidKey:
          "BDnbqWYFZvJLORO3ShyYqHLgZf6G2JsFeGb3uro9nRdxH3wam2odE1VCpGOtgbxnCtfyypgXGb-_wCSM6eRY2M0",
      })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Token adquirido");
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }, [])

  if (!localStorage.getItem("usuarioToken")) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact strict component={Login} />
          <Route path="/registro" exact strict component={RegistroProvider} />
          <Route path="/recuperar" exact strict component={RecuperarContraseña} />
          <Redirect to="/login"></Redirect>
        </Switch>
      </BrowserRouter>
    );
  }

  const app = (
    <BrowserRouter>
      <Switch>
        <Route
          path="/login"
          render={() => {
            window.location.replace("/");
          }}
        />
        <Layout>
          {userData.estado == "enabled" ?
            (<><Route path="/" exact strict component={Inicio} />
              <Route path="/chat" exact strict component={Chat} />
              {userData.tipoUsuario == "Administrador" ? <Route path="/usuarios" exact strict component={Usuarios} />
                : <></>}
              <Route
                path="/recuperar"
                exact
                strict
                component={RecuperarContraseña}
              />
              <Route path="/nueva" exact strict component={NuevaContraseña} />
              {/*<Route component={PageNotFound} />--Verificar si page not found!*/}</>)
            :
            userData.estado == "disabled" ?
              <Route component={PageDisabled} />
              : userData.estado == "pending" ? <Route component={PagePending} />
                : <>Cargando...</>
          }

        </Layout>
      </Switch>
    </BrowserRouter>
  );
  return app;
}
