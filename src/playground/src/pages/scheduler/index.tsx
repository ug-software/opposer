import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  CircularProgress,
  Chip,
} from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { playgroundApi } from "../../services";
import useRequest from "../../hooks/use-request";
import { useToast } from "../../context/toast";
import {
  SchedulerWrapper,
  PageHeader,
  SearchBar,
  HistoryCard,
  StyledTableContainer,
  StatusChip,
  TaskName,
  ErrorText,
} from "./styles";

interface Task {
  name: string;
  interval: number;
  enabled: boolean;
}

interface ExecutionHistory {
  id: string;
  nm: string;
  st: string;
  ft: string;
  sc: boolean;
  er: string;
  du: number;
}

export default () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<ExecutionHistory[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { showToast } = useToast();

  const [loadingTasks, fetchTasks] = useRequest(() => {
    return playgroundApi.sendRequestOpposer(
      JSON.stringify({
        controller: "scheduler",
        method: "listTasks",
        payload: {},
      })
    );
  });

  const [loadingHistory, fetchHistory] = useRequest(() => {
    return playgroundApi.sendRequestOpposer(
      JSON.stringify({
        controller: "scheduler",
        method: "getHistory",
        payload: {},
      })
    );
  });

  const [runningTask, executeTask] = useRequest((name: string) => {
    return playgroundApi.sendRequestOpposer(
      JSON.stringify({
        controller: "scheduler",
        method: "runTask",
        payload: { name },
      })
    );
  });

  const loadData = async () => {
    const tasksRes = await fetchTasks();
    if (tasksRes.success) {
      setTasks(tasksRes.data.data);
    } else {
      showToast(tasksRes.error || "Erro ao carregar tarefas", "error");
    }

    const historyRes = await fetchHistory();
    if (historyRes.success) {
      setHistory(historyRes.data.data);
    } else {
      showToast(historyRes.error || "Erro ao carregar histórico", "error");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30s
    return () => {
      return clearInterval(interval);
    };
  }, []);

  const handleRunTask = async (name: string) => {
    const res = await executeTask(name);
    if (res.success) {
      showToast(`Tarefa '${name}' iniciada com sucesso!`, "success");
    } else {
      showToast(res.error || `Erro ao executar tarefa '${name}'`, "error");
    }
    loadData();
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        item.nm.toLowerCase().includes(search.toLowerCase()) ||
        (item.er && item.er.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "success" && item.sc) ||
        (statusFilter === "error" && !item.sc && item.ft) ||
        (statusFilter === "running" && !item.ft);

      return matchesSearch && matchesStatus;
    });
  }, [history, search, statusFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatus = (item: ExecutionHistory) => {
    if (!item.ft) {
      return <StatusChip label="EXECUTANDO" status="running" size="small" />;
    }
    if (item.sc) {
      return <StatusChip label="SUCESSO" status="success" size="small" />;
    }
    return <StatusChip label="ERRO" status="error" size="small" />;
  };

  return (
    <SchedulerWrapper>
      <PageHeader>
        <Typography variant="h4" fontWeight="bold">
          Scheduler
        </Typography>
        <IconButton
          onClick={loadData}
          disabled={loadingTasks || loadingHistory}
        >
          <RefreshRoundedIcon />
        </IconButton>
      </PageHeader>

      <HistoryCard elevation={0}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Tarefas Cadastradas
        </Typography>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Intervalo (ms)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => {
                return (
                  <TableRow key={task.name}>
                    <TableCell>
                      <TaskName>{task.name}</TaskName>
                    </TableCell>
                    <TableCell>{task.interval}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.enabled ? "ATIVO" : "INATIVO"}
                        color={task.enabled ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Executar Agora">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            return handleRunTask(task.name);
                          }}
                          disabled={runningTask}
                        >
                          <PlayArrowRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {tasks.length === 0 && !loadingTasks && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhuma tarefa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </HistoryCard>

      <HistoryCard elevation={0}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Histórico de Execução
        </Typography>

        <SearchBar>
          <TextField
            label="Pesquisar por nome ou erro"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => {
              return setSearch(e.target.value);
            }}
            sx={{ flex: 1, minWidth: "250px" }}
          />
          <FormControl size="small" sx={{ minWidth: "150px" }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                return setStatusFilter(e.target.value);
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="success">Sucesso</MenuItem>
              <MenuItem value="error">Erro</MenuItem>
              <MenuItem value="running">Executando</MenuItem>
            </Select>
          </FormControl>
        </SearchBar>

        <StyledTableContainer>
          {loadingHistory && history.length === 0 ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Tarefa</TableCell>
                  <TableCell>Início</TableCell>
                  <TableCell>Fim</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Mensagem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Typography fontWeight="medium">{item.nm}</Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(item.st).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {item.ft ? new Date(item.ft).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>{item.du ? `${item.du}ms` : "-"}</TableCell>
                        <TableCell>{getStatus(item)}</TableCell>
                        <TableCell>
                          {item.er ? (
                            <Tooltip title={item.er}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <ErrorOutlineRoundedIcon
                                  color="error"
                                  fontSize="small"
                                />
                                <ErrorText>{item.er}</ErrorText>
                              </Box>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </StyledTableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </HistoryCard>
    </SchedulerWrapper>
  );
};
