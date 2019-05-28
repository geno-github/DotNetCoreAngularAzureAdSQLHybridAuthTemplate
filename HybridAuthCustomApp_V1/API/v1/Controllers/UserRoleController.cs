using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HybridAuthCustomApp_V1.API.v1.Database.Context;
using Microsoft.AspNetCore.Authorization;

namespace HybridAuthCustomApp_V1.API.v1.Controllers
{
  [Authorize]
  [Route("api/v1/[controller]/[action]")]
  [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly Hybridauthcustomapp_V1_Context _context;

        public UserRoleController(Hybridauthcustomapp_V1_Context context)
        {
            _context = context;
        }

    // GET: api/UserRole
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpGet]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRole()
        {
            return await _context.UserRole.ToListAsync();
        }

    // GET: api/UserRole/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpGet("{id}")]
        public async Task<ActionResult<UserRole>> GetUserRole(int id)
        {
            var UserRole = await _context.UserRole.FindAsync(id);

            if (UserRole == null)
            {
                return NotFound();
            }

            return UserRole;
        }

    // GET: api/UserRole/networkId
    [Authorize(Policy = "NormalUsersMinimum")]
    [HttpGet("{networkId}")]
    public async Task<ActionResult<UserRole>> GetUserRoleByName(string roleName)
    {
      var UserRole = await _context.UserRole.Where(userRole => userRole.RoleName == roleName).FirstOrDefaultAsync();

      if (UserRole == null)
      {
        return NotFound();
      }

      return UserRole;
    }

    // PUT: api/UserRole/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpPut("{id}")]
        public async Task<IActionResult> PutUserRole(int id, UserRole UserRole)
        {
            if (id != UserRole.Id)
            {
                return BadRequest();
            }

            _context.Entry(UserRole).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

    // POST: api/UserRole
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpPost]
        public async Task<ActionResult<UserRole>> PostUserRole(UserRole UserRole)
        {
            _context.UserRole.Add(UserRole);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserRoleExists(UserRole.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserRole", new { id = UserRole.Id }, UserRole);
        }

    // DELETE: api/UserRole/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpDelete("{id}")]
        public async Task<ActionResult<UserRole>> DeleteUserRole(int id)
        {
            var UserRole = await _context.UserRole.FindAsync(id);
            if (UserRole == null)
            {
                return NotFound();
            }

            _context.UserRole.Remove(UserRole);
            await _context.SaveChangesAsync();

            return UserRole;
        }

        private bool UserRoleExists(int id)
        {
            return _context.UserRole.Any(e => e.Id == id);
        }
    }
}
