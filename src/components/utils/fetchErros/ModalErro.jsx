import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";

function ModalErro  ({showModal, setShowModal, ErrorData}) {
const {RefreshingToken} = useAuth()

  const [modalMensagem, setModalMensagem] = useState("")

console.log("eerrroror", ErrorData)

useEffect(() => {
if( ErrorData.httpStatus === 401){
  setShowModal(false)
  RefreshingToken()
  console.log('uaua')
}else if(ErrorData.httpStatus === 404){
  setModalMensagem("Erro interno do sistema")
}else{setModalMensagem(ErrorData.mensagem)}

}, [ErrorData])

return(

<div>

{showModal ? 
 
<div className="modal-overlay">

          <div className="modal-content">
            <div className="modal-header bg-danger">
              <h5 className="modal-title">{`(Erro ${ErrorData.httpStatus})`}</h5>
          
            </div>

            <div className="modal-body">

              {modalMensagem}
              
            </div>

            <div className="modal-footer">
              <button
                className="modal-confirm-btn"
                onClick={ () => setShowModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
    : null
}
</div>

);


}



export default ModalErro