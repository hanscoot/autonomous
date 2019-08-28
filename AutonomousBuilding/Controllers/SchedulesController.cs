using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Route("api/schedule")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleDataRepository scheduleDataRepository;
        public ScheduleController(IScheduleDataRepository scheduleDataRepository)
        {
            this.scheduleDataRepository = scheduleDataRepository;
        }

        [HttpGet, Route("testdata")]
        public async Task<IEnumerable<ScheduleData>> GetTestData()
        {
            return await this.scheduleDataRepository.GetAllAsync();
        }

        // GET api/schedule/5
        [HttpGet("{id}")]
        public ScheduleData Get(int id)
        {
            return scheduleDataRepository.Find(id);
        }


        // POST api/schedule/test
        [HttpPost("test")]
        public void Post([FromBody] ScheduleData value)
        {
            scheduleDataRepository.Test(value);
        }

        // PUT api/schedule/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] ScheduleData value)
        {
          value.ScheduleID = id;
            scheduleDataRepository.Edit(value);
        }

        // DELETE api/schedule/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            scheduleDataRepository.Del(id);
        }
    }
}
