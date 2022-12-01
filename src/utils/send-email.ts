import { ClientResponse } from '@sendgrid/client/src/response';
import { ResponseError } from '@sendgrid/helpers/classes';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import MailService from '@sendgrid/mail';

MailService.setApiKey(process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '');

const sendEmail = async (
  to: string | undefined,
  templateId: string,
  templateData: Record<string, string | undefined>,
  callback: (err: Error | ResponseError, result: [ClientResponse, Record<string, never>]) => void,
) => {
  const msg: MailDataRequired = {
    mailSettings: {
      sandboxMode: {
        enable:
          process.env.ENV === 'test' ||
          process.env.ENV === 'develop' ||
          process.env.IS_TEST === 'true',
      },
    },
    to: to,
    from: process.env.SENDGRID_EMAIL_SENDER ? process.env.SENDGRID_EMAIL_SENDER : '',
    templateId: templateId,
    dynamicTemplateData: templateData,
  };
  await MailService.send(msg, undefined, callback);
};

export default sendEmail;
