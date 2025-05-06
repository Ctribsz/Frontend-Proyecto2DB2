import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from './components/Sidebar';
import { useUsuarios } from './hooks/useUsuarios'; // nuevo hook
import { Usuario } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#60a5fa', // Azul claro
    },
    secondary: {
      main: '#fb923c', // Naranja
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        
      </Box>
    </ThemeProvider>
  );
}

export default App;
