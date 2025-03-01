import Mailgen from "mailgen";
import Nodemailer from "nodemailer";
// import { mailOptions } from "./types/user.types";
import dotenv from "dotenv";
dotenv.config();
const sendMail = async (option: any) => {
  try {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Rupesh Khadka",
        link: "https://example.com",
      },
    });

    // Make sure option.mailgenContent exists and is properly formatted
    if (!option.mailgenContent) {
      console.error("Missing mailgenContent in email options");
      return;
    }

    const emailHtml = mailGenerator.generate(option.mailgenContent);
    const textEmail = mailGenerator.generatePlaintext(option.mailgenContent);

    const transporter = Nodemailer.createTransport({
      service: "gmail",  // Using service instead of host can be more reliable
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mail = {
      from: `"Rupesh Khadka" <${process.env.GMAIL_USER}>`,
      to: option.email,
      subject: option.subject,
      text: textEmail,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mail);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Email service failed:", err);
    return false;
  }
};
// const emailVerificationMailgenContent = (
//   username: string,
//   verificationUrl: string
// ): Mailgen.Content => {
//   return {
//     body: {
//       name: username,
//       intro: "Welcome to our app! We're very excited to have you on board.",
//       action: {
//         instructions:
//           "To verify your email please click on the following button:",
//         button: {
//           color: "#22BC66", // Optional action button color
//           text: "Verify your email",
//           link: verificationUrl,
//         },
//       },
//       outro:
//         "Need help, or have questions? Just reply to this email, we'd love to help.",
//     },
//   };
// };

const forgotPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string
): Mailgen.Content => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of our account",
      action: {
        instructions:
          "To reset your password click on the following button or link:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendMail, forgotPasswordMailgenContent };
