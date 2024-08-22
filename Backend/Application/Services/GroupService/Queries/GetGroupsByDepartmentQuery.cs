using Application.Repositories.Groups;
using Application.Services.GroupService.Queries;
using Domain.Models;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services.GroupService.Queries
{
    public class GetGroupsByDepartmentQuery : IRequest<IEnumerable<Group>>
    {
        public string Department { get; set; }

        public GetGroupsByDepartmentQuery(string department)
        {
            Department = department;
        }
    }
}
public class GetGroupsByDepartmentQueryHandler : IRequestHandler<GetGroupsByDepartmentQuery, IEnumerable<Group>>
{
    private readonly IGroupRepository _repository;

    public GetGroupsByDepartmentQueryHandler(IGroupRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Group>> Handle(GetGroupsByDepartmentQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetGroupsByDepartmentAsync(request.Department);
    }
}

