using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _db;

        public ProjectService(AppDbContext db)
        {
            _db = db;
        }

        public IEnumerable<Project> GetAll(Guid userId)
        {
            return _db.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToList();
        }

        public Project GetById(Guid userId, Guid projectId)
        {
            return _db.Projects
                .FirstOrDefault(p => p.Id == projectId && p.UserId == userId);
        }

        public Project Create(Guid userId, string title, string description)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = title,
                Description = description
            };

            _db.Projects.Add(project);
            _db.SaveChanges();
            return project;
        }

        public void Delete(Guid userId, Guid projectId)
        {
            var project = GetById(userId, projectId);
            if (project == null)
                throw new Exception("Project not found");

            _db.Projects.Remove(project);
            _db.SaveChanges();
        }
    }
}
