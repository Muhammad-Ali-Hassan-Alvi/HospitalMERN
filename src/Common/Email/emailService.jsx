import emailjs from "emailjs-com";

export const sendEmail = (message, recipientEmail = "freefire247365@gmail.com") => {
  return new Promise((resolve, reject) => {
    console.log("Public Key:", process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    console.log("Service ID:", process.env.REACT_APP_EMAILJS_SERVICE_ID);
    console.log("Template ID:", process.env.REACT_APP_EMAILJS_TEMPLATE_ID);

    const templateParams = {
      to_email: recipientEmail, // Allow dynamic recipient
      message: message,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY // Pass Public Key here
      )
      .then((response) => {
        console.log("✅ Email sent successfully!", response);
        resolve("✅ Email sent successfully!");
      })
      .catch((error) => {
        console.error("❌ Email failed to send:", error);
        reject("❌ Failed to send email.");
      });
  });
};
