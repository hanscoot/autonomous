using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutonomousBuilding.Models;
using AutonomousBuilding.service;

namespace AutonomousBuilding.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("/api/file")]
    public class FileController : ControllerBase
    {
        private IFileService _fileservice;

        public FileController(IFileService fileservice)
        {
            _fileservice = fileservice;
        }

        [HttpPost("get")]
        public IActionResult Get([FromBody] GetRequest request)
        {
            var user = _fileservice.Get(request.content, request.day, request.date);

            if (user == null)
                return BadRequest(new { message = "nope" });
            if (user == "zero")
                request.status = "key";
            if (user == "one")
                request.status = "lock";
            if (user == "two")
                request.status = "shcedule";
            if (user == "three")
                request.status = "out of hours";
            if (user == "four")
                request.status = "success";
                
            
            //Log attempt
            return Ok(request);
        }
        [HttpPost("account/{id}")]
        public IActionResult Gets(int id)
        {
            var user = _fileservice.Gets(id);

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("lockkey/{id}")]
        public IActionResult GetLockKey(int id)
        {
            var user = _fileservice.GetLockKey(id);

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("notlockkey/{id}")]
        public IActionResult GetNotLockKey(int id)
        {
            var user = _fileservice.GetNotLockKey(id);

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("schedulekey/{id}")]
        public IActionResult GetScheduleKey(int id)
        {
            var user = _fileservice.GetScheduleKey(id);

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("notschedulekey")]
        public IActionResult GetNotScheduleKey()
        {
            var user = _fileservice.GetNotScheduleKey();

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("notpersonkey")]
        public IActionResult GetNotPersonKey()
        {
            var user = _fileservice.GetNotPersonKey();

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("key")]
        public IActionResult GetKey()
        {
            var user = _fileservice.GetKey();

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }

        [HttpPost("light/{id}")]
        public IActionResult GetLight(int id)
        {
            var user = _fileservice.Brain(id);

            if (user == null)
                return BadRequest(new { message = "nope" });
            //Log attempt
            return Ok(user);
        }
    }

    public class GetRequest
    {
        public string content { get; set; }
        public int day { get; set; }
        public string date { get; set; }
        public string status { get; set; }
    }
}