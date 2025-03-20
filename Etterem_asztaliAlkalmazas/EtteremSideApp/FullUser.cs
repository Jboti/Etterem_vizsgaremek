using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EtteremSideApp
{
    public class FullUser
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public int points { get; set; }
        public bool isAdmin { get; set; }
        public bool isActive { get; set; }

        public FullUser(int id, string email, string username, string fullName, int points, bool isAdmin, bool isActive)
        {
            Id = id;
            Email = email;
            Username = username;
            FullName = fullName;
            this.points = points;
            this.isAdmin = isAdmin;
            this.isActive = isActive;
        }
    }
}
