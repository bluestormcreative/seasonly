import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLoggedInUser } from "./context/userContext";
import {
  SignUpDialog,
  LoginDialog,
  NavBar,
  OffCanvasMenu,
  UpdateProfileDialog,
  Footer,
} from "./components";
import { ListsPage, InSeasonPage, NotFoundPage } from "./pages";

function App() {
  const { loggedInUser, setLoggedInUser, defaultUser } = useLoggedInUser();
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showOffCanvasMenu, setShowOffCanvasMenu] = useState(false);
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);

  useEffect(() => {
    if (loggedInUser?.username !== "" && loggedInUser?.zone.zone === "") {
      setShowUpdateProfileDialog(true);
    } else if (
      loggedInUser?.zone.zone !== "" &&
      loggedInUser?.zone.zone !== undefined
    ) {
      setShowUpdateProfileDialog(false);
    } else {
      setShowUpdateProfileDialog(false);
    }
  }, [loggedInUser]);

  return (
    <BrowserRouter>
      <Box className="app">
        <NavBar
          onLoginClicked={() => setShowLoginDialog(true)}
          onSignUpClicked={() => setShowSignUpDialog(true)}
          onLogOutSuccess={() => setLoggedInUser(defaultUser)}
          onMenuIconClicked={() => setShowOffCanvasMenu(true)}
        />
        <OffCanvasMenu
          open={showOffCanvasMenu}
          onCloseIconClicked={() => setShowOffCanvasMenu(false)}
          onLinkClicked={() => setShowOffCanvasMenu(false)}
          onLoginClicked={() => {
            setShowLoginDialog(true);
            setShowOffCanvasMenu(false);
          }}
          onSignUpClicked={() => {
            setShowOffCanvasMenu(false);
            setShowSignUpDialog(true);
          }}
          onLogOutSuccess={() => {
            setShowOffCanvasMenu(false);
            setLoggedInUser(defaultUser);
          }}
        />
        <Box className="main" p={4}>
          <Routes>
            <Route path="/" element={<InSeasonPage />} />
            <Route path="/shopping-lists" element={<ListsPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Box>

        {showSignUpDialog ? (
          <SignUpDialog
            onDismiss={() => setShowSignUpDialog(false)}
            onSignupSuccess={(user) => {
              setLoggedInUser(user);
              setShowSignUpDialog(false);
              loggedInUser?.zone.zone === ""
                ? setShowUpdateProfileDialog(true)
                : null;
            }}
          />
        ) : null}
        {showLoginDialog ? (
          <LoginDialog
            onDismiss={() => setShowLoginDialog(false)}
            onLoginSuccess={(user) => {
              setLoggedInUser(user);
              setShowLoginDialog(false);
              loggedInUser?.zone.zone === ""
                ? setShowUpdateProfileDialog(true)
                : null;
            }}
          />
        ) : null}
        {showUpdateProfileDialog && loggedInUser?.zone.zone === "" ? (
          <UpdateProfileDialog
            onUpdateProfileSuccess={(user) => {
              setLoggedInUser(user);
              setShowUpdateProfileDialog(false);
            }}
          />
        ) : null}
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;
