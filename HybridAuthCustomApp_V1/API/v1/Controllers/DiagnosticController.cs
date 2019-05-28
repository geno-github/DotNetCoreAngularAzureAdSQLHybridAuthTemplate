using LinqKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace HybridAuthCustomApp_V1.API.v1.Controllers
{
  [Route("api/v1/[controller]/[action]")]
  public class DiagnosticController : ControllerBase
  {
    private IHostingEnvironment _environment;
    public DiagnosticController(IHostingEnvironment environment)
    {
      _environment = environment;
    }

    /// <summary>
    /// method to get admin users
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(string), 200)]
    [ProducesResponseType(typeof(IDictionary<string, string>), 400)]
    [ProducesResponseType(typeof(IDictionary<string, string>), 404)]
    [ApiExplorerSettings(GroupName = "v1")]
    public IActionResult GetEnvironment()
    {
      // declare object to return
      var environmentToReturn = string.Empty;

      try
      {
        environmentToReturn = _environment.EnvironmentName;
      }
      catch (Exception ex)
      {
        string errMsg = string.Empty;

        if (_environment.EnvironmentName == "Production")
        {
          errMsg = string.Format("Error getting admin user from database.");
        }
        else // detailed error message for DEV and TST environments
        {
          errMsg = string.Format("Error getting admin user from database: {0} Inner Exception: {1}.", ex.Message, ex.InnerException);
        }

        return BadRequest(new { error = errMsg });
      }

      // return OK status code and object
      return Ok(environmentToReturn);
    }
  }
}
