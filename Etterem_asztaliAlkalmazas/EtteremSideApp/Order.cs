using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EtteremSideApp.Form1;

namespace EtteremSideApp
{
    public class Order
    {
        public List<OrderItem> Items { get; set; }
        public int Id { get; set; }
        public int price { get; set; }
        public bool paid { get; set; }
        public DateTime timestamp { get; set; }
        public string customer_name { get; set; }
        public string message { get; set; }
        public bool takeAway { get; set; }
        public List<(string,string)> locationData { get; set; }
        public Order(List<OrderItem> items, int id, int price, bool paid, DateTime timestamp, string customer_name, string message, bool takeAway, List<(string, string)> locationData)
        {
            Items = items;
            Id = id;
            this.price = price;
            this.paid = paid;
            this.timestamp = timestamp;
            this.customer_name = customer_name;
            this.message = message;
            this.takeAway = takeAway;
            this.locationData = locationData;
        }
    }
}
