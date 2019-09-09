using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutonomousBuilding.Models;
using AutonomousBuilding.Services;

namespace AutonomousBuilding.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("/api/users")]
    public class UsersController : ControllerBase
    {
        private IUserServices _userServices;

        public UsersController(IUserServices userServices)
        {
            _userServices = userServices;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]User userParam)
        {
            var user = _userServices.Authenticate(userParam.Email, userParam.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }
    }
}