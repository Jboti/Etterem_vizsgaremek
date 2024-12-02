-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 15. 08:42
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `etterem`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergy`
--

CREATE TABLE `allergy` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `allergy_connection`
--

CREATE TABLE `allergy_connection` (
  `id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `allergy_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `dish`
--

CREATE TABLE `dish` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` date NOT NULL DEFAULT current_timestamp(),
  `price` int(255) NOT NULL,
  `available` tinyint(1) NOT NULL,
  `customization` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`customization`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `order_connection`
--

CREATE TABLE `order_connection` (
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `date` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `customization` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customization`)),
  `dish_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `timestamp` date NOT NULL DEFAULT current_timestamp(),
  `created` date NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `points` int(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `allergy`
--
ALTER TABLE `allergy`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `allergy_connection`
--
ALTER TABLE `allergy_connection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_allergy_connection_dish` (`dish_id`),
  ADD KEY `fk_allergy_connection_allergy` (`allergy_id`);

--
-- A tábla indexei `dish`
--
ALTER TABLE `dish`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `order_connection`
--
ALTER TABLE `order_connection`
  ADD KEY `fk_order_connection_user` (`user_id`),
  ADD KEY `fk_order_connection_purchase` (`order_id`);

--
-- A tábla indexei `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_purchase_dish` (`dish_id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `allergy`
--
ALTER TABLE `allergy`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `allergy_connection`
--
ALTER TABLE `allergy_connection`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `dish`
--
ALTER TABLE `dish`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `allergy_connection`
--
ALTER TABLE `allergy_connection`
  ADD CONSTRAINT `fk_allergy_connection_allergy` FOREIGN KEY (`allergy_id`) REFERENCES `allergy` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_allergy_connection_dish` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `order_connection`
--
ALTER TABLE `order_connection`
  ADD CONSTRAINT `fk_order_connection_purchase` FOREIGN KEY (`order_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_connection_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `fk_purchase_dish` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
