using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Security.Policy;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
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
        public static string adminName = "---";
        public string[] allCategories = new string[] { "Kebab wrap", "Kebab box", "Kebab tál", "Köret", "Üdítő" }; // ehhez kell majd egy get-all-categories endpoint
        public string currentIMGBlob = "empty";

        public static List<FullUser> selectedUsers = new List<FullUser>(); // user edit keresési részéhez tartozik
        public static FullUser selectedUser;

        public static List<MenuItem> selectedMenuItems = new List<MenuItem>();
        public static MenuItem selectedMenuItem;

        public FlowLayoutPanel panel2 = new FlowLayoutPanel();
        public FlowLayoutPanel panel3 = new FlowLayoutPanel();
        public FlowLayoutPanel panel4 = new FlowLayoutPanel();


        public ListBox resultsListBoxUser;
        public TextBox searchTextBoxUser;

        //user edit felület részei
        public ListBox resultsListBoxDish;
        public TextBox searchTextBoxDish;
        public TextBox idTextBox;
        public TextBox usernameTextBox;
        public TextBox fullNameTextBox;
        public TextBox emailTextBox;
        public NumericUpDown pointsNumericUpDown;
        public RadioButton adminYesRadioButton;
        public RadioButton adminNoRadioButton;
        public RadioButton ActiveYesRadioButton;
        public RadioButton ActiveNoRadioButton;

        //uj termek mododsítása
        public TextBox nameTextBox;
        public NumericUpDown priceNumericUpDown;
        public DataGridView optionsDataGridView;
        public CheckBox glutenCheckBox;
        public CheckBox lactoseCheckBox;
        public CheckBox eggCheckBox;
        public CheckBox nutsCheckBox;
        public TextBox descriptionTextBox;
        public ComboBox typeComboBox;
        public Button imageButton;


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
            clockTimer = new Timer
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
            Timer updateTimer = new Timer
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
                Padding = new Padding(20, 20, 20, 20),
                AutoScroll = true,
            };
        }

        private Panel CreateOrderPanel()
        {
            Panel panel = new Panel
            {
                AutoSize = true,
                Margin = new Padding(10, 20, 20, 60),
                BackColor = Color.White,
            };
            
            //hogy mindig szépen igazodjanak a cakkok a "blokk" alján//
            panel.SizeChanged += (s, e) =>
            {
                if (panel.Width % 15 != 0)
                {
                    int newWidth = panel.Width + (15 - panel.Width % 15);
                    panel.Width = newWidth;
                }
            };
            //-------------------------------------------------------//

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
            int allLabelHeight = 0;

            allLabelHeight += AddLabel(orderPanel, $"Rendelés ID: {order.Id}\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Dátum: {order.timestamp.ToShortDateString()} {order.timestamp.ToShortTimeString()}\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Megrendelő: {order.customer_name}\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Ár: {order.price} Ft\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Kifizetve: {(order.paid ? "Igen" : "Nem")}\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Elvitelre: {(order.takeAway ? "Igen" : "Nem")}\n", ref currentTop, ref maxLabelWidth);
            allLabelHeight += AddLabel(orderPanel, $"Megjegyzés: {order.message}\n", ref currentTop, ref maxLabelWidth);

            AddSeparator(orderPanel, ref currentTop);
            allLabelHeight += 5;

            string orderContent = GenerateOrderContent(order);
            allLabelHeight += AddLabel(orderPanel, $"Tartalom:\n{orderContent}", ref currentTop, ref maxLabelWidth);

            AddDoneButton(orderPanel, order, currentTop, maxLabelWidth, allLabelHeight);

            ColorOrderPanel(ref orderPanel, ref order);

            orderPanel.Width = maxLabelWidth;
            orderPanel.Height = allLabelHeight;
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

        private int AddLabel(Panel panel, string text, ref int top, ref int maxWidth)
        { 

            Label label = new Label
            {
                Text = text,
                AutoSize = true,
                Location = new Point(10, top),
                Margin = new Padding(0, 5, 0, 5),
            };

            panel.Controls.Add(label);

            int labelHeight = label.Height + 5;
            top += labelHeight; 

            maxWidth = Math.Max(maxWidth, label.Width);

            return labelHeight;
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
                displayContent.Add($"\n---- {categoryGroup.Key} ----\n");

                var groupedItems = categoryGroup
                    .GroupBy(item =>
                    {
                        string modificationsKey = "";

                        if (item.modifications.Count > 0)
                        {
                            var orderedMods = item.modifications.OrderBy(m => m).ToList();
                            modificationsKey = string.Join(", ", orderedMods);
                        }

                        return new
                        {
                            item.name,
                            ModificationsKey = modificationsKey
                        };
                    })
                    .Select(group =>
                    {
                        var result = new List<string>();

                        result.Add($"{group.Count()} X {group.Key.name}");

                        if (!string.IsNullOrEmpty(group.Key.ModificationsKey))
                        {
                            var modifications = group.Key.ModificationsKey.Split(',').ToList();

                            result.Add($"\n\t  Szósz: \"{modifications[0]}\"");

                            if (modifications.Count > 1)
                            {
                                result.Add($"\n\t  Módosítások: {string.Join(", ", modifications.Skip(1))}");
                            }
                        }

                        return string.Join("", result);
                    })
                    .ToList();

                displayContent.AddRange(groupedItems);
            }

            return string.Join("\n", displayContent);
        }




        private void AddDoneButton(Panel panel, Order order, int currentTop, int width, int allLabelHeight)
        {
            Button doneButton = new Button
            {
                Text = "Kész",
                Width = width + 250,
                Height = 30,
                
                Location = new Point(10,allLabelHeight+currentTop/3),
                BackColor = Color.LightGreen,
                FlatStyle = FlatStyle.Flat,
                Margin = new Padding(0, 10, 10, 20),

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
            showPasswordButton.MouseDown += (s, ev) => { passwordTextBox.PasswordChar = '\0'; };
            showPasswordButton.MouseUp += (s, ev) => { passwordTextBox.PasswordChar = '*'; };
            showPasswordButton.BackColor = Color.White;

            Button okButton = new Button() { Text = "OK", Left = 100, Top = 100, Width = 80 };
            okButton.Click += async (s, ev) =>
            {
                string email = emailTextBox.Text;
                string password = passwordTextBox.Text;
                if (email != "" && password != "")
                {
                    string check = await getLogin(email, password);
                    if (check == "")
                    {
                        MessageBox.Show("Hibás jelszó/e-mail cím vagy nincs jogosultsága itt bejelentkezni!");
                    }
                    else
                    {
                        // sikeres bejelentkezés
                        adminLoggedIn = true;
                        adminName = check;
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

            loginForm.KeyDown += (s, ev) =>
            {
                if (ev.KeyCode == Keys.Enter)
                {
                    okButton.PerformClick();
                }
            };

            loginForm.Controls.Add(emailLabel);
            loginForm.Controls.Add(emailTextBox);
            loginForm.Controls.Add(passwordLabel);
            loginForm.Controls.Add(passwordTextBox);
            loginForm.Controls.Add(showPasswordButton);
            loginForm.Controls.Add(okButton);

            loginForm.KeyPreview = true;

            loginForm.ShowDialog();
        }





        private void ShowAdminButtons()
        {
            if (adminLoggedIn)
            {
                toolStripSeparator3.Visible = false;
                toolStripSeparator4.Visible = true;
                toolStripSeparator5.Visible = true;
                toolStripSeparator6.Visible = true;
                toolStripSeparator7.Visible = true;


                toolStripLabel3.Visible = false; //ne legyen bejelentkezés gomb amíg be van jelentkezve valaki
                toolStripLabel6.Visible = true;
                toolStripLabel7.Visible = true;
                toolStripLabel8.Visible = true;
                toolStripLabel9.Visible = true;

                toolStripLabel5.Text = adminName;
            }
            else
            {
                toolStripSeparator3.Visible = true;
                toolStripSeparator4.Visible = false;
                toolStripSeparator5.Visible = false;
                toolStripSeparator6.Visible = false;
                toolStripSeparator7.Visible = false;

                toolStripLabel3.Visible = true;
                toolStripLabel6.Visible = false;
                toolStripLabel7.Visible = false;
                toolStripLabel8.Visible = false;
                toolStripLabel9.Visible = false;

                adminName = "---";
                toolStripLabel5.Text = adminName;
            }
        }



        public async Task<string> getLogin(string givenEmail, string givenPw)
        {
            string url = "http://localhost:3000/api/v1/get-admin-user";
            var credentials = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("email", givenEmail),
                new KeyValuePair<string, string>("password", givenPw)
            };

            try
            {
                using (var client = new HttpClient())
                {
                    var content = new FormUrlEncodedContent(credentials);

                    HttpResponseMessage response = await client.PostAsync(url, content);
                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        return responseBody.Replace("{","").Replace("}","").Replace(",","").Replace("\":\"", ": ").Replace("\"","").Replace("email","e-mail").Replace("userName"," Név");
                    }
                    else
                    {
                        return "";
                    }
                }
            }
            catch
            {
                return "";
            }
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



            CreateUserControl(0,null,null,null,0, false, false);

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
                BackColor = Color.LightGray,
            };

            searchTextBoxUser = new TextBox
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
            idTextBox = new TextBox
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
            usernameTextBox = new TextBox
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
            fullNameTextBox = new TextBox
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
            emailTextBox = new TextBox
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
            pointsNumericUpDown = new NumericUpDown
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
            };

            Panel AdminRadioButtonPanel = new Panel
            {
                Location = new Point(150, 260),
                Size = new Size(150, 20),
            };

            adminYesRadioButton = new RadioButton
            {
                Text = "Igen",
                Location = new Point(0, 0),
                AutoSize = true,
                Checked = admin,
            };

            adminNoRadioButton = new RadioButton
            {
                Text = "Nem",
                Location = new Point(70, 0),
                AutoSize = true,
                Checked = !admin,
            };

            AdminRadioButtonPanel.Controls.Add(adminYesRadioButton);
            AdminRadioButtonPanel.Controls.Add(adminNoRadioButton);

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

            ActiveYesRadioButton = new RadioButton
            {
                Text = "Igen",
                Location = new Point(0, 0),
                AutoSize = true,
                Checked = active,
            };

            ActiveNoRadioButton = new RadioButton
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

            // Találatok
            Panel resultsPanel = new Panel
            {
                Location = new Point(410, 0),
                Size = new Size(250, 400),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.LightGray,
            };

            Label resultsLabel = new Label
            {
                Text = "Találatok",
                Location = new Point(10, 10),
                AutoSize = true,
                Font = new Font("Arial", 10, FontStyle.Bold),
            };

            resultsListBoxUser = new ListBox
            {
                Location = new Point(10, 40),
                Size = new Size(230, 350),
            };

            resultsListBoxUser.SelectedIndexChanged += (sender, e) =>
            {
                if (resultsListBoxUser.SelectedItem != null)
                {
                    string selectedUsername = resultsListBoxUser.SelectedItem.ToString();

                    selectedUser = selectedUsers.FirstOrDefault(user => user.Email == selectedUsername);

                    if (selectedUser != null)
                    {
                        idTextBox.Text = selectedUser.Id.ToString();
                        usernameTextBox.Text = selectedUser.Username;
                        fullNameTextBox.Text = selectedUser.FullName;
                        emailTextBox.Text = selectedUser.Email;
                        pointsNumericUpDown.Value = selectedUser.points;
                        adminYesRadioButton.Checked = selectedUser.isAdmin;
                        adminNoRadioButton.Checked = !selectedUser.isAdmin;
                        ActiveYesRadioButton.Checked = selectedUser.isActive;
                        ActiveNoRadioButton.Checked = !selectedUser.isActive;
                    }
                }
            };

            resultsPanel.Controls.Add(resultsLabel);
            resultsPanel.Controls.Add(resultsListBoxUser);


            centralPanel.Controls.Add(searchTextBoxUser);
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
            panel2.Controls.Add(resultsPanel);
        }

        private void DeleteButton_Click(object sender, EventArgs e)
        {
            //kiüríti a mezőket
            CreateUserControl(0, null, null, null, 0, false, false);
        }

        private async void SaveButton_Click(object sender, EventArgs e)
        {
            // Extract username from adminName using the "Név:" keyword.
            string input = adminName;
            string keyword = "Név: ";
            int startIndex = input.IndexOf(keyword);
            string username = "";

            if (startIndex != -1)
            {
                username = input.Substring(startIndex + keyword.Length).Trim();
            }

            // Flag to determine if logout should occur.
            bool logoutAfterUpdate = false;

            // If the admin is modifying their own account.
            if (selectedUser.Username == username)
            {
                DialogResult result = MessageBox.Show(
                    "Ön magát fogja módosítani, a módosítások után újra be kell jelentkezzen!",
                    "Megerősítés",
                    MessageBoxButtons.OKCancel,
                    MessageBoxIcon.Warning
                );

                if (result != DialogResult.OK)
                {
                    return; // Kilépünk, ha a felhasználó a "Mégse" gombot választja.
                }
                // Set flag to logout after modifications.
                logoutAfterUpdate = true;
            }


            // Execute modifications.

            postUserModifications(Convert.ToInt32(idTextBox.Text.Trim()), usernameTextBox.Text.Trim(), fullNameTextBox.Text.Trim(), emailTextBox.Text.Trim(), Convert.ToInt32(pointsNumericUpDown.Value), adminYesRadioButton.Checked, ActiveYesRadioButton.Checked);
            CreateUserControl(0, null, null, null, 0, false, false);

            if (logoutAfterUpdate)
            {
                panel2.SendToBack();
                panel3.SendToBack();
                panel4.SendToBack();

                adminLoggedIn = false;
                ShowAdminButtons();
            }
        }



        private async void postUserModifications(int givenID, string givenUsername, string givenFullname, string givenEmail, int givenPoints, bool givenisAdmin, bool givenisActive)
        {
            //MessageBox.Show(givenUsername + " " + givenFullname + " " + givenEmail + " " + givenPoints.ToString() + " " + givenisAdmin.ToString() + " " + givenisActive.ToString());

            string url = "http://localhost:3000/api/v1/admin-user-modify";
            var credentials = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("id", givenID.ToString()),
                new KeyValuePair<string, string>("username", givenUsername),
                new KeyValuePair<string, string>("fullname", givenFullname),
                new KeyValuePair<string, string>("email", givenEmail),
                new KeyValuePair<string, string>("points", givenPoints.ToString()),
                new KeyValuePair<string, string>("isAdmin", givenisAdmin.ToString().ToLower()),
                new KeyValuePair<string, string>("isActive", givenisActive.ToString().ToLower())
            };

            try
            {
                using (var client = new HttpClient())
                {
                    var content = new FormUrlEncodedContent(credentials);
                    HttpResponseMessage response = await client.PutAsync(url, content);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        MessageBox.Show("Sikeres mentés.");
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt a mentés során 1: " + response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt a mentés során 2: " + ex.Message);
            }
        }


        private async void SearchButton_Click(object sender, EventArgs e)
        {
            try
            {
                selectedUsers.Clear();
                selectedUsers = await getAllUsers();

                UpdateSearchResults(selectedUsers);
            }
            catch
            {
                MessageBox.Show("Hiba a keresés során 3");
            }
        }

        private void UpdateSearchResults(List<FullUser> users)
        {
            resultsListBoxUser.Items.Clear();
            string searchString = searchTextBoxUser.Text.ToLower();

            foreach (var user in users)
            {
                if (user.Email.ToLower().Contains(searchString))
                {
                    resultsListBoxUser.Items.Add(user.Email);
                }
            }
        }


        public async Task<List<FullUser>> getAllUsers()
        {
            string url = "http://localhost:3000/api/v1/get-users";

            try
            {
                HttpResponseMessage response = await sharedClient.GetAsync(url).ConfigureAwait(false);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    List<FullUser> users = JsonSerializer.Deserialize<List<FullUser>>(jsonResponse, options);
                    if (users != null)
                    {
                        return users;
                    }
                }
                else
                {
                    Console.WriteLine("HIBA a felhasználók lekérdezése során 1");
                }
            }
            catch
            {
                Console.WriteLine("HIBA a felhasználók lekérdezése során 2");
            }

            return new List<FullUser>(); 
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
            panel3.BackColor = backGroundColor;

            CreateProductControl();

            this.Controls.Add(panel3);
            panel3.BringToFront();
        }

        private void CreateProductControl()
        {
            panel3.Controls.Clear();

            Panel centralPanel = new Panel
            {
                Size = new Size(520, 650), // increased height to accommodate new checkboxes
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.LightGray,
            };

            Label nameLabel = new Label
            {
                Text = "Név:",
                Location = new Point(20, 20),
                AutoSize = true
            };
            nameTextBox = new TextBox
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
            priceNumericUpDown = new NumericUpDown
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
            optionsDataGridView = new DataGridView
            {
                Location = new Point(150, 98),
                Width = 300,
                Height = 150,
                AllowUserToAddRows = false
            };
            optionsDataGridView.Columns.Add(new DataGridViewTextBoxColumn { Name = "Opció", HeaderText = "Opció" });
            optionsDataGridView.Columns.Add(new DataGridViewTextBoxColumn { Name = "Felár", HeaderText = "Felár" });
            optionsDataGridView.Columns.Add(new DataGridViewCheckBoxColumn { Name = "Szósz", HeaderText = "Szósz" });

            optionsDataGridView.CellValueChanged += (sender, e) =>
            {
                if (e.ColumnIndex == optionsDataGridView.Columns["Szósz"].Index && e.RowIndex >= 0)
                {
                    var checkBoxCell = (DataGridViewCheckBoxCell)optionsDataGridView.Rows[e.RowIndex].Cells["Szósz"];
                    var priceCell = (DataGridViewTextBoxCell)optionsDataGridView.Rows[e.RowIndex].Cells["Felár"];

                    if ((bool)checkBoxCell.Value)
                    {
                        priceCell.Value = 0;
                        priceCell.ReadOnly = true;
                    }
                    else
                    {
                        priceCell.ReadOnly = false;
                    }
                }
            };

            optionsDataGridView.CurrentCellDirtyStateChanged += (sender, e) =>
            {
                if (optionsDataGridView.IsCurrentCellDirty && optionsDataGridView.CurrentCell is DataGridViewCheckBoxCell)
                {
                    optionsDataGridView.CommitEdit(DataGridViewDataErrorContexts.Commit);
                }
            };

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

            // --- New Checkboxes below the DataGridView ---
            // Positioning checkboxes in a row under the DataGridView.
            glutenCheckBox = new CheckBox
            {
                Text = "Glutén",
                Location = new Point(150, 260),
                AutoSize = true
            };
            lactoseCheckBox = new CheckBox
            {
                Text = "Laktóz",
                Location = new Point(240, 260),
                AutoSize = true
            };
            eggCheckBox = new CheckBox
            {
                Text = "Tojás",
                Location = new Point(330, 260),
                AutoSize = true
            };
            nutsCheckBox = new CheckBox
            {
                Text = "Magvak",
                Location = new Point(420, 260),
                AutoSize = true
            };

            // Shift description controls downward to avoid overlapping the new checkboxes
            Label descriptionLabel = new Label
            {
                Text = "Leírás:",
                Location = new Point(20, 300),
                AutoSize = true
            };
            descriptionTextBox = new TextBox
            {
                Location = new Point(150, 298),
                Width = 300,
                Height = 80,
                Multiline = true
            };

            Label typeLabel = new Label
            {
                Text = "Típus:",
                Location = new Point(20, 400),
                AutoSize = true
            };
            typeComboBox = new ComboBox
            {
                Location = new Point(150, 398),
                Width = 300,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            typeComboBox.Items.AddRange(new string[] { "Típus1", "Típus2", "Típus3" });

            Label imageLabel = new Label
            {
                Text = "Kép:",
                Location = new Point(20, 440),
                AutoSize = true
            };
            imageButton = new Button
            {
                Text = "Kép kiválasztása",
                Location = new Point(150, 438),
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
                Location = new Point(150, 480),
                Width = 80,
                Height = 30
            };
            saveButton.Click += (sender, e) =>
            {
                NewProductSaveButton_Click();
            };

            Button deleteButton = new Button
            {
                Text = "Törlés",
                Location = new Point(240, 480),
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
            centralPanel.Controls.Add(glutenCheckBox);
            centralPanel.Controls.Add(lactoseCheckBox);
            centralPanel.Controls.Add(eggCheckBox);
            centralPanel.Controls.Add(nutsCheckBox);
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

        private void NewProductSaveButton_Click()
        {
            currentIMGBlob = "wadwdawd";
            if (EmptyCheckNewProduct())
            {
                List<(string, int)> cutomisations = new List<(string, int)>();
                List<string> sauces = new List<string>();

                ReadNewProductOptionsDataFromDataGridView(ref cutomisations, ref sauces);

                CreateNewProductRequest(nameTextBox.Text, Convert.ToInt32(priceNumericUpDown.Value), cutomisations, sauces, descriptionTextBox.Text, typeComboBox.SelectedItem.ToString(), "img", glutenCheckBox.Checked, lactoseCheckBox.Checked, eggCheckBox.Checked, nutsCheckBox.Checked);
            }
            else
            {
                MessageBox.Show("Nem hagyhat üres mezőket");
            }
        }

        private void ReadNewProductOptionsDataFromDataGridView(ref List<(string, int)> customisations, ref List<string> sauces)
        {
            foreach (DataGridViewRow row in optionsDataGridView.Rows)
            {
                if (row.IsNewRow) continue;

                string optionName = row.Cells[0].Value?.ToString() ?? "";

                int price = 0;
                if (row.Cells[1].Value != null)
                {
                    int.TryParse(row.Cells[1].Value.ToString(), out price);
                }

                bool isSauce = false;
                if (row.Cells[2].Value != null)
                {
                    bool.TryParse(row.Cells[2].Value.ToString(), out isSauce);
                }

                if (isSauce)
                {
                    sauces.Add(optionName);
                }
                else
                {
                    customisations.Add((optionName, price));
                }
            }
        }
        private bool EmptyCheckNewProduct()
        {
            if (nameTextBox.Text.Length == 0 || priceNumericUpDown.Value == null || typeComboBox.SelectedIndex == -1 || currentIMGBlob == "empty")
            {
                return false;
            }
            else 
            {
                return true;
            }
        }

        private async void CreateNewProductRequest(string givenName, int givenPrice, List<(string,int)> givenCustomizationOptions, List<string> givenSauceOptions, string givenDescription, string givenType, string givenIMGblob, bool givenGluten, bool givenLactose, bool givenEgg, bool givenNuts)
        {
            MessageBox.Show(givenName + "\n" + givenPrice.ToString() + "\n" + givenCustomizationOptions.Count.ToString() + "\n" + givenSauceOptions.Count.ToString() + "\n" + givenDescription + "\n" + givenType + "\n" + givenIMGblob + " \n" + givenGluten.ToString() + " " + givenLactose.ToString() + " " + givenEgg.ToString() + " " + givenNuts.ToString());

            var d1 = JsonSerializer.Serialize(
                givenCustomizationOptions.Select(option => new { name = option.Item1, price = option.Item2 })
            );

            var d2 = JsonSerializer.Serialize(
                givenSauceOptions.Select(sauce => new { name = sauce })
            );

            string url = "http://localhost:3000/api/v1/create-new-dish";


            var data = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("name", givenName),
                new KeyValuePair<string, string>("price", Convert.ToString(givenPrice)),
                new KeyValuePair<string, string>("sauceOptions", d2),
                new KeyValuePair<string, string>("customizationOptions", d1), 
                new KeyValuePair<string, string>("description", givenDescription),
                new KeyValuePair<string, string>("type", givenType),
                new KeyValuePair<string, string>("image", givenIMGblob), //ide kell még cucc hehe
                new KeyValuePair<string, string>("gluten",givenGluten.ToString().ToLower()),
                new KeyValuePair<string, string>("lactose",givenLactose.ToString().ToLower()),
                new KeyValuePair<string, string>("egg",givenEgg.ToString().ToLower()),
                new KeyValuePair<string, string>("nuts",givenNuts.ToString().ToLower()),
            };

            MessageBox.Show(d1);
            MessageBox.Show(d2);

            try
            {
                using (var client = new HttpClient())
                {
                    var content = new FormUrlEncodedContent(data);
                    HttpResponseMessage response = await client.PostAsync(url, content);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        MessageBox.Show("Sikeres mentés.");
                    }
                    else
                    {
                        MessageBox.Show("Hiba történt a mentés során 1: " + response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Hiba történt a mentés során 2: " + ex.Message);
            }
        }

        private void toolStripLabel9_Click(object sender, EventArgs e)
        {
            var modifications = new List<(string, int, bool)>
            {
                ("", 0, false),
            };

            //Image image = Image.FromFile("C:\\Users\\xboxh\\Pictures\\2024-04-29\\001.jpg");

            var menuItem = new MenuItem(
                id:0,
                name: "",
                price: 0,
                available: false,
                modifications: modifications,
                description: "",
                category: "",
                img: null
            );

            panel4.Visible = true;
            panel4.Dock = DockStyle.Fill;
            panel4.FlowDirection = FlowDirection.LeftToRight;
            panel4.WrapContents = true;
            panel4.Padding = new Padding(20, 20, 20, 200);
            panel4.AutoScroll = true;
            panel4.BackColor = backGroundColor;
            this.Controls.Add(panel4);
            panel4.BringToFront();

            CreateProductEdit(menuItem);
        }

        private void CreateProductEdit(MenuItem item)
        {
            panel4.Controls.Clear();

            Panel centralPanel = new Panel
            {
                Size = new Size(600, 700),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.LightGray,
                Location = new Point(20, 60)
            };

            searchTextBoxDish = new TextBox
            {
                Location = new Point(20, 20),
                Width = 300
            };
            Button searchButton = new Button
            {
                Text = "Keresés",
                Location = new Point(330, 18),
                Width = 80,
                Height = 25
            };
            searchButton.Click += SearchButton_Dish_Click;

            Label nameLabel = new Label
            {
                Text = "Név:",
                Location = new Point(20, 60),
                AutoSize = true
            };
            TextBox nameTextBox = new TextBox
            {
                Location = new Point(150, 58),
                Width = 300,
                Text = item.name
            };

            Label priceLabel = new Label
            {
                Text = "Ár:",
                Location = new Point(20, 100),
                AutoSize = true
            };
            NumericUpDown priceNumericUpDown = new NumericUpDown
            {
                Location = new Point(150, 98),
                Width = 100,
                Minimum = 0,
                Maximum = 1000000,
                DecimalPlaces = 2,
                Value = item.price
            };

            Label optionsLabel = new Label
            {
                Text = "Opciók:",
                Location = new Point(20, 140),
                AutoSize = true
            };
            DataGridView optionsDataGridView = new DataGridView
            {
                Location = new Point(150, 138),
                Width = 400,
                Height = 150,
                AllowUserToAddRows = false
            };

            optionsDataGridView.Columns.Add(new DataGridViewTextBoxColumn { Name = "Opció", HeaderText = "Opció" });
            optionsDataGridView.Columns.Add(new DataGridViewTextBoxColumn { Name = "Felár", HeaderText = "Felár" });
            optionsDataGridView.Columns.Add(new DataGridViewCheckBoxColumn { Name = "Szósz", HeaderText = "Szósz" });

            foreach (var mod in item.modifications)
            {
                optionsDataGridView.Rows.Add(mod.Item1, mod.Item2, mod.Item3);
            }

            optionsDataGridView.CellValueChanged += (sender, e) =>
            {
                if (e.ColumnIndex == optionsDataGridView.Columns["Szósz"].Index && e.RowIndex >= 0)
                {
                    var checkBoxCell = (DataGridViewCheckBoxCell)optionsDataGridView.Rows[e.RowIndex].Cells["Szósz"];
                    var priceCell = (DataGridViewTextBoxCell)optionsDataGridView.Rows[e.RowIndex].Cells["Felár"];

                    if ((bool)checkBoxCell.Value)
                    {
                        priceCell.Value = 0;
                        priceCell.ReadOnly = true;
                    }
                    else
                    {
                        priceCell.ReadOnly = false;
                    }
                }
            };

            optionsDataGridView.CurrentCellDirtyStateChanged += (sender, e) =>
            {
                if (optionsDataGridView.IsCurrentCellDirty && optionsDataGridView.CurrentCell is DataGridViewCheckBoxCell)
                {
                    optionsDataGridView.CommitEdit(DataGridViewDataErrorContexts.Commit);
                }
            };

            Button addOptionButton = new Button
            {
                Text = "+",
                Location = new Point(560, 138),
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
                Location = new Point(560, 178),
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
                Location = new Point(20, 300),
                AutoSize = true
            };
            TextBox descriptionTextBox = new TextBox
            {
                Location = new Point(150, 298),
                Width = 300,
                Height = 80,
                Multiline = true,
                Text = item.description
            };

            Label typeLabel = new Label
            {
                Text = "Típus:",
                Location = new Point(20, 390),
                AutoSize = true
            };
            ComboBox typeComboBox = new ComboBox
            {
                Location = new Point(150, 388),
                Width = 300,
                DropDownStyle = ComboBoxStyle.DropDownList
            };
            typeComboBox.Items.AddRange(allCategories);
            typeComboBox.SelectedItem = item.category;

            Label imageLabel = new Label
            {
                Text = "Kép:",
                Location = new Point(20, 420),
                AutoSize = true
            };
            PictureBox pictureBox = new PictureBox
            {
                Location = new Point(150, 418),
                Size = new Size(150, 150),
                BorderStyle = BorderStyle.FixedSingle,
                SizeMode = PictureBoxSizeMode.Zoom,
                Image = item.img
            };

            Button imageButton = new Button
            {
                Text = "Új kép kiválasztása",
                Location = new Point(310, 548),
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
                        Image selectedImage = Image.FromFile(openFileDialog.FileName);
                        pictureBox.Image = selectedImage;
                        item.img = selectedImage;
                    }
                }
            };

            Label availabilityLabel = new Label
            {
                Text = "Elérhetőség:",
                Location = new Point(20, 590),
                AutoSize = true
            };
            RadioButton availableRadioButton = new RadioButton
            {
                Text = "Elérhető",
                Location = new Point(150, 588),
                AutoSize = true,
                Checked = item.available
            };
            RadioButton notAvailableRadioButton = new RadioButton
            {
                Text = "Nem elérhető",
                Location = new Point(250, 588),
                AutoSize = true,
                Checked = !item.available
            };

            Panel resultsPanel = new Panel
            {
                Location = new Point(640, 60),
                Size = new Size(250, 700),
                BorderStyle = BorderStyle.FixedSingle,
                BackColor = Color.LightGray
            };

            Label resultsLabel = new Label
            {
                Text = "Keresési találatok",
                Location = new Point(10, 10),
                AutoSize = true,
                Font = new Font("Arial", 10, FontStyle.Bold),
            };

            resultsListBoxDish = new ListBox
            {
                Location = new Point(10, 40),
                Size = new Size(230, 650),
            };

            resultsListBoxDish.SelectedIndexChanged += (sender, e) =>
            {
                if (resultsListBoxDish.SelectedItem != null)
                {
                    string selectedItemname = resultsListBoxDish.SelectedItem.ToString();
                    optionsDataGridView.Rows.Clear();
                    selectedMenuItem = selectedMenuItems.FirstOrDefault(menu_item => menu_item.name == selectedItemname);
                    if (selectedMenuItem != null)
                    {
                        nameTextBox.Text = selectedMenuItem.name;
                        priceNumericUpDown.Value = selectedMenuItem.price;
                        descriptionTextBox.Text = selectedMenuItem.description;
                        typeComboBox.SelectedItem = selectedMenuItem.category;
                        pictureBox.Image = selectedMenuItem.img;
                        availableRadioButton.Checked = selectedMenuItem.available;
                        notAvailableRadioButton.Checked = !selectedMenuItem.available;

                        if (selectedMenuItem.modifications != null)
                        {
                            foreach (var mod in selectedMenuItem.modifications)
                            {
                                int rowIndex = optionsDataGridView.Rows.Add();
                                DataGridViewRow row = optionsDataGridView.Rows[rowIndex];

                                row.Cells[0].Value = mod.Item1;
                                row.Cells[1].Value = mod.Item2;
                                row.Cells[2].Value = mod.Item3;
                            }
                        }
                    }
                }
            };

            resultsPanel.Controls.Add(resultsLabel);
            resultsPanel.Controls.Add(resultsListBoxDish);

            centralPanel.Controls.Add(searchTextBoxDish);
            centralPanel.Controls.Add(searchButton);
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
            centralPanel.Controls.Add(pictureBox);
            centralPanel.Controls.Add(imageButton);
            centralPanel.Controls.Add(availabilityLabel);
            centralPanel.Controls.Add(availableRadioButton);
            centralPanel.Controls.Add(notAvailableRadioButton);

            panel4.Controls.Add(centralPanel);
            panel4.Controls.Add(resultsPanel);
        }

        private async void SearchButton_Dish_Click(object sender, EventArgs e)
        {
            //dish keresés gomb

            selectedMenuItems.Clear();
            selectedMenuItems = await getAllMenuItems();

            UpdateResoultsDish(selectedMenuItems);
        }

        public async Task<List<MenuItem>> getAllMenuItems()
        {
            string url = "http://localhost:3000/api/v1/get-dishes";

            HttpResponseMessage response = await sharedClient.GetAsync(url).ConfigureAwait(false);
            List<MenuItem> items = new List<MenuItem>();
            if (response.IsSuccessStatusCode)
            {
                string jsonResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

                using (var jsonDoc = JsonDocument.Parse(jsonResponse))
                {
                    string organizedJson = JsonSerializer.Serialize(jsonDoc.RootElement, new JsonSerializerOptions
                    {
                        WriteIndented = true,
                        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    });

                    JsonElement finalJsonElement = JsonDocument.Parse(organizedJson).RootElement;
                    int jsonArrayLength = finalJsonElement.GetArrayLength();

                    for (int i = 0; i < jsonArrayLength; i++)
                    {

                        int id = finalJsonElement[i].GetProperty("id").GetInt32();
                        string name = finalJsonElement[i].GetProperty("name").GetString();
                        int price = finalJsonElement[i].GetProperty("price").GetInt32();
                        bool available = finalJsonElement[i].GetProperty("available").GetBoolean();
                        string description = finalJsonElement[i].GetProperty("description").GetString();
                        string type = finalJsonElement[i].GetProperty("type").GetString();
                        Image img = null;

                        List<(string, int, bool)> modifications = new List<(string, int, bool)>(); // név, ár, sauce e?

                        if (finalJsonElement[i].GetProperty("sauceOptions").GetString() != null && finalJsonElement[i].GetProperty("customizationOptions").GetString() != null)
                        {

                            JsonElement temp_sauce = JsonDocument.Parse(finalJsonElement[i].GetProperty("sauceOptions").GetString()).RootElement;
                            int lengthtemp2 = temp_sauce.GetArrayLength();
                            for (int j = 0; j < lengthtemp2; j++)
                            {
                                modifications.Add((temp_sauce[j].GetProperty("name").GetString(), 0, true));
                            }

                            JsonElement temp_customisation = JsonDocument.Parse(finalJsonElement[i].GetProperty("customizationOptions").GetString()).RootElement;
                            int lengthtemp = temp_customisation.GetArrayLength();
                            for (int j = 0; j < lengthtemp; j++)
                            {
                                modifications.Add((temp_customisation[j].GetProperty("name").GetString(), temp_customisation[j].GetProperty("price").GetInt32(), false));
                            }
                        }
                        else 
                        {
                            modifications = null;
                        }

                        MenuItem item = new MenuItem(id,name,price,available,modifications,description, type, img);
                        items.Add(item);
                    }


                }
                return items;
            }
            else
            {
                MessageBox.Show("HIBA1");
            }
            


            return new List<MenuItem>();
        }


        private void UpdateResoultsDish(List<MenuItem> menuitems)
        { 
            resultsListBoxDish.Items.Clear();
            string searchString = searchTextBoxDish.Text.ToLower();

            foreach (MenuItem menuitem in menuitems) 
            {
                if (menuitem.name.ToLower().Contains(searchString))
                { 
                    resultsListBoxDish.Items.Add(menuitem.name);
                }
            }
        }

        private async void postDishModifications(string givenItemName, int givenPrice, bool givenAvailable, List<(string, int, bool)> givenModifications, string givenDescription, string givenCategory, Image img)
        {
            //var blob = Convert.To
            MessageBox.Show(givenItemName + " " + Convert.ToString(givenPrice) + " " + Convert.ToString(givenAvailable) + " " + givenDescription + " " + givenCategory);

            //string url = "http://localhost:3000/api/v1/";
            //var credentials = new List<KeyValuePair<string, string>>
            //{
            //    new KeyValuePair<string, string>("name", givenItemName),
            //    new KeyValuePair<string, string>("price", Convert.ToString(givenPrice)),
            //    new KeyValuePair<string, string>("available", Convert.ToString(givenAvailable)),
            //    new KeyValuePair<string, string>("lista", null), //ez kérdéses hogy oldom meg
            //    new KeyValuePair<string, string>("description", givenDescription),
            //    new KeyValuePair<string, string>("category", givenCategory),
            //};

            //try
            //{
            //    using (var client = new HttpClient())
            //    {
            //        var content = new FormUrlEncodedContent(credentials);

            //        HttpResponseMessage response = await client.PostAsync(url, content);
            //        if (response.IsSuccessStatusCode)
            //        {
            //            string responseBody = await response.Content.ReadAsStringAsync();
            //        }
            //        else
            //        {
            //        }
            //    }
            //}
            //catch
            //{
            //}
        }


        private void toolStripLabel10_Click(object sender, EventArgs e)
        {
        }

        public class User
        {
            public string Email { get; set; }
            public string Username { get; set; }

            public User(string email, string username)
            {
                Email = email;
                Username = username;
            }
        }

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

            public MenuItem(int id, string name, int price, bool available, List<(string, int, bool)> modifications, string description, string category, Image img)
            {
                this.id = id;
                this.name = name;
                this.price = price;
                this.available = available;
                this.modifications = modifications;
                this.description = description;
                this.category = category;
                this.img = img;
            }

            public override string ToString()
            {
                var modificationsString = modifications != null && modifications.Count > 0
                    ? string.Join(", ", modifications.Select(m => $"{m.Item1} Price: {m.Item2}, Sauce: {(m.Item3 ? "Yes" : "No")}"))
                    : "No modifications";

                return $"Id: {id}\n"+
                       $"Name: {name}\n" +
                       $"Price: {price}Ft\n" +
                       $"Available: {available}\n" +
                       $"Category: {category}\n" +
                       $"Description: {description}\n" +
                       $"Modifications: {modificationsString}\n" +
                       $"Image: {img?.ToString() ?? "No Image"}";
            }
        }

        private void toolStripLabel4_Click(object sender, EventArgs e)
        {

        }

        private void toolStripLabel5_Click(object sender, EventArgs e)
        {

        }

    }
}