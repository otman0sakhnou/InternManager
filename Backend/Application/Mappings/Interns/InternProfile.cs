using AutoMapper;
using Domain.Models;

using Domain.DTOs;
using Application.Services.InternService.Commands;

namespace Application.Mappings
{
    public class InternProfile : Profile
    {
        public InternProfile()
        {
            CreateMap<Intern, InternDto>().ReverseMap();
            CreateMap<UpdateInternCommand, Intern>();
            CreateMap<CreateInternCommand, Intern>()
               .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignorer l'ID car il sera généré automatiquement
               .ForMember(dest => dest.UserId, opt => opt.Ignore()); // Ignorer l'UserId car il sera assigné après la création de l'utilisateur

        }
    }
}
