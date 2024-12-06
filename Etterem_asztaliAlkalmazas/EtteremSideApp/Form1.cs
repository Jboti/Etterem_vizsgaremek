using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            var orders = new List<Rendeles>
        {
            new Rendeles(1, "2024-11-01", new List<string>{"Pizza", "Tészta"}, new List<string>{"Nem kérek hagymát"}),
            new Rendeles(2, "2024-11-02", new List<string>{"Hamburger", "Sült krumpli"}, new List<string>{"Extra sajt"}),
            new Rendeles(3, "2024-11-03", new List<string>{"Saláta", "Leves"}, new List<string>{"Nincs öntet"}),
            new Rendeles(4, "2024-11-04", new List<string>{"Pörkölt", "Rizs"}, new List<string>{"Köret: Rizs"}),
            new Rendeles(5, "2024-11-05", new List<string>{"Lángos", "Kefir"}, new List<string>{"Fokhagyma a lángosra"}),
            new Rendeles(6, "2024-11-06", new List<string>{"Töltött káposzta", "Főtt burgonya"}, new List<string>{"Tálalás mellé tejfölt"}),
            new Rendeles(7, "2024-11-07", new List<string>{"Gulyás", "Pogácsa"}, new List<string>{"Tálalás mellé friss kenyér"}),
            new Rendeles(8, "2024-11-08", new List<string>{"Sült csirke", "Sült zöldségek"}, new List<string>{"Tálalás mellé egy kis saláta"}),
            new Rendeles(9, "2024-11-09", new List<string>{"Vegetáriánus pizza", "Leves"}, new List<string>{"Vegán alap"}),
            new Rendeles(10, "2024-11-10", new List<string>{"Steak", "Friss zöldségek"}, new List<string>{"Közepesen átsütve"}),
            new Rendeles(11, "2024-11-11", new List<string>{"Tiramisu", "Kávé"}, new List<string>{"Desszert után egy kis eszpresszó"}),
            new Rendeles(12, "2024-11-12", new List<string>{"Rántott hús", "Krumplipüré"}, new List<string>{"Friss citrommal"}),
            new Rendeles(13, "2024-11-13", new List<string>{"Rakott krumpli", "Savanyú uborka"}, new List<string>{"Friss uborka a rakott krumpli mellé"}),
            new Rendeles(14, "2024-11-14", new List<string>{"Pizzaszendvics", "Kóla"}, new List<string>{"Szósz: paradicsomos"}),
            new Rendeles(15, "2024-11-15", new List<string>{"Csirkemell", "Rizs"}, new List<string>{"Grill zöldségekkel tálalva"}),
            new Rendeles(16, "2024-11-16", new List<string>{"Halászlé", "Kenyér"}, new List<string>{"Friss kenyérrel tálalva"}),
            new Rendeles(17, "2024-11-17", new List<string>{"Sült oldalas", "Sült édesburgonya"}, new List<string>{"Fűszeres mártással tálalva"}),
            new Rendeles(18, "2024-11-18", new List<string>{"Túró Rudi", "Fagyi"}, new List<string>{"Néhány darab gyümölcs mellé"}),
            new Rendeles(19, "2024-11-19", new List<string>{"Húsos rakott tészta", "Zöldsaláta"}, new List<string>{"Fűszeres öntettel"}),
            new Rendeles(20, "2024-11-20", new List<string>{"Gyros", "Sült krumpli"}, new List<string>{"Extra fűszeres szósz"}),
            new Rendeles(21, "2024-11-21", new List<string>{"Tojásos lecsó", "Friss kenyér"}, new List<string>{"Néhány szelet szalámi a lecsóhoz"}),
            new Rendeles(22, "2024-11-22", new List<string>{"Pörkölt", "Krumpli"}, new List<string>{"Friss tejföl a pörkölthöz"}),
            new Rendeles(23, "2024-11-23", new List<string>{"Rántott csirke", "Zöldsaláta"}, new List<string>{"Öntet: majonéz"}),
            new Rendeles(24, "2024-11-24", new List<string>{"Fasírt", "Krumplipüré"}, new List<string>{"Friss petrezselyem a fasírton"}),
            new Rendeles(25, "2024-11-25", new List<string>{"Rakott zöldségek", "Kenyér"}, new List<string>{"Tálalás előtt egy kis vajjal"}),
            new Rendeles(26, "2024-11-26", new List<string>{"Gyümölcssaláta", "Joghurt"}, new List<string>{"Friss bogyós gyümölcsök a tetején"}),
            new Rendeles(27, "2024-11-27", new List<string>{"Gulyásleves", "Friss kenyér"}, new List<string>{"Friss zöldfűszer a leveshez"}),
            new Rendeles(28, "2024-11-28", new List<string>{"Sült kacsa", "Káposzta"}, new List<string>{"Tálalás mellé narancsos szósz"}),
            new Rendeles(29, "2024-11-29", new List<string>{"Túrós csusza", "Tejfölt"}, new List<string>{"Néhány szelet kolbász hozzá"}),
            new Rendeles(30, "2024-11-30", new List<string>{"Sült pisztráng", "Főtt burgonya"}, new List<string>{"Tálalás mellé friss citrom"}),
            new Rendeles(31, "2024-12-01", new List<string>{"Lecsó", "Rántott szelet"}, new List<string>{"Tálalás mellé egy kis pirospaprika"}),
            new Rendeles(32, "2024-12-02", new List<string>{"Sült oldalas", "Pirítt krumpli"}, new List<string>{"Tálalás előtt fűszeres barbecue szósz"}),
            new Rendeles(33, "2024-12-03", new List<string>{"Bableves", "Kenyér"}, new List<string>{"Egy kis tejföl a leveshez"}),
            new Rendeles(34, "2024-12-04", new List<string>{"Húsgombóc", "Káposztás tészta"}, new List<string>{"Tálalás előtt egy kis tejföl"}),
            new Rendeles(35, "2024-12-05", new List<string>{"Tavaszi tekercs", "Édes savanyú szósz"}, new List<string>{"Pikáns ízű szósz"}),
            new Rendeles(36, "2024-12-06", new List<string>{"Pizzás csiga", "Limonádé"}, new List<string>{"Friss bazsalikom a tetején"}),
            new Rendeles(37, "2024-12-07", new List<string>{"Vadas", "Főtt krumpli"}, new List<string>{"Friss kenyér tálalás mellé"}),
            new Rendeles(38, "2024-12-08", new List<string>{"Sült csirkecomb", "Zöldségpüré"}, new List<string>{"Friss fűszerek a csirke bőrén"}),
            new Rendeles(39, "2024-12-09", new List<string>{"Húsos rakott tészta", "Savanyú uborka"}, new List<string>{"Tálalás mellé friss paradicsom"}),
            new Rendeles(40, "2024-12-10", new List<string>{"Hortobágyi palacsinta", "Kávé"}, new List<string>{"Tálalás mellé egy kis csokoládéöntet"}),
            new Rendeles(41, "2024-12-11", new List<string>{"Köményes káposzta", "Kolbász"}, new List<string>{"Friss hagyma a tetején"}),
            new Rendeles(42, "2024-12-12", new List<string>{"Lángos", "Fagylalt"}, new List<string>{"Egy kis porcukor a tetején"}),
            new Rendeles(43, "2024-12-13", new List<string>{"Kifli", "Joghurt"}, new List<string>{"Friss bogyós gyümölcsökkel tálalva"}),
            new Rendeles(44, "2024-12-14", new List<string>{"Húsleves", "Pogácsa"}, new List<string>{"Friss petrezselyem a leves tetején"}),
            new Rendeles(45, "2024-12-15", new List<string>{"Túróscsusza", "Tejfölt"}, new List<string>{"A túrós csusza mellé kolbász is jár"}),
            new Rendeles(46, "2024-12-16", new List<string>{"Vérbél", "Töltött káposzta"}, new List<string>{"Tálalás mellé tejföl és savanyú uborka"}),
            new Rendeles(47, "2024-12-17", new List<string>{"Töltött paprika", "Rizs"}, new List<string>{"A paprika mellé friss tejföl és kenyér"}),
            new Rendeles(48, "2024-12-18", new List<string>{"Tartós pörkölt", "Főtt burgonya"}, new List<string>{"Tálalás előtt tejföllel"}),
            new Rendeles(49, "2024-12-19", new List<string>{"Párolt hús", "Tészta"}, new List<string>{"Fűszeres mártással tálalva"}),
            new Rendeles(50, "2024-12-20", new List<string>{"Tészta carbonara", "Rukkola saláta"}, new List<string>{"Friss parmezán a tetején"}),
            new Rendeles(51, "2024-12-21", new List<string>{"Rántott hallal", "Sült krumpli"}, new List<string>{"Tálalás mellé egy kis majonéz"}),
            new Rendeles(52, "2024-12-22", new List<string>{"Pecsenye csirke", "Zöldséges köret"}, new List<string>{"Friss citromot a csirke mellé"}),
            new Rendeles(53, "2024-12-23", new List<string>{"Rakott burgonya", "Kenyér"}, new List<string>{"Tálalás előtt fűszeres tejföl"}),
            new Rendeles(54, "2024-12-24", new List<string>{"Halászlé", "Főtt tojás"}, new List<string>{"Tálalás mellé pirospaprika és kenyér"}),
            new Rendeles(55, "2024-12-25", new List<string>{"Sült pulyka", "Rizs"}, new List<string>{"Friss töltelék a pulykával"}),
            new Rendeles(56, "2024-12-26", new List<string>{"Fasírt", "Savanyúság"}, new List<string>{"Tálalás előtt egy kis mustár"}),
            new Rendeles(57, "2024-12-27", new List<string>{"Kolbász", "Főtt burgonya"}, new List<string>{"Friss hagyma a kolbász mellé"}),
            new Rendeles(58, "2024-12-28", new List<string>{"Gyros", "Cézár saláta"}, new List<string>{"Extra fokhagymás öntet"}),
            new Rendeles(59, "2024-12-29", new List<string>{"Kacsasült", "Sült zöldség"}, new List<string>{"Tálalás mellé egy kis narancsos szósz"}),
            new Rendeles(60, "2024-12-30", new List<string>{"Steak", "Zöldsaláta"}, new List<string>{"Friss fűszerekkel és olívaolajjal tálalva"}),
            new Rendeles(61, "2025-01-01", new List<string>{"Rakott krumpli", "Savanyú uborka"}, new List<string>{"Tálalás előtt egy kis tejföl"}),
            new Rendeles(62, "2025-01-02", new List<string>{"Mákos guba", "Kávé"}, new List<string>{"Tálalás előtt egy kis porcukor"}),
            new Rendeles(63, "2025-01-03", new List<string>{"Rántott hús", "Krumplisaláta"}, new List<string>{"Tálalás mellé egy kis tejföl"}),
            new Rendeles(64, "2025-01-04", new List<string>{"Lángos", "Fokhagymás tejföl"}, new List<string>{"Friss sajt a tetején"}),
            new Rendeles(65, "2025-01-05", new List<string>{"Túrós palacsinta", "Tej"}, new List<string>{"Friss lekvárral tálalva"}),
            new Rendeles(66, "2025-01-06", new List<string>{"Hortobágyi palacsinta", "Kávé"}, new List<string>{"Tálalás mellé csokoládéöntet"}),
            new Rendeles(67, "2025-01-07", new List<string>{"Sült hús", "Cézár saláta"}, new List<string>{"Extra öntet a salátához"}),
            new Rendeles(68, "2025-01-08", new List<string>{"Tejberizs", "Kakaó"}, new List<string>{"Tálalás előtt friss gyümölcs"}),
            new Rendeles(69, "2025-01-09", new List<string>{"Sült lazac", "Krumplipüré"}, new List<string>{"Friss citrom a lazac mellé"}),
            new Rendeles(70, "2025-01-10", new List<string>{"Töltött tojás", "Tavaszi saláta"}, new List<string>{"Friss fűszerek a tetején"}),
            new Rendeles(71, "2025-01-11", new List<string>{"Gulyás", "Főtt burgonya"}, new List<string>{"Friss tejföl a leveshez"}),
            new Rendeles(72, "2025-01-12", new List<string>{"Rántott csirke", "Sült zöldség"}, new List<string>{"Fűszeres majonéz a csirke mellé"}),
            new Rendeles(73, "2025-01-13", new List<string>{"Főtt tojás", "Kolbász"}, new List<string>{"Friss hagyma a tetején"}),
            new Rendeles(74, "2025-01-14", new List<string>{"Túró Rudi", "Gyümölcssaláta"}, new List<string>{"Tálalás mellé egy kis tejföl"}),
            new Rendeles(75, "2025-01-15", new List<string>{"Csirke pörkölt", "Tészta"}, new List<string>{"Tálalás mellé egy kis tejföl"}),
            new Rendeles(76, "2025-01-16", new List<string>{"Párolt zöldségek", "Rizs"}, new List<string>{"Tálalás előtt egy kis fűszeres olívaolaj"}),
            new Rendeles(77, "2025-01-17", new List<string>{"Köményes káposzta", "Kolbász"}, new List<string>{"Friss hagyma és pirospaprika"}),
            new Rendeles(78, "2025-01-18", new List<string>{"Rakott krumpli", "Savanyú uborka"}, new List<string>{"Tálalás előtt egy kis tejföl"}),
            new Rendeles(79, "2025-01-19", new List<string>{"Húsos tészta", "Zöldsaláta"}, new List<string>{"Fűszeres öntet a salátához"}),
            new Rendeles(80, "2025-01-20", new List<string>{"Lecsó", "Rántott szelet"}, new List<string>{"Tálalás mellé egy kis pirospaprika"})
        };

            DisplayOrders(orders);
        }

        private void DisplayOrders(List<Rendeles> orders)
        {
            FlowLayoutPanel flowLayoutPanel = new FlowLayoutPanel
            {
                Dock = DockStyle.Fill,
                AutoScroll = true,  
                FlowDirection = FlowDirection.LeftToRight,
                WrapContents = true,  
                Padding = new Padding(10)  
            };

            this.Controls.Add(flowLayoutPanel);

            foreach (var order in orders)
            {
                Panel orderPanel = new Panel
                {
                    Width = 150,
                    Height = 200,  
                    Margin = new Padding(10),
                    BackColor = GetRandomColor() 
                };

                Label orderLabel = new Label
                {
                    Text = $"ID: {order.Id}\nDátum: {order.Date}\nTartalom: {string.Join(", ", order.Tartalom)}\nMegjegyzések: {string.Join(", ", order.Megjegyzesek)}",
                    AutoSize = false,
                    Height = 100, 
                    Width = 130,  
                    Location = new Point(10, 10),
                    ForeColor = Color.White,
                    TextAlign = ContentAlignment.TopLeft
                };

                orderPanel.Controls.Add(orderLabel);

                Button doneButton = new Button
                {
                    Text = "Kész",
                    Width = 130,  
                    Height = 30,  
                    Location = new Point(10, orderPanel.Height - 40),  
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

    public class Rendeles
    {
        public int Id { get; set; }
        public string Date { get; set; }
        public List<string> Tartalom { get; set; }
        public List<string> Megjegyzesek { get; set; }

        public Rendeles(int id, string date, List<string> tartalom, List<string> megjegyzesek)
        {
            Id = id;
            Date = date;
            Tartalom = tartalom;
            Megjegyzesek = megjegyzesek;
        }
    }

}
