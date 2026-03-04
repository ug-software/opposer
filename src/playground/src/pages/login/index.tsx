import { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router";
import authApi from "../../services/api/auth";
import useRequest from "../../hooks/use-request";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loading, handleLoginRequest] = useRequest(async (lg: string, ps: string) => {
    setError("");
    const res = await authApi.login(lg, ps);
    
    if (res.success) {
      // check if manager
      const user = res.data.data.usr;
      const roles = user.rl || [];
      const isManager = roles.some((x: any) => x.mt === "all" && x.sm === "all");
      
      if (isManager) {
        navigate("/");
      } else {
        setError("Acesso negado. Apenas administradores podem acessar o playground.");
        await authApi.logout();
      }
    } else {
      setError(res.error || "Login ou senha inválidos.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginRequest(login, password);
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Opposer Playground
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Faça login para acessar o ambiente de testes
          </Typography>
          
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Login"
              autoComplete="username"
              autoFocus
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
