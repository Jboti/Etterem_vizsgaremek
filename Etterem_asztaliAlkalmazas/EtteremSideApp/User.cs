using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EtteremSideApp
{
    public class User
    {
        public string Email { get; set; }
        public string Username { get; set; }

        public User(string email, string username)
        {
            Email = email;
            Username = username;
        }
    }
}
