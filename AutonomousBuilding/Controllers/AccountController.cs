using System.Collections.Generic;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    [Authorize (AuthenticationSchemes = "Bearer")]
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository accountRepository;
        public AccountController(IAccountRepository accountRepository)
        {
            this.accountRepository = accountRepository;
        }
        //Gets all key id's for that user id
        [HttpGet("key/{id}")]
        public UserKeys[] GetKey(int id)
        {
            return accountRepository.GetKey(id);
        }
        //Gets all lock name's for that key id
        [HttpGet("lock/{id}")]
        public UserLocks[] GetLock(int id)
        {
            return accountRepository.GetLock(id);
        }
        //Gets all schedule's for that key id
        [HttpGet("schedule/{id}")]
        public UserSchedules[] Get(int id)
        {
            return accountRepository.Get(id);
        }
        //Gets user info for that user id
        [HttpGet("user/{id}")]
        public UserInfo GetUser(int id)
        {
            return accountRepository.GetUser(id);
        }
        //Gets user info for that key id
        [HttpGet("name/{id}")]
        public UserName GetUsern(int id)
        {
            return accountRepository.GetUsername(id);
        }
    }
}
