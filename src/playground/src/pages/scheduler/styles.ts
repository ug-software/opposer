import {
  Box,
  styled,
  Paper,
  TableContainer,
  Typography,
  Chip,
} from "@mui/material";

export const SchedulerWrapper = styled(Box)({
  padding: "2rem",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const PageHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1rem",
});

export const SearchBar = styled(Box)({
  display: "flex",
  gap: "1rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
});

export const HistoryCard = styled(Paper)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "15px",
  backgroundColor: theme.palette.background.paper,
  width: "100%",
}));

export const StyledTableContainer = styled(TableContainer)({
  marginTop: "1rem",
  borderRadius: "8px",
  maxHeight: "60vh",
  "& .MuiTableCell-head": {
    fontWeight: "bold",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

export const StatusChip = styled(Chip)<{ status: 'success' | 'error' | 'running' }>(({ status, theme }) => ({
  fontWeight: "bold",
  ...(status === 'success' && {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    color: "#4caf50",
    border: "1px solid #4caf50",
  }),
  ...(status === 'error' && {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    color: "#f44336",
    border: "1px solid #f44336",
  }),
  ...(status === 'running' && {
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    color: "#2196f3",
    border: "1px solid #2196f3",
  }),
}));

export const TaskName = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1rem",
});

export const ErrorText = styled(Typography)({
  color: "#f44336",
  fontSize: "0.85rem",
  maxWidth: "300px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
