using System.Collections.Generic;
using System.Threading.Tasks;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutonomousBuilding.Controllers
{
    //[Authorize]
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
        
        [HttpGet("schedule/{id}")]
        public UserSchedules[] Get(int id)
        {
            return accountRepository.Get(id);
        }


    }
}
