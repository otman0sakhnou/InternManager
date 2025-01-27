﻿using Application.Repositories;
using Application.Repositories.Periods;
using Application.Services.AuthenticationAndAuthorization.Commands;
using Application.Services.LoggerService.Commands;
using AutoMapper;
using Domain.Models;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;


namespace Application.Services.InternService.Commands
{
    public class CreateInternCommand : IRequest<Guid>
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Institution { get; set; }
        public string Level { get; set; }
        public string Gender { get; set; }
        public string Specialization { get; set; }
        public int YearOfStudy { get; set; }
        public string Title { get; set; }
        public string Department { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }


    }

    public class CreateInternCommandHandler : IRequestHandler<CreateInternCommand, Guid>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IInternRepository _internRepository;
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        private readonly IPeriodRepository _periodRepository;

        // Définir un mot de passe statique
        private const string DefaultPassword = "SqliIntern123!";
        private const string role = "Intern";

        public CreateInternCommandHandler(
            UserManager<ApplicationUser> userManager,
            IInternRepository internRepository,
            IMapper mapper,
            IMediator mediator,
            IPeriodRepository periodRepository)

        {
            _userManager = userManager;
            _internRepository = internRepository;
            _mapper = mapper;
           _mediator = mediator;
            _periodRepository = periodRepository;
        }

        public async Task<Guid> Handle(CreateInternCommand request, CancellationToken cancellationToken)
        {
            // Créer l'utilisateur avec ASP.NET Identity
            //var user = new ApplicationUser
            //{
            //    UserName = request.Email,
            //    Email = request.Email
            //};
            //var result = await _userManager.CreateAsync(user, DefaultPassword);
            //if (!result.Succeeded)
            //{
            //    // Gérer les erreurs de création d'utilisateur
            //    throw new ApplicationException("Could not create user");
            //}

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                var registerCommand = new RegisterCommand(DefaultPassword, request.Email);
                var registerResult = await _mediator.Send(registerCommand, cancellationToken);

                if (!registerResult.Success)
                {
                    throw new ValidationException($"Failed to create user: {string.Join(", ", registerResult.Errors)}");
                }

                user = await _userManager.FindByIdAsync(registerResult.UserId);
                if (user == null)
                {
                    throw new ValidationException("User creation failed.");
                }
            }

            // Mapper les informations du stagiaire
            var intern = _mapper.Map<Intern>(request);
            intern.UserId = user.Id;

            // Ajouter le stagiaire à la base de données
            await _internRepository.AddAsync(intern);

            var period = new Period
            {
                Id = Guid.NewGuid(),
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                InternId = intern.Id, // Associez la période à l'intern
               
            };
            await _periodRepository.AddAsync(period);


            var logEntry = new LogEntry
            {
                UserId = null,
                Action = "CreateIntern",
                Timestamp = DateTime.UtcNow,
                Description = $"Intern with ID {intern.Id} was created."
            };
            if (!string.IsNullOrEmpty(role))
            {
                var assignRoleCommand = new AssignRoleCommand(user.Id, role);
                var assignRoleResult = await _mediator.Send(assignRoleCommand, cancellationToken);

                if (!assignRoleResult.Success)
                {
                    throw new ValidationException($"Failed to assign role: {string.Join(", ", assignRoleResult.Errors)}");
                }
            }

            var createLogCommand = new CreateLogEntryCommand { LogEntry = logEntry };
            await _mediator.Send(createLogCommand); // Envoyer le command de log


            return intern.Id;
        }
    }
}
