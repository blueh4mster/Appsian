using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        User Register(string username, string password);
        User Authenticate(string username, string password);
        User GetById(Guid id);
    }
}
