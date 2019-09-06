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
    [Authorize]
    [Route("api/locks")]
  [ApiController]
  public class LockController : ControllerBase
  {
    private readonly ILockDataRepository lockDataRepository;
    public LockController(ILockDataRepository lockDataRepository)
    {
      this.lockDataRepository = lockDataRepository;
    }
    // GET api/locks/testdata
    [HttpGet, Route("testdata")]
    public async Task<IEnumerable<LockData>> GetTestData()
    {
      return await this.lockDataRepository.GetAllAsync();
    }

    // GET api/locks/5
    [HttpGet("{id}")]
    public LockData Get(int id)
    {
            return lockDataRepository.Find(id);
    }


    // POST api/locks/test
    [HttpPost("test")]
    public void Post([FromBody] LockData value)
    {
            lockDataRepository.Test(value);
    }

    // PUT api/locks/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] LockData value)
    {
      value.LockID = id;
            lockDataRepository.Edit(value);
    }

    // DELETE api/locks/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
            lockDataRepository.Del(id);
    }
  }
}
