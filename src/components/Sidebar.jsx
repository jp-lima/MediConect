import React, { useState } from "react";
import { Link } from "react-router-dom";
import menuItems from "../data/sidebar-items-medico.json"; // Use "sidebar-items-secretaria.json" para secretaria e "sidebar-items-adm.json" para ADM

// 1. Recebe 'menuItems' e 'onLogout' como props
function Sidebar({ menuItems, onLogout }) { 
 const [isActive, setIsActive] = useState(true);
 const [openSubmenu, setOpenSubmenu] = useState(null);

 const toggleSidebar = () => {
  setIsActive(!isActive);
 };

 const handleSubmenuClick = (submenuName) => {
  setOpenSubmenu(openSubmenu === submenuName ? null : submenuName);
 };

 const renderLink = (item) => {
  // Links internos (rotas do React Router)
  if (item.url && item.url.startsWith("/")) {
   return (
    <Link to={item.url} className="sidebar-link">
     {item.icon && <i className={`bi bi-${item.icon}`}></i>}
     <span>{item.name}</span>
    </Link>
   );
  }

  // Links externos
  return (
   <a
    href={item.url}
    className="sidebar-link"
    target="_blank"
    rel="noreferrer"
   >
    {item.icon && <i className={`bi bi-${item.icon}`}></i>}
    <span>{item.name}</span>
   </a>
  );
 };

 return (
  <div id="sidebar" className={isActive ? "active" : ""}>
   <div className="sidebar-wrapper active">
    <div className="sidebar-header">
     {/* ... Header... */}
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
      {menuItems && menuItems.map((item, index) => {
       if (item.isTitle) {
        return (
         <li key={index} className="sidebar-title">
          {item.name}
         </li>
        );
       }

       if (item.submenu) {
        return (
         <li
          key={index}
          className={`sidebar-item has-sub ${
           openSubmenu === item.key ? "active" : ""
          }`}
         >
          {/* ... Lógica de Submenu ... */}
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
       }

       return (
        <li key={index} className="sidebar-item">
         {renderLink(item)}
        </li>
       );
      })}
            {/* 3. Adiciona o botão de logout no final do menu */}
            <li className="sidebar-item" onClick={onLogout}>
                <button type="button" className="sidebar-link btn">
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sair (Logout)</span>
                </button>
            </li>

     </ul>
    </div>
        
    <button className="sidebar-toggler btn x" onClick={toggleSidebar}>
     <i data-feather="x"></i>
    </button>
   </div>
  </div>
 );
}

export default Sidebar;