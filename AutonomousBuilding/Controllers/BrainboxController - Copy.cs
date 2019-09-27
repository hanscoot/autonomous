using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/tests")]
    [ApiController]
    public class TestControllerCopy : ControllerBase
    {
        private readonly IBrainBoxInputRepository brainBoxInputRepository;
        public TestControllerCopy(IBrainBoxInputRepository brainBoxInputRepository)
        {
            this.brainBoxInputRepository = brainBoxInputRepository;
        }

        //check input
        [HttpPost, Route("test")]
        public string Test()
        {
            var input = brainBoxInputRepository.Put();
            return "string";
        }
    }
}
