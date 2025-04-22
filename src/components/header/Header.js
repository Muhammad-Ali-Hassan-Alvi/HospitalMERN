import React, { useEffect, useLayoutEffect } from "react"; // useLayoutEffect might not be needed anymore
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Alert from "../../Common/Alert";
import * as AllRedux from "../../store/slice/admindataSlice"; // Keep this for logout/other actions if needed
import * as ALLADMIN from "../../store/slice/admindataSlice"; // Keep this alias or unify
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const adminDataState = useSelector((state) => state.admindata.adminData);
  // Simpler/more reliable check: Does the data object exist and have an ID?
  const isAdminDataLoaded = !!adminDataState?.data?.id; // Check for a key property like 'id' or 'email'

  // --- Effect 1: Fetch adminData on initial load/refresh if token exists but data isn't loaded ---
  useEffect(() => {
    const token = sessionStorage.getItem("UserToken");

    // Only fetch if a token exists AND admin data hasn't been successfully loaded yet
    // This primarily handles page refreshes or direct navigation when already logged in.
    if (token && !isAdminDataLoaded) {
      console.log(
        "Header Effect (Mount/Refresh): Token found, adminData not loaded. Fetching..."
      );
      dispatch(ALLADMIN.getAdminData({})); // ** Re-enable this line **
    } else if (token && isAdminDataLoaded) {
      console.log(
        "Header Effect (Mount/Refresh): Token found, adminData already loaded."
      );
    } else if (!token) {
      console.log("Header Effect (Mount/Refresh): No token found.");
    }
    // Dependencies: Re-run if the data loading status changes.
  }, [dispatch, isAdminDataLoaded]);

  // --- Effect 2: Check token on navigation and redirect if necessary ---
  useEffect(() => {
    const token = sessionStorage.getItem("UserToken");
    // Define public paths that DON'T require a token
    // Make sure ALL public/login paths are included
    const publicPaths = [
      "/",
      "/web",
      "/forgot-password",
      "/web/med",
      "/web/att",
      "/sign-up",
    ]; // Add others as needed
    const isPublicPath = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    ); // Use startsWith if paths have sub-routes

    // If NO token exists AND the user is trying to access a NON-PUBLIC path
    if (!token && !isPublicPath) {
      console.log(
        `Header Effect (Navigation): No token on protected route (${location.pathname}). Redirecting to login.`
      );
      // Prevent recursive navigation if already going to '/'
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
    // Also handle case where token exists but user tries to access login page? (Optional)
    // if (token && isPublicPath && location.pathname !== '/web/dashboard' /* or other allowed public pages for logged-in users */ ) {
    //    navigate('/web/dashboard'); // Redirect logged-in users away from login/signup etc.
    // }
  }, [location.pathname, navigate]); // Run this effect whenever the location changes

  // --- Logout Function --- (Keep as is)
  const clearData = () => {
    // ... (logout logic) ...
    try {
      dispatch(AllRedux.logout({})).finally(() => {
        // Use finally to ensure cleanup happens
        sessionStorage.removeItem("UserToken");
        // Maybe dispatch an action to clear adminData state in Redux?
        // dispatch(AllRedux.clearAdminData()); // You'd need to add this reducer/action
        Alert.SuccessAlert("Logged out successfully.");
        navigate("/");
      });
    } catch (error) {
      // This catch might not be reachable if thunk handles errors
      console.error("Logout sync error:", error);
      Alert.ErrorAlert(error.message || "Logout failed");
      sessionStorage.removeItem("UserToken");
      navigate("/");
    }
  };

  // --- Render Logic ---
  return (
    <>
      <div className="page-header">
        <div className="header-wrapper row m-0">
          {/* Search Form (keep as is) */}
          <form className="form-inline search-full col" action="#" method="get">
            {/* ... */}
          </form>
          {/* Header Logo (keep as is) */}
          <div className="header-logo-wrapper col-auto p-0">{/* ... */}</div>
          {/* Left Header (keep as is) */}
          <div className="left-header col-xxl-5 col-xl-6 col-lg-5 col-md-4 col-sm-3 p-0">
            {/* ... */}
          </div>
          {/* Right Header Nav */}
          <div className="nav-right col-xxl-7 col-xl-6 col-md-7 col-8 pull-right right-header p-0 ms-auto">
            <ul className="nav-menus">
              <li className="profile-nav onhover-dropdown pe-0 py-0">
                <div className="media profile-media">
                  <img
                    className="b-r-10"
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/dashboard/profile.png"
                    }
                    alt=""
                  />
                  <div className="media-body">
                    <span>{adminDataState?.data?.name || "User"}</span>
                    <p className="mb-0 font-roboto">
                      {(adminDataState?.data?.role || "Role").toUpperCase()}
                      <i className="middle fa fa-angle-down"></i>
                    </p>
                  </div>
                </div>
                <ul className="profile-dropdown onhover-show-div">
                  {/* Conditional links based on role */}
                  {adminDataState?.data?.role === "Admin" && (
                    <>
                      <li>
                        <Link to="/web/profile">
                          {" "}
                          {/* Assuming profile route */}
                          <span>Profile</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/web/change_password">
                          {" "}
                          {/* Assuming change password route */}
                          <span>Change Password</span>
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    {/* Use a button or prevent Link default if only for onClick */}
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        clearData();
                      }}
                    >
                      <span>Log Out</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          {/* Handlebars Templates (keep as is) */}
          <script className="result-template" type="text/x-handlebars-template">
            {/* ... */}
          </script>
          <script className="empty-template" type="text/x-handlebars-template">
            {/* ... */}
          </script>
        </div>
      </div>
    </>
  );
}
