import emailjs from "emailjs-com";

export const SendMessage = (email, message) => {
  emailjs
    .send(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      {
        from_email: email,
        message,
      },
      "YOUR_USER_ID"
    )
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
    })
    .catch((err) => {
      console.log("FAILED...", err);
    });
};
