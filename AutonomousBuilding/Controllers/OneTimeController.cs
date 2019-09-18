using System.Collections.Generic;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/onetime")]
    [ApiController]
    public class OneTimeController : ControllerBase
    {
        private readonly IOneTimeRepository oneTimeRepository;
        public OneTimeController(IOneTimeRepository oneTimeRepository)
        {
            this.oneTimeRepository = oneTimeRepository;
        }

        [HttpGet, Route("testdata")]
        public async Task<IEnumerable<OneTime>> GetTestData()
        {
            return await this.oneTimeRepository.GetUsers();
        }

        [HttpGet("{id}")]
        public OneTime Get(int id)
        {
            return oneTimeRepository.Find(id);
        }

        [HttpPost("test")]
        public void Post([FromBody] OneTime value)
        {
            oneTimeRepository.Post(value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            oneTimeRepository.Delete(id);
        }
    }
}
