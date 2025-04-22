import React from "react";
import {
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";

const EmailModal = ({ open, onClose, data, selectedFields, setSelectedFields, selectedRows, setSelectedRows, onSend }) => {
  const handleFieldChange = (field) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleRowChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((client) => client.id));
    }
  };

  const handleSend = () => {
    onSend(selectedRows, selectedFields);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.85)",
          padding: "24px",
          borderRadius: "6px",
          width: "400px",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "600", color: "#333" }}>
          Select Data
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={selectedRows.length === data.length}
              onChange={handleSelectAll}
              size="small"
              sx={{
                color: "#007bff",
                "&.Mui-checked": { color: "#007bff" },
              }}
            />
          }
          label="Select All"
          sx={{ color: "#444" }}
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "500", color: "#555" }}>
            Fields:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "4px" }}>
            {["firstName", "lastName", "disposition"].map((field) => (
              <FormControlLabel
                key={field}
                control={
                  <Checkbox
                    checked={selectedFields[field]}
                    onChange={() => handleFieldChange(field)}
                    size="small"
                    sx={{
                      color: "#007bff",
                      "&.Mui-checked": { color: "#007bff" },
                    }}
                  />
                }
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                sx={{ color: "#444" }}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "500", color: "#555" }}>
            Rows:
          </Typography>
          <Box
            sx={{
              maxHeight: "140px",
              overflowY: "auto",
              borderRadius: "3px",
              background: "rgba(245, 245, 245, 0.8)",
              padding: "10px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              scrollbarWidth: "thin",
            }}
          >
            {data.map((client) => (
              <FormControlLabel
                key={client.id}
                control={
                  <Checkbox
                    checked={selectedRows.includes(client.id)}
                    onChange={() => handleRowChange(client.id)}
                    size="small"
                    sx={{
                      color: "#007bff",
                      "&.Mui-checked": { color: "#007bff" },
                    }}
                  />
                }
                label={`${client.first_name} ${client.last_name}`}
                sx={{ color: "#444" }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSend}
            size="small"
            sx={{
              background: "#7366FF",
              textTransform: "none",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "3px",
              "&:hover": { background: "#7366FF " },
            }}
          >
            Send Email
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "3px",
              borderColor: "#007bff",
              color: "#007bff",
              "&:hover": { background: "rgba(0, 123, 255, 0.1)" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmailModal;