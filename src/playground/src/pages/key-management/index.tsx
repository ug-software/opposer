import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Tooltip,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import api from "../../services/api/playground";
import useRequest from "../../hooks/use-request";
import { useToast } from "../../context/toast";
import { useConfirm } from "../../context/confirm";

const validationSchema = Yup.object({
  nm: Yup.string().required("Nome da chave é obrigatório"),
  ex: Yup.date()
    .required("Data de expiração é obrigatória")
    .min(new Date(), "A data deve ser futura"),
});

const generateHash = (length = 32) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => {
    return byte.toString(16).padStart(2, "0");
  }).join("");
};

export default () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newGeneratedKey, setNewGeneratedKey] = useState<string | null>(null);
  const { showToast } = useToast();
  const { confirmAction } = useConfirm();

  const [loadingKeys, fetchKeys] = useRequest(async () => {
    const res = await api.sendRequestOpposer(
      JSON.stringify({ method: "get", model: "ke", query: { filter: {} } })
    );
    if (res.success) {
      setKeys(res.data);
    } else {
      showToast(res.error || "Erro ao carregar chaves", "error");
    }
  });

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleOpen = () => {
    formik.resetForm();
    setNewGeneratedKey(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    confirmAction({
      title: "Excluir Chave",
      description: "Deseja realmente excluir esta chave?",
      onConfirm: async () => {
        const res = await api.sendRequestOpposer(
          JSON.stringify({ method: "delete", model: "ke", filter: { id } })
        );
        if (res.success) {
          showToast("Chave excluída com sucesso!", "success");
          fetchKeys();
        } else {
          showToast(res.error || "Erro ao excluir chave", "error");
        }
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Chave copiada para a área de transferência!", "success");
  };

  const handleSubmit = async (values: any) => {
    const hash = generateHash();
    const res = await api.sendRequestOpposer(
      JSON.stringify({
        method: "insert",
        model: "ke",
        data: {
          nm: values.nm,
          ex: values.ex,
          hs: hash,
        },
      })
    );

    if (res.success) {
      setNewGeneratedKey(hash);
      showToast("Chave gerada com sucesso!", "success");
      fetchKeys();
    } else {
      showToast(res.error || "Erro ao criar chave", "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      nm: "",
      ex: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Gerenciamento de API Keys</Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon />}
          onClick={handleOpen}
        >
          Nova Chave
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "background.paper" }}>
                Nome
              </TableCell>
              <TableCell sx={{ backgroundColor: "background.paper" }}>
                Hash (Parcial)
              </TableCell>
              <TableCell sx={{ backgroundColor: "background.paper" }}>
                Expiração
              </TableCell>
              <TableCell
                align="right"
                sx={{ backgroundColor: "background.paper" }}
              >
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingKeys ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhuma chave encontrada
                </TableCell>
              </TableRow>
            ) : (
              keys.map((key) => {
                return (
                  <TableRow key={key.id}>
                    <TableCell>{key.nm}</TableCell>
                    <TableCell>
                      <code>
                        {key.hs.substring(0, 8)}...
                        {key.hs.substring(key.hs.length - 4)}
                      </code>
                    </TableCell>
                    <TableCell>
                      {new Date(key.ex).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Copiar Hash">
                        <IconButton
                          onClick={() => {
                            return copyToClipboard(key.hs);
                          }}
                          color="primary"
                        >
                          <ContentCopyRoundedIcon />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={() => {
                          return handleDelete(key.id);
                        }}
                        color="error"
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nova API Key</DialogTitle>
        <Divider />
        <DialogContent>
          {newGeneratedKey ? (
            <Box sx={{ mt: 2 }}>
              <Paper
                variant="outlined"
                sx={{ p: 2, bgcolor: "rgba(129, 199, 132, 0.1)", mb: 2 }}
              >
                <Typography variant="body2" color="success.main">
                  Chave criada com sucesso! <strong>Copie-a agora</strong>, pois
                  ela não será exibida novamente por completo por motivos de
                  segurança.
                </Typography>
              </Paper>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-all",
                    flex: 1,
                    fontFormat: "monospace",
                  }}
                >
                  {newGeneratedKey}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    return copyToClipboard(newGeneratedKey);
                  }}
                >
                  <ContentCopyRoundedIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box component="form" sx={{ pt: 1 }}>
              <TextField
                fullWidth
                name="nm"
                label="Nome da Chave (ex: Produção, Web App)"
                sx={{ mb: 2 }}
                value={formik.values.nm}
                onChange={formik.handleChange}
                error={formik.touched.nm && Boolean(formik.errors.nm)}
                helperText={formik.touched.nm && (formik.errors.nm as string)}
              />
              <TextField
                fullWidth
                name="ex"
                label="Data de Expiração"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                value={formik.values.ex}
                onChange={formik.handleChange}
                error={formik.touched.ex && Boolean(formik.errors.ex)}
                helperText={formik.touched.ex && (formik.errors.ex as string)}
              />
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button disableElevation onClick={handleClose}>
            {newGeneratedKey ? "Fechar" : "Cancelar"}
          </Button>
          {!newGeneratedKey && (
            <Button
              onClick={() => {
                return formik.handleSubmit();
              }}
              variant="contained"
              disableElevation
            >
              Gerar Chave
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
