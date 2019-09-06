using System.Text;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using AutonomousBuilding.Services;
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

    // This method gets called by the runtime. Use this method to add Services to the container.
    public void ConfigureServices(IServiceCollection Services)
    {
        Services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        Services.AddScoped<IDatabaseService, DatabaseService>();
        Services.AddScoped<IKeyDataRepository, KeyDataRepository>();
        Services.AddScoped<ILockDataRepository, LockDataRepository>();
        Services.AddScoped<IPersonKeyDataRepository, PersonKeyDataRepository>();
        Services.AddScoped<ILockKeyDataRepository, LockKeyDataRepository>();
        Services.AddScoped<IScheduleDataRepository, ScheduleDataRepository>();
        Services.AddScoped<IScheduleKeyDataRepository, ScheduleKeyDataRepository>();
        Services.AddScoped<IBrainBoxRepository, BrainBoxRepository > ();
        Services.AddScoped<ILogRepository, LogRepository>();
        Services.AddScoped<ILockTypeRepository, LockTypeRepository>();
        Services.AddScoped<IPersonRepository, PersonRepository>();
        Services.BuildServiceProvider().GetService<IDatabaseService>().RunMigrationScripts();

        // configure strongly typed settings objects
        var appSettingsSection = Configuration.GetSection("AppSettings");
        Services.Configure<AppSettings>(appSettingsSection);

        // configure jwt authentication
        var appSettings = appSettingsSection.Get<AppSettings>();
        var key = Encoding.ASCII.GetBytes(appSettings.Secret);
        Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        // configure DI for application Services
        Services.AddScoped<IUserServices, UserServices>();
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