using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;

namespace EtteremSideApp
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            var orders = new List<Order>
            {
                new Order(new List<OrderItem>
                {
                    new OrderItem("Pizza", new List<string>{"Nem kérek hagymát"}, "Tészta"),
                    new OrderItem("Tészta", new List<string>{"Nem kérek hagymát"}, "Tészta")
                }, 1, 2000, false, DateTime.Parse("2024-11-01 14:30"), "John Doe"),

                new Order(new List<OrderItem>
                {
                    new OrderItem("Hamburger", new List<string>{"Extra sajt"}, "Fast Food"),
                    new OrderItem("Sült krumpli", new List<string>(), "Side Dish")
                }, 2, 2500, false, DateTime.Parse("2024-11-02 16:45"), "Jane Smith"),

                new Order(new List<OrderItem>
                {
                    new OrderItem("Saláta", new List<string>{"Nincs öntet"}, "Appetizer"),
                    new OrderItem("Leves", new List<string>(), "Soup")
                }, 3, 1500, false, DateTime.Parse("2024-11-03 18:00"), "Bob Lee"),

                new Order(new List<OrderItem>
                {
                    new OrderItem("Pörkölt", new List<string>{"Köret: Rizs"}, "Main Dish"),
                    new OrderItem("Rizs", new List<string>(), "Side Dish")
                }, 4, 1800, false, DateTime.Parse("2024-11-04 20:15"), "Alice Johnson"),

                new Order(new List<OrderItem>
                {
                    new OrderItem("Lángos", new List<string>{"Fokhagyma a lángosra"}, "Main Dish"),
                    new OrderItem("Kefir1", new List<string>(), "Drink"),
                    new OrderItem("Kefir2", new List<string>(), "Drink"),
                    new OrderItem("Kefir3", new List<string>(), "Drink"),
                    new OrderItem("Kefir4", new List<string>(), "Drink"),
                    new OrderItem("Kefir5", new List<string>(), "Drink"),
                    new OrderItem("Kefir6", new List<string>(), "Drink"),
                    new OrderItem("Kefir7", new List<string>(), "Drink"),
                    new OrderItem("Kefir8", new List<string>(), "Drink"),
                    new OrderItem("Kefir9", new List<string>(), "Drink"),
                    new OrderItem("Kefir10", new List<string>(), "Drink"),
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown")
            };

            DisplayOrders(orders);
        }

        private void DisplayOrders(List<Order> orders)
        {
            FlowLayoutPanel flowLayoutPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                AutoScroll = true,
                FlowDirection = FlowDirection.TopDown,
                WrapContents = true,
                Padding = new Padding(10)
            };

            this.Controls.Add(flowLayoutPanel);

            foreach (var order in orders)
            {
                Panel orderPanel = new Panel
                {
                    AutoSize = true,  // Enables automatic size based on content
                    Margin = new Padding(10),
                    BackColor = GetRandomColor()
                };

                Label orderLabel = new Label
                {
                    Text = $"ID: {order.Id}\nDátum: {order.timestamp.ToShortDateString()} {order.timestamp.ToShortTimeString()}\nNév: {order.customer_name}\nÁr: {order.pricev} Ft\nKifizetve: {(order.paid ? "Igen" : "Nem")}\nTartalom:\n{string.Join("\n", order.Items)}",
                    AutoSize = true,
                    Location = new Point(10, 10),
                    ForeColor = Color.White,
                    TextAlign = ContentAlignment.TopLeft
                };

                orderPanel.Controls.Add(orderLabel);

                // Calculate the button location dynamically
                int buttonTop = orderLabel.Bottom + 10;  // Space between the label and button
                int panelHeight = buttonTop + 40;  // Additional space to account for button height
                Button doneButton = new Button
                {
                    Text = "Kész",
                    Width = 280,
                    Height = 30,
                    Location = new Point(5, panelHeight - 30),  // Align button at the bottom
                    BackColor = Color.LightGreen,
                    FlatStyle = FlatStyle.Flat
                };

                orderPanel.Controls.Add(doneButton);

                flowLayoutPanel.Controls.Add(orderPanel);
            }
        }




        private Color GetRandomColor()
        {
            Random rand = new Random();
            return Color.FromArgb(rand.Next(256), rand.Next(256), rand.Next(256));
        }
    }

    public class Order
    {
        public List<OrderItem> Items { get; set; }
        public int Id { get; set; }
        public int pricev { get; set; }
        public bool paid { get; set; }
        public DateTime timestamp { get; set; }
        public string customer_name { get; set; }

        public Order(List<OrderItem> items, int id, int pricev, bool paid, DateTime timestamp, string customer_name)
        {
            Items = items;
            Id = id;
            this.pricev = pricev;
            this.paid = true;
            this.timestamp = timestamp;
            this.customer_name = customer_name;
        }
    }

    public class OrderItem
    {
        public string name { get; set; }
        public List<string> modifications { get; set; }
        public string category { get; set; }

        public OrderItem(string name, List<string> modifications, string category)
        {
            this.name = name;
            this.modifications = modifications;
            this.category = category;
        }

        public override string ToString()
        {
            return $"{name} - {category}";
        }
    }
}
