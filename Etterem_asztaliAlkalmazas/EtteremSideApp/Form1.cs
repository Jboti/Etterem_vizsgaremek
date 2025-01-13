using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading;
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
        static string conn_link = "http://localhost:3000/user/getAllUser";
        public static List<Order> all_orders = new List<Order>();

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
            JsonElement jsonResponse; // Declare the JSON response variable
            HttpResponseMessage response = await sharedClient.GetAsync("http://localhost:3000/purchase/getAllActiveOrder");

            string responseBody = await response.Content.ReadAsStringAsync();

            // Deserialize the JSON response into JsonElement
            jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);

            // Define JSON serialization options
            var jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            // Optionally log the formatted JSON
            string formattedJson = JsonSerializer.Serialize(jsonResponse, jsonOptions);
            // Console.WriteLine(formattedJson);

            return jsonResponse;
        }

        public static async void RendelesekGet()
        {
            all_orders.Clear();
            // Await the getRendelesJSON method to get the actual JsonElement
            JsonElement jsonResponse = await getRendelesJSON();

            int number_of_active_orders = jsonResponse.GetArrayLength(); // Get the actual number of orders

            for (int i = 0; i < number_of_active_orders; i++)
            {
                // Access each order in the loop
                JsonElement order = jsonResponse[i];

                // Example: Get some properties of the order
                int id = order.GetProperty("id").GetInt32();
                int totalprice = order.GetProperty("totalPrice").GetInt32();
                DateTime date = order.GetProperty("date").GetDateTime();
                string message = order.GetProperty("message").GetString();
                string name = order.GetProperty("order_connections")[0].GetProperty("user").GetProperty("userName").GetString();
                var dishes = order.GetProperty("order_dishes");
                int number_of_dishes = dishes.GetArrayLength();
                List<OrderItem> items = new List<OrderItem>();

                // Fixing the loop where you use 'i' incorrectly
                for (int j = 0; j < number_of_dishes; j++)
                {
                    string dish_name = dishes[j].GetProperty("dish").GetProperty("name").GetString();
                    string customizationsStr = dishes[j].GetProperty("customizations").GetString();

                    // Remove the surrounding quotes and split by commas if needed
                    List<string> dish_customizations = customizationsStr
                        .Trim('"')  // Remove the outer quotes
                        .Split(new[] { "\",\"" }, StringSplitOptions.None)  // Split by comma separator if multiple options are present
                        .ToList();
                    string dish_type = dishes[j].GetProperty("dish").GetProperty("type").GetString();
                    int dish_amount = dishes[j].GetProperty("amount").GetInt32();
                    for (int k = 0; k < dish_amount; k++)
                        items.Add(new OrderItem(dish_name, dish_customizations, dish_type));
                }

                // Add the order to the all_orders list
                all_orders.Add(new Order(items, id, totalprice, true, date, name));
                Console.WriteLine("lefutott " + all_orders.Count());
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

            // Fetch new orders
            await RefreshOrders();

            // Update the connection status label
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
            // Clear existing orders
            all_orders.Clear();

            // Await the getRendelesJSON method to get the actual JsonElement and fill all_orders
            JsonElement jsonResponse = await getRendelesJSON();

            int number_of_active_orders = jsonResponse.GetArrayLength(); // Get the actual number of orders

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
                        .Trim('"')  // Remove the outer quotes
                        .Split(new[] { "\",\"" }, StringSplitOptions.None)  // Split by comma separator if multiple options are present
                        .ToList();
                    string dish_type = dishes[j].GetProperty("dish").GetProperty("type").GetString();
                    int dish_amount = dishes[j].GetProperty("amount").GetInt32();

                    for (int k = 0; k < dish_amount; k++)
                        items.Add(new OrderItem(dish_name, dish_customizations, dish_type));
                }

                // Add the order to the all_orders list
                all_orders.Add(new Order(items, id, totalprice, true, date, name));



            }
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

        public bool must_Update;


        int previousOrdersCount = 0;
        private void DisplayOrders(List<Order> all_orders)
        {

            //ide kell rakni minden panel törlésést
            FlowLayoutPanel flowLayoutPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = true,
                Padding = new Padding(20, 20, 20, 200),
                AutoScroll = true,
            };

            this.Controls.Add(flowLayoutPanel);

            foreach (var order in all_orders)
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
                    Text = "Ár: " + order.price + " Ft" + "\n",
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

                // Add click event handler for the button
                doneButton.Click += (sender, args) =>
                {
                    // Show a MessageBox with "OK" and "Cancel" options
                    DialogResult result = MessageBox.Show($"Rendelés ID: {order.Id}", "Biztosan kiadja a rendelést?", MessageBoxButtons.OKCancel, MessageBoxIcon.Warning);

                    // Check the result of the MessageBox
                    if (result == DialogResult.OK)
                    {
                        // If the "OK" button is clicked, call the OrderFinish function
                        OrderFinish(order.Id);
                    }
                };
                orderPanel.Controls.Add(doneButton);
                flowLayoutPanel.Controls.Add(orderPanel);
            }
        }

        private void OrderFinish(int id)
        {
            MessageBox.Show("Rendelés sikeresen kiadva");

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
