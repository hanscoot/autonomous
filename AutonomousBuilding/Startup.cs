using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Repositories;
using AutonomousBuilding.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AutonomousBuilding
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
      services.AddScoped<IDatabaseService, DatabaseService>();
      services.AddScoped<ITestDataRepository, TestDataRepository>();
      services.AddScoped<IKeyDataRepository, KeyDataRepository>();
      services.AddScoped<ILockDataRepository, LockDataRepository>();
      services.AddScoped<IPersonKeyDataRepository, PersonKeyDataRepository>();
      services.AddScoped<ILockKeyDataRepository, LockKeyDataRepository>();
      services.AddScoped<IScheduleDataRepository, ScheduleDataRepository>();
      services.AddScoped<IScheduleKeyDataRepository, ScheduleKeyDataRepository>();
      services.AddScoped<IBrainBoxRepository, BrainBoxRepository > ();
      services.AddScoped<ILogRepository, LogRepository>();
      services.AddScoped<ILockTypeRepository, LockTypeRepository>();
            services.BuildServiceProvider().GetService<IDatabaseService>().RunMigrationScripts();
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
    }
  }
}