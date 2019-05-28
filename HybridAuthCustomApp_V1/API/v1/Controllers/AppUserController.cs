using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HybridAuthCustomApp_V1.API.v1.Database.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using LinqKit;

namespace HybridAuthCustomApp_V1.API.v1.Controllers
{
  [Authorize]
  [Route("api/v1/[controller]/[action]")]
  [ApiController]
    public class AppUserController : ControllerBase
    {
        private readonly Hybridauthcustomapp_V1_Context _context;
    private IHostingEnvironment _environment;

        public AppUserController(Hybridauthcustomapp_V1_Context context, IHostingEnvironment environment)
        {
            _context = context;
      _environment = environment;
        }

    // GET: api/AppUser
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetAppUser()
    {
      try
      {
        return await _context.AppUser
        .Where(appUser => appUser.Id != 1)
        .Include(appUser => appUser.UserRole)
        .OrderBy(appUser => appUser.NetworkId)
        .ToListAsync();
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error getting app user from database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error getting app user from database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
    }

    // GET: api/AppUser/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpGet("{id}")]
    public async Task<ActionResult<AppUser>> GetAppUser(int id)
    {
      try
      {
        var AppUser = await _context.AppUser
          .Include(appUser => appUser.UserRole)
          .FirstOrDefaultAsync(appUser => appUser.Id == id);

        if (AppUser == null)
        {
          return NotFound();
        }

        return AppUser;
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error getting app user from database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error getting app user from database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
    }

    // GET: api/AppUser/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetAppUsers(int[] ids)
    {
      try
      {
        // create top level (and) search predicate
        var appUserPredicate = PredicateBuilder.New<AppUser>(true);

        foreach (int id in ids)
        {
          appUserPredicate.And(appUser => appUser.Id == id);
        }

        var AppUsers = await _context.AppUser
          .Where(appUserPredicate)
          .Include(appUser => appUser.UserRole)
          .OrderBy(appUser => appUser.NetworkId)
          .ToListAsync();

        if (AppUsers == null)
        {
          return NotFound();
        }

        return AppUsers;
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error getting app users from database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error getting app users from database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
    }
    // GET: api/AppUser/networkId
    [Authorize(Policy = "NormalUsersMinimum")]
    [HttpGet("{networkId}")]
    public async Task<ActionResult<AppUser>> GetAppUserByNetworkId(string networkId)
    {
      try
      {
        var AppUser = await _context.AppUser.Where(appUser => appUser.NetworkId == networkId).Include(appUser => appUser.UserRole).FirstOrDefaultAsync();

        if (AppUser == null)
        {
          return NotFound();
        }

        return AppUser;
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error getting app user from database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error getting app user from database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
    }
    // PUT: api/AppUser/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAppUser(int id, AppUser appUser)
    {
      if (id != appUser.Id)
      {
        return BadRequest();
      }

      try
      {
        var appUserToUpdate = await _context.AppUser.Where(au => au.Id == id).FirstOrDefaultAsync();
        appUserToUpdate.Id = appUser.Id;
        appUserToUpdate.NetworkId = appUser.NetworkId;
        appUserToUpdate.DisplayName = appUser.DisplayName;
        appUserToUpdate.CompanyName = appUser.CompanyName;
        appUserToUpdate.UserRoleId = appUser.UserRoleId;
        appUserToUpdate.IsActive = appUser.IsActive;
        appUserToUpdate.CreatedBy = appUser.CreatedBy;
        appUserToUpdate.CreatedOn = appUser.CreatedOn;
        appUserToUpdate.LastModifiedBy = await _context.AppUser.Where(au => au.NetworkId == HttpContext.User.Identity.Name).Select(appu => appu.Id).FirstOrDefaultAsync();
        appUserToUpdate.LastModifiedDate = DateTime.Now;
        appUserToUpdate.LastLoggedInDate = appUser.LastLoggedInDate;
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!AppUserExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error saving app user changes to database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error saving app user changes to database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }

      return Ok(appUser);
    }

    // POST: api/AppUser
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpPost]
    public async Task<ActionResult<AppUser>> PostAppUser(AppUser appUser)
    {      
      try
      {
        appUser.CreatedBy = await _context.AppUser.Where(au => au.NetworkId == HttpContext.User.Identity.Name).Select(appu => appu.Id).FirstOrDefaultAsync();
        appUser.CreatedOn = DateTime.Now;
        _context.AppUser.Add(appUser);
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (AppUserExists(appUser.Id))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error saving app user changes to database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error saving app user changes to database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
      return Ok(appUser);
    }

    // POST: api/AppUser
    [Authorize(Policy = "NormalUsersMinimum")]
    [HttpPost]
    public async Task<ActionResult<AppUser>> PostSelfUpdate(AppUser appUser)
    {
      try
      {
        // get user object matching incoming
        var appUserToUpdate = await _context.AppUser.Where(auser => auser.Id == appUser.Id).FirstOrDefaultAsync();

        // verify that user is themself
        if (appUserToUpdate.NetworkId.ToLower() == User.Identity.Name.ToLower())
        {
          // update (selected) user object properties
          appUserToUpdate.DisplayName = appUser.DisplayName;
          appUserToUpdate.CompanyName = appUser.CompanyName;
          appUserToUpdate.LastLoggedInDate = appUser.LastLoggedInDate;
          await _context.SaveChangesAsync();
        }
        else
        {
          return BadRequest(new { error = "Error: Cannot update another user with this method." });
        }
      }
      catch (DbUpdateException)
      {
        if (AppUserExists(appUser.Id))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error saving app user changes to database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error saving app user changes to database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
      return Ok(appUser);
    }


    // DELETE: api/AppUser/5
    [Authorize(Policy = "AdminUsersOnly")]
    [HttpDelete("{id}")]
    public async Task<ActionResult<AppUser>> DeleteAppUser(int id)
    {
      try
      {
        var AppUser = await _context.AppUser.FindAsync(id);
        if (AppUser == null)
        {
          return NotFound();
        }

        AppUser.IsActive = false;
        await _context.SaveChangesAsync();

        return AppUser;
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error deleting app user.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error deleting app user: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }
    }

    private bool AppUserExists(int id)
    {
      return _context.AppUser.Any(e => e.Id == id);
    }

    // DELETE: api/AppUser/5
    [Authorize(Policy = "NormalUsersMinimum")]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAppUserLastLoginDate(int id)
    {
      try
      {
        var appUser = await _context.AppUser
          .Where(au => au.Id == id)
          .FirstOrDefaultAsync();

        appUser.LastLoggedInDate = DateTime.Now;

        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!AppUserExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error saving app user changes to database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error saving app user changes to database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }

      return Ok();
    }
  }
}
