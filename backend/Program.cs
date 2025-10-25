using Backend.Data;
using Backend.Services;
using Backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // frontend URL
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<SchedulerService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; // optional
    });

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])
            )
        };
    });

builder.Services.AddAuthorization();
var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();