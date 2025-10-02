import React from 'react';

const StatsCard = ({ icon, color, title, value, className }) => {
  return (
    <div className={className}>
      <div className="card">
        <div className="card-body px-4 py-4-5">
          <div className="row">
            <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start ">
              {/* Ajuste importante aqui: classes para o ícone e cor de fundo */}
              {/* Use as classes 'stats-icon' e 'bg-' para a cor de fundo, e a classe 'iconly-' para o ícone */}
              <div className={`stats-icon ${color} mb-2`}> {/* A classe de cor (purple, blue, etc.) deve ser bg-purple se o seu CSS usar isso */}
                <i className={`${icon}`}></i> {/* A prop 'icon' já deve vir com o 'iconly-boldShow', 'iconly-boldProfile', etc. */}
              </div>
            </div>
            <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
              <h6 className="text-muted font-semibold">{title}</h6>
              <h6 className="font-extrabold mb-0">{value}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;