export interface SendMailDTO {
    to: string;
    subject: string;
    emailTemplate: string;
    context: {
      username?: string;
      [key: string]: any;
    };
  }