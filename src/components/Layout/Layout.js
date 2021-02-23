import React, {Fragment} from "react";
import Header from "./Header";

const Layout = (props) => {
  const layout = (
    <Fragment>
      <Header />
      <main id="main" className="content-wrapper">
        {props.children}
      </main>
    </Fragment>
  );
  return layout;
};

export default Layout;
