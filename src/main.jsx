import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@mantine/core/styles.css';

import { MantineProvider, Container, Paper } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider
    defaultColorScheme="dark"
      >
    <Container
        size="md"
        padding="xl"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width : '100%',
          height: "100%",
          backgroundColor: '#ff',
          padding: '2rem'
           // Light grey background
        }}
      >
        <Paper
          padding="xl"
          shadow="md"
          radius="lg"
          style={{
            textAlign: 'center',
            backgroundColor: '#000000',
            // borderRadius: '8px',
            // border: '1px solid #e1e1e1',
            width: '100%',
            height: '100%',
             // Adjust max-width for larger screens
          }}
        >
         <div style={{ padding: '5rem' }}> {/* Padding around the App component */}
            <App />
          </div>

        </Paper>
      </Container>


    </MantineProvider>
  </React.StrictMode>
);
