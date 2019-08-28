using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Route("api/locktype")]
    [ApiController]
    public class LockTypeController : ControllerBase
    {
        private readonly ILockTypeRepository lockTypeRepository;
        public LockTypeController(ILockTypeRepository lockTypeRepository)
        {
            this.lockTypeRepository = lockTypeRepository;
        }
        // GET api/locktyoe/testdata
        [HttpGet, Route("testdata")]
        public async Task<IEnumerable<LockType>> GetTestData()
        {
            return await this.lockTypeRepository.GetAllAsync();
        }

        // POST api/locktype/test
        [HttpPost("test")]
        public void Post([FromBody] LockType value)
        {
            lockTypeRepository.Test(value);
        }

        // PUT api/locktype/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] LockType value)
        {
            value.LockTypeID = id;
            lockTypeRepository.Edit(value);
        }

        // DELETE api/locktype/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            lockTypeRepository.Del(id);
        }
    }
}
