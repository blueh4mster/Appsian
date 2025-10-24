using System;
using System.Collections.Generic;
using Backend.Models;

namespace Backend.Services
{
    public interface IProjectService
    {
        IEnumerable<Project> GetAll(Guid userId);
        Project GetById(Guid userId, Guid projectId);
        Project Create(Guid userId, string title, string description);
        void Delete(Guid userId, Guid projectId);
    }
}