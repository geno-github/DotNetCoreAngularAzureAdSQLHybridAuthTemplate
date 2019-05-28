using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using HybridAuthCustomApp_V1.API.v1.Utilities;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace HybridAuthCustomApp_V1
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
      // token auth - jwt
      services.AddAuthentication(authOptions =>
      {
        authOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        authOptions.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        authOptions.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
        .AddJwtBearer(jwtOptions =>
        {
          jwtOptions.RequireHttpsMetadata = true;
          jwtOptions.SaveToken = true;
          jwtOptions.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
          {
            ValidateAudience = true,
            ValidAudiences = new List<string>
            {
              Configuration["AzureAd:ApiAppIdUrl"]
            },
            ValidateIssuer = false
            // ValidateIssuer = true << use for Corporate-Only scenarios
          };
          jwtOptions.Audience = Configuration["AzureAd:ApiAppIdUrl"];
          jwtOptions.Authority = Configuration["AzureAd:Authority"];
        });

      // add auth polices and wire to handlers
      services.AddAuthorization(options =>
      {
        options.AddPolicy("AdminUsersOnly",
                  policy => policy
                  .AddRequirements(new UserIsAdminUserRequirement()));

        options.AddPolicy("PrivilegedUsersMinimum",
                  policy => policy
                  .AddRequirements(new UserIsPrivilegedUserRequirement()));

        options.AddPolicy("NormalUsersMinimum",
                  policy => policy
                  .AddRequirements(new UserIsNormalUserRequirement()));
      });

      // add mvc with option to disable reference loop handling to avoid error when returning joined tables in EF
      services.AddMvc()
        .AddJsonOptions(opt =>
          opt.SerializerSettings.ReferenceLoopHandling =
          ReferenceLoopHandling.Ignore)
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

      // add auth handlers for auth scopes
      services.AddScoped<IAuthorizationHandler, UserIsAdminUserHandler>();
      services.AddScoped<IAuthorizationHandler, UserIsPrivilegedUserHandler>();
      services.AddScoped<IAuthorizationHandler, UserIsNormalUserHandler>();

      // add sql connections
      string template_connection = Configuration["SqlConnections:Template"]; // gets environment configuration from appsettings.json
      services.AddDbContext<API.v1.Database.Context.Hybridauthcustomapp_V1_Context>(options => options.UseSqlServer(template_connection));

      // add swagger configuration
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1",
                        new Info
                        {
                          Title = "Template API - V1",
                          Version = "v1",
                          Description = "Hybrid Auth Template Version 1",
                          TermsOfService = "All rights reserved",
                          Contact = new Contact
                          {
                            Name = "Geno Salvati",
                            Email = "geno-github@users.noreply.github.com"
                          },
                          License = new License
                          {
                            Name = "Apache 2.0",
                            Url = "http://www.apache.org/licenses/LICENSE-2.0.html"
                          }
                        }
                    );
        c.CustomSchemaIds(x => x.FullName);

        // needed for token auth swagger support
        c.AddSecurityDefinition("Bearer", new ApiKeyScheme { In = "header", Description = "Please enter JWT with Bearer into field", Name = "Authorization", Type = "apiKey" });
        c.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>> {
            { "Bearer", Enumerable.Empty<string>() },
        });
      });
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

      app.UseHttpsRedirection();

      app.UseAuthentication();

      app.UseDefaultFiles();
      app.UseStaticFiles();

      app.UseMvc();

      if (!env.IsProduction())
      {
        // enable swagger everywhere but production
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
          c.SwaggerEndpoint("/swagger/v1/swagger.json", "Template API V1");
        });
      }
    }
  }
}
