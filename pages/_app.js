import "../styles/globals.css";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import { store } from "../store";
import { Provider } from "react-redux";
import ProtectedRoute from "../lib/firebase/auth";

export default function App({ Component, pageProps }) {
  const progress = new ProgressBar({
    size: 4,
    color: "#EAB308",
    className: "z-50",
    delay: 100,
  });

  Router.events.on("routeChangeStart", progress.start);
  Router.events.on("routeChangeComplete", progress.finish);
  Router.events.on("routeChangeError", progress.finish);

  return (
    <Provider store={store}>
      <ProtectedRoute>
        <Component {...pageProps} />
      </ProtectedRoute>
    </Provider>
  );
}
