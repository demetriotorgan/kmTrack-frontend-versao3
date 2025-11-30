import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { dateToIso, isoToDate, isoToDateEdit, isoToHHMM } from '../util/time';
import ModalCarregamento from './ModalCarregamento';
import api from '../api/api';
import { useSalvarPedagio } from '../hooks/useSalvarPedagio';

const Pedagio = () => {

const { salvarTrecho, handleDadosPedagio, dadosPedagio, setDadosPedagio, salvando} = useSalvarPedagio();
  return (
    <>
    {salvando && (<ModalCarregamento label='Salvando' />)}
    <div className='container'>
      <h2>Salvar Pedágio</h2>
      <label>
        Local
        <input 
          name='local'
          type='text'
          value={dadosPedagio.local}          
          onChange={handleDadosPedagio}
        />
      </label>
      <label>
        Valor
        <input 
        name='valor'
        type='number'
        value={dadosPedagio.valor}
        onChange={handleDadosPedagio}
        />
      </label>
      <label>
        Data
        <input 
        name='data'
        type='date'
        value={dadosPedagio.data}
        onChange={handleDadosPedagio}
        />
      </label>
      <button className='botao-principal' onClick={salvarTrecho}>Salvar<Save /></button>
    </div>
    
    </>
  )
}

export default Pedagio