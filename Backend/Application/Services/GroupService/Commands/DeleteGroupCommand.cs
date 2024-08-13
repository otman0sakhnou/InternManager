using Application.Repositories.Groups;
using MediatR;


namespace Application.Services.GroupService.Commands
{
    public class DeleteGroupCommand : IRequest<bool>
    {
        public Guid Id { get; set; }

        public DeleteGroupCommand(Guid id)
        {
            Id = id;
        }
    }

    public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand, bool>
    {
        private readonly IGroupRepository _repository;

        public DeleteGroupCommandHandler(IGroupRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            var group = await _repository.GetByIdAsync(request.Id);
            if (group == null)
            {
                return false;
            }

            await _repository.DeleteAsync(request.Id);
            return true;
        }
    }
}
