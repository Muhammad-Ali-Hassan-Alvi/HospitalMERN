import React, { useState } from "react";
import { Modal, Button, TextField, Typography, Box } from "@mui/material"; // Use @mui/material for the latest version
import { sendEmail } from "./emailService"; // Adjust the path if needed

const EmailForm = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();

    try {
      const result = await sendEmail(message);
      setStatus(result);
      onClose(); // Close the modal after sending
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="email-modal-title" aria-describedby="email-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="email-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Send an Email
        </Typography>
        <form onSubmit={handleSendEmail} className="flex flex-col space-y-3">
          <TextField
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }} // Add margin bottom for spacing
          />
          <Button
          className="bg-primary"
            type="submit"
            variant="contained"
           
            fullWidth
            sx={{
              padding: '8px', // Add padding for the button
              fontSize: '12px', // Adjust font size
              borderRadius: '4px', // Rounded corners
            }}
          >
            Send Email
          </Button>
        </form>
        {status && <Typography variant="body2" color="error" sx={{ mt: 2 }}>{status}</Typography>}
      </Box>
    </Modal>
  );
};

export default EmailForm;