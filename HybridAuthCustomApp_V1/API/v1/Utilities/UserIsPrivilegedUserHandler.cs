using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HybridAuthCustomApp_V1.API.v1.Database.Context;

namespace HybridAuthCustomApp_V1.API.v1.Utilities
{
  public class UserIsPrivilegedUserHandler : AuthorizationHandler<UserIsPrivilegedUserRequirement>
  {
    private Hybridauthcustomapp_V1_Context _applicationContext;

    public UserIsPrivilegedUserHandler(Hybridauthcustomapp_V1_Context applicationContext)
    {
      _applicationContext = applicationContext;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext authHandlerContext,
        UserIsPrivilegedUserRequirement requirement)
    {
      System.Security.Principal.IIdentity userIdentity = authHandlerContext.User.Identity;

      if(userIdentity.Name != null)
      {
        // get user from app user database (if present)
        var appUser = _applicationContext.AppUser
          .Where(a => a.NetworkId.ToLower() == userIdentity.Name.ToLower()).FirstOrDefault();

        // check if user is in app user database
        if (appUser != null) // user IS in app user database
        {
          if (appUser.UserRoleId == 2 || appUser.UserRoleId == 3) // user is privileged user minimum
          {
            authHandlerContext.Succeed(requirement);
          }
        }
      }

      return Task.CompletedTask;
    }
  }
}
