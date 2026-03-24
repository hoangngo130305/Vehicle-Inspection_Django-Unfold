-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2026 at 04:34 AM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vehicle_inspectionn`
--

-- --------------------------------------------------------

--
-- Table structure for table `authtoken_token`
--

CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authtoken_token`
--

INSERT INTO `authtoken_token` (`key`, `created`, `user_id`) VALUES
('b6e01145d7795b0892e38bd4d995f45fd1a1f1e0', '2026-03-14 07:32:54.839411', 7);

-- --------------------------------------------------------

--
-- Table structure for table `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_group`
--

INSERT INTO `auth_group` (`id`, `name`) VALUES
(1, 'Customer');

-- --------------------------------------------------------

--
-- Table structure for table `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 3, 'add_permission'),
(6, 'Can change permission', 3, 'change_permission'),
(7, 'Can delete permission', 3, 'delete_permission'),
(8, 'Can view permission', 3, 'view_permission'),
(9, 'Can add group', 2, 'add_group'),
(10, 'Can change group', 2, 'change_group'),
(11, 'Can delete group', 2, 'delete_group'),
(12, 'Can view group', 2, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add Token', 8, 'add_token'),
(26, 'Can change Token', 8, 'change_token'),
(27, 'Can delete Token', 8, 'delete_token'),
(28, 'Can view Token', 8, 'view_token'),
(29, 'Can add Token', 9, 'add_tokenproxy'),
(30, 'Can change Token', 9, 'change_tokenproxy'),
(31, 'Can delete Token', 9, 'delete_tokenproxy'),
(32, 'Can view Token', 9, 'view_tokenproxy'),
(33, 'Can add station', 7, 'add_station'),
(34, 'Can change station', 7, 'change_station'),
(35, 'Can delete station', 7, 'delete_station'),
(36, 'Can view station', 7, 'view_station'),
(37, 'Can add checklist item', 11, 'add_checklistitem'),
(38, 'Can change checklist item', 11, 'change_checklistitem'),
(39, 'Can delete checklist item', 11, 'delete_checklistitem'),
(40, 'Can view checklist item', 11, 'view_checklistitem'),
(41, 'Can add otp', 17, 'add_otp'),
(42, 'Can change otp', 17, 'change_otp'),
(43, 'Can delete otp', 17, 'delete_otp'),
(44, 'Can view otp', 17, 'view_otp'),
(45, 'Can add permission', 19, 'add_permission'),
(46, 'Can change permission', 19, 'change_permission'),
(47, 'Can delete permission', 19, 'delete_permission'),
(48, 'Can view permission', 19, 'view_permission'),
(49, 'Can add role', 22, 'add_role'),
(50, 'Can change role', 22, 'change_role'),
(51, 'Can delete role', 22, 'delete_role'),
(52, 'Can view role', 22, 'view_role'),
(53, 'Can add vehicle type', 31, 'add_vehicletype'),
(54, 'Can change vehicle type', 31, 'change_vehicletype'),
(55, 'Can delete vehicle type', 31, 'delete_vehicletype'),
(56, 'Can view vehicle type', 31, 'view_vehicletype'),
(57, 'Can add Customer', 12, 'add_customer'),
(58, 'Can change Customer', 12, 'change_customer'),
(59, 'Can delete Customer', 12, 'delete_customer'),
(60, 'Can view Customer', 12, 'view_customer'),
(61, 'Can add order', 14, 'add_order'),
(62, 'Can change order', 14, 'change_order'),
(63, 'Can delete order', 14, 'delete_order'),
(64, 'Can view order', 14, 'view_order'),
(65, 'Can add order status history', 16, 'add_orderstatushistory'),
(66, 'Can change order status history', 16, 'change_orderstatushistory'),
(67, 'Can delete order status history', 16, 'delete_orderstatushistory'),
(68, 'Can view order status history', 16, 'view_orderstatushistory'),
(69, 'Can add payment', 18, 'add_payment'),
(70, 'Can change payment', 18, 'change_payment'),
(71, 'Can delete payment', 18, 'delete_payment'),
(72, 'Can view payment', 18, 'view_payment'),
(73, 'Can add Staff', 24, 'add_staff'),
(74, 'Can change Staff', 24, 'change_staff'),
(75, 'Can delete Staff', 24, 'delete_staff'),
(76, 'Can view Staff', 24, 'view_staff'),
(77, 'Can add rating', 21, 'add_rating'),
(78, 'Can change rating', 21, 'change_rating'),
(79, 'Can delete rating', 21, 'delete_rating'),
(80, 'Can view rating', 21, 'view_rating'),
(81, 'Can add order checklist', 15, 'add_orderchecklist'),
(82, 'Can change order checklist', 15, 'change_orderchecklist'),
(83, 'Can delete order checklist', 15, 'delete_orderchecklist'),
(84, 'Can view order checklist', 15, 'view_orderchecklist'),
(85, 'Can add notification', 13, 'add_notification'),
(86, 'Can change notification', 13, 'change_notification'),
(87, 'Can delete notification', 13, 'delete_notification'),
(88, 'Can view notification', 13, 'view_notification'),
(89, 'Can add chat message', 10, 'add_chatmessage'),
(90, 'Can change chat message', 10, 'change_chatmessage'),
(91, 'Can delete chat message', 10, 'delete_chatmessage'),
(92, 'Can view chat message', 10, 'view_chatmessage'),
(93, 'Can add system setting', 25, 'add_systemsetting'),
(94, 'Can change system setting', 25, 'change_systemsetting'),
(95, 'Can delete system setting', 25, 'delete_systemsetting'),
(96, 'Can view system setting', 25, 'view_systemsetting'),
(97, 'Can add vehicle', 27, 'add_vehicle'),
(98, 'Can change vehicle', 27, 'change_vehicle'),
(99, 'Can delete vehicle', 27, 'delete_vehicle'),
(100, 'Can view vehicle', 27, 'view_vehicle'),
(101, 'Can add vehicle receipt log', 28, 'add_vehiclereceiptlog'),
(102, 'Can change vehicle receipt log', 28, 'change_vehiclereceiptlog'),
(103, 'Can delete vehicle receipt log', 28, 'delete_vehiclereceiptlog'),
(104, 'Can view vehicle receipt log', 28, 'view_vehiclereceiptlog'),
(105, 'Can add vehicle return log', 30, 'add_vehiclereturnlog'),
(106, 'Can change vehicle return log', 30, 'change_vehiclereturnlog'),
(107, 'Can delete vehicle return log', 30, 'delete_vehiclereturnlog'),
(108, 'Can view vehicle return log', 30, 'view_vehiclereturnlog'),
(109, 'Can add vehicle return additional cost', 29, 'add_vehiclereturnadditionalcost'),
(110, 'Can change vehicle return additional cost', 29, 'change_vehiclereturnadditionalcost'),
(111, 'Can delete vehicle return additional cost', 29, 'delete_vehiclereturnadditionalcost'),
(112, 'Can view vehicle return additional cost', 29, 'view_vehiclereturnadditionalcost'),
(113, 'Can add pricing', 20, 'add_pricing'),
(114, 'Can change pricing', 20, 'change_pricing'),
(115, 'Can delete pricing', 20, 'delete_pricing'),
(116, 'Can view pricing', 20, 'view_pricing'),
(117, 'Can add role permission', 23, 'add_rolepermission'),
(118, 'Can change role permission', 23, 'change_rolepermission'),
(119, 'Can delete role permission', 23, 'delete_rolepermission'),
(120, 'Can view role permission', 23, 'view_rolepermission'),
(121, 'Can add time slot', 26, 'add_timeslot'),
(122, 'Can change time slot', 26, 'change_timeslot'),
(123, 'Can delete time slot', 26, 'delete_timeslot'),
(124, 'Can view time slot', 26, 'view_timeslot'),
(125, 'Can add Hạng mục kiểm tra', 34, 'add_checklistitem'),
(126, 'Can change Hạng mục kiểm tra', 34, 'change_checklistitem'),
(127, 'Can delete Hạng mục kiểm tra', 34, 'delete_checklistitem'),
(128, 'Can view Hạng mục kiểm tra', 34, 'view_checklistitem'),
(129, 'Can add Mã OTP', 40, 'add_otp'),
(130, 'Can change Mã OTP', 40, 'change_otp'),
(131, 'Can delete Mã OTP', 40, 'delete_otp'),
(132, 'Can view Mã OTP', 40, 'view_otp'),
(133, 'Can add permission', 42, 'add_permission'),
(134, 'Can change permission', 42, 'change_permission'),
(135, 'Can delete permission', 42, 'delete_permission'),
(136, 'Can view permission', 42, 'view_permission'),
(137, 'Can add Vai trò', 45, 'add_role'),
(138, 'Can change Vai trò', 45, 'change_role'),
(139, 'Can delete Vai trò', 45, 'delete_role'),
(140, 'Can view Vai trò', 45, 'view_role'),
(141, 'Can add Dịch vụ', 47, 'add_service'),
(142, 'Can change Dịch vụ', 47, 'change_service'),
(143, 'Can delete Dịch vụ', 47, 'delete_service'),
(144, 'Can view Dịch vụ', 47, 'view_service'),
(145, 'Can add Trạm đăng kiểm', 49, 'add_station'),
(146, 'Can change Trạm đăng kiểm', 49, 'change_station'),
(147, 'Can delete Trạm đăng kiểm', 49, 'delete_station'),
(148, 'Can view Trạm đăng kiểm', 49, 'view_station'),
(149, 'Can add Loại xe', 56, 'add_vehicletype'),
(150, 'Can change Loại xe', 56, 'change_vehicletype'),
(151, 'Can delete Loại xe', 56, 'delete_vehicletype'),
(152, 'Can view Loại xe', 56, 'view_vehicletype'),
(153, 'Can add Khách hàng', 32, 'add_customer'),
(154, 'Can change Khách hàng', 32, 'change_customer'),
(155, 'Can delete Khách hàng', 32, 'delete_customer'),
(156, 'Can view Khách hàng', 32, 'view_customer'),
(157, 'Can add Đơn đăng kiểm', 36, 'add_order'),
(158, 'Can change Đơn đăng kiểm', 36, 'change_order'),
(159, 'Can delete Đơn đăng kiểm', 36, 'delete_order'),
(160, 'Can view Đơn đăng kiểm', 36, 'view_order'),
(161, 'Can add Lịch sử trạng thái', 39, 'add_orderstatushistory'),
(162, 'Can change Lịch sử trạng thái', 39, 'change_orderstatushistory'),
(163, 'Can delete Lịch sử trạng thái', 39, 'delete_orderstatushistory'),
(164, 'Can view Lịch sử trạng thái', 39, 'view_orderstatushistory'),
(165, 'Can add Thanh toán', 41, 'add_payment'),
(166, 'Can change Thanh toán', 41, 'change_payment'),
(167, 'Can delete Thanh toán', 41, 'delete_payment'),
(168, 'Can view Thanh toán', 41, 'view_payment'),
(169, 'Can add Nhân viên', 48, 'add_staff'),
(170, 'Can change Nhân viên', 48, 'change_staff'),
(171, 'Can delete Nhân viên', 48, 'delete_staff'),
(172, 'Can view Nhân viên', 48, 'view_staff'),
(173, 'Can add Đánh giá', 44, 'add_rating'),
(174, 'Can change Đánh giá', 44, 'change_rating'),
(175, 'Can delete Đánh giá', 44, 'delete_rating'),
(176, 'Can view Đánh giá', 44, 'view_rating'),
(177, 'Can add Kết quả kiểm tra', 37, 'add_orderchecklist'),
(178, 'Can change Kết quả kiểm tra', 37, 'change_orderchecklist'),
(179, 'Can delete Kết quả kiểm tra', 37, 'delete_orderchecklist'),
(180, 'Can view Kết quả kiểm tra', 37, 'view_orderchecklist'),
(181, 'Can add notification', 35, 'add_notification'),
(182, 'Can change notification', 35, 'change_notification'),
(183, 'Can delete notification', 35, 'delete_notification'),
(184, 'Can view notification', 35, 'view_notification'),
(185, 'Can add chat message', 33, 'add_chatmessage'),
(186, 'Can change chat message', 33, 'change_chatmessage'),
(187, 'Can delete chat message', 33, 'delete_chatmessage'),
(188, 'Can view chat message', 33, 'view_chatmessage'),
(189, 'Can add system setting', 50, 'add_systemsetting'),
(190, 'Can change system setting', 50, 'change_systemsetting'),
(191, 'Can delete system setting', 50, 'delete_systemsetting'),
(192, 'Can view system setting', 50, 'view_systemsetting'),
(193, 'Can add Phương tiện', 52, 'add_vehicle'),
(194, 'Can change Phương tiện', 52, 'change_vehicle'),
(195, 'Can delete Phương tiện', 52, 'delete_vehicle'),
(196, 'Can view Phương tiện', 52, 'view_vehicle'),
(197, 'Can add Nhận xe', 53, 'add_vehiclereceiptlog'),
(198, 'Can change Nhận xe', 53, 'change_vehiclereceiptlog'),
(199, 'Can delete Nhận xe', 53, 'delete_vehiclereceiptlog'),
(200, 'Can view Nhận xe', 53, 'view_vehiclereceiptlog'),
(201, 'Can add Trả xe', 55, 'add_vehiclereturnlog'),
(202, 'Can change Trả xe', 55, 'change_vehiclereturnlog'),
(203, 'Can delete Trả xe', 55, 'delete_vehiclereturnlog'),
(204, 'Can view Trả xe', 55, 'view_vehiclereturnlog'),
(205, 'Can add Chi phí phát sinh', 54, 'add_vehiclereturnadditionalcost'),
(206, 'Can change Chi phí phát sinh', 54, 'change_vehiclereturnadditionalcost'),
(207, 'Can delete Chi phí phát sinh', 54, 'delete_vehiclereturnadditionalcost'),
(208, 'Can view Chi phí phát sinh', 54, 'view_vehiclereturnadditionalcost'),
(209, 'Can add Bảng giá', 43, 'add_pricing'),
(210, 'Can change Bảng giá', 43, 'change_pricing'),
(211, 'Can delete Bảng giá', 43, 'delete_pricing'),
(212, 'Can view Bảng giá', 43, 'view_pricing'),
(213, 'Can add role permission', 46, 'add_rolepermission'),
(214, 'Can change role permission', 46, 'change_rolepermission'),
(215, 'Can delete role permission', 46, 'delete_rolepermission'),
(216, 'Can view role permission', 46, 'view_rolepermission'),
(217, 'Can add Dịch vụ đơn hàng', 38, 'add_orderservice'),
(218, 'Can change Dịch vụ đơn hàng', 38, 'change_orderservice'),
(219, 'Can delete Dịch vụ đơn hàng', 38, 'delete_orderservice'),
(220, 'Can view Dịch vụ đơn hàng', 38, 'view_orderservice'),
(221, 'Can add Khung giờ', 51, 'add_timeslot'),
(222, 'Can change Khung giờ', 51, 'change_timeslot'),
(223, 'Can delete Khung giờ', 51, 'delete_timeslot'),
(224, 'Can view Khung giờ', 51, 'view_timeslot');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `password`, `last_login`, `is_superuser`, `username`, `first_name`, `last_name`, `email`, `is_staff`, `is_active`, `date_joined`) VALUES
(1, 'pbkdf2_sha256$1200000$r1IZvqhxjpvgfwTcEYleoY$56kE0Jt9pxdfY4cCxf1CWBQO6cb1UIIjq3L12WNhkuc=', '2026-03-11 10:40:56.068119', 1, 'admin', '', '', '', 1, 1, '2026-03-11 09:58:50.233900'),
(2, 'pbkdf2_sha256$870000$VQxvZ8qF5YmHxKp6Gk7L2U$9wJX3zRqN8pTvYs4Hf6Kj2L5M8QwE1Rt7Uy9Ip0Oa3Gb=', NULL, 0, '0912345678', 'An', 'Nguyễn Văn', 'nguyenvanan@example.com', 0, 1, '2026-03-13 09:49:59.000000'),
(3, 'pbkdf2_sha256$870000$VQxvZ8qF5YmHxKp6Gk7L2U$9wJX3zRqN8pTvYs4Hf6Kj2L5M8QwE1Rt7Uy9Ip0Oa3Gb=', NULL, 0, '0923456789', 'Bình', 'Trần Thị', 'tranthibinh@example.com', 0, 1, '2026-03-13 09:49:59.000000'),
(4, 'pbkdf2_sha256$870000$VQxvZ8qF5YmHxKp6Gk7L2U$9wJX3zRqN8pTvYs4Hf6Kj2L5M8QwE1Rt7Uy9Ip0Oa3Gb=', NULL, 0, '0934567890', 'Cường', 'Lê Văn', 'levancuong@example.com', 0, 1, '2026-03-13 09:49:59.000000'),
(5, 'pbkdf2_sha256$870000$VQxvZ8qF5YmHxKp6Gk7L2U$9wJX3zRqN8pTvYs4Hf6Kj2L5M8QwE1Rt7Uy9Ip0Oa3Gb=', NULL, 0, '0945678901', 'Dung', 'Phạm Thị', 'phamthidung@example.com', 0, 1, '2026-03-13 09:49:59.000000'),
(6, 'pbkdf2_sha256$870000$VQxvZ8qF5YmHxKp6Gk7L2U$9wJX3zRqN8pTvYs4Hf6Kj2L5M8QwE1Rt7Uy9Ip0Oa3Gb=', NULL, 0, '0956789012', 'Em', 'Hoàng Văn', 'hoangvanem@example.com', 0, 1, '2026-03-13 09:49:59.000000'),
(7, 'pbkdf2_sha256$1200000$f73YGDCr02cmLuXVHMHlNz$5DU7jkwrns0qVjK/cfCSOtOqXy5D9YMuW42/O2Sz2i0=', '2026-03-14 07:33:07.453443', 0, '0382786317', '', '', '', 0, 1, '2026-03-14 07:32:53.978146');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_user_groups`
--

INSERT INTO `auth_user_groups` (`id`, `user_id`, `group_id`) VALUES
(1, 7, 1);

-- --------------------------------------------------------

--
-- Table structure for table `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) NOT NULL,
  `sender_type` varchar(20) NOT NULL,
  `message_type` varchar(20) NOT NULL,
  `message_text` longtext DEFAULT NULL,
  `media_url` varchar(500) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `sender_user_id` int(11) DEFAULT NULL,
  `sender_customer_id` bigint(20) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  `sender_staff_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `checklist_items`
--

CREATE TABLE `checklist_items` (
  `id` bigint(20) NOT NULL,
  `item_key` varchar(100) NOT NULL,
  `item_label` varchar(200) NOT NULL,
  `category` varchar(20) NOT NULL,
  `display_order` int(11) NOT NULL,
  `require_photo` tinyint(1) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `checklist_items`
--

INSERT INTO `checklist_items` (`id`, `item_key`, `item_label`, `category`, `display_order`, `require_photo`, `status`, `created_at`, `updated_at`) VALUES
(1, 'brake_system', 'Hệ thống phanh', 'safety', 1, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(2, 'steering_system', 'Hệ thống lái', 'safety', 2, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(3, 'suspension', 'Hệ thống treo', 'safety', 3, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(4, 'lights_front', 'Đèn chiếu sáng phía trước', 'safety', 4, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(5, 'lights_rear', 'Đèn phía sau', 'safety', 5, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(6, 'horn', 'Còi xe', 'safety', 6, 0, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(7, 'windshield', 'Kính chắn gió', 'safety', 7, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(8, 'wiper', 'Gạt nước', 'safety', 8, 0, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(9, 'mirrors', 'Gương chiếu hậu', 'safety', 9, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(10, 'tires', 'Lốp xe', 'safety', 10, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(11, 'seatbelts', 'Dây an toàn', 'safety', 11, 0, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(12, 'doors_locks', 'Cửa và khóa', 'safety', 12, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(13, 'emission_co', 'Nồng độ CO', 'emission', 13, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(14, 'emission_hc', 'Nồng độ HC', 'emission', 14, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(15, 'emission_smoke', 'Độ khói (diesel)', 'emission', 15, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(16, 'chassis_body', 'Khung gầm và thân xe', 'both', 16, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(17, 'engine_mount', 'Giá đỡ động cơ', 'both', 17, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(18, 'fuel_system', 'Hệ thống nhiên liệu', 'both', 18, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(19, 'exhaust_system', 'Hệ thống xả', 'both', 19, 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(20, 'battery', 'Bình điện', 'both', 20, 0, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `id_number` varchar(20) DEFAULT NULL,
  `id_issued_date` date DEFAULT NULL,
  `id_issued_place` varchar(200) DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `facebook_id` varchar(255) DEFAULT NULL,
  `apple_id` varchar(255) DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL,
  `email_verified` tinyint(1) NOT NULL,
  `total_orders` int(11) NOT NULL,
  `completed_orders` int(11) NOT NULL,
  `total_spent` decimal(12,2) NOT NULL,
  `loyalty_points` int(11) NOT NULL,
  `membership_tier` varchar(20) NOT NULL,
  `preferred_language` varchar(10) NOT NULL,
  `timezone` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `full_name`, `phone`, `avatar_url`, `date_of_birth`, `gender`, `id_number`, `id_issued_date`, `id_issued_place`, `address`, `city`, `district`, `ward`, `google_id`, `facebook_id`, `apple_id`, `phone_verified`, `email_verified`, `total_orders`, `completed_orders`, `total_spent`, `loyalty_points`, `membership_tier`, `preferred_language`, `timezone`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'Nguyễn Văn An', '0912345678', NULL, '1985-03-15', 'male', '079085012345', '2015-01-10', 'Công an TP Quy Nhơn', '123 Trần Hưng Đạo, Quy Nhơn', 'Bình Định', 'Quy Nhơn', 'Nguyễn Văn Cừ', NULL, NULL, NULL, 1, 0, 3, 2, 1500000.00, 150, 'silver', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 2),
(2, 'Trần Thị Bình', '0923456789', NULL, '1990-07-20', 'female', '079090056789', '2016-05-20', 'Công an TP Pleiku', '456 Hùng Vương, Pleiku', 'Gia Lai', 'Pleiku', 'Hoa Lư', NULL, NULL, NULL, 1, 1, 5, 5, 3000000.00, 300, 'gold', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 3),
(3, 'Lê Văn Cường', '0934567890', NULL, '1988-11-05', 'male', '001088087654', '2017-08-15', 'Công an TP Hà Nội', '789 Láng Hạ, Hà Nội', 'Hà Nội', 'Đống Đa', 'Láng Hạ', NULL, NULL, NULL, 1, 0, 1, 0, 0.00, 0, 'bronze', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 4),
(4, 'Phạm Thị Dung', '0945678901', NULL, '1992-02-28', 'female', '048092034567', '2018-12-10', 'Công an TP Đà Nẵng', '321 Nguyễn Văn Linh, Đà Nẵng', 'Đà Nẵng', 'Hải Châu', 'Thanh Bình', NULL, NULL, NULL, 1, 1, 2, 1, 800000.00, 80, 'silver', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 5),
(5, 'Hoàng Văn Em', '0956789012', NULL, '1995-09-12', 'male', '079095098765', '2020-03-25', 'Công an TP An Khê', '654 Quang Trung, An Khê', 'Gia Lai', 'An Khê', 'An Bình', NULL, NULL, NULL, 0, 0, 0, 0, 0.00, 0, 'bronze', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 6),
(6, 'hi', '0382786317', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 0.00, 0, 'bronze', 'vi', 'Asia/Ho_Chi_Minh', '2026-03-14 07:32:54.806694', '2026-03-14 07:32:54.806734', 7);

-- --------------------------------------------------------

--
-- Table structure for table `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_admin_log`
--

INSERT INTO `django_admin_log` (`id`, `action_time`, `object_id`, `object_repr`, `action_flag`, `change_message`, `content_type_id`, `user_id`) VALUES
(1, '2026-03-13 03:06:28.112099', '2', 'Trạm Đăng Kiểm Pleiku', 2, '[{\"changed\": {\"fields\": [\"Address\"]}}]', 7, 1),
(2, '2026-03-18 00:55:59.411346', '11', '33 - ê e', 2, '[{\"changed\": {\"fields\": [\"License plate\", \"Manufacture year\"]}}]', 52, 1),
(3, '2026-03-18 00:59:53.906211', '12', 'e - ê e', 3, '', 52, 1),
(4, '2026-03-18 01:22:04.425400', '10', 'gff', 2, '[{\"changed\": {\"fields\": [\"Type code\", \"Description\"]}}]', 56, 1),
(5, '2026-03-18 01:22:06.431749', '10', 'gff', 2, '[]', 56, 1),
(6, '2026-03-18 01:22:07.226067', '10', 'gff', 2, '[]', 56, 1),
(7, '2026-03-18 01:55:38.115892', '13', 'eddddddddd - ê e', 2, '[{\"changed\": {\"fields\": [\"License plate\"]}}]', 52, 1),
(8, '2026-03-18 01:55:56.108013', '13', '766445 - ê e', 2, '[{\"changed\": {\"fields\": [\"License plate\"]}}]', 52, 1),
(9, '2026-03-18 02:01:33.652699', '1', 'Trạm Đăng Kiểm An Khê', 2, '[{\"changed\": {\"fields\": [\"Address\"]}}]', 49, 1),
(10, '2026-03-18 02:01:50.673502', '10', '81E1-88888 - Kia Morning', 2, '[]', 52, 1),
(11, '2026-03-18 02:01:59.949137', '10', '81E1-888 - Kia Morning', 2, '[{\"changed\": {\"fields\": [\"License plate\"]}}]', 52, 1),
(12, '2026-03-18 02:43:07.838732', '22', 'ffffffff', 2, '[{\"changed\": {\"fields\": [\"Item key\"]}}]', 34, 1);

-- --------------------------------------------------------

--
-- Table structure for table `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(33, 'api', 'chatmessage'),
(34, 'api', 'checklistitem'),
(32, 'api', 'customer'),
(35, 'api', 'notification'),
(36, 'api', 'order'),
(37, 'api', 'orderchecklist'),
(38, 'api', 'orderservice'),
(39, 'api', 'orderstatushistory'),
(40, 'api', 'otp'),
(41, 'api', 'payment'),
(42, 'api', 'permission'),
(43, 'api', 'pricing'),
(44, 'api', 'rating'),
(45, 'api', 'role'),
(46, 'api', 'rolepermission'),
(47, 'api', 'service'),
(48, 'api', 'staff'),
(49, 'api', 'station'),
(50, 'api', 'systemsetting'),
(51, 'api', 'timeslot'),
(52, 'api', 'vehicle'),
(53, 'api', 'vehiclereceiptlog'),
(54, 'api', 'vehiclereturnadditionalcost'),
(55, 'api', 'vehiclereturnlog'),
(56, 'api', 'vehicletype'),
(2, 'auth', 'group'),
(3, 'auth', 'permission'),
(4, 'auth', 'user'),
(8, 'authtoken', 'token'),
(9, 'authtoken', 'tokenproxy'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session'),
(10, 'shop', 'chatmessage'),
(11, 'shop', 'checklistitem'),
(12, 'shop', 'customer'),
(13, 'shop', 'notification'),
(14, 'shop', 'order'),
(15, 'shop', 'orderchecklist'),
(16, 'shop', 'orderstatushistory'),
(17, 'shop', 'otp'),
(18, 'shop', 'payment'),
(19, 'shop', 'permission'),
(20, 'shop', 'pricing'),
(21, 'shop', 'rating'),
(22, 'shop', 'role'),
(23, 'shop', 'rolepermission'),
(24, 'shop', 'staff'),
(7, 'shop', 'station'),
(25, 'shop', 'systemsetting'),
(26, 'shop', 'timeslot'),
(27, 'shop', 'vehicle'),
(28, 'shop', 'vehiclereceiptlog'),
(29, 'shop', 'vehiclereturnadditionalcost'),
(30, 'shop', 'vehiclereturnlog'),
(31, 'shop', 'vehicletype');

-- --------------------------------------------------------

--
-- Table structure for table `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2026-03-11 09:56:13.756865'),
(2, 'auth', '0001_initial', '2026-03-11 09:56:13.949284'),
(3, 'admin', '0001_initial', '2026-03-11 09:56:13.996458'),
(4, 'admin', '0002_logentry_remove_auto_add', '2026-03-11 09:56:14.002726'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2026-03-11 09:56:14.009557'),
(6, 'contenttypes', '0002_remove_content_type_name', '2026-03-11 09:56:14.063638'),
(7, 'auth', '0002_alter_permission_name_max_length', '2026-03-11 09:56:14.084518'),
(8, 'auth', '0003_alter_user_email_max_length', '2026-03-11 09:56:14.101891'),
(9, 'auth', '0004_alter_user_username_opts', '2026-03-11 09:56:14.110521'),
(10, 'auth', '0005_alter_user_last_login_null', '2026-03-11 09:56:14.135394'),
(11, 'auth', '0006_require_contenttypes_0002', '2026-03-11 09:56:14.136945'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2026-03-11 09:56:14.145815'),
(13, 'auth', '0008_alter_user_username_max_length', '2026-03-11 09:56:14.159081'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2026-03-11 09:56:14.178703'),
(15, 'auth', '0010_alter_group_name_max_length', '2026-03-11 09:56:14.198337'),
(16, 'auth', '0011_update_proxy_permissions', '2026-03-11 09:56:14.206428'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2026-03-11 09:56:14.221285'),
(18, 'sessions', '0001_initial', '2026-03-11 09:56:14.239069'),
(19, 'stations', '0001_initial', '2026-03-11 09:56:30.423720'),
(20, 'shop', '0001_initial', '2026-03-12 03:36:01.944084'),
(21, 'authtoken', '0001_initial', '2026-03-12 07:58:09.761031'),
(22, 'authtoken', '0002_auto_20160226_1747', '2026-03-12 07:58:09.783015'),
(23, 'authtoken', '0003_tokenproxy', '2026-03-12 07:58:09.785852'),
(24, 'authtoken', '0004_alter_tokenproxy_options', '2026-03-12 07:58:09.793786'),
(25, 'shop', '0002_checklistitem_otp_permission_role_vehicletype_and_more', '2026-03-12 07:58:11.685890'),
(26, 'shop', '0003_alter_order_driver_location_updated_at', '2026-03-13 06:48:53.103501'),
(27, 'api', '0001_initial', '2026-03-17 01:39:23.359982'),
(28, 'api', '0002_remove_pricing_document_fee_and_more', '2026-03-17 02:45:57.691929'),
(29, 'api', '0003_alter_vehiclereturnlog_status', '2026-03-18 08:55:05.208129');

-- --------------------------------------------------------

--
-- Table structure for table `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `django_session`
--

INSERT INTO `django_session` (`session_key`, `session_data`, `expire_date`) VALUES
('17gmlzadz97ne5n8uaff5oor480uabm1', '.eJxVjEEOgjAQRe_StWmKwLTj0j1nIDPTwaKmTSisjHdXEha6_e-9_zIjbWsat6rLOEdzMd6cfjcmeWjeQbxTvhUrJa_LzHZX7EGrHUrU5_Vw_w4S1fStzwgCqITOSdsRegg9UyM9TCzQuBBUGSIjukl6pRgDuZZ16jg0HtC8P-4YOHs:1w1JUU:P7NfHskRRl-VsP5ld5oSHXkmyLJn_Z9CnEPbVPXIIaU', '2026-03-28 07:32:54.843955'),
('7y3w2km9bvnehnd6k2y8ij8yfx7pdgkb', '.eJxVjEEOgjAQRe_StWmKwLTj0j1nIDPTwaKmTSisjHdXEha6_e-9_zIjbWsat6rLOEdzMd6cfjcmeWjeQbxTvhUrJa_LzHZX7EGrHUrU5_Vw_w4S1fStzwgCqITOSdsRegg9UyM9TCzQuBBUGSIjukl6pRgDuZZ16jg0HtC8P-4YOHs:1w1JUh:75-7MN10iWNy_oK_3pE15NS_-G8sqyB0F9yyYeVJa-w', '2026-03-28 07:33:07.456923'),
('8ri27ma0ug0xiyure7j9vwsl6q64aumv', '.eJxVjEEOwiAQRe_C2hBGaCEu3XsGMjAzUjWQlHZlvLtt0oVu_3vvv1XEdSlx7TzHidRFgTr9bgnzk-sO6IH13nRudZmnpHdFH7TrWyN-XQ_376BgL1s95my9GEKG5ClgtgxOhL14NKMNBANvyEgw5wBiDTmQnMQFhgHFqM8XEF444g:1w0Gzo:3RgwvrNONa1fn4riFSQdruMcB3dpgeY47Qpe9ck4KQc', '2026-03-25 10:40:56.070862');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `recipient_type` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` longtext NOT NULL,
  `notification_type` varchar(30) NOT NULL,
  `related_object_type` varchar(50) DEFAULT NULL,
  `related_object_id` bigint(20) DEFAULT NULL,
  `action_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `priority` varchar(20) NOT NULL,
  `scheduled_for` datetime(6) DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `recipient_customer_id` bigint(20) DEFAULT NULL,
  `recipient_user_id` int(11) DEFAULT NULL,
  `recipient_staff_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `order_code` varchar(30) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time(6) NOT NULL,
  `estimated_amount` decimal(10,2) NOT NULL,
  `additional_amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `priority` varchar(20) NOT NULL,
  `inspection_result` varchar(20) NOT NULL,
  `customer_notes` longtext DEFAULT NULL,
  `staff_notes` longtext DEFAULT NULL,
  `cancel_reason` longtext DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `confirmed_at` datetime(6) DEFAULT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `pickup_address` longtext DEFAULT NULL,
  `pickup_lat` decimal(10,8) DEFAULT NULL,
  `pickup_lng` decimal(11,8) DEFAULT NULL,
  `driver_current_lat` decimal(10,8) DEFAULT NULL,
  `driver_current_lng` decimal(11,8) DEFAULT NULL,
  `driver_location_updated_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint(20) NOT NULL,
  `station_id` bigint(20) NOT NULL,
  `assigned_staff_id` bigint(20) DEFAULT NULL,
  `vehicle_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `appointment_date`, `appointment_time`, `estimated_amount`, `additional_amount`, `status`, `priority`, `inspection_result`, `customer_notes`, `staff_notes`, `cancel_reason`, `started_at`, `completed_at`, `created_at`, `updated_at`, `confirmed_at`, `cancelled_at`, `pickup_address`, `pickup_lat`, `pickup_lng`, `driver_current_lat`, `driver_current_lng`, `driver_location_updated_at`, `customer_id`, `station_id`, `assigned_staff_id`, `vehicle_id`) VALUES
(1, 'DK20260310ABC123', '2026-03-10', '08:00:00.000000', 236500.00, 0.00, 'completed', 'normal', 'pass', 'Xe chạy bình thường', 'Đã kiểm tra xong, xe đạt', NULL, '2026-03-10 08:15:00.000000', '2026-03-10 10:30:00.000000', '2026-03-08 09:00:00.000000', '2026-03-10 10:30:00.000000', '2026-03-09 14:00:00.000000', NULL, '123 Trần Hưng Đạo, Quy Nhơn', 13.77648900, 109.22368800, NULL, NULL, NULL, 1, 1, NULL, 1),
(2, 'DK20260313XYZ456', '2026-03-13', '09:00:00.000000', 500500.00, 50000.00, 'in_progress', 'normal', 'not_started', 'Kiểm tra kỹ phanh', 'Đang kiểm tra', NULL, '2026-03-13 09:10:00.000000', NULL, '2026-03-11 10:00:00.000000', '2026-03-13 09:10:00.000000', '2026-03-12 16:00:00.000000', NULL, '123 Trần Hưng Đạo, Quy Nhơn', 13.77648900, 109.22368800, NULL, NULL, NULL, 1, 1, NULL, 2),
(3, 'DK20260314DEF789', '2026-03-14', '07:30:00.000000', 500500.00, 0.00, 'confirmed', 'high', 'not_started', NULL, NULL, NULL, NULL, NULL, '2026-03-12 14:00:00.000000', '2026-03-13 10:00:00.000000', '2026-03-13 10:00:00.000000', NULL, '456 Hùng Vương, Pleiku', 13.98333300, 108.00000000, NULL, NULL, NULL, 2, 2, NULL, 3),
(4, 'DK20260315GHI012', '2026-03-15', '08:30:00.000000', 588500.00, 0.00, 'assigned', 'urgent', 'not_started', 'Cần kiểm tra gấp', 'Đã phân công kỹ thuật viên', NULL, NULL, NULL, '2026-03-12 15:00:00.000000', '2026-03-13 11:00:00.000000', '2026-03-13 11:00:00.000000', NULL, '456 Hùng Vương, Pleiku', 13.98333300, 108.00000000, NULL, NULL, NULL, 2, 2, NULL, 4),
(5, 'DK20260316JKL345', '2026-03-16', '09:30:00.000000', 236500.00, 0.00, 'pending', 'low', 'not_started', NULL, NULL, NULL, NULL, NULL, '2026-03-13 08:00:00.000000', '2026-03-13 08:00:00.000000', NULL, NULL, '456 Hùng Vương, Pleiku', 13.98333300, 108.00000000, NULL, NULL, NULL, 2, 2, NULL, 5),
(6, 'DK20260311MNO678', '2026-03-11', '08:00:00.000000', 773500.00, 0.00, 'completed', 'normal', 'pass', 'Xe tải mới mua', 'Kiểm tra hoàn tất, xe đạt', NULL, '2026-03-11 08:30:00.000000', '2026-03-11 11:00:00.000000', '2026-03-09 09:00:00.000000', '2026-03-11 11:00:00.000000', '2026-03-10 14:00:00.000000', NULL, '789 Láng Hạ, Hà Nội', 21.02776800, 105.80661800, NULL, NULL, NULL, 3, 6, NULL, 6),
(7, 'DK20260312PQR901', '2026-03-12', '09:00:00.000000', 500500.00, 100000.00, 'completed', 'high', 'fail', 'Kiểm tra kỹ hệ thống phanh', 'Phanh sau không đạt, cần sửa', NULL, '2026-03-12 09:15:00.000000', '2026-03-12 11:45:00.000000', '2026-03-10 10:00:00.000000', '2026-03-12 11:45:00.000000', '2026-03-11 16:00:00.000000', NULL, '321 Nguyễn Văn Linh, Đà Nẵng', 16.04738800, 108.20623200, NULL, NULL, NULL, 4, 4, NULL, 7),
(8, 'DK20260313STU234', '2026-03-13', '10:00:00.000000', 588500.00, 0.00, 'in_progress', 'normal', 'not_started', NULL, 'Đang kiểm tra khí thải', NULL, '2026-03-13 10:20:00.000000', NULL, '2026-03-11 11:00:00.000000', '2026-03-13 10:20:00.000000', '2026-03-12 17:00:00.000000', NULL, '321 Nguyễn Văn Linh, Đà Nẵng', 16.04738800, 108.20623200, NULL, NULL, NULL, 4, 4, NULL, 8),
(9, 'DK20260314VWX567', '2026-03-14', '14:00:00.000000', 236500.00, 0.00, 'cancelled', 'low', 'not_started', 'Đặt nhầm ngày', NULL, 'Khách hàng yêu cầu hủy do bận', NULL, NULL, '2026-03-12 16:00:00.000000', '2026-03-13 12:00:00.000000', '2026-03-13 09:00:00.000000', '2026-03-13 12:00:00.000000', '654 Quang Trung, An Khê', 13.99550400, 108.67244600, NULL, NULL, NULL, 5, 1, NULL, 9),
(10, 'DK20260315YZA890', '2026-03-15', '15:00:00.000000', 500500.00, 0.00, 'confirmed', 'normal', 'not_started', 'Xe mới mua cần kiểm tra lần đầu', NULL, NULL, NULL, NULL, '2026-03-12 17:00:00.000000', '2026-03-13 13:00:00.000000', '2026-03-13 13:00:00.000000', NULL, '654 Quang Trung, An Khê', 13.99550400, 108.67244600, NULL, NULL, NULL, 5, 1, NULL, 10),
(11, 'DK20260305BCD123', '2026-03-05', '13:30:00.000000', 588500.00, 0.00, 'completed', 'normal', 'pass', NULL, 'Hoàn tất kiểm tra định kỳ', NULL, '2026-03-05 13:45:00.000000', '2026-03-05 16:00:00.000000', '2026-03-03 10:00:00.000000', '2026-03-05 16:00:00.000000', '2026-03-04 14:00:00.000000', NULL, '456 Hùng Vương, Pleiku', 13.98333300, 108.00000000, NULL, NULL, NULL, 2, 2, NULL, 4),
(12, 'DK20260308EFG456', '2026-03-08', '14:30:00.000000', 500500.00, 0.00, 'completed', 'normal', 'pass', NULL, 'Xe đạt chuẩn', NULL, '2026-03-08 14:45:00.000000', '2026-03-08 16:30:00.000000', '2026-03-06 11:00:00.000000', '2026-03-08 16:30:00.000000', '2026-03-07 15:00:00.000000', NULL, '456 Hùng Vương, Pleiku', 13.98333300, 108.00000000, NULL, NULL, NULL, 2, 2, NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `order_checklist`
--

CREATE TABLE `order_checklist` (
  `id` bigint(20) NOT NULL,
  `check_type` varchar(20) DEFAULT NULL,
  `is_checked` tinyint(1) NOT NULL,
  `result` varchar(20) DEFAULT NULL,
  `measured_value` varchar(100) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `checked_at` datetime(6) DEFAULT NULL,
  `checklist_item_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `checked_by_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_services`
--

CREATE TABLE `order_services` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  `service_name` varchar(200) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` bigint(20) NOT NULL,
  `from_status` varchar(20) NOT NULL,
  `to_status` varchar(20) NOT NULL,
  `notes` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `changed_by_id` int(11) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otp_verification`
--

CREATE TABLE `otp_verification` (
  `id` bigint(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `purpose` varchar(50) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp_verification`
--

INSERT INTO `otp_verification` (`id`, `phone`, `otp_code`, `purpose`, `is_verified`, `expires_at`, `verified_at`, `created_at`) VALUES
(1, '0382786317', '669572', 'register', 1, '2026-03-14 07:37:41.301381', '2026-03-14 07:32:54.827378', '2026-03-14 07:32:41.301824');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL,
  `transaction_code` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(30) NOT NULL,
  `payment_type` varchar(20) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `vietqr_code_url` varchar(500) DEFAULT NULL,
  `qr_content` longtext DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `payment_proof_url` varchar(500) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `permission_code` varchar(100) NOT NULL,
  `permission_name` varchar(150) NOT NULL,
  `module` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pricings`
--

CREATE TABLE `pricings` (
  `id` bigint(20) NOT NULL,
  `inspection_fee` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_type_id` bigint(20) NOT NULL,
  `registration_fee` decimal(10,2) NOT NULL,
  `service_fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pricings`
--

INSERT INTO `pricings` (`id`, `inspection_fee`, `total_amount`, `effective_from`, `effective_to`, `status`, `created_at`, `updated_at`, `vehicle_type_id`, `registration_fee`, `service_fee`) VALUES
(1, 150000.00, 236500.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1, 0.00, 0.00),
(2, 350000.00, 500500.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2, 0.00, 0.00),
(3, 420000.00, 588500.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3, 0.00, 0.00),
(4, 550000.00, 773500.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4, 0.00, 0.00),
(5, 800000.00, 1122000.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5, 0.00, 0.00),
(6, 950000.00, 1342000.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6, 0.00, 0.00),
(7, 1200000.00, 1726000.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7, 0.00, 0.00),
(8, 380000.00, 528500.00, '2026-01-01', NULL, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 8, 0.00, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) NOT NULL,
  `overall_rating` int(11) NOT NULL,
  `service_rating` int(11) DEFAULT NULL,
  `staff_rating` int(11) DEFAULT NULL,
  `facility_rating` int(11) DEFAULT NULL,
  `comment` longtext DEFAULT NULL,
  `pros` longtext DEFAULT NULL,
  `cons` longtext DEFAULT NULL,
  `photos_url` longtext DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `admin_response` longtext DEFAULT NULL,
  `responded_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `responded_by_id` bigint(20) DEFAULT NULL,
  `staff_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` longtext DEFAULT NULL,
  `level` int(11) NOT NULL,
  `color` varchar(20) NOT NULL,
  `priority` int(11) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `code`, `description`, `level`, `color`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'ADMIN', 'Quản trị viên hệ thống', 100, 'red', 1, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(2, 'Quản lý trạm', 'STATION_MANAGER', 'Quản lý trạm đăng kiểm', 80, 'blue', 2, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(3, 'Kỹ thuật viên cao cấp', 'SENIOR_INSPECTOR', 'Kỹ thuật viên kiểm tra cao cấp', 60, 'green', 3, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(4, 'Kỹ thuật viên', 'INSPECTOR', 'Kỹ thuật viên kiểm tra', 50, 'orange', 4, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(5, 'Lễ tân', 'RECEPTIONIST', 'Nhân viên tiếp nhận xe', 30, 'purple', 5, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(6, 'Thu ngân', 'CASHIER', 'Nhân viên thu ngân', 30, 'yellow', 6, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(7, 'Tài xế', 'DRIVER', 'Tài xế đưa đón xe', 20, 'gray', 7, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `permission_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) NOT NULL,
  `service_code` varchar(20) NOT NULL,
  `service_name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'other',
  `base_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_code`, `service_name`, `description`, `category`, `base_price`, `is_required`, `status`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'SV001', 'Kiểm tra an toàn kỹ thuật', 'Kiểm tra phanh, đèn, gương, khung xe, hệ thống lái, hệ thống treo', 'inspection', 340000.00, 1, 'active', 1, '2026-03-17 08:59:12.000000', '2026-03-17 08:59:12.000000'),
(2, 'SV002', 'Kiểm tra khí thải', 'Đo nồng độ khí CO, HC, NOx cho xe xăng/dầu', 'emission', 120000.00, 1, 'active', 2, '2026-03-17 08:59:12.000000', '2026-03-17 08:59:12.000000'),
(3, 'SV003', 'Cấp tem đăng kiểm', 'Cấp tem đăng kiểm mới cho xe đạt chuẩn', 'document', 50000.00, 0, 'active', 3, '2026-03-17 08:59:12.000000', '2026-03-17 08:59:12.000000'),
(4, 'SV004', 'Cấp giấy chứng nhận', 'Cấp giấy chứng nhận đăng kiểm định kỳ', 'document', 30000.00, 0, 'active', 4, '2026-03-17 08:59:12.000000', '2026-03-17 08:59:12.000000');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` bigint(20) NOT NULL,
  `employee_code` varchar(20) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `address` longtext DEFAULT NULL,
  `tasks_total` int(11) NOT NULL,
  `tasks_completed` int(11) NOT NULL,
  `rating_average` decimal(3,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` bigint(20) NOT NULL,
  `station_code` varchar(20) NOT NULL,
  `station_name` varchar(200) NOT NULL,
  `address` longtext NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `capacity` int(11) NOT NULL DEFAULT 10,
  `daily_capacity` int(11) NOT NULL DEFAULT 50,
  `working_hours` varchar(50) DEFAULT NULL,
  `open_time` time(6) DEFAULT NULL,
  `close_time` time(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `station_code`, `station_name`, `address`, `phone`, `email`, `latitude`, `longitude`, `capacity`, `daily_capacity`, `working_hours`, `open_time`, `close_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DK-001', 'Trạm Đăng Kiểm An Khê', '123 Nguyễn Huệ, An Khê, Gia Laii', '02693888888', 'ankhe@dangkiem.vn', 13.9450000, 108.6500000, 10, 120, 'Thứ 2 - Thứ 7', '07:30:00.000000', '17:00:00.000000', 'active', '2026-03-10 08:00:00.000000', '2026-03-18 02:01:33.650886'),
(2, 'DK-002', 'Trạm Đăng Kiểm Pleiku', '45 Trường Chinh, Pleiku, Gia Laii', '02693777777', 'pleiku@dangkiem.vn', 13.9833000, 108.0000000, 12, 150, 'Thứ 2 - Thứ 7', '07:00:00.000000', '17:30:00.000000', 'active', '2026-03-10 08:05:00.000000', '2026-03-13 03:06:28.110021'),
(3, 'DK-003', 'Trạm Đăng Kiểm Quy Nhơn', '78 Tây Sơn, Quy Nhơn, Bình Định', '02563888888', 'quynhon@dangkiem.vn', 13.7820000, 109.2190000, 8, 90, 'Thứ 2 - Thứ 6', '07:30:00.000000', '16:30:00.000000', 'active', '2026-03-10 08:10:00.000000', '2026-03-10 08:10:00.000000'),
(4, 'DK-004', 'Trạm Đăng Kiểm Đà Nẵng', '150 Điện Biên Phủ, Đà Nẵng', '02363888888', 'danang@dangkiem.vn', 16.0544000, 108.2022000, 15, 200, 'Thứ 2 - Chủ Nhật', '06:30:00.000000', '18:00:00.000000', 'active', '2026-03-10 08:15:00.000000', '2026-03-10 08:15:00.000000'),
(5, 'DK-005', 'Trạm Đăng Kiểm TP.HCM', '200 Lý Thường Kiệt, Quận 10, TP.HCM', '02838383838', 'tphcm@dangkiem.vn', 10.7769000, 106.7009000, 20, 300, 'Thứ 2 - Chủ Nhật', '06:00:00.000000', '19:00:00.000000', 'active', '2026-03-10 08:20:00.000000', '2026-03-10 08:20:00.000000'),
(6, 'DK-006', 'Trạm Đăng Kiểm Hà Nội', '99 Giải Phóng, Hoàng Mai, Hà Nội', '02438888888', 'hanoi@dangkiem.vn', 21.0285000, 105.8542000, 18, 250, 'Thứ 2 - Thứ 7', '06:30:00.000000', '18:00:00.000000', 'inactive', '2026-03-10 08:25:00.000000', '2026-03-10 08:25:00.000000'),
(7, 'STN-4F4D3943', 'Trạm Đăng Kiểm Nha Trang', '56 Trần Phú, Nha Trang', '02583888888', NULL, 12.2388000, 109.1967000, 10, 50, NULL, NULL, NULL, 'active', '2026-03-12 03:41:18.011458', '2026-03-12 03:41:18.011481');

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` bigint(20) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_group` varchar(50) NOT NULL,
  `setting_name` varchar(200) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `default_value` longtext DEFAULT NULL,
  `value_type` varchar(20) NOT NULL,
  `description` longtext DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL,
  `is_editable` tinyint(1) NOT NULL,
  `validation_rule` longtext DEFAULT NULL,
  `allowed_values` longtext DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `updated_by_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_slots`
--

CREATE TABLE `time_slots` (
  `id` bigint(20) NOT NULL,
  `time_slot` time(6) NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `display_order` int(11) NOT NULL,
  `notes` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `station_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_slots`
--

INSERT INTO `time_slots` (`id`, `time_slot`, `day_of_week`, `max_capacity`, `is_active`, `display_order`, `notes`, `created_at`, `updated_at`, `station_id`) VALUES
(1, '08:00:00.000000', 'all', 5, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(2, '09:00:00.000000', 'all', 5, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(3, '10:00:00.000000', 'all', 5, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(4, '11:00:00.000000', 'all', 5, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(5, '13:00:00.000000', 'all', 5, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(6, '14:00:00.000000', 'all', 5, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(7, '15:00:00.000000', 'all', 5, 1, 7, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(8, '16:00:00.000000', 'all', 5, 1, 8, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 1),
(9, '07:30:00.000000', 'all', 6, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(10, '08:30:00.000000', 'all', 6, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(11, '09:30:00.000000', 'all', 6, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(12, '10:30:00.000000', 'all', 6, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(13, '13:30:00.000000', 'all', 6, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(14, '14:30:00.000000', 'all', 6, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(15, '15:30:00.000000', 'all', 6, 1, 7, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(16, '16:30:00.000000', 'all', 6, 1, 8, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 2),
(17, '08:00:00.000000', 'all', 4, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(18, '09:00:00.000000', 'all', 4, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(19, '10:00:00.000000', 'all', 4, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(20, '13:00:00.000000', 'all', 4, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(21, '14:00:00.000000', 'all', 4, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(22, '15:00:00.000000', 'all', 4, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 3),
(23, '07:00:00.000000', 'all', 8, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(24, '08:00:00.000000', 'all', 8, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(25, '09:00:00.000000', 'all', 8, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(26, '10:00:00.000000', 'all', 8, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(27, '11:00:00.000000', 'all', 8, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(28, '13:00:00.000000', 'all', 8, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(29, '14:00:00.000000', 'all', 8, 1, 7, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(30, '15:00:00.000000', 'all', 8, 1, 8, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(31, '16:00:00.000000', 'all', 8, 1, 9, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(32, '17:00:00.000000', 'all', 8, 1, 10, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 4),
(33, '06:30:00.000000', 'all', 10, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(34, '07:30:00.000000', 'all', 10, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(35, '08:30:00.000000', 'all', 10, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(36, '09:30:00.000000', 'all', 10, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(37, '10:30:00.000000', 'all', 10, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(38, '13:00:00.000000', 'all', 10, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(39, '14:00:00.000000', 'all', 10, 1, 7, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(40, '15:00:00.000000', 'all', 10, 1, 8, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(41, '16:00:00.000000', 'all', 10, 1, 9, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(42, '17:00:00.000000', 'all', 10, 1, 10, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(43, '18:00:00.000000', 'all', 10, 1, 11, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 5),
(44, '07:00:00.000000', 'all', 9, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(45, '08:00:00.000000', 'all', 9, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(46, '09:00:00.000000', 'all', 9, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(47, '10:00:00.000000', 'all', 9, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(48, '11:00:00.000000', 'all', 9, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(49, '13:00:00.000000', 'all', 9, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(50, '14:00:00.000000', 'all', 9, 1, 7, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(51, '15:00:00.000000', 'all', 9, 1, 8, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(52, '16:00:00.000000', 'all', 9, 1, 9, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(53, '17:00:00.000000', 'all', 9, 1, 10, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 6),
(54, '08:00:00.000000', 'all', 5, 1, 1, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7),
(55, '09:00:00.000000', 'all', 5, 1, 2, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7),
(56, '10:00:00.000000', 'all', 5, 1, 3, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7),
(57, '13:00:00.000000', 'all', 5, 1, 4, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7),
(58, '14:00:00.000000', 'all', 5, 1, 5, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7),
(59, '15:00:00.000000', 'all', 5, 1, 6, NULL, '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000', 7);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` bigint(20) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `manufacture_year` int(11) DEFAULT NULL,
  `chassis_number` varchar(100) DEFAULT NULL,
  `engine_number` varchar(100) DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `last_inspection_date` date DEFAULT NULL,
  `next_inspection_date` date DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `vehicle_type_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `license_plate`, `brand`, `model`, `color`, `manufacture_year`, `chassis_number`, `engine_number`, `registration_date`, `last_inspection_date`, `next_inspection_date`, `status`, `created_at`, `updated_at`, `customer_id`, `vehicle_type_id`) VALUES
(1, '77A1-12345', 'Honda', 'Wave Alpha', 'Đỏ', 2020, 'HA1234567890', 'ENG1234567', '2020-05-10', '2025-05-10', '2026-05-10', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 1, 1),
(2, '77B1-56789', 'Toyota', 'Vios', 'Trắng', 2019, 'VIN1234567890ABC', 'ENG9876543', '2019-08-15', '2024-08-15', '2026-08-15', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 1, 2),
(3, '81A1-11111', 'Honda', 'City', 'Xám', 2021, 'VIN2222222222ABC', 'ENG2222222', '2021-03-20', '2025-03-20', '2027-03-20', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 2, 2),
(4, '81B1-22222', 'Toyota', 'Innova', 'Bạc', 2020, 'VIN3333333333ABC', 'ENG3333333', '2020-06-10', '2025-06-10', '2027-06-10', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 2, 3),
(5, '81C1-33333', 'Yamaha', 'Exciter', 'Xanh', 2022, 'YA9999999999', 'ENG9999999', '2022-01-15', '2026-01-15', '2028-01-15', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 2, 1),
(6, '30A1-44444', 'Hyundai', 'Porter', 'Trắng', 2018, 'VIN4444444444ABC', 'ENG4444444', '2018-11-20', '2024-11-20', '2025-11-20', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 3, 4),
(7, '43A1-55555', 'Mazda', 'CX-5', 'Đỏ', 2021, 'VIN5555555555ABC', 'ENG5555555', '2021-04-25', '2025-04-25', '2027-04-25', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 4, 2),
(8, '43B1-66666', 'Ford', 'Everest', 'Đen', 2020, 'VIN6666666666ABC', 'ENG6666666', '2020-09-30', '2025-09-30', '2027-09-30', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 4, 3),
(9, '81D1-77777', 'Honda', 'SH Mode', 'Xanh', 2023, 'HA7777777777', 'ENG7777777', '2023-02-10', NULL, '2024-02-10', 'active', '2026-03-13 09:49:59.000000', '2026-03-13 09:49:59.000000', 5, 1),
(10, '81E1-888', 'Kia', 'Morning', 'Vàng', 2022, 'VIN8888888888ABC', 'ENG8888888', '2022-12-05', NULL, '2023-12-05', 'active', '2026-03-13 09:49:59.000000', '2026-03-18 02:01:59.947789', 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_receipt_logs`
--

CREATE TABLE `vehicle_receipt_logs` (
  `id` bigint(20) NOT NULL,
  `received_at` datetime(6) NOT NULL,
  `status` varchar(20) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `odometer_reading` int(11) DEFAULT NULL,
  `fuel_level` varchar(20) NOT NULL,
  `exterior_front` longtext DEFAULT NULL,
  `exterior_rear` longtext DEFAULT NULL,
  `exterior_left` longtext DEFAULT NULL,
  `exterior_right` longtext DEFAULT NULL,
  `windows_condition` longtext DEFAULT NULL,
  `lights_condition` longtext DEFAULT NULL,
  `mirrors_condition` longtext DEFAULT NULL,
  `wipers_condition` longtext DEFAULT NULL,
  `tires_condition` longtext DEFAULT NULL,
  `interior_condition` longtext DEFAULT NULL,
  `has_spare_tire` tinyint(1) NOT NULL,
  `has_tool_kit` tinyint(1) NOT NULL,
  `has_jack` tinyint(1) NOT NULL,
  `has_fire_extinguisher` tinyint(1) NOT NULL,
  `has_warning_triangle` tinyint(1) NOT NULL,
  `has_first_aid_kit` tinyint(1) NOT NULL,
  `has_registration` tinyint(1) NOT NULL,
  `has_insurance` tinyint(1) NOT NULL,
  `has_previous_inspection` tinyint(1) NOT NULL,
  `photo_front_url` varchar(500) DEFAULT NULL,
  `photo_rear_url` varchar(500) DEFAULT NULL,
  `photo_left_url` varchar(500) DEFAULT NULL,
  `photo_right_url` varchar(500) DEFAULT NULL,
  `photo_dashboard_url` varchar(500) DEFAULT NULL,
  `photo_interior_url` varchar(500) DEFAULT NULL,
  `vehicle_registration_url` varchar(500) DEFAULT NULL,
  `vehicle_insurance_url` varchar(500) DEFAULT NULL,
  `exterior_ok` tinyint(1) NOT NULL,
  `tires_ok` tinyint(1) NOT NULL,
  `lights_ok` tinyint(1) NOT NULL,
  `mirrors_ok` tinyint(1) NOT NULL,
  `windows_ok` tinyint(1) NOT NULL,
  `interior_ok` tinyint(1) NOT NULL,
  `engine_ok` tinyint(1) NOT NULL,
  `fuel_ok` tinyint(1) NOT NULL,
  `exterior_check_photo` varchar(500) DEFAULT NULL,
  `tires_check_photo` varchar(500) DEFAULT NULL,
  `lights_check_photo` varchar(500) DEFAULT NULL,
  `mirrors_check_photo` varchar(500) DEFAULT NULL,
  `windows_check_photo` varchar(500) DEFAULT NULL,
  `interior_check_photo` varchar(500) DEFAULT NULL,
  `engine_check_photo` varchar(500) DEFAULT NULL,
  `fuel_check_photo` varchar(500) DEFAULT NULL,
  `additional_notes` longtext DEFAULT NULL,
  `special_requests` longtext DEFAULT NULL,
  `customer_confirmed` tinyint(1) NOT NULL,
  `customer_signature` longtext DEFAULT NULL,
  `staff_signature` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `received_by_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_return_additional_costs`
--

CREATE TABLE `vehicle_return_additional_costs` (
  `id` bigint(20) NOT NULL,
  `cost_type` varchar(100) NOT NULL,
  `cost_name` varchar(200) NOT NULL,
  `description` longtext DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `photo_url` varchar(200) DEFAULT NULL,
  `invoice_url` varchar(200) DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `notes` longtext DEFAULT NULL,
  `approved_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL,
  `qr_code_url` varchar(200) DEFAULT NULL,
  `qr_content` longtext DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_proof_url` varchar(200) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_note` longtext DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint(20) DEFAULT NULL,
  `order_id` bigint(20) NOT NULL,
  `return_log_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_return_logs`
--

CREATE TABLE `vehicle_return_logs` (
  `id` bigint(20) NOT NULL,
  `returned_at` datetime(6) NOT NULL,
  `status` varchar(50) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `odometer_reading` int(11) DEFAULT NULL,
  `fuel_level` varchar(20) NOT NULL,
  `exterior_front` longtext DEFAULT NULL,
  `exterior_rear` longtext DEFAULT NULL,
  `exterior_left` longtext DEFAULT NULL,
  `exterior_right` longtext DEFAULT NULL,
  `windows_condition` longtext DEFAULT NULL,
  `lights_condition` longtext DEFAULT NULL,
  `mirrors_condition` longtext DEFAULT NULL,
  `wipers_condition` longtext DEFAULT NULL,
  `tires_condition` longtext DEFAULT NULL,
  `interior_condition` longtext DEFAULT NULL,
  `has_spare_tire` tinyint(1) NOT NULL,
  `has_tool_kit` tinyint(1) NOT NULL,
  `has_jack` tinyint(1) NOT NULL,
  `has_fire_extinguisher` tinyint(1) NOT NULL,
  `has_warning_triangle` tinyint(1) NOT NULL,
  `has_first_aid_kit` tinyint(1) NOT NULL,
  `has_registration` tinyint(1) NOT NULL,
  `has_insurance` tinyint(1) NOT NULL,
  `has_previous_inspection` tinyint(1) NOT NULL,
  `photo_front_url` varchar(200) DEFAULT NULL,
  `photo_rear_url` varchar(200) DEFAULT NULL,
  `photo_left_url` varchar(200) DEFAULT NULL,
  `photo_right_url` varchar(200) DEFAULT NULL,
  `photo_dashboard_url` varchar(200) DEFAULT NULL,
  `photo_interior_url` varchar(200) DEFAULT NULL,
  `vehicle_registration_url` varchar(200) DEFAULT NULL,
  `vehicle_insurance_url` varchar(200) DEFAULT NULL,
  `exterior_ok` tinyint(1) NOT NULL,
  `tires_ok` tinyint(1) NOT NULL,
  `lights_ok` tinyint(1) NOT NULL,
  `mirrors_ok` tinyint(1) NOT NULL,
  `windows_ok` tinyint(1) NOT NULL,
  `interior_ok` tinyint(1) NOT NULL,
  `engine_ok` tinyint(1) NOT NULL,
  `fuel_ok` tinyint(1) NOT NULL,
  `exterior_check_photo` varchar(200) DEFAULT NULL,
  `tires_check_photo` varchar(200) DEFAULT NULL,
  `lights_check_photo` varchar(200) DEFAULT NULL,
  `mirrors_check_photo` varchar(200) DEFAULT NULL,
  `windows_check_photo` varchar(200) DEFAULT NULL,
  `interior_check_photo` varchar(200) DEFAULT NULL,
  `engine_check_photo` varchar(200) DEFAULT NULL,
  `fuel_check_photo` varchar(200) DEFAULT NULL,
  `inspection_certificate_url` varchar(200) DEFAULT NULL,
  `stamp_url` varchar(200) DEFAULT NULL,
  `documents_complete_ok` tinyint(1) NOT NULL,
  `documents_complete_photo` varchar(200) DEFAULT NULL,
  `stamp_attached_ok` tinyint(1) NOT NULL,
  `stamp_attached_photo` varchar(200) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `stamp_number` varchar(50) DEFAULT NULL,
  `stamp_expiry_date` date DEFAULT NULL,
  `other_documents_urls` longtext DEFAULT NULL,
  `receipt_url` varchar(200) DEFAULT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `certificate_number` varchar(50) DEFAULT NULL,
  `certificate_expiry_date` date DEFAULT NULL,
  `additional_notes` longtext DEFAULT NULL,
  `special_requests` longtext DEFAULT NULL,
  `customer_confirmed` tinyint(1) NOT NULL,
  `customer_signature` longtext DEFAULT NULL,
  `staff_signature` longtext DEFAULT NULL,
  `handover_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`handover_checklist`)),
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `returned_by_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` bigint(20) NOT NULL,
  `type_code` varchar(50) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` longtext DEFAULT NULL,
  `icon_url` varchar(500) DEFAULT NULL,
  `display_order` int(11) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `type_code`, `type_name`, `description`, `icon_url`, `display_order`, `base_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 'MOTO', 'Xe máy', 'Xe moto, xe gắn máy', NULL, 1, 150000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(2, 'CAR_4', 'Ô tô 4 chỗ', 'Xe con 4-5 chỗ ngồi', NULL, 2, 350000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(3, 'CAR_7', 'Ô tô 7 chỗ', 'Xe 7-9 chỗ ngồi (SUV, MPV)', NULL, 3, 420000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(4, 'TRUCK_LIGHT', 'Xe tải nhẹ', 'Xe tải dưới 3.5 tấn', NULL, 4, 550000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(5, 'TRUCK_HEAVY', 'Xe tải nặng', 'Xe tải trên 3.5 tấn', NULL, 5, 800000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(6, 'BUS', 'Xe khách', 'Xe bus, xe khách 16 chỗ trở lên', NULL, 6, 950000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(7, 'CONTAINER', 'Xe Container', 'Xe đầu kéo container', NULL, 7, 1200000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(8, 'TAXI', 'Taxi', 'Xe taxi kinh doanh vận tải', NULL, 8, 380000.00, 'active', '2026-03-13 09:24:21.000000', '2026-03-13 09:24:21.000000'),
(11, 'fgddd', 'gff', NULL, NULL, 0, 454656.00, 'active', '2026-03-18 01:59:14.118829', '2026-03-18 02:02:27.493133');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD PRIMARY KEY (`key`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indexes for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_sender_user_id_e15320d5_fk_auth_user_id` (`sender_user_id`),
  ADD KEY `chat_messages_sender_customer_id_f8654ea3_fk_customers_id` (`sender_customer_id`),
  ADD KEY `chat_messages_order_id_dc732baf_fk_orders_id` (`order_id`),
  ADD KEY `chat_messages_sender_staff_id_f58e3653_fk_staff_id` (`sender_staff_id`);

--
-- Indexes for table `checklist_items`
--
ALTER TABLE `checklist_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_key` (`item_key`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `facebook_id` (`facebook_id`),
  ADD UNIQUE KEY `apple_id` (`apple_id`);

--
-- Indexes for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indexes for table `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indexes for table `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_recipient_customer_id_bf3f4365_fk_customers_id` (`recipient_customer_id`),
  ADD KEY `notifications_recipient_user_id_42f935ff_fk_auth_user_id` (`recipient_user_id`),
  ADD KEY `notifications_recipient_staff_id_e6cf48cd_fk_staff_id` (`recipient_staff_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_code` (`order_code`),
  ADD KEY `orders_assigned_staff_id_8050b97b_fk_staff_id` (`assigned_staff_id`),
  ADD KEY `orders_vehicle_id_59612d64_fk_vehicles_id` (`vehicle_id`),
  ADD KEY `orders_customer_id_b7016332_fk_customers_id` (`customer_id`),
  ADD KEY `orders_station_id_426ce7c9_fk_stations_id` (`station_id`);

--
-- Indexes for table `order_checklist`
--
ALTER TABLE `order_checklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_checklist_checklist_item_id_731ce924_fk_checklist_items_id` (`checklist_item_id`),
  ADD KEY `order_checklist_order_id_141a1b53_fk_orders_id` (`order_id`),
  ADD KEY `order_checklist_checked_by_id_d61a1420_fk_staff_id` (`checked_by_id`);

--
-- Indexes for table `order_services`
--
ALTER TABLE `order_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`),
  ADD KEY `idx_service_id` (`service_id`);

--
-- Indexes for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_status_history_changed_by_id_f13feb0a_fk_auth_user_id` (`changed_by_id`),
  ADD KEY `order_status_history_order_id_d33fdfde_fk_orders_id` (`order_id`);

--
-- Indexes for table `otp_verification`
--
ALTER TABLE `otp_verification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_code` (`transaction_code`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_code` (`permission_code`);

--
-- Indexes for table `pricings`
--
ALTER TABLE `pricings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pricings_vehicle_type_id_283ae16b_fk_vehicle_types_id` (`vehicle_type_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `ratings_customer_id_5e571b3b_fk_customers_id` (`customer_id`),
  ADD KEY `ratings_responded_by_id_99a95be0_fk_staff_id` (`responded_by_id`),
  ADD KEY `ratings_staff_id_b80bbf11_fk_staff_id` (`staff_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_permissions_role_id_permission_id_04f77df0_uniq` (`role_id`,`permission_id`),
  ADD KEY `role_permissions_permission_id_ad343843_fk_permissions_id` (`permission_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `service_code` (`service_code`),
  ADD KEY `idx_category` (`category`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_code` (`employee_code`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `staff_role_id_f8da7ae2_fk_roles_id` (`role_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `station_code_unique` (`station_code`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `system_settings_updated_by_id_cf1dfbba_fk_staff_id` (`updated_by_id`);

--
-- Indexes for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `time_slots_station_id_time_slot_day_of_week_aded5d3e_uniq` (`station_id`,`time_slot`,`day_of_week`),
  ADD KEY `time_slots_station_5118f8_idx` (`station_id`,`is_active`),
  ADD KEY `time_slots_day_of__a162bb_idx` (`day_of_week`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_plate` (`license_plate`),
  ADD KEY `vehicles_customer_id_04e6bf00_fk_customers_id` (`customer_id`),
  ADD KEY `vehicles_vehicle_type_id_45741935_fk_vehicle_types_id` (`vehicle_type_id`);

--
-- Indexes for table `vehicle_receipt_logs`
--
ALTER TABLE `vehicle_receipt_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `vehicle_receipt_logs_received_by_id_59eeb983_fk_staff_id` (`received_by_id`);

--
-- Indexes for table `vehicle_return_additional_costs`
--
ALTER TABLE `vehicle_return_additional_costs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_return_additi_created_by_id_b3bc7579_fk_staff_id` (`created_by_id`),
  ADD KEY `vehicle_return_additional_costs_order_id_009a2da2_fk_orders_id` (`order_id`),
  ADD KEY `vehicle_return_addit_return_log_id_3fe2e5cf_fk_vehicle_r` (`return_log_id`);

--
-- Indexes for table `vehicle_return_logs`
--
ALTER TABLE `vehicle_return_logs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `vehicle_return_logs_returned_by_id_8924b2d1_fk_staff_id` (`returned_by_id`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type_code` (`type_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `checklist_items`
--
ALTER TABLE `checklist_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_checklist`
--
ALTER TABLE `order_checklist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_services`
--
ALTER TABLE `order_services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otp_verification`
--
ALTER TABLE `otp_verification`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pricings`
--
ALTER TABLE `pricings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `time_slots`
--
ALTER TABLE `time_slots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `vehicle_receipt_logs`
--
ALTER TABLE `vehicle_receipt_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_return_additional_costs`
--
ALTER TABLE `vehicle_return_additional_costs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_return_logs`
--
ALTER TABLE `vehicle_return_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Constraints for table `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Constraints for table `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_order_id_dc732baf_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `chat_messages_sender_customer_id_f8654ea3_fk_customers_id` FOREIGN KEY (`sender_customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `chat_messages_sender_staff_id_f58e3653_fk_staff_id` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `chat_messages_sender_user_id_e15320d5_fk_auth_user_id` FOREIGN KEY (`sender_user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_user_id_28f6c6eb_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_recipient_customer_id_bf3f4365_fk_customers_id` FOREIGN KEY (`recipient_customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `notifications_recipient_staff_id_e6cf48cd_fk_staff_id` FOREIGN KEY (`recipient_staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `notifications_recipient_user_id_42f935ff_fk_auth_user_id` FOREIGN KEY (`recipient_user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_assigned_staff_id_8050b97b_fk_staff_id` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `orders_customer_id_b7016332_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_station_id_426ce7c9_fk_stations_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`),
  ADD CONSTRAINT `orders_vehicle_id_59612d64_fk_vehicles_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

--
-- Constraints for table `order_checklist`
--
ALTER TABLE `order_checklist`
  ADD CONSTRAINT `order_checklist_checked_by_id_d61a1420_fk_staff_id` FOREIGN KEY (`checked_by_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `order_checklist_checklist_item_id_731ce924_fk_checklist_items_id` FOREIGN KEY (`checklist_item_id`) REFERENCES `checklist_items` (`id`),
  ADD CONSTRAINT `order_checklist_order_id_141a1b53_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `order_services`
--
ALTER TABLE `order_services`
  ADD CONSTRAINT `order_services_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Constraints for table `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_changed_by_id_f13feb0a_fk_auth_user_id` FOREIGN KEY (`changed_by_id`) REFERENCES `auth_user` (`id`),
  ADD CONSTRAINT `order_status_history_order_id_d33fdfde_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_6086ad70_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `pricings`
--
ALTER TABLE `pricings`
  ADD CONSTRAINT `pricings_vehicle_type_id_283ae16b_fk_vehicle_types_id` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_customer_id_5e571b3b_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `ratings_order_id_2d75e230_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `ratings_responded_by_id_99a95be0_fk_staff_id` FOREIGN KEY (`responded_by_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `ratings_staff_id_b80bbf11_fk_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_ad343843_fk_permissions_id` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  ADD CONSTRAINT `role_permissions_role_id_216516f2_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Constraints for table `staff`
--
ALTER TABLE `staff`
  ADD CONSTRAINT `staff_role_id_f8da7ae2_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `staff_user_id_e6242ba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_updated_by_id_cf1dfbba_fk_staff_id` FOREIGN KEY (`updated_by_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `time_slots`
--
ALTER TABLE `time_slots`
  ADD CONSTRAINT `time_slots_station_id_bbe67166_fk_stations_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_customer_id_04e6bf00_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `vehicles_vehicle_type_id_45741935_fk_vehicle_types_id` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`);

--
-- Constraints for table `vehicle_receipt_logs`
--
ALTER TABLE `vehicle_receipt_logs`
  ADD CONSTRAINT `vehicle_receipt_logs_order_id_3966f97a_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `vehicle_receipt_logs_received_by_id_59eeb983_fk_staff_id` FOREIGN KEY (`received_by_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `vehicle_return_additional_costs`
--
ALTER TABLE `vehicle_return_additional_costs`
  ADD CONSTRAINT `vehicle_return_addit_return_log_id_3fe2e5cf_fk_vehicle_r` FOREIGN KEY (`return_log_id`) REFERENCES `vehicle_return_logs` (`id`),
  ADD CONSTRAINT `vehicle_return_additi_created_by_id_b3bc7579_fk_staff_id` FOREIGN KEY (`created_by_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `vehicle_return_additional_costs_order_id_009a2da2_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `vehicle_return_logs`
--
ALTER TABLE `vehicle_return_logs`
  ADD CONSTRAINT `vehicle_return_logs_order_id_703b1b61_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `vehicle_return_logs_returned_by_id_8924b2d1_fk_staff_id` FOREIGN KEY (`returned_by_id`) REFERENCES `staff` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
