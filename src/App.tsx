import Header from './components/Header'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <Header />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            ¡Hola con TS + Material UI!
          </Typography>
          <Typography>
            Tu proyecto corre con Vite, React, TypeScript y Material UI.
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default App