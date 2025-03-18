-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 11, 2025 at 03:18 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `ride_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` float(10,2) NOT NULL,
  `COMMENT` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `ride_id`, `user_id`, `rating`, `COMMENT`) VALUES
(1, 2, 3, 4.70, '\"The ride was smooth, and the driver was very professional. Arrived on time and took the best route.\"'),
(2, 4, 5, 2.50, '\"The driver was friendly, but the ride was bumpy, and the car had an odd smell. Room for improvement.\"'),
(3, 3, 4, 1.80, '\"Not a great experience. The driver was late, and the car wasn’t very clean. Expected better.\"'),
(4, 1, 1, 3.90, '\"Comfortable ride with good music, but the driver missed an exit, making the trip longer.\"'),
(5, 6, 6, 5.00, ' \"Couldn’t have asked for a better trip! Quick, efficient, and the driver was incredibly friendly.\"'),
(6, 5, 2, 3.40, 'The ride was okay, but there were a few issues that could be improved. The driver was friendly and knew the route well, but the car wasn’t very clean, and there was an odd smell inside.');

-- --------------------------------------------------------

--
-- Table structure for table `rides`
--

CREATE TABLE `rides` (
  `ride_id` int NOT NULL,
  `user_id` int NOT NULL,
  `pickup_location` varchar(255) NOT NULL,
  `dropoff_location` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rides`
--

INSERT INTO `rides` (`ride_id`, `user_id`, `pickup_location`, `dropoff_location`, `cost`, `status`) VALUES
(1, 1, 'hyde park', 'ROEHAMPTON UNIVERISTY', 12.50, 'Completed'),
(2, 3, 'emirates stadium', 'ROEHAMPTON UNIVERISTY', 32.00, 'pending '),
(3, 4, 'westfield bush', 'ROEHAMPTON UNIVERSITY', 13.22, 'completed '),
(4, 5, 'G-tech stadium', 'ROEHAMPTON UNIVERSITY', 18.50, 'cancelled'),
(5, 2, '65 MAYGROVE ROAD', 'ROEHAMPTON UNIVERSITY', 7.70, 'ongoing '),
(6, 6, 'CLAPHAM JUNCTION ', 'ROEHAMPTON UNIVERSITY', 34.25, 'ONGOING');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rating` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `firstname`, `lastname`, `email`, `password`, `rating`) VALUES
(1, 'Bukayo\r\n', 'Saka\r\n', 'sak@gmail.com\r\n', 'password1\r\n', 3),
(2, 'MOHAMED', 'FARAH', 'jes@gmail.com', 'password2', 5),
(3, 'USAIN', 'BOLT', 'wil@gmail.com', 'password3', 4),
(4, 'martin', 'odegaard', 'ode@gmail.com', 'password4', 5),
(5, 'declan', 'rice', 'ric@gmail.com', 'password5', 4),
(6, 'kai', 'havertz', 'hav@gmail.com', 'password7', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `rides`
--
ALTER TABLE `rides`
  ADD PRIMARY KEY (`ride_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `rides`
--
ALTER TABLE `rides`
  MODIFY `ride_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
