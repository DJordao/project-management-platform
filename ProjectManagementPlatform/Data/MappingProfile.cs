using AutoMapper;
using ProjectManagementPlatform.Data.Entities;
using ProjectManagementPlatform.Models;

namespace ProjectManagementPlatform.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Project, ProjectModel>().ReverseMap().ForMember(p => p.Tasks, opt => opt.Ignore()).ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Entities.Task, TaskModel>().ReverseMap();

            CreateMap<ProjectManager, ProjectManagerModel>().ReverseMap().ForMember(pm => pm.Projects, opt => opt.Ignore()).ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Developer, DeveloperModel>().ReverseMap().ForMember(d => d.Tasks, opt => opt.Ignore()).ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
