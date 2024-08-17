using Domain.DTOs.Periods;
using Domain.Models;
using AutoMapper;
using Application.Services.PriodService.Commands;


namespace Application.Mappings.Periods
{
    public class PeriodProfile : Profile
    {
        public PeriodProfile()
        {
            CreateMap<Period, PeriodDto>().ReverseMap();

            CreateMap<CreatePeriodCommand, Period>()
                  .ForMember(dest => dest.Id, opt => opt.Ignore()) 
                 
                  .ReverseMap();

            CreateMap<UpdatePeriodCommand, Period>()
           .ForMember(dest => dest.Id, opt => opt.Ignore()).ReverseMap();

        }
    }
}
