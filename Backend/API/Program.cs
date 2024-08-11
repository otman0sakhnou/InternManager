using Application.Behaviors;
using Application.Mapping;
using Application.Repositories;
using Application.Services.AuthenticationAndAuthorization.Commands;
using Application.Services.AuthenticationAndAuthorization.Common;
using Application.Services.AuthenticationAndAuthorization.Validators;
using Domain.Models;
using FluentValidation;
using Infrastructure.Data.Context;
using Infrastructure.Data.Seed;
using Infrastructure.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Configure DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
});

// Configure services
builder.Services.AddControllers();
// Uncomment and configure FluentValidation if needed
//builder.Services.AddControllers()
//    .AddFluentValidationAutoValidation()
//    .AddFluentValidationClientsideAdapters()
//    .AddValidatorsFromAssemblyContaining<YourValidatorClass>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()); // Use if you need to allow credentials
});

// Configure Identity
//builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>( options =>
    { 
    // Password settings
    options.Password.RequireDigit = false;            // Password does not require a digit
    options.Password.RequireLowercase = false;        // Password does not require a lowercase letter
    options.Password.RequireUppercase = false;        // Password does not require an uppercase letter
    options.Password.RequireNonAlphanumeric = false;  // Password does not require a non-alphanumeric character
    options.Password.RequiredLength = 6;              // Minimum length of 6 characters
    options.Password.RequiredUniqueChars = 1;         // Number of unique characters required
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(MappinProfile));


//builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<RegisterCommand>());
//builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Register TokenService
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
builder.Services.AddValidatorsFromAssemblyContaining<RegisterCommandValidator>();

// Configure JWT authentication
//var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
//var key = Encoding.ASCII.GetBytes(jwtSettings.Key);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });


builder.Services.AddAuthorization();



builder.Services.AddScoped<RoleSeeder>();
builder.Services.AddScoped<AdminUsersSeeder>();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Define the BearerAuth scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// Configure Repositories
builder.Services.AddScoped(typeof(ILoggerRepository<>), typeof(LoggerRepository<>));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.MapIdentityApi<IdentityUser>();
app.UseAuthentication();
app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

// Seed roles in the database
using (var scope = app.Services.CreateScope())
{
    var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeeder>();
    await roleSeeder.SeedRolesAsync();
}

// Seed admin users
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await AdminUsersSeeder.Initialize(userManager, roleManager);
}


app.Run();
