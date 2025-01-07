using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
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
            var res = await GetResponse().ConfigureAwait(false); // ne ragadjon be
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
                    new OrderItem("Kefir", new List<string> { "Csípős", "Pöcsös" }, "Drink"),
                    new OrderItem("Kefir", new List<string> { "Csípős", "Pöcsös" }, "Drink"),
                    new OrderItem("Kefir", new List<string> { "Csípős", "Pöcsös" }, "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                    new OrderItem("Kefir", new List<string>(), "Drink"),
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown")
            };

            await START(); //várni kell a responsera
            DisplayOrders(orders);
            InitializeClock();
            UpdateClock();
            UpdateElement();
            InitializeElementUpdater();
            this.WindowState = FormWindowState.Maximized;

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
            bool result = await START();
            conn_alive = result;

            if (InvokeRequired)
            {
                Invoke((MethodInvoker)(() =>
                {
                    if (conn_alive)
                    {
                        toolStripLabel2.Text = "A kapcsolat él";
                        toolStripLabel2.ForeColor = Color.Green;
                    }
                    else 
                    {
                        toolStripLabel2.Text = "HIBA nincs kapcsolat";
                        toolStripLabel2.ForeColor = Color.Red;
                    }
                }));
            }
            else
            {
                if (conn_alive)
                {
                    toolStripLabel2.Text = "A kapcsolat él";
                    toolStripLabel2.ForeColor = Color.Green;
                }
                else
                {
                    toolStripLabel2.Text = "HIBA nincs kapcsolat";
                    toolStripLabel2.ForeColor = Color.Red;
                }
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

                //Kategóriánként csoportosítjuk
                var groupedByCategory = order.Items
                    .GroupBy(item => item.category)
                    .ToList();

                var displayContent = new List<string>();

                foreach (var categoryGroup in groupedByCategory)
                {
                    
                    displayContent.Add($"\n----{categoryGroup.Key}----\n");

                    //ételek és módosítások szerinti csoportosítás
                    var groupedItems = categoryGroup
                    .GroupBy(item =>
                    {
                        string modificationsKey;
                        if (item.modifications.Count == 0)
                        {
                            modificationsKey = null;
                        }
                        else
                        {
                            modificationsKey = string.Join(",", item.modifications.OrderBy(m => m));
                        }

                        return new
                        {
                            item.name,
                            ModificationsKey = modificationsKey
                        };
                    })
                    .Select(group =>
                    {
                        string mods;
                        if (group.Key.ModificationsKey == null)
                        {
                            mods = "";
                        }
                        else
                        {
                            mods = $"Módosítások: ({group.Key.ModificationsKey})";
                        }

                        return $"{group.Count()} X {group.Key.name} {mods}";
                    })
                    .ToList();

                    displayContent.AddRange(groupedItems);
                }

                Label orderLabel = new Label
                {
                    Text = $@"ID: {order.Id}
Dátum: {order.timestamp.ToShortDateString()} {order.timestamp.ToShortTimeString()}
Név: {order.customer_name}
Ár: {order.pricev} Ft
Kifizetve: {(order.paid ? "Igen" : "Nem")}
Tartalom:
{string.Join("\n", displayContent)}",
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
