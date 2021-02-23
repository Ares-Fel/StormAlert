import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import ReactNotification from 'react-notifications-component'

import { AuthProvider } from "./Auth";

ReactDOM.render(
  <AuthProvider>
    <Suspense><ReactNotification />
      <App /></Suspense>

  </AuthProvider>,
  document.getElementById("root")
);
