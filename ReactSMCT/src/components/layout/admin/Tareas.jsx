import React from 'react'
import ListadoTareas from '../../listados/listadoTareas'

const tareas = () => {
  return (
    <>
    <div className="flex justify-center items-center text-center h4 py-4">
      Alta, Baja y Modificaciones de Tareas
    </div>
    <ListadoTareas/>
    </>
  )
}

export default tareas