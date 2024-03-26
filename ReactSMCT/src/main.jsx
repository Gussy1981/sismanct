import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MantineProvider } from '@mantine/core'
import '@mantine/tiptap/styles.css';
import './index.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <App />
  </MantineProvider>
)
