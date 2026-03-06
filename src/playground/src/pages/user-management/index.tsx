import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Switch,
  FormControlLabel,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import api from "../../services/api/playground";
import useRequest from "../../hooks/use-request";
import { useToast } from "../../context/toast";
import { useConfirm } from "../../context/confirm";

const validationSchema = Yup.object({
  fn: Yup.string().required("Primeiro nome é obrigatório"),
  ln: Yup.string().required("Sobrenome é obrigatório"),
  lg: Yup.string()
    .email("Formato de email inválido")
    .required("Login (email) é obrigatório"),
  ps: Yup.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,}$/,
      "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    )
    .test("required-if-new", "Senha é obrigatória", function (value) {
      if (!(this.options as any).context?.editingUser && !value) {
        return false;
      }
      return true;
    }),
  ac: Yup.boolean(),
});

export default () => {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const { showToast } = useToast();
  const { confirmAction } = useConfirm();

  const [loadingUsers, fetchUsers] = useRequest(async () => {
    const res = await api.sendRequestOpposer(
      JSON.stringify({ method: "get", model: "usr", query: { filter: {} } })
    );
    if (res.success) {
      setUsers(res.data);
    } else {
      showToast(res.error || "Erro ao carregar usuários", "error");
    }
  });

  const [loadingModels, fetchModels] = useRequest(async () => {
    const res = await api.getAppMap();
    if (res.success && res.data) {
      setModels(Object.keys(res.data.models));
    }
  });

  useEffect(() => {
    fetchUsers();
    fetchModels();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    const res = await api.sendRequestOpposer(
      JSON.stringify({
        method: "get",
        model: "rl",
        query: { filter: { usr: userId } },
      })
    );
    if (res.success) {
      setUserRoles(res.data);
    } else {
      showToast(res.error || "Erro ao carregar permissões", "error");
    }
  };

  const handleOpen = (user: any = null) => {
    setEditUser(user);
    setUserRoles([]);
    setSelectedModel("");
    setSelectedMethod("");
    if (user) {
      formik.setValues({
        fn: user.fn,
        ln: user.ln,
        lg: user.lg,
        ps: "", // Senha não deve ser carregada
        ac: user.ac,
      });
      fetchUserRoles(user.id);
    } else {
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleAddRole = async () => {
    if (!selectedModel || !selectedMethod || !editingUser) return;

    const res = await api.sendRequestOpposer(
      JSON.stringify({
        method: "insert",
        model: "rl",
        data: {
          sm: selectedModel,
          mt: selectedMethod,
          usr: editingUser.id,
        },
      })
    );

    if (res.success) {
      showToast("Permissão adicionada com sucesso!", "success");
      fetchUserRoles(editingUser.id);
      setSelectedModel("");
      setSelectedMethod("");
    } else {
      showToast(res.error || "Erro ao adicionar permissão", "error");
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    confirmAction({
      title: "Remover Permissão",
      description: "Deseja realmente remover esta permissão?",
      onConfirm: async () => {
        const res = await api.sendRequestOpposer(
          JSON.stringify({
            method: "delete",
            model: "rl",
            filter: { id: roleId },
          })
        );

        if (res.success) {
          showToast("Permissão removida com sucesso!", "success");
          fetchUserRoles(editingUser.id);
        } else {
          showToast(res.error || "Erro ao remover permissão", "error");
        }
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleDelete = async (id: string) => {
    confirmAction({
      title: "Excluir Usuário",
      description: "Deseja realmente excluir este usuário?",
      onConfirm: async () => {
        const res = await api.sendRequestOpposer(
          JSON.stringify({ method: "delete", model: "usr", filter: { id } })
        );
        if (res.success) {
          showToast("Usuário excluído com sucesso!", "success");
          fetchUsers();
        } else {
          showToast(res.error || "Erro ao excluir usuário", "error");
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    let res;
    if (editingUser) {
      // Na edição, se a senha estiver vazia, não enviamos
      const data: any = { ...values };
      if (!values.ps) {
        delete data.ps;
      }
      res = await api.sendRequestOpposer(
        JSON.stringify({
          method: "update",
          model: "usr",
          filter: { id: editingUser.id },
          data: data,
        })
      );
    } else {
      res = await api.sendRequestOpposer(
        JSON.stringify({
          method: "insert",
          model: "usr",
          data: values,
        })
      );
    }

    if (res.success) {
      showToast(
        `Usuário ${editingUser ? "atualizado" : "criado"} com sucesso!`,
        "success"
      );
      handleClose();
      fetchUsers();
    } else {
      showToast(res.error || "Erro ao salvar usuário", "error");
    }
  };

  const formik = useFormik({
    initialValues: {
      fn: "",
      ln: "",
      lg: "",
      ps: "",
      ac: true,
    },
    validationSchema: validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
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
        <Typography variant="h4">Gerenciamento de Usuários</Typography>
        <Button
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            return handleOpen();
          }}
        >
          Novo Usuário
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
                Login
              </TableCell>
              <TableCell sx={{ backgroundColor: "background.paper" }}>
                Status
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
            {loadingUsers ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.fn} {user.ln}
                    </TableCell>
                    <TableCell>{user.lg}</TableCell>
                    <TableCell>{user.ac ? "Ativo" : "Inativo"}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => {
                          return handleOpen(user);
                        }}
                        color="primary"
                      >
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          return handleDelete(user.id);
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          {editingUser ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                name="fn"
                label="Primeiro Nome"
                value={formik.values.fn}
                onChange={formik.handleChange}
                error={formik.touched.fn && Boolean(formik.errors.fn)}
                helperText={formik.touched.fn && (formik.errors.fn as string)}
              />
              <TextField
                fullWidth
                name="ln"
                label="Sobrenome"
                value={formik.values.ln}
                onChange={formik.handleChange}
                error={formik.touched.ln && Boolean(formik.errors.ln)}
                helperText={formik.touched.ln && (formik.errors.ln as string)}
              />
            </Box>
            <TextField
              fullWidth
              name="lg"
              label="Login (Email)"
              sx={{ mb: 2 }}
              value={formik.values.lg}
              onChange={formik.handleChange}
              error={formik.touched.lg && Boolean(formik.errors.lg)}
              helperText={formik.touched.lg && (formik.errors.lg as string)}
            />
            <TextField
              fullWidth
              name="ps"
              label="Senha"
              type="password"
              sx={{ mb: 2 }}
              value={formik.values.ps}
              onChange={formik.handleChange}
              error={formik.touched.ps && Boolean(formik.errors.ps)}
              helperText={
                formik.touched.ps
                  ? (formik.errors.ps as string)
                  : editingUser
                  ? "Deixe em branco para não alterar"
                  : ""
              }
            />
            <FormControlLabel
              control={
                <Switch
                  name="ac"
                  checked={formik.values.ac}
                  onChange={formik.handleChange}
                />
              }
              label="Ativo"
            />

            {editingUser && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Permissões de Modelos
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Modelo</InputLabel>
                    <Select
                      value={selectedModel}
                      label="Modelo"
                      onChange={(e) => {
                        return setSelectedModel(e.target.value);
                      }}
                    >
                      <MenuItem value="all">all (Todos)</MenuItem>
                      {models.map((model) => {
                        return (
                          <MenuItem key={model} value={model}>
                            {model}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Método</InputLabel>
                    <Select
                      value={selectedMethod}
                      label="Método"
                      onChange={(e) => {
                        return setSelectedMethod(e.target.value);
                      }}
                    >
                      <MenuItem value="get">get</MenuItem>
                      <MenuItem value="insert">insert</MenuItem>
                      <MenuItem value="update">update</MenuItem>
                      <MenuItem value="delete">delete</MenuItem>
                      <MenuItem value="all">all (Todos)</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={handleAddRole}
                    disabled={!selectedModel || !selectedMethod}
                    startIcon={<AddRoundedIcon />}
                  >
                    Adicionar
                  </Button>
                </Box>

                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{ maxHeight: 300, overflow: "auto" }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: "background.paper" }}>
                          Modelo
                        </TableCell>
                        <TableCell sx={{ backgroundColor: "background.paper" }}>
                          Método
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ backgroundColor: "background.paper" }}
                        >
                          Ação
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userRoles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            Nenhuma permissão atribuída
                          </TableCell>
                        </TableRow>
                      ) : (
                        userRoles.map((role) => {
                          return (
                            <TableRow key={role.id}>
                              <TableCell>{role.sm}</TableCell>
                              <TableCell>{role.mt}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    return handleRemoveRole(role.id);
                                  }}
                                >
                                  <DeleteRoundedIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button disableElevation onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              return formik.handleSubmit();
            }}
            variant="contained"
            disableElevation
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
