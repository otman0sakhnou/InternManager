﻿using Application.Services.AuthenticationAndAuthorization.Commands;
using Application.Services.AuthenticationAndAuthorization.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginCommand loginCommand)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _mediator.Send(loginCommand);
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized(new { Message = "Invalid username or password." });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _mediator.Send(command);
            if (response.Success)
            {
                //on successfull registration this will be the response: {"userId": "12345abcde"}
                return Ok(new { UserId = response.UserId });
            }
            return BadRequest(response.Errors);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(response.Message);
            }
            return BadRequest(response.Errors);
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok(new
                {
                    AccessToken = response.AccessToken,
                    RefreshToken = response.RefreshToken
                });
            }
            return BadRequest(response.Errors);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _mediator.Send(command);
            if (response.Success)
            {
                return Ok("Logout successfully");
            }
            return BadRequest(response.Errors);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var result = await _mediator.Send(command);

            if (result.Success)
            {
                return Ok(result.Message);
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUser(string userId)
        {
            var query = new GetUserQuery(userId);
            var response = await _mediator.Send(query);

            if (response.User != null)
            {
                return Ok(response.User);
            }

            return NotFound(response.Error);
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var command = new DeleteUserCommand(userId);
            var response = await _mediator.Send(command);

            if (response.Success)
            {
                return Ok(response.Message);
            }

            return NotFound(response.Message);
        }

    }
}
