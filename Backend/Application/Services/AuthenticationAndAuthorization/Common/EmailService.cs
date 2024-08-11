using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.AuthenticationAndAuthorization.Common
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Intern Manager", _configuration["Smtp:From"]));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;


            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            email.Body = builder.ToMessageBody();

            using (var smtp = new SmtpClient())
            {
                try
                {
                    smtp.Connect(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"]), MailKit.Security.SecureSocketOptions.StartTls);
                    smtp.Authenticate(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
                    await smtp.SendAsync(email);
                }
                catch (Exception ex)
                {
                    // Handle any exceptions (e.g., log the error)
                    throw new Exception("Failed to send email", ex);
                }
                finally
                {
                    smtp.Disconnect(true);
                }
            }
        }
    }
}
