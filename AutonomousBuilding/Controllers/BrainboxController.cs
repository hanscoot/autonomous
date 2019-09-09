using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    //[Authorize]
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly IBrainBoxRepository brainBoxRepository;
        public TestController(IBrainBoxRepository brainBoxRepository)
        {
            this.brainBoxRepository = brainBoxRepository;
        }

        // POST api/test on
        [HttpPost, Route("1")]
        public void Post([FromBody] LockType value)
        {
            brainBoxRepository.set(value);
        }

        // POST api/test off
        [HttpPost, Route("0")]
        public void Put([FromBody] LockType value)
        {
            brainBoxRepository.put(value);  
        }
    }
}
