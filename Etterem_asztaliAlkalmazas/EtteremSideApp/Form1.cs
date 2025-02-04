using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text.Encodings.Web;
using System.Text.Json;
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
        static string conn_link = "http://localhost:3000/api/v1/get-users";
        public static List<Order> all_orders = new List<Order>();
        public static bool must_Update;
        public static int previousOrdersCount = 0;
        public static int fontSize = 12;
        public static Color backGroundColor = Color.Black;
        public static bool adminLoggedIn = false;
        public FlowLayoutPanel panel2 = new FlowLayoutPanel();
        public FlowLayoutPanel panel3 = new FlowLayoutPanel();
        public FlowLayoutPanel panel4 = new FlowLayoutPanel();



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
                HttpResponseMessage response = await sharedClient.GetAsync("http://localhost:3000/api/v1/get-all-active-order");

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
                    bool takeAway = order.GetProperty("takeAway").GetBoolean();
                    Console.WriteLine(order.GetProperty("takeAway").GetBoolean());
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

                    all_orders.Add(new Order(items, id, totalprice, true, date, name, message, takeAway));
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
            this.Font = new Font("Arial", fontSize);
            this.BackColor = backGroundColor;
            ShowAdminButtons();
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
            //DisplayOrders(all_orders);
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
                    bool takeAway = order.GetProperty("takeAway").GetBoolean();
                    Console.WriteLine(order.GetProperty("takeAway").GetBoolean());
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

                    all_orders.Add(new Order(items, id, totalprice, true, date, name, message, takeAway));
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

        public void DisplayOrders(List<Order> all_orders)
        {
            if (must_Update)
            {
                DeleteAllPanels();
            }

            FlowLayoutPanel flowLayoutPanel = CreateFlowLayoutPanel();

            this.Controls.Add(flowLayoutPanel);

            //a name a flowLayoutPanel

            foreach (var order in all_orders)
            {
                Panel orderPanel = CreateOrderPanel();
                PopulateOrderPanel(orderPanel, order);
                flowLayoutPanel.Controls.Add(orderPanel);
            }
        }

        public static FlowLayoutPanel CreateFlowLayoutPanel()
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
            Panel panel = new Panel
            {
                AutoSize = true,
                Margin = new Padding(10, 20, 20, 20),
                BackColor = Color.White,
            };

            panel.SizeChanged += (s, e) =>
            {
                if (panel.Width % 15 != 0)
                {
                    int newWidth = panel.Width + (15 - panel.Width % 15);
                    panel.Width = newWidth;
                }
            };

            panel.Paint += (s, e) => PaintPanel(e.Graphics, panel);

            return panel;
        }

        private void PaintPanel(Graphics g, Panel panel)
        {
            Color topLeftBorderColor = Color.Black;
            Color rightBottomBorderColor = Color.Black;
            int topLeftBorderThickness = 3;
            int rightBottomBorderThickness = 3;

            using (Pen topLeftPen = new Pen(topLeftBorderColor, topLeftBorderThickness))
            using (Pen rightBottomPen = new Pen(rightBottomBorderColor, rightBottomBorderThickness))
            {
                g.DrawLine(topLeftPen, 0, 0, panel.Width, 0);
                g.DrawLine(topLeftPen, 0, 0, 0, panel.Height);

                g.DrawLine(rightBottomPen, panel.Width - 1, 0, panel.Width - 1, panel.Height);

                int zigzagHeight = 10;
                int zigzagWidth = 15;
                int numZigzags = panel.Width / zigzagWidth;

                Point[] zigzagPoints = new Point[numZigzags * 2 + 2];
                for (int i = 0; i <= numZigzags; i++)
                {
                    int x = i * zigzagWidth;
                    int yBase = panel.Height;
                    zigzagPoints[i * 2] = new Point(x, yBase); // háromszög alja
                    zigzagPoints[i * 2 + 1] = new Point(x + zigzagWidth / 2, yBase - zigzagHeight); // háromszög teteje
                }
                zigzagPoints[zigzagPoints.Length - 1] = new Point(panel.Width, panel.Height);

                using (Brush blackBrush = new SolidBrush(backGroundColor))
                {
                    for (int i = 0; i < zigzagPoints.Length - 2; i += 2)
                    {
                        Point[] triangle = {
                    zigzagPoints[i],
                    zigzagPoints[i + 1],
                    zigzagPoints[i + 2]
                };
                        g.FillPolygon(blackBrush, triangle);
                    }
                }

                g.DrawLines(rightBottomPen, zigzagPoints);
            }
        }






        private void PopulateOrderPanel(Panel orderPanel, Order order)
        {
            int currentTop = 10;
            int maxLabelWidth = 0;

            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Rendelés ID: {order.Id}\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Dátum: {order.timestamp.ToShortDateString()} {order.timestamp.ToShortTimeString()}\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Megrendelő: {order.customer_name}\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Ár: {order.price} Ft\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Kifizetve: {(order.paid ? "Igen" : "Nem")}\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Elvitelre: {(order.takeAway ? "Igen" : "Nem")}\n", ref currentTop));
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Megjegyzés: {order.message}\n", ref currentTop));

            AddSeparator(orderPanel, ref currentTop);

            string orderContent = GenerateOrderContent(order);
            maxLabelWidth = Math.Max(maxLabelWidth, AddLabel(orderPanel, $"Tartalom:\n{orderContent}", ref currentTop));

            AddDoneButton(orderPanel, order, currentTop + 50, maxLabelWidth);

            ColorOrderPanel(ref orderPanel, ref order);
        }

        private void ColorOrderPanel(ref Panel orderPanel, ref Order order)
        {
            if (order.takeAway)
            {
                orderPanel.BackColor = Color.LightSalmon;
            }
            else
            {
                orderPanel.BackColor = Color.LightSteelBlue;
            }
        }

        private int AddLabel(Panel panel, string text, ref int top)
        {
            Label label = new Label
            {
                Text = text,
                AutoSize = true,
                Location = new Point(10, top),

            };
            panel.Controls.Add(label);

            top += label.Height + 5;
            return label.Width;
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
                        string mods = string.IsNullOrEmpty(group.Key.ModificationsKey)
                            ? ""
                            : $"Módosítások: {group.Key.ModificationsKey}";

                        return $"{group.Count()} X {group.Key.name} {mods}";
                    })
                    .ToList();

                displayContent.AddRange(groupedItems);
            }

            return string.Join("\n", displayContent);
        }

        private void AddDoneButton(Panel panel, Order order, int currentTop, int width)
        {
            Button doneButton = new Button
            {
                Text = "Kész",
                Width = width + 200,
                Height = 30,
                Location = new Point(10, currentTop),
                BackColor = Color.LightGreen,
                FlatStyle = FlatStyle.Flat,
                Margin = new Padding(0, 0, 10, 20),

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
            string url = String.Format("http://localhost:3000/api/v1/in-activate-order/" + Convert.ToString(id));
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

        private void toolStripLabel3_Click(object sender, EventArgs e)
        {
            Form loginForm = new Form();
            loginForm.Text = "Admin Login";
            loginForm.Size = new Size(400, 200);
            loginForm.StartPosition = FormStartPosition.CenterScreen;
            loginForm.BackColor = Color.Black;

            Label emailLabel = new Label() { Text = "Email:", Left = 20, Top = 20, Width = 80 };
            TextBox emailTextBox = new TextBox() { Left = 100, Top = 20, Width = 150 };

            Label passwordLabel = new Label() { Text = "Password:", Left = 20, Top = 60, Width = 80 };
            TextBox passwordTextBox = new TextBox() { Left = 100, Top = 60, Width = 150, PasswordChar = '*' };

            Button showPasswordButton = new Button() { Text = "Show", Left = 260, Top = 60, Width = 50 };
            showPasswordButton.MouseDown += (s, ev) => { passwordTextBox.PasswordChar = '\0'; }; //üres
            showPasswordButton.MouseUp += (s, ev) => { passwordTextBox.PasswordChar = '*'; };
            showPasswordButton.BackColor = Color.White;

            Button okButton = new Button() { Text = "OK", Left = 100, Top = 100, Width = 80 };
            okButton.Click += (s, ev) =>
            {
                string email = emailTextBox.Text;
                string password = passwordTextBox.Text;
                if (email != "" && password != "")
                {
                    string check = getLogin(email, password);
                    if (check == "")
                    {
                        MessageBox.Show("Hibás jelszó/e-mail cím vagy nincs jogosultsága itt bejelentkezni!");
                    }
                    else
                    {
                        //sikeres bejelentkezés |
                        //                      V
                        adminLoggedIn = true;
                        ShowAdminButtons();


                        loginForm.Close();
                    }
                }
                else
                {
                    MessageBox.Show("Ne hagyjon üres mezőket!");
                }
            };
            okButton.BackColor = Color.White;

            loginForm.Controls.Add(emailLabel);
            loginForm.Controls.Add(emailTextBox);
            loginForm.Controls.Add(passwordLabel);
            loginForm.Controls.Add(passwordTextBox);
            loginForm.Controls.Add(showPasswordButton);
            loginForm.Controls.Add(okButton);

            loginForm.ShowDialog();
        }




        private void ShowAdminButtons()
        {
            if (adminLoggedIn)
            {
                toolStripSeparator4.Visible = true;
                toolStripSeparator5.Visible = true;
                toolStripSeparator6.Visible = true;
                toolStripSeparator7.Visible = true;

                toolStripLabel6.Visible = true;
                toolStripLabel7.Visible = true;
                toolStripLabel8.Visible = true;
                toolStripLabel9.Visible = true;
            }
            else
            {
                toolStripSeparator4.Visible = false;
                toolStripSeparator5.Visible = false;
                toolStripSeparator6.Visible = false;
                toolStripSeparator7.Visible = false;

                toolStripLabel6.Visible = false;
                toolStripLabel7.Visible = false;
                toolStripLabel8.Visible = false;
                toolStripLabel9.Visible = false;
            }
        }

        private string getLogin(string givenEmail, string givenPw)
        {
            string username = "awdawd";

            //MessageBox.Show(givenEmail, givenPw);

            return username;
        }



        //a name a flowLayoutPanel

        private void toolStripLabel6_Click(object sender, EventArgs e)
        {
            //Kijelentkezés
            //minden panel hátra küld + hide

            panel2.SendToBack();
            panel3.SendToBack();
            panel4.SendToBack();

            adminLoggedIn = false;
            ShowAdminButtons();
        }

        private void toolStripLabel7_Click(object sender, EventArgs e)
        {


            // Felhasználók kezelése

            panel2.Visible = true;
            panel2.Dock = DockStyle.Fill;
            panel2.Padding = new Padding(20, 20, 20, 200);
            panel2.AutoScroll = true;
            panel2.BackColor = backGroundColor;



            CreateUserControl(1, "xXx_TesztMatyi_xXx", "Tesztelő Mátyás", "matyizom@gmail.com", 6969, true, false);

            this.Controls.Add(panel2);
            panel2.BringToFront();
        }
        private void CreateUserControl(int id, string username, string fullname, string email, int points, bool admin, bool active)
        {
            panel2.Controls.Clear();

            Panel centralPanel = new Panel
            {
                Size = new Size(400, 400),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.Gray,
            };

            TextBox searchTextBox = new TextBox
            {
                Location = new Point(20, 20),
                Width = 250
            };

            Button searchButton = new Button
            {
                Text = "Keresés",
                Location = new Point(280, 18),
                Width = 80,
                Height = 30,
            };
            searchButton.Click += SearchButton_Click;

            Label idLabel = new Label
            {
                Text = "ID:",
                Location = new Point(20, 60),
                AutoSize = true
            };
            TextBox idTextBox = new TextBox
            {
                Location = new Point(150, 58),
                Width = 210,
                Text = id.ToString(),
                ReadOnly = true
            };

            Label usernameLabel = new Label
            {
                Text = "Felhasználó név:",
                Location = new Point(20, 100),
                AutoSize = true
            };
            TextBox usernameTextBox = new TextBox
            {
                Location = new Point(150, 98),
                Width = 210,
                Text = username
            };

            Label fullNameLabel = new Label
            {
                Text = "Teljes név:",
                Location = new Point(20, 140),
                AutoSize = true
            };
            TextBox fullNameTextBox = new TextBox
            {
                Location = new Point(150, 138),
                Width = 210,
                Text = fullname
            };

            Label emailLabel = new Label
            {
                Text = "E-mail:",
                Location = new Point(20, 180),
                AutoSize = true
            };
            TextBox emailTextBox = new TextBox
            {
                Location = new Point(150, 178),
                Width = 210,
                Text = email
            };

            Label pointsLabel = new Label
            {
                Text = "Pontok:",
                Location = new Point(20, 220),
                AutoSize = true
            };
            NumericUpDown pointsNumericUpDown = new NumericUpDown
            {
                Location = new Point(150, 218),
                Width = 100,
                Minimum = 0,
                Maximum = 1000000,
                Value = points
            };

            Label adminLabel = new Label
            {
                Text = "Admin:",
                Location = new Point(20, 260),
                AutoSize = true,
                //Checked = admin
            };

            Panel AdminRadioButtonPanel = new Panel
            {
                Location = new Point(150,260),
                Size = new Size(150,20),
            };

            RadioButton adminYesRadioButton = new RadioButton
            {
                Text = "Igen",
                Location = new Point(0, 0),
                AutoSize = true,
                Checked = admin,
            };

            RadioButton adminNoRadioButton = new RadioButton
            {
                Text = "Nem",
                Location = new Point(70, 0),
                AutoSize = true,
                Checked = !admin,
            };

            AdminRadioButtonPanel.Controls.Add(adminYesRadioButton);
            AdminRadioButtonPanel.Controls.Add (adminNoRadioButton);

            Label ActiveLabel = new Label
            {
                Text = "Aktív:",
                Location = new Point(20, 285),
                AutoSize = true,
                
            };

            Panel ActiveRadioButtonPanel = new Panel
            {
                Location = new Point(150, 285),
                Size = new Size(150, 20),
            };

            RadioButton ActiveYesRadioButton = new RadioButton
            {
                Text = "Igen",
                Location = new Point(0, 0),
                AutoSize = true,
                Checked = active,
            };

            RadioButton ActiveNoRadioButton = new RadioButton
            {
                Text = "Nem",
                Location = new Point(70, 0),
                AutoSize = true,
                Checked = !active,
            };

            ActiveRadioButtonPanel.Controls.Add(ActiveYesRadioButton);
            ActiveRadioButtonPanel.Controls.Add(ActiveNoRadioButton);

            Button saveButton = new Button
            {
                Text = "Mentés",
                Location = new Point(150, 310),
                Width = 80,
                Height = 30,
            };
            saveButton.Click += SaveButton_Click;
            Button deleteButton = new Button
            {
                Text = "Törlés",
                Location = new Point(240, 310),
                Width = 80,
                Height = 30,
            };
            deleteButton.Click += DeleteButton_Click;

            centralPanel.Controls.Add(searchTextBox);
            centralPanel.Controls.Add(searchButton);
            centralPanel.Controls.Add(idLabel);
            centralPanel.Controls.Add(idTextBox);
            centralPanel.Controls.Add(usernameLabel);
            centralPanel.Controls.Add(usernameTextBox);
            centralPanel.Controls.Add(fullNameLabel);
            centralPanel.Controls.Add(fullNameTextBox);
            centralPanel.Controls.Add(emailLabel);
            centralPanel.Controls.Add(emailTextBox);
            centralPanel.Controls.Add(pointsLabel);
            centralPanel.Controls.Add(pointsNumericUpDown);
            centralPanel.Controls.Add(adminLabel);
            centralPanel.Controls.Add(AdminRadioButtonPanel);
            centralPanel.Controls.Add(ActiveLabel);
            centralPanel.Controls.Add(ActiveRadioButtonPanel);
            centralPanel.Controls.Add(saveButton);
            centralPanel.Controls.Add(deleteButton);

            panel2.Controls.Add(centralPanel);
        }


        private void DeleteButton_Click(object sender, EventArgs e)
        {
            //kiüríti a mezőket

            CreateUserControl(0, null, null, null, 0, false, false);


        }

        private void SaveButton_Click(object sender, EventArgs e)
        {
            //menti a módosításokat

            //ide kell megírni azt hogy feltöltse az új adatokat

            CreateUserControl(0, null, null, null, 0, false, false);

        }

        private void SearchButton_Click(object sender, EventArgs e)
        {
            //itt kell keresni email cím alapján



            //CreateUserControl(0, null, null, null, 0, false, false);
        }

        private void toolStripLabel8_Click(object sender, EventArgs e)
        {
            //Új termék


            panel3.Visible = true;
            panel3.Dock = DockStyle.Fill;
            panel3.FlowDirection = FlowDirection.LeftToRight;
            panel3.WrapContents = true;
            panel3.Padding = new Padding(20, 20, 20, 200);
            panel3.AutoScroll = true;
            panel3.BackColor = Color.Blue;

            CreateProductControl();

            this.Controls.Add(panel3);
            panel3.BringToFront();
        }

        private void CreateProductControl()
        {
            panel3.Controls.Clear();

            Panel centralPanel = new Panel
            {
                Size = new Size(500, 600),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.LightGray,
            };

            Label nameLabel = new Label
            {
                Text = "Név:",
                Location = new Point(20, 20),
                AutoSize = true
            };
            TextBox nameTextBox = new TextBox
            {
                Location = new Point(150, 18),
                Width = 300
            };

            Label priceLabel = new Label
            {
                Text = "Ár:",
                Location = new Point(20, 60),
                AutoSize = true
            };
            NumericUpDown priceNumericUpDown = new NumericUpDown
            {
                Location = new Point(150, 58),
                Width = 100,
                Minimum = 0,
                Maximum = 1000000,
                DecimalPlaces = 2
            };

            Label optionsLabel = new Label
            {
                Text = "Opciók:",
                Location = new Point(20, 100),
                AutoSize = true
            };
            DataGridView optionsDataGridView = new DataGridView
            {
                Location = new Point(150, 98),
                Width = 300,
                Height = 150,
                ColumnCount = 2,
                Columns = { [0] = { Name = "Opció" }, [1] = { Name = "Felár" } },
                AllowUserToAddRows = false
            };
            optionsDataGridView.Rows.Add();

            Button addOptionButton = new Button
            {
                Text = "+",
                Location = new Point(460, 98),
                Width = 30,
                Height = 30
            };
            addOptionButton.Click += (sender, e) =>
            {
                optionsDataGridView.Rows.Add();
            };

            Button removeOptionButton = new Button
            {
                Text = "-",
                Location = new Point(460, 138),
                Width = 30,
                Height = 30
            };
            removeOptionButton.Click += (sender, e) =>
            {
                foreach (DataGridViewRow row in optionsDataGridView.SelectedRows)
                {
                    optionsDataGridView.Rows.Remove(row);
                }
            };

            ToolTip toolTip = new ToolTip();
            toolTip.SetToolTip(addOptionButton, "Sor hozzáadása");
            toolTip.SetToolTip(removeOptionButton, "Kijelölt sor törlése");

            Label descriptionLabel = new Label
            {
                Text = "Leírás:",
                Location = new Point(20, 260),
                AutoSize = true
            };
            TextBox descriptionTextBox = new TextBox
            {
                Location = new Point(150, 258),
                Width = 300,
                Height = 80,
                Multiline = true
            };

            Label typeLabel = new Label
            {
                Text = "Típus:",
                Location = new Point(20, 350),
                AutoSize = true
            };
            ComboBox typeComboBox = new ComboBox
            {
                Location = new Point(150, 348),
                Width = 300,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            typeComboBox.Items.AddRange(new string[] { "Típus1", "Típus2", "Típus3" });

            Label imageLabel = new Label
            {
                Text = "Kép:",
                Location = new Point(20, 390),
                AutoSize = true
            };
            Button imageButton = new Button
            {
                Text = "Kép kiválasztása",
                Location = new Point(150, 388),
                Width = 150,
                Height = 30
            };
            imageButton.Click += (sender, e) =>
            {
                using (OpenFileDialog openFileDialog = new OpenFileDialog())
                {
                    openFileDialog.Filter = "PNG fájlok (*.png)|*.png";
                    if (openFileDialog.ShowDialog() == DialogResult.OK)
                    {
                        // A kiválasztott fájl elérési útja: openFileDialog.FileName
                        // Itt lehet kezelni a kiválasztott képet
                    }
                }
            };

            Button saveButton = new Button
            {
                Text = "Mentés",
                Location = new Point(150, 430),
                Width = 80,
                Height = 30
            };
            saveButton.Click += (sender, e) =>
            {
                // save cucc
            };

            Button deleteButton = new Button
            {
                Text = "Törlés",
                Location = new Point(240, 430),
                Width = 80,
                Height = 30
            };
            deleteButton.Click += (sender, e) =>
            {
                nameTextBox.Clear();
                priceNumericUpDown.Value = 0;
                optionsDataGridView.Rows.Clear();
                optionsDataGridView.Rows.Add();
                descriptionTextBox.Clear();
                typeComboBox.SelectedIndex = -1;
            };

            centralPanel.Controls.Add(nameLabel);
            centralPanel.Controls.Add(nameTextBox);
            centralPanel.Controls.Add(priceLabel);
            centralPanel.Controls.Add(priceNumericUpDown);
            centralPanel.Controls.Add(optionsLabel);
            centralPanel.Controls.Add(optionsDataGridView);
            centralPanel.Controls.Add(addOptionButton);
            centralPanel.Controls.Add(removeOptionButton);
            centralPanel.Controls.Add(descriptionLabel);
            centralPanel.Controls.Add(descriptionTextBox);
            centralPanel.Controls.Add(typeLabel);
            centralPanel.Controls.Add(typeComboBox);
            centralPanel.Controls.Add(imageLabel);
            centralPanel.Controls.Add(imageButton);
            centralPanel.Controls.Add(saveButton);
            centralPanel.Controls.Add(deleteButton);

            panel3.Controls.Add(centralPanel);
        }


        private void toolStripLabel9_Click(object sender, EventArgs e)
        {
            //meglévő termék módosítása

            
            panel4.Visible = true;
            panel4.Dock = DockStyle.Fill;
            panel4.FlowDirection = FlowDirection.LeftToRight;
            panel4.WrapContents = true;
            panel4.Padding = new Padding(20, 20, 20, 200);
            panel4.AutoScroll = true;
            panel4.BackColor = Color.Green;
            this.Controls.Add(panel4);
            panel4.BringToFront();
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
        public string message { get; set; }
        public bool takeAway { get; set; }
        public Order(List<OrderItem> items, int id, int price, bool paid, DateTime timestamp, string customer_name, string message, bool takeAway)
        {
            Items = items;
            Id = id;
            this.price = price;
            this.paid = paid;
            this.timestamp = timestamp;
            this.customer_name = customer_name;
            this.message = message;
            this.takeAway = takeAway;
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