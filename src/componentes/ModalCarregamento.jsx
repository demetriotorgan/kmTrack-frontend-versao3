import React from 'react'
import '../style/ModalCarregamento.css'

const ModalCarregamento = ({label}) => {
  return (
    <div className="modal-loading">
        <div className="loader"></div>
        <p>{label}</p>
    </div>
  )
}

export default ModalCarregamento