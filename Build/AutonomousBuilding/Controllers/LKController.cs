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
    [Route("api/lk")]
  [ApiController]
  public class LKController : ControllerBase
  {
    private readonly ILockKeyDataRepository lockKeyDataRepository;
    public LKController(ILockKeyDataRepository lockKeyDataRepository)
    {
      this.lockKeyDataRepository = lockKeyDataRepository;
    }
    // GET api/pk/testdata
    [HttpGet, Route("testdata")]
    public async Task<IEnumerable<LockKey>> GetTestData()
    {
      return await this.lockKeyDataRepository.GetAllAsync();
    }

    // GET api/pk/5
    [HttpGet("{id}")]
    public LockKey Get(int id)
    {
            return lockKeyDataRepository.Find(id);
    }

    // GET api/pk/lock/{id}
    [HttpGet("lock/{id}")]
    public LockKeyName Gett(int id)
    {
            return lockKeyDataRepository.Name(id);
    }

    // POST api/pk/test
    [HttpPost("test")]
    public void Post([FromBody] LockKey value)
    {
            lockKeyDataRepository.Test(value);
    }

    // DELETE api/pk/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
            lockKeyDataRepository.Del(id);
    }
  }
}
