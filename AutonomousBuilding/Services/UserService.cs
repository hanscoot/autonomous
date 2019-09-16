using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using AutonomousBuilding.Models;
using AutonomousBuilding.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AutonomousBuilding.service
{
    public interface IUserservice
    {
        User Authenticate(string username, string password);
    }

    public class Userservice : IUserservice
    {
        private readonly AppSettings _appSettings;
        private readonly IPersonRepository personRepository;

        public Userservice(IOptions<AppSettings> appSettings, IPersonRepository personRepository)
        {
            _appSettings = appSettings.Value;
            this.personRepository = personRepository;
        }

        public User Authenticate(string username, string password)
        {
            var user = personRepository.Find(username);
            // return null if user not found
            if ((user == null) || (user.Password != password) )
                return null;

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.PersonId.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            // remove password before returning
            user.Password = null;
            user.Email = null;
            user.Number = 0;

            return user;
        }
    }
}