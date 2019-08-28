using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
  [Route("api/pk")]
  [ApiController]
  public class PKController : ControllerBase
  {
    private readonly IPersonKeyDataRepository personKeyDataRepository;
    public PKController(IPersonKeyDataRepository personKeyDataRepository)
    {
      this.personKeyDataRepository = personKeyDataRepository;
    }
    // GET api/pk/testdata
    [HttpGet, Route("testdata")]
    public async Task<IEnumerable<PersonKey>> GetTestData()
    {
      return await this.personKeyDataRepository.GetAllAsync();
    }

    // GET api/pk/testdata
    [HttpGet, Route("data")]
    public async Task<IEnumerable<KeyPerson>> GetTestdata()
    {
      return await this.personKeyDataRepository.GetAllasync();
    }

    // GET api/pk/5
    [HttpGet("{id}")]
    public PersonKey Get(int id)
    {
            return personKeyDataRepository.Find(id);
    }
    
     // GET api/pk/5
    [HttpGet("key/{id}")]
    public KeyPerson Gett(int id)
    {
            return personKeyDataRepository.GetPerson(id);
    }

    // POST api/pk/test
    [HttpPost("test")]
    public void Post([FromBody] PersonKey value)
    {
            personKeyDataRepository.Test(value);
    }

    // DELETE api/pk/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
            personKeyDataRepository.Del(id);
    }
  }
}
