using System.Text;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using AutonomousBuilding.service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace AutonomousBuilding
{
    public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add service to the container.
    public void ConfigureServices(IServiceCollection service)
    {
        service.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        service.AddScoped<IDatabaseService, DatabaseService>();
        service.AddScoped<IKeyDataRepository, KeyDataRepository>();
        service.AddScoped<ILockDataRepository, LockDataRepository>();
        service.AddScoped<IPersonKeyDataRepository, PersonKeyDataRepository>();
        service.AddScoped<ILockKeyDataRepository, LockKeyDataRepository>();
        service.AddScoped<IScheduleDataRepository, ScheduleDataRepository>();
        service.AddScoped<IScheduleKeyDataRepository, ScheduleKeyDataRepository>();
        service.AddScoped<IBrainBoxRepository, BrainBoxRepository > ();
        service.AddScoped<ILogRepository, LogRepository>();
        service.AddScoped<ILockTypeRepository, LockTypeRepository>();
        service.AddScoped<IPersonRepository, PersonRepository>();
        service.AddScoped<IAccountRepository, AccountRepository>();
        service.AddScoped<IOneTimeRepository, OneTimeRepository>();
        service.BuildServiceProvider().GetService<IDatabaseService>().RunMigrationScripts();

        // configure strongly typed settings objects
        var appSettingsSection = Configuration.GetSection("AppSettings");
        service.Configure<AppSettings>(appSettingsSection);

        // configure jwt authentication
        var appSettings = appSettingsSection.Get<AppSettings>();
        var key = Encoding.ASCII.GetBytes(appSettings.Secret);
        service.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.IncludeErrorDetails = true;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = false,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        // configure DI for application service
        service.AddScoped<IUserservice, Userservice>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseDefaultFiles();
      app.UseStaticFiles();
      app.UseHttpsRedirection();
      app.UseMvc();
      app.UseAuthentication();
    }
  }
}