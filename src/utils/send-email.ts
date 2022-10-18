import MailService, { MailDataRequired } from '@sendgrid/mail';

MailService.setApiKey(process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '');

const sendEmail = async (to: string, templateId: string, templateData: Record<string, string>) => {
  const msg: MailDataRequired = {
    mailSettings: {
      sandboxMode: {
        enable: !(
          process.env.ENV === 'test' ||
          process.env.ENV === 'develop' ||
          process.env.IS_TEST === 'true'
        ),
      },
    },
    to: to,
    from: 'guido.cerioni@radiumrocket.com',
    templateId: templateId,
    dynamicTemplateData: templateData,
  };
  await MailService.send(msg);
};

export default sendEmail;
