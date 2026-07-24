import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import 'mantine-datatable/styles.css';
import './index.css'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider defaultColorScheme="dark">
    <App />
  </MantineProvider>
)
