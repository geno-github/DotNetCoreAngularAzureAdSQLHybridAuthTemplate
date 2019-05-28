using System;
using System.Collections.Generic;

namespace HybridAuthCustomApp_V1.API.v1.Database.Context
{
    public partial class UserRole
    {
        public UserRole()
        {
            AppUser = new HashSet<AppUser>();
        }

        public int Id { get; set; }
        public string RoleName { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public int? LastModifiedBy { get; set; }

        public virtual ICollection<AppUser> AppUser { get; set; }
    }
}