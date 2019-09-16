using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Route("api/log")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly ILogRepository logRepository;
        public LogController(ILogRepository logRepository)
        {
            this.logRepository = logRepository;
        }

        // GET api/log/data
        [HttpGet, Route("data")]
        public async Task<IEnumerable<Log>> GetTestData()
        {
            return await this.logRepository.GetAllAsync();
        }

        // POST api/log/test
        [HttpPost("test")]
        public void Post([FromBody] Log value)
        {
            logRepository.Test(value);
        }

        // DELETE api/log/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            logRepository.Del(id);
        }
    }
}
