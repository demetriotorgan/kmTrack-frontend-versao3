import React, { useEffect, useState } from 'react'
import { Database, DatabaseZap } from 'lucide-react'
import api from '../api/api'

const DbStatus = () => {
    const [status, setStatus] = useState(false);

    const verificarMongo = async()=>{
        try {
            const {data} = await api.get('/db-status');

            if(data.mongo === 'connected'){
                setStatus(true)
            }else{
                setStatus(false)
            }
        } catch (error) {
            console.log('Api offline ou indisponível')
        }
    };

    useEffect(()=>{
        verificarMongo();
    },[])


  return (
      <div className='db-status'>
        {status ? <Database /> : <DatabaseZap />}
    </div>
  )
}

export default DbStatus