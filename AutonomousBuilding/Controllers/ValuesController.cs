using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Route("api/values")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly ITestDataRepository testDataRepository;
        public ValuesController(ITestDataRepository testDataRepository)
        {
            this.testDataRepository = testDataRepository;
        }

        [HttpGet, Route("testdata")]
        public async Task<IEnumerable<TestData>> GetTestData()
        {
            return await this.testDataRepository.GetAllAsync();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public TestData Get(int id)
        {
            return testDataRepository.Find(id);
        }
          

        // POST api/values/test
        [HttpPost("test")]
        public void Post([FromBody] TestData value)
        {
          testDataRepository.Test(value);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] TestData value)
        {
          value.PersonId = id;
          testDataRepository.Edit(value);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
          testDataRepository.Del(id);
        }
    }
}
