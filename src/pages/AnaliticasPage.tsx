import { Box, Typography } from '@mui/material'

export default function AnaliticasPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>
      <Box
        sx={{
          width: '100%',
          height: '80vh',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <iframe
          style={{
            background: '#21313C',
            border: 'none',
            borderRadius: '2px',
            boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)',
            width: '100%',
            height: '100%',
          }}
          src="https://charts.mongodb.com/charts-project-0-tnmpysl/embed/dashboards?id=67fc80d0-718b-4fed-8a41-c06cb8ff39c8&theme=dark&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
          allowFullScreen
        />
      </Box>
    </Box>
  )
}
