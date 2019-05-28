using System;
using System.Collections.Generic;

namespace HybridAuthCustomApp_V1.API.v1.Database.Context
{
    public partial class AppUser
    {
        public int Id { get; set; }
        public string NetworkId { get; set; }
        public string DisplayName { get; set; }
        public string CompanyName { get; set; }
        public int UserRoleId { get; set; }
        public bool? IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public int? LastModifiedBy { get; set; }
        public DateTime? LastLoggedInDate { get; set; }

        public virtual UserRole UserRole { get; set; }
    }
}