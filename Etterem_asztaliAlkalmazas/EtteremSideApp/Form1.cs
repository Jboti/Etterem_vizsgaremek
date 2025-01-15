using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml.Linq;

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
        static string conn_link = "http://localhost:3000/user/getAllUser";
        public static List<Order> all_orders = new List<Order>();
        public static bool must_Update;
        public static int previousOrdersCount = 0;


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

        public static async Task<JsonElement> getRendelesJSON()
        {
            JsonElement jsonResponse = default;

            try
            {
                HttpResponseMessage response = await sharedClient.GetAsync("http://localhost:3000/purchase/getAllActiveOrder");

                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();

                jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);

                var jsonOptions = new JsonSerializerOptions
                {
                    WriteIndented = true,
                    Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                };
                string formattedJson = JsonSerializer.Serialize(jsonResponse, jsonOptions);
                Console.WriteLine(formattedJson);
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"Request error: {ex.Message}");
                conn_alive = false;
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"JSON error: {ex.Message}");
                conn_alive = false;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                conn_alive = false;

            }

            return jsonResponse;
        }

        public static async void RendelesekGet()
        {
            try
            {
                all_orders.Clear();

                JsonElement jsonResponse = await getRendelesJSON();

                int number_of_active_orders = jsonResponse.GetArrayLength();

                for (int i = 0; i < number_of_active_orders; i++)
                {
                    JsonElement order = jsonResponse[i];

                    int id = order.GetProperty("id").GetInt32();
                    int totalprice = order.GetProperty("totalPrice").GetInt32();
                    DateTime date = order.GetProperty("date").GetDateTime();
                    string message = order.GetProperty("message").GetString();
                    string name = order.GetProperty("order_connections")[0].GetProperty("user").GetProperty("userName").GetString();
                    var dishes = order.GetProperty("order_dishes");
                    int number_of_dishes = dishes.GetArrayLength();
                    List<OrderItem> items = new List<OrderItem>();

                    for (int j = 0; j < number_of_dishes; j++)
                    {
                        string dish_name = dishes[j].GetProperty("dish").GetProperty("name").GetString();
                        string customizationsStr = dishes[j].GetProperty("customizations").GetString();

                        List<string> dish_customizations = customizationsStr
                            .Trim('"')
                            .Split(new[] { "\",\"" }, StringSplitOptions.None)
                            .ToList();
                        string dish_type = dishes[j].GetProperty("dish").GetProperty("type").GetString();
                        int dish_amount = dishes[j].GetProperty("amount").GetInt32();
                        for (int k = 0; k < dish_amount; k++)
                            items.Add(new OrderItem(dish_name, dish_customizations, dish_type));
                    }

                    all_orders.Add(new Order(items, id, totalprice, true, date, name));
                    Console.WriteLine("lefutott " + all_orders.Count());
                }
            }
            catch
            {
                conn_alive = false;
            }
        }


        private async void Form1_Load(object sender, EventArgs e)
        {
            RendelesekGet();
            await START(); //várni kell a responsera
            InitializeClock();
            UpdateClock();
            UpdateElement();
            InitializeElementUpdater();
            DisplayOrders(all_orders);
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

            await RefreshOrders();

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
            DisplayOrders(all_orders);
        }


        private async Task RefreshOrders()
        {
            try
            {
                all_orders.Clear();

                JsonElement jsonResponse = await getRendelesJSON();

                int number_of_active_orders = jsonResponse.GetArrayLength();

                for (int i = 0; i < number_of_active_orders; i++)
                {
                    JsonElement order = jsonResponse[i];

                    int id = order.GetProperty("id").GetInt32();
                    int totalprice = order.GetProperty("totalPrice").GetInt32();
                    DateTime date = order.GetProperty("date").GetDateTime();
                    string message = order.GetProperty("message").GetString();
                    string name = order.GetProperty("order_connections")[0].GetProperty("user").GetProperty("userName").GetString();
                    var dishes = order.GetProperty("order_dishes");
                    int number_of_dishes = dishes.GetArrayLength();
                    List<OrderItem> items = new List<OrderItem>();

                    for (int j = 0; j < number_of_dishes; j++)
                    {
                        string dish_name = dishes[j].GetProperty("dish").GetProperty("name").GetString();
                        string customizationsStr = dishes[j].GetProperty("customizations").GetString();

                        List<string> dish_customizations = customizationsStr
                            .Trim('"')
                            .Split(new[] { "\",\"" }, StringSplitOptions.None)
                            .ToList();
                        string dish_type = dishes[j].GetProperty("dish").GetProperty("type").GetString();
                        int dish_amount = dishes[j].GetProperty("amount").GetInt32();

                        for (int k = 0; k < dish_amount; k++)
                            items.Add(new OrderItem(dish_name, dish_customizations, dish_type));
                    }

                    all_orders.Add(new Order(items, id, totalprice, true, date, name));
                }

                //kell e frissítsen?

                int orders_count = all_orders.Count;

                if (orders_count != previousOrdersCount)
                {
                    must_Update = true;

                    previousOrdersCount = orders_count;
                }
                else
                {
                    must_Update = false;
                }
                Console.WriteLine("eredeti: " + orders_count);
                Console.WriteLine("előző: " + previousOrdersCount);
                Console.WriteLine(must_Update);
                DisplayOrders(all_orders);
            }
            catch
            {
                conn_alive = false;
            }
        }


        //--megjelenítés--

        public void DeleteAllPanels()
        {
            foreach (var panel in this.Controls.OfType<FlowLayoutPanel>().ToList())
            {
                this.Controls.Remove(panel);
                panel.Dispose();
            }
        }

        private void DisplayOrders(List<Order> all_orders)
        {
            if (must_Update)
            {
                Console.WriteLine("Updating orders...");
                DeleteAllPanels();
            }

            FlowLayoutPanel flowLayoutPanel = CreateFlowLayoutPanel();
            this.Controls.Add(flowLayoutPanel);

            foreach (var order in all_orders)
            {
                Panel orderPanel = CreateOrderPanel();
                PopulateOrderPanel(orderPanel, order);
                flowLayoutPanel.Controls.Add(orderPanel);
            }
        }

        private FlowLayoutPanel CreateFlowLayoutPanel()
        {
            return new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = true,
                Padding = new Padding(20, 20, 20, 200),
                AutoScroll = true,
            };
        }

        private Panel CreateOrderPanel()
        {
            return new Panel
            {
                AutoSize = true,
                Margin = new Padding(20),
                BackColor = Color.White
            };
        }

        private void PopulateOrderPanel(Panel orderPanel, Order order)
        {
            int currentTop = 10;

            AddLabel(orderPanel, $"Rendelés ID: {order.Id}\n", ref currentTop);
            AddLabel(orderPanel, $"Dátum: {order.timestamp.ToShortDateString()} {order.timestamp.ToShortTimeString()}\n", ref currentTop);
            AddLabel(orderPanel, $"Megrendelő: {order.customer_name}\n", ref currentTop);
            AddLabel(orderPanel, $"Ár: {order.price} Ft\n", ref currentTop);
            AddLabel(orderPanel, $"Kifizetve: {(order.paid ? "Igen" : "Nem")}\n", ref currentTop);

            AddSeparator(orderPanel, ref currentTop);

            string orderContent = GenerateOrderContent(order);
            AddLabel(orderPanel, $"Tartalom:\n{orderContent}", ref currentTop);

            AddDoneButton(orderPanel, order, currentTop);
        }

        private void AddLabel(Panel panel, string text, ref int currentTop)
        {
            Label label = new Label
            {
                Text = text,
                AutoSize = true,
                Location = new Point(10, currentTop),
                ForeColor = Color.Black,
                TextAlign = ContentAlignment.TopLeft
            };
            panel.Controls.Add(label);
            currentTop += label.Height + 5;
        }

        private void AddSeparator(Panel panel, ref int currentTop)
        {
            Label separatorLabel = new Label
            {
                AutoSize = false,
                Height = 2,
                Width = panel.Width - 20,
                Location = new Point(10, currentTop),
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
            panel.Controls.Add(separatorLabel);
            currentTop += separatorLabel.Height + 10;
        }

        private string GenerateOrderContent(Order order)
        {
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

            return string.Join("\n", displayContent);
        }

        private void AddDoneButton(Panel panel, Order order, int currentTop)
        {
            Button doneButton = new Button
            {
                Text = "Kész",
                Width = 280,
                Height = 30,
                Location = new Point(10, currentTop),
                BackColor = Color.LightGreen,
                FlatStyle = FlatStyle.Flat
            };

            doneButton.Click += (sender, args) =>
            {
                DialogResult result = MessageBox.Show($"Rendelés ID: {order.Id}", "Biztosan kiadja a rendelést?", MessageBoxButtons.OKCancel, MessageBoxIcon.Warning);

                if (result == DialogResult.OK)
                {
                    OrderFinish(order.Id);
                }
            };
            panel.Controls.Add(doneButton);
        }

        private async void OrderFinish(int id)
        {
            string url = String.Format("http://localhost:3000/purchase/deActivatePurchase/" + Convert.ToString(id));
            Console.WriteLine(url);
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpContent content = new StringContent("");

                    HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("PATCH"), url)
                    {
                        Content = content
                    };

                    HttpResponseMessage response = await client.SendAsync(request);

                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Rendelés sikeresen kiadva");
                    }
                    else
                    {
                        Console.WriteLine($"Hiba történt: {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Hiba történt: {ex.Message}");
                }
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
        public int price { get; set; }
        public bool paid { get; set; }
        public DateTime timestamp { get; set; }
        public string customer_name { get; set; }

        public Order(List<OrderItem> items, int id, int price, bool paid, DateTime timestamp, string customer_name)
        {
            Items = items;
            Id = id;
            this.price = price;
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