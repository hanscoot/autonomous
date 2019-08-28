using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
  [Route("api/keys")]
  [ApiController]
  public class KeyController : ControllerBase
  {
    private readonly IKeyDataRepository keyDataRepository;
    public KeyController(IKeyDataRepository keyDataRepository)
    {
      this.keyDataRepository = keyDataRepository;
    }
    // GET api/keys/testdata
    [HttpGet, Route("testdata")]
    public async Task<IEnumerable<KeyData>> GetTestData()
    {
      return await this.keyDataRepository.GetAllAsync();
    }

    // GET api/keys/5
    [HttpGet("{id}")]
    public KeyData Get(int id)
    {
        return keyDataRepository.Find(id);
    }

    // POST api/keys/test
    [HttpPost("test")]
    public void Post([FromBody] KeyData value)
    {
            keyDataRepository.Test(value);
    }

    // PUT api/keys/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] KeyData value)
    {
      value.KeyID = id;
            keyDataRepository.Edit(value);
    }

    // DELETE api/keys/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
            keyDataRepository.Del(id);
    }
  }
}
