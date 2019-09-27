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
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/sk")]
  [ApiController]
  public class SKController : ControllerBase
  {
    private readonly IScheduleKeyDataRepository scheduleKeyDataRepository;
    public SKController(IScheduleKeyDataRepository scheduleKeyDataRepository)
    {
      this.scheduleKeyDataRepository = scheduleKeyDataRepository;
    }
    // GET api/pk/testdata
    [HttpGet, Route("testdata")]
    public async Task<IEnumerable<ScheduleKey>> GetTestData()
    {
      return await this.scheduleKeyDataRepository.GetAllAsync();
    }

    // GET api/pk/5
    [HttpGet("{id}")]
    public ScheduleKey[] Get(int id)
    {
            return scheduleKeyDataRepository.Find(id);
    }

    [HttpGet("sch/{id}")]
    public ScheduleKeyData Gett(int id)
    {
            return scheduleKeyDataRepository.FindKey(id);
    }

    // POST api/pk/test
    [HttpPost("test")]
    public void Post([FromBody] ScheduleKey value)
    {
            scheduleKeyDataRepository.Test(value);
    }

    // DELETE api/pk/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
            scheduleKeyDataRepository.Del(id);
    }



    // GET api/pk/5
    [HttpGet("get/{id}")]
    public ScheduleKey GetID(int id)
    {
            return scheduleKeyDataRepository.FindID(id);
    }

    // GET api/pk/5
    [HttpGet("get/sk/{id}")]
    public ScheduleKey GetD(int id)
    {
        return scheduleKeyDataRepository.FindSchKey(id);
    }

  }
}
