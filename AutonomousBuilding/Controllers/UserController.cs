using System.Collections.Generic;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Authorize]
    [Route("api/values")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IPersonRepository personRepository;
        public UserController(IPersonRepository personRepository)
        {
            this.personRepository = personRepository;
        }

        [HttpGet, Route("testdata")]
        public async Task<IEnumerable<User>> GetTestData()
        {
            return await this.personRepository.GetUsers();
        }

        [HttpGet("{id}")]
        public User Get(int id)
        {
            return personRepository.GetUser(id);
        }
          
        [HttpPost("test")]
        public void Post([FromBody] User value)
        {
            personRepository.Post(value);
        }

        [HttpPut("{id}")]
        public void Put(int id, [FromBody] User value)
        {
          value.PersonId = id;
            personRepository.Edit(value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            personRepository.Delete(id);
        }
    }
}
