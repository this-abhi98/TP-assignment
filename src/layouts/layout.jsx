import { Container, Box } from '@mui/material'

export default function Layout({ children }) {
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Container maxWidth="xl" sx={{ py: 2 }}>
                {children}
            </Container>
        </Box>
    )
}