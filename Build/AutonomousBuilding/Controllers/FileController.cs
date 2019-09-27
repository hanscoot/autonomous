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
    }

    public class GetRequest
    {
        public string content { get; set; }
        public int day { get; set; }
        public string date { get; set; }
        public string status { get; set; }
    }
}