using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutonomousBuilding.Models;
using AutonomousBuilding.service;

namespace AutonomousBuilding.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("/api/users")]
    public class UsersController : ControllerBase
    {
        private IUserservice _userservice;

        public UsersController(IUserservice userservice)
        {
            _userservice = userservice;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]User userParam)
        {
            var user = _userservice.Authenticate(userParam.Email, userParam.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }
    }
}