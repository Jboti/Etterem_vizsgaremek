using System;
using System.Collections.Generic;
using System.Drawing;
using System.Net.Http;
using System.Threading.Tasks;
using System.Windows.Forms;

//csak C:-n lehet futtatni!!

namespace EtteremSideApp
{
    public partial class Form1 : Form
    {
        //------Global values------\\
        private System.Windows.Forms.Timer clockTimer;
        Random rand = new Random();
        private int refetchIntervall = 2000;
        static bool conn_alive = false;

        //------Global values------\\

        public Form1()
        {
            InitializeComponent();
        }

        private static readonly HttpClient sharedClient = new HttpClient(new HttpClientHandler
        {
            Proxy = null,
            UseProxy = false
        });

        private static async Task<bool> START()
        {
            var res = await GetResponse().ConfigureAwait(false); // Avoid capturing context
            conn_alive = res;
            return res;
        }

        public static async Task<bool> GetResponse()
        {
            try
            {
                HttpResponseMessage response = await sharedClient.GetAsync("https://www.google.com/");
                if (response.IsSuccessStatusCode)
                {
                    return true;
                }
                else
                {
                    Console.WriteLine("Request failed with status code: " + response.StatusCode);
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred: " + ex.Message);
                return false;
            }
        }

        private async void Form1_Load(object sender, EventArgs e)
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

            await START(); // Use await instead of .Wait() to avoid deadlock
            DisplayOrders(orders);
            InitializeClock();
            UpdateClock();
            UpdateElement();
            InitializeElementUpdater();
        }

        private void InitializeClock()
        {
            clockTimer = new System.Windows.Forms.Timer
            {
                Interval = 1000
            };
            clockTimer.Tick += UpdateClock;
            clockTimer.Start();
        }

        private void UpdateClock(object sender = null, EventArgs e = null)
        {
            toolStripLabel1.Text = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        }

        private void InitializeElementUpdater()
        {
            System.Windows.Forms.Timer updateTimer = new System.Windows.Forms.Timer
            {
                Interval = refetchIntervall
            };

            updateTimer.Tick += UpdateElement;
            updateTimer.Start();
        }

        private async void UpdateElement(object sender = null, EventArgs e = null)
        {
            bool result = await START(); // Ensure async behavior for connectivity
            conn_alive = result;

            if (InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    toolStripLabel2.Text = conn_alive ? "Látja a szervert" : "HIBA nincs kapcsolat";
                }));
            }
            else
            {
                toolStripLabel2.Text = conn_alive ? "Látja a szervert" : "HIBA nincs kapcsolat";
            }
            Console.WriteLine("Sikeresen frissült");
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
                    AutoSize = true,
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

                int buttonTop = orderLabel.Bottom + 10;
                int panelHeight = buttonTop + 40;
                Button doneButton = new Button
                {
                    Text = "Kész",
                    Width = 280,
                    Height = 30,
                    Location = new Point(5, panelHeight - 30),
                    BackColor = Color.LightGreen,
                    FlatStyle = FlatStyle.Flat
                };

                orderPanel.Controls.Add(doneButton);
                flowLayoutPanel.Controls.Add(orderPanel);
            }
        }

        private Color GetRandomColor()
        {
            return Color.FromArgb(rand.Next(256), rand.Next(256), rand.Next(256));
        }

        private void toolStrip1_ItemClicked(object sender, ToolStripItemClickedEventArgs e)
        {
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
