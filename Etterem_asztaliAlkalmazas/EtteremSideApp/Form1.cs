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
        static string conn_link = "http://localhost:3000/user/getUsers";

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
                HttpResponseMessage response = await sharedClient.GetAsync(conn_link);
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),

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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),

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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),                new Order(new List<OrderItem>
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),

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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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
                }, 5, 1600, false, DateTime.Parse("2024-11-05 22:30"), "Charlie Brown"),
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

        //var displayContent = new List<string>();
        //    var groupedByCategory = order.Items
        //.GroupBy(item => item.category)
        //.ToList();

        //    var displayContent = new List<string>();


        private void DisplayOrders(List<Order> orders)
        {
            FlowLayoutPanel flowLayoutPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = true, //must remain true
                Padding = new Padding(20),
                AutoScroll = true,
            };

            this.Controls.Add(flowLayoutPanel);

            foreach (var order in orders)
            {
                Panel orderPanel = new Panel
                {
                    AutoSize = true,
                    Margin = new Padding(20),
                    BackColor = Color.White
                };

                var groupedByCategory = order.Items
                    .GroupBy(item => item.category)
                    .ToList();

                var displayContent = new List<string>();

                foreach (var categoryGroup in groupedByCategory)
                {
                    displayContent.Add($"\n----{categoryGroup.Key}----\n");

                    var groupedItems = categoryGroup
                        .GroupBy(item =>
                        {
                            string modificationsKey = item.modifications.Count == 0
                                ? null
                                : string.Join(",", item.modifications.OrderBy(m => m));

                            return new
                            {
                                item.name,
                                ModificationsKey = modificationsKey
                            };
                        })
                        .Select(group =>
                        {
                            string mods = group.Key.ModificationsKey == null
                                ? ""
                                : $"Módosítások: ({group.Key.ModificationsKey})";

                            return $"{group.Count()} X {group.Key.name} {mods}";
                        })
                        .ToList();

                    displayContent.AddRange(groupedItems);
                }

                int currentTop = 10;

                Label orderIdLabel = new Label
                {
                    Text = "Rendelés ID: " + order.Id + "\n",
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderIdLabel);
                currentTop += orderIdLabel.Height + 5;

                Label orderDateLabel = new Label
                {
                    Text = "Dátum: " + order.timestamp.ToShortDateString() + " " + order.timestamp.ToShortTimeString() + "\n",
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderDateLabel);
                currentTop += orderDateLabel.Height + 5;

                Label orderNameLabel = new Label
                {
                    Text = "Megrendelő: " + order.customer_name + "\n",
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderNameLabel);
                currentTop += orderNameLabel.Height + 5;

                Label orderPriceLabel = new Label
                {
                    Text = "Ár: " + order.pricev + " Ft" + "\n",
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderPriceLabel);
                currentTop += orderPriceLabel.Height + 5;

                Label orderPaidLabel = new Label
                {
                    Text = "Kifizetve: " + " " + Convert.ToString(order.paid ? "Igen" : "Nem") + "\n",
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderPaidLabel);
                currentTop += orderPaidLabel.Height + 10; // Add some extra space before the separator

                Label separatorLabel = new Label
                {
                    AutoSize = false,
                    Height = 2, // Thickness of the dotted line
                    Width = orderPanel.Width - 20, // Adjust width if necessary
                    Location = new Point(10, currentTop), // Position it below the orderPaidLabel
                    BackColor = Color.Transparent
                };

                separatorLabel.Paint += (sender, e) =>
                {
                    using (Pen dottedPen = new Pen(Color.Black))
                    {
                        dottedPen.DashStyle = System.Drawing.Drawing2D.DashStyle.Dot;
                        int y = separatorLabel.Height / 2;
                        e.Graphics.DrawLine(dottedPen, 0, y, separatorLabel.Width, y);
                    }
                };
                orderPanel.Controls.Add(separatorLabel);
                currentTop += separatorLabel.Height + 10; // Update position after the separator

                Label orderContentLabel = new Label
                {
                    Text = "Tartalom:" + "\n" + string.Join("\n", displayContent),
                    AutoSize = true,
                    Location = new Point(10, currentTop),
                    ForeColor = Color.Black,
                    TextAlign = ContentAlignment.TopLeft
                };
                orderPanel.Controls.Add(orderContentLabel);
                currentTop += orderContentLabel.Height + 15;

                int buttonTop = currentTop;
                Button doneButton = new Button
                {
                    Text = "Kész",
                    Width = 280,
                    Height = 30,
                    Location = new Point(10, buttonTop),
                    BackColor = Color.LightGreen,
                    FlatStyle = FlatStyle.Flat
                };

                orderPanel.Controls.Add(doneButton);
                flowLayoutPanel.Controls.Add(orderPanel);
            }
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
