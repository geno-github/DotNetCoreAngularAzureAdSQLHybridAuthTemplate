using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HybridAuthCustomApp_V1.API.v1.Utilities
{
    public class UserIsPrivilegedUserRequirement : IAuthorizationRequirement
    {
        public UserIsPrivilegedUserRequirement()
        {
        }
    }
}
