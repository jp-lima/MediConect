import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TrocardePerfis from "./TrocardePerfis";
import MobileMenuToggle from "./MobileMenuToggle";

function Sidebar({ menuItems }) {
  const [isActive, setIsActive] = useState(true);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // Detecta se é mobile/tablet
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setIsActive(!mobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => setIsActive(!isActive);
  const handleSubmenuClick = (submenuName) =>
    setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = async () => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken") ||
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken");

      if (token) {
        const response = await fetch(
          "https://mock.apidog.com/m1/1053378-0-default/auth/v1/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 204) console.log("Logout realizado com sucesso");
        else if (response.status === 401) console.log("Token inválido ou expirado");
        else {
          try {
            const errorData = await response.json();
            console.error("Erro no logout:", errorData);
          } catch {
            console.error("Erro no logout - status:", response.status);
          }
        }
      }

      clearAuthData();
      navigate("/login");
    } catch (error) {
      console.error("Erro durante logout:", error);
      clearAuthData();
      navigate("/login");
    } finally {
      setShowLogoutModal(false);
    }
  };

  const clearAuthData = () => {
    ["token","authToken","userToken","access_token","user","auth","userData"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    if (window.caches) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes("auth") || name.includes("api")) caches.delete(name);
        });
      });
    }
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  const renderLink = (item) => {
    if (item.url && item.url.startsWith("/")) {
      return (
        <Link to={item.url} className="sidebar-link">
          {item.icon && <i className={`bi bi-${item.icon}`}></i>}
          <span>{item.name}</span>
        </Link>
      );
    }
    return (
      <a href={item.url} className="sidebar-link" target="_blank" rel="noreferrer">
        {item.icon && <i className={`bi bi-${item.icon}`}></i>}
        <span>{item.name}</span>
      </a>
    );
  };

  return (
    <>
      {/* Toggle e backdrop para mobile */}
      {isMobile && <MobileMenuToggle isOpen={isActive} onToggle={toggleSidebar} />}
      {isMobile && isActive && (
        <div
          className="sidebar-backdrop"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Modal de Logout */}
      {showLogoutModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "1rem" }}>Confirmar Logout</h3>
            <p style={{ marginBottom: "2rem" }}>Tem certeza que deseja encerrar a sessão?</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={handleLogoutCancel}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div id="sidebar" className={isActive ? "active" : ""}>
        <div className="sidebar-wrapper active">
          <div className="sidebar-header">
            <div className="d-flex justify-content-between">
              <div className="logo">
                <Link to="/">
                  <h1>MediConnect</h1>
                </Link>
              </div>
              <div className="toggler">
                <button
                  type="button"
                  className="sidebar-hide d-xl-none d-block btn"
                  onClick={toggleSidebar}
                >
                  <i className="bi bi-x bi-middle"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="sidebar-menu">
            <ul className="menu">
              {menuItems &&
                menuItems.map((item, index) => {
                  if (item.isTitle)
                    return (
                      <li key={index} className="sidebar-title">
                        {item.name}
                      </li>
                    );

                  if (item.submenu)
                    return (
                      <li
                        key={index}
                        className={`sidebar-item has-sub ${
                          openSubmenu === item.key ? "active" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className="sidebar-link btn"
                          onClick={() => handleSubmenuClick(item.key)}
                        >
                          <i className={`bi bi-${item.icon}`}></i>
                          <span>{item.name}</span>
                        </button>
                        <ul
                          className={`submenu ${
                            openSubmenu === item.key ? "active" : ""
                          }`}
                        >
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex} className="submenu-item">
                              {renderLink(subItem)}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );

                  return (
                    <li key={index} className="sidebar-item">
                      {renderLink(item)}
                    </li>
                  );
                })}

              {/* Logout */}
              <li className="sidebar-item">
                <button
                  type="button"
                  className="sidebar-link btn"
                  onClick={handleLogoutClick}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sair (Logout)</span>
                </button>
              </li>

              <TrocardePerfis />
            </ul>
          </div>

          <button className="sidebar-toggler btn x" onClick={toggleSidebar}>
            <i data-feather="x"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
