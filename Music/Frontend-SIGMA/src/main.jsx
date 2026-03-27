import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthProvider } from './context/AuthContext'
import VehiculosState from './context/Vehiculos/VehiculosState'
import './index.css'
import MantenimientosState from './context/Mantenimientos/MantenimientosState'
import SiniestrosState from './context/Siniestros/SiniestrosState'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <VehiculosState>
        <MantenimientosState>
          <SiniestrosState>
        <RouterProvider router={router} />
        </SiniestrosState>
        </MantenimientosState>
      </VehiculosState>
    </AuthProvider>
  </React.StrictMode>
)