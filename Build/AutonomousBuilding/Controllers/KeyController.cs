﻿using System;
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

    //GET api/keys/ct/{id}
    [HttpGet("ct/{content}")]
    public KeyData GetKey(string content)
    {
        return keyDataRepository.Check(content);
    }
  }
}
