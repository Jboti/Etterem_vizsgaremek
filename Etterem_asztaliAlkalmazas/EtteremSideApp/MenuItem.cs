using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EtteremSideApp
{
    public class MenuItem
    {
        public int id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public bool available { get; set; }
        public List<(string, int, bool)> modifications { get; set; } // név, ár, sauce e?
        public string description { get; set; }
        public string category { get; set; }
        public Image img { get; set; }
        public string imgBLOB { get; set; }
        public bool gluten { get; set; }
        public bool lactose { get; set; }
        public bool egg { get; set; }
        public bool nuts { get; set; }

        public MenuItem(int id, string name, int price, bool available, List<(string, int, bool)> modifications, string description, string category, Image img, string imgBLOB, bool gluten, bool lactose, bool egg, bool nuts)
        {
            this.id = id;
            this.name = name;
            this.price = price;
            this.available = available;
            this.modifications = modifications;
            this.description = description;
            this.category = category;
            this.img = img;
            this.imgBLOB = imgBLOB;
            this.gluten = gluten;
            this.lactose = lactose;
            this.egg = egg;
            this.nuts = nuts;
        }
    }
}
