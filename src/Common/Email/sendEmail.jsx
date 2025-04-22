import emailjs from "emailjs-com";

// Initialize EmailJS with Public Key
emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

export const sendEmail = async (recipientEmail, message) => {
  const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
  const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

  const templateParams = {
    to_email: recipientEmail,
    message: message,
  };

  // ✅ Log Everything Before Sending
  console.log("🔍 Debugging EmailJS Data:");
  console.log("Service ID:", serviceId);
  console.log("Template ID:", templateId);
  console.log("Public Key:", publicKey);
  console.log("Template Params:", templateParams);

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log("✅ Email sent successfully!", response);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    return { success: false, message: "Failed to send email." };
  }
};
