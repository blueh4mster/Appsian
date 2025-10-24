using System;
using System.Linq;
using Backend.Data;
using Backend.Helpers;
using Backend.Models;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public User Register(string username, string password)
        {
            if (_db.Users.Any(u => u.Username == username))
                throw new Exception("Username already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = username,
                PasswordHash = PasswordHasher.Hash(password)
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return user;
        }

        public User Authenticate(string username, string password)
        {
            var user = _db.Users.SingleOrDefault(u => u.Username == username);
            if (user == null || !PasswordHasher.Verify(user.PasswordHash, password))
                return null;

            return user;
        }

        public User GetById(Guid id)
        {
            return _db.Users.Find(id);
        }
    }
}
