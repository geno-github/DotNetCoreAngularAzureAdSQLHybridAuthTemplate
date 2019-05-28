using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HybridAuthCustomApp_V1.API.v1.Database.Context
{
    public partial class Hybridauthcustomapp_V1_Context : DbContext
    {
        public Hybridauthcustomapp_V1_Context()
        {
        }

        public Hybridauthcustomapp_V1_Context(DbContextOptions<Hybridauthcustomapp_V1_Context> options)
            : base(options)
        {
        }

        public virtual DbSet<AppUser> AppUser { get; set; }
        public virtual DbSet<UserRole> UserRole { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.0-rtm-35687");

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.Property(e => e.CreatedBy).HasDefaultValueSql("'0'");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("getdate()");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("1");

                entity.Property(e => e.LastLoggedInDate).HasColumnType("datetime");

                entity.Property(e => e.LastModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.NetworkId)
                    .IsRequired()
                    .HasMaxLength(64);

                entity.HasOne(d => d.UserRole)
                    .WithMany(p => p.AppUser)
                    .HasForeignKey(d => d.UserRoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_UserRoleId");
            });

            modelBuilder.Entity<UserRole>(entity =>
            {
                entity.Property(e => e.CreatedBy).HasDefaultValueSql("'0'");

                entity.Property(e => e.CreatedOn)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("getdate()");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("1");

                entity.Property(e => e.LastModifiedDate).HasColumnType("datetime");

                entity.Property(e => e.RoleName)
                    .IsRequired()
                    .HasMaxLength(16);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}