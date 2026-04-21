-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: vehicle_inspection
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'Customer'),(2,'Staff');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Token',7,'add_token'),(26,'Can change Token',7,'change_token'),(27,'Can delete Token',7,'delete_token'),(28,'Can view Token',7,'view_token'),(29,'Can add Token',8,'add_tokenproxy'),(30,'Can change Token',8,'change_tokenproxy'),(31,'Can delete Token',8,'delete_tokenproxy'),(32,'Can view Token',8,'view_tokenproxy'),(33,'Can add checklist item',9,'add_checklistitem'),(34,'Can change checklist item',9,'change_checklistitem'),(35,'Can delete checklist item',9,'delete_checklistitem'),(36,'Can view checklist item',9,'view_checklistitem'),(37,'Can add Customer',10,'add_customer'),(38,'Can change Customer',10,'change_customer'),(39,'Can delete Customer',10,'delete_customer'),(40,'Can view Customer',10,'view_customer'),(41,'Can add order',11,'add_order'),(42,'Can change order',11,'change_order'),(43,'Can delete order',11,'delete_order'),(44,'Can view order',11,'view_order'),(45,'Can add otp',12,'add_otp'),(46,'Can change otp',12,'change_otp'),(47,'Can delete otp',12,'delete_otp'),(48,'Can view otp',12,'view_otp'),(49,'Can add role',13,'add_role'),(50,'Can change role',13,'change_role'),(51,'Can delete role',13,'delete_role'),(52,'Can view role',13,'view_role'),(53,'Can add station',14,'add_station'),(54,'Can change station',14,'change_station'),(55,'Can delete station',14,'delete_station'),(56,'Can view station',14,'view_station'),(57,'Can add vehicle type',15,'add_vehicletype'),(58,'Can change vehicle type',15,'change_vehicletype'),(59,'Can delete vehicle type',15,'delete_vehicletype'),(60,'Can view vehicle type',15,'view_vehicletype'),(61,'Can add vehicle',16,'add_vehicle'),(62,'Can change vehicle',16,'change_vehicle'),(63,'Can delete vehicle',16,'delete_vehicle'),(64,'Can view vehicle',16,'view_vehicle'),(65,'Can add Staff',17,'add_staff'),(66,'Can change Staff',17,'change_staff'),(67,'Can delete Staff',17,'delete_staff'),(68,'Can view Staff',17,'view_staff'),(69,'Can add rating',18,'add_rating'),(70,'Can change rating',18,'change_rating'),(71,'Can delete rating',18,'delete_rating'),(72,'Can view rating',18,'view_rating'),(73,'Can add pricing',19,'add_pricing'),(74,'Can change pricing',19,'change_pricing'),(75,'Can delete pricing',19,'delete_pricing'),(76,'Can view pricing',19,'view_pricing'),(77,'Can add payment',20,'add_payment'),(78,'Can change payment',20,'change_payment'),(79,'Can delete payment',20,'delete_payment'),(80,'Can view payment',20,'view_payment'),(81,'Can add order status history',21,'add_orderstatushistory'),(82,'Can change order status history',21,'change_orderstatushistory'),(83,'Can delete order status history',21,'delete_orderstatushistory'),(84,'Can view order status history',21,'view_orderstatushistory'),(85,'Can add order checklist',22,'add_orderchecklist'),(86,'Can change order checklist',22,'change_orderchecklist'),(87,'Can delete order checklist',22,'delete_orderchecklist'),(88,'Can view order checklist',22,'view_orderchecklist'),(89,'Can add system setting',23,'add_systemsetting'),(90,'Can change system setting',23,'change_systemsetting'),(91,'Can delete system setting',23,'delete_systemsetting'),(92,'Can view system setting',23,'view_systemsetting'),(93,'Can add permission',24,'add_permission'),(94,'Can change permission',24,'change_permission'),(95,'Can delete permission',24,'delete_permission'),(96,'Can view permission',24,'view_permission'),(97,'Can add chat message',25,'add_chatmessage'),(98,'Can change chat message',25,'change_chatmessage'),(99,'Can delete chat message',25,'delete_chatmessage'),(100,'Can view chat message',25,'view_chatmessage'),(101,'Can add role permission',26,'add_rolepermission'),(102,'Can change role permission',26,'change_rolepermission'),(103,'Can delete role permission',26,'delete_rolepermission'),(104,'Can view role permission',26,'view_rolepermission'),(105,'Can add notification',27,'add_notification'),(106,'Can change notification',27,'change_notification'),(107,'Can delete notification',27,'delete_notification'),(108,'Can view notification',27,'view_notification'),(109,'Can add vehicle receipt log',28,'add_vehiclereceiptlog'),(110,'Can change vehicle receipt log',28,'change_vehiclereceiptlog'),(111,'Can delete vehicle receipt log',28,'delete_vehiclereceiptlog'),(112,'Can view vehicle receipt log',28,'view_vehiclereceiptlog'),(113,'Can add time slot',29,'add_timeslot'),(114,'Can change time slot',29,'change_timeslot'),(115,'Can delete time slot',29,'delete_timeslot'),(116,'Can view time slot',29,'view_timeslot'),(117,'Can add vehicle return log',31,'add_vehiclereturnlog'),(118,'Can change vehicle return log',31,'change_vehiclereturnlog'),(119,'Can delete vehicle return log',31,'delete_vehiclereturnlog'),(120,'Can view vehicle return log',31,'view_vehiclereturnlog'),(121,'Can add vehicle return additional cost',30,'add_vehiclereturnadditionalcost'),(122,'Can change vehicle return additional cost',30,'change_vehiclereturnadditionalcost'),(123,'Can delete vehicle return additional cost',30,'delete_vehiclereturnadditionalcost'),(124,'Can view vehicle return additional cost',30,'view_vehiclereturnadditionalcost'),(125,'Can add Dịch vụ',33,'add_service'),(126,'Can change Dịch vụ',33,'change_service'),(127,'Can delete Dịch vụ',33,'delete_service'),(128,'Can view Dịch vụ',33,'view_service'),(129,'Can add Dịch vụ đơn hàng',32,'add_orderservice'),(130,'Can change Dịch vụ đơn hàng',32,'change_orderservice'),(131,'Can delete Dịch vụ đơn hàng',32,'delete_orderservice'),(132,'Can view Dịch vụ đơn hàng',32,'view_orderservice'),(133,'Can add Trạng thái đơn hàng',34,'add_orderstatus'),(134,'Can change Trạng thái đơn hàng',34,'change_orderstatus'),(135,'Can delete Trạng thái đơn hàng',34,'delete_orderstatus'),(136,'Can view Trạng thái đơn hàng',34,'view_orderstatus'),(137,'Can add inspection image requirement',35,'add_inspectionimagerequirement'),(138,'Can change inspection image requirement',35,'change_inspectionimagerequirement'),(139,'Can delete inspection image requirement',35,'delete_inspectionimagerequirement'),(140,'Can view inspection image requirement',35,'view_inspectionimagerequirement'),(141,'Can add media file',36,'add_mediafile'),(142,'Can change media file',36,'change_mediafile'),(143,'Can delete media file',36,'delete_mediafile'),(144,'Can view media file',36,'view_mediafile'),(145,'Can add Log thanh toán',37,'add_paymentlog'),(146,'Can change Log thanh toán',37,'change_paymentlog'),(147,'Can delete Log thanh toán',37,'delete_paymentlog'),(148,'Can view Log thanh toán',37,'view_paymentlog'),(149,'Can add Số dư ví',40,'add_walletbalance'),(150,'Can change Số dư ví',40,'change_walletbalance'),(151,'Can delete Số dư ví',40,'delete_walletbalance'),(152,'Can view Số dư ví',40,'view_walletbalance'),(153,'Can add Lịch sử ví',41,'add_wallethistory'),(154,'Can change Lịch sử ví',41,'change_wallethistory'),(155,'Can delete Lịch sử ví',41,'delete_wallethistory'),(156,'Can view Lịch sử ví',41,'view_wallethistory'),(157,'Can add Hoàn tiền',38,'add_refund'),(158,'Can change Hoàn tiền',38,'change_refund'),(159,'Can delete Hoàn tiền',38,'delete_refund'),(160,'Can view Hoàn tiền',38,'view_refund'),(161,'Can add Giao dịch',39,'add_transaction'),(162,'Can change Giao dịch',39,'change_transaction'),(163,'Can delete Giao dịch',39,'delete_transaction'),(164,'Can view Giao dịch',39,'view_transaction');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1200000$XMRDRpKam4PJetcmMz0ZO3$Wl1PMDPfKXUXmsFo9pg10FfoBZR/kSajXrzxjss36GE=','2026-04-20 15:11:19.464718',1,'admin','Admin','System','admin@dangkiem.vn',1,1,'2026-03-02 00:00:00.000000'),(2,'!','2026-03-02 05:08:48.669199',0,'0912345678','','','',0,1,'2026-03-02 00:00:00.000000'),(3,'!',NULL,0,'0987654321','','','',0,1,'2026-03-02 00:00:00.000000'),(4,'!',NULL,0,'0901234567','','','levanc@gmail.com',0,1,'2026-03-02 00:00:00.000000'),(5,'!',NULL,0,'0934567890','','','',0,1,'2026-03-02 00:00:00.000000'),(6,'pbkdf2_sha256$1200000$XXP60DHdvnoswVsBIqylKx$cAEKSwDNjkGMewkBRpcSQpUTsVgygLDbc+g8uvbqUS0=','2026-04-20 15:44:15.162165',0,'0945678901','','','',0,1,'2026-03-02 00:00:00.000000'),(7,'pbkdf2_sha256$1200000$it0Lg5QVf4PBexVau26svO$Agj7fl9Xoar6xayO+LlZTbkgH5UTEuxI/qBGnio8nrU=','2026-04-19 08:44:48.076863',0,'nv001','Nguyễn','Văn F','nvf@dangkiem.vn',1,1,'2026-03-02 00:00:00.000000'),(8,'pbkdf2_sha256$1200000$caS7vuzKlZnSKIJd7agrxj$xHOSNgQfOoxsJxif3LEfppPHmDKmBgEZLvdYRegh3aI=','2026-03-23 06:25:04.130587',0,'nv002','Trần','Văn G','nvg@dangkiem.vn',1,1,'2026-03-02 00:00:00.000000'),(9,'pbkdf2_sha256$1200000$HDqiFNjXEIU0TP3PO46HNc$jTYFrILWp7Cep1lFWOlZpT72jBjV332GH8XZhoVjg3E=','2026-03-23 06:25:10.850645',0,'nv003','Lê','Thị H','lth@dangkiem.vn',1,1,'2026-03-02 00:00:00.000000'),(10,'pbkdf2_sha256$1200000$rV53nXwSkZ0qQs1Pq06zgI$skojBDiykBozJbFKXpnHfGplDXYZHpPYUrxtIhQwnGY=','2026-04-20 15:25:41.997234',0,'nv004','Phạm','Văn I','pvi@dangkiem.vn',1,1,'2026-03-02 00:00:00.000000'),(12,'pbkdf2_sha256$1200000$TjS1qS7JTvWHXoDZvsvxWm$0M+ARSXgEy4IdwndSaRNXXNLIRu4fr8jP3dkhp1oQNA=','2026-03-03 14:00:14.886290',0,'customer_0382786317','','','',0,1,'2026-03-02 08:19:33.301385'),(13,'pbkdf2_sha256$600000$gffnV5ArtvWQUPQnzlAoD0$qP0c7gRfswLrJqyAAZ2XoWmfz7ViPHqTf5lwdWFk5mA=','2026-03-02 08:25:59.112590',0,'customer_0973685142','','','',0,1,'2026-03-02 08:25:58.731727'),(14,'pbkdf2_sha256$1200000$QjkHzv4vsOI7otMLnPx2cT$htVGDogf3lDKtlC/Wt4iA4Wh08Z3Qn6yYq3x1vPf8pc=','2026-03-03 10:16:41.696821',0,'0456384712','','','',0,1,'2026-03-03 10:16:40.637802'),(15,'pbkdf2_sha256$1200000$1nbkQXBubHn8RvZNSx8Mgh$gwTA4dLp6lgyXjaoBTki27Tdik08o4wu4uuhT/SBxwk=','2026-03-03 11:39:54.160930',0,'0984606837','','','',0,1,'2026-03-03 11:39:53.183797'),(16,'pbkdf2_sha256$1200000$qZ8hKLc5Ls7LLiXX741mip$9iuOsJAQNsoV/F2gWn/hKxNWJibNXS082EdvDSPqmGM=','2026-03-05 02:34:58.582337',0,'0123456789','','','',0,1,'2026-03-04 03:53:55.286285'),(17,'pbkdf2_sha256$1200000$amY3yyY0CkrUxSG4bwTonL$PEi5iczP9Sc27wJgTr4Qw6xptkFGPwmHhMhq8BV3M/I=',NULL,0,'0835641299','','','',0,1,'2026-03-07 14:48:57.644024'),(18,'pbkdf2_sha256$1200000$biaPEtoD3BGle0Dm0S0yke$bgiPZmivadyqGZjITvkNnQ0oN7l61k7KiYDy6yIgYr0=','2026-03-09 04:44:57.763603',0,'0919443838','','','',0,1,'2026-03-09 04:44:27.969202');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
INSERT INTO `auth_user_groups` VALUES (1,2,1),(2,3,1),(3,4,1),(4,5,1),(5,6,1),(6,7,2),(7,8,2),(8,9,2),(9,10,2),(11,12,1),(12,13,1),(13,14,1),(14,15,1),(15,16,1),(16,18,1);
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('0549195dfd004a2a58b4584e9701ffd27cfd3082','2026-04-20 15:44:15.167111',6),('1404068c32b7e032fe4cc0f9ad9e783dae7616eb','2026-03-02 05:08:48.674479',2),('1aa4a45b23abfc6cd736447efb2b915bac59381d','2026-03-23 06:25:10.854987',9),('6c0e97c62039a1618145b3105008733655d7f3b2','2026-03-02 08:25:59.116643',13),('8399a9c1da0ad0c58d80cef3a67952143f3a1de8','2026-03-09 04:44:28.942906',18),('8fd6cc752317aabb7d31e130e57caa48586304e1','2026-03-04 01:40:15.558508',8),('916fa3dbdb97d5b72affc471bf50e9cd0e3431a5','2026-03-02 05:32:36.285820',1),('9e15ec56e8a73d97bd9cfd0e32bb1c9637d8ee8e','2026-03-02 08:19:33.707983',12),('9ebc2a88969d62d587271522ff67b529ecebd70c','2026-03-04 12:12:13.029055',10),('a25a419d8337892bd4133ed7c22b95024d5ffacc','2026-03-03 10:16:41.701569',14),('b0731b4cc9e12ffc00c375835a90cbcc8cce9a91','2026-03-02 05:05:24.997610',7),('c2099dccecef5fe87edcf49d0533485dc1c347d4','2026-03-04 03:53:56.398096',16),('f51894db45eea75575c003be4e964b8ec6aa9b5f','2026-03-03 11:39:54.165584',15);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sender_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_text` longtext COLLATE utf8mb4_unicode_ci,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` int DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  `sender_customer_id` bigint DEFAULT NULL,
  `sender_staff_id` bigint DEFAULT NULL,
  `sender_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_messages_order_id_dc732baf_fk_orders_id` (`order_id`),
  KEY `chat_messages_sender_customer_id_f8654ea3_fk_customers_id` (`sender_customer_id`),
  KEY `chat_messages_sender_staff_id_f58e3653_fk_staff_id` (`sender_staff_id`),
  KEY `chat_messages_sender_user_id_e15320d5_fk_auth_user_id` (`sender_user_id`),
  CONSTRAINT `chat_messages_order_id_dc732baf_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `chat_messages_sender_customer_id_f8654ea3_fk_customers_id` FOREIGN KEY (`sender_customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `chat_messages_sender_staff_id_f58e3653_fk_staff_id` FOREIGN KEY (`sender_staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `chat_messages_sender_user_id_e15320d5_fk_auth_user_id` FOREIGN KEY (`sender_user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklist_items`
--

DROP TABLE IF EXISTS `checklist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklist_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_order` int NOT NULL,
  `require_photo` tinyint(1) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `item_key` (`item_key`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklist_items`
--

LOCK TABLES `checklist_items` WRITE;
/*!40000 ALTER TABLE `checklist_items` DISABLE KEYS */;
INSERT INTO `checklist_items` VALUES (1,'brake_system_front','Kiểm tra hệ thống phanh trước','safety',1,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(2,'brake_system_rear','Kiểm tra hệ thống phanh sau','safety',2,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(3,'brake_fluid_level','Kiểm tra mức dầu phanh','safety',3,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(4,'parking_brake','Kiểm tra phanh đậu xe','safety',4,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(5,'steering_wheel_play','Kiểm tra độ rơ tay lái','safety',5,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(6,'steering_linkage','Kiểm tra hệ thống liên động lái','safety',6,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(7,'power_steering_fluid','Kiểm tra dầu trợ lực lái','safety',7,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(8,'front_suspension','Kiểm tra hệ thống treo trước','safety',8,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(9,'rear_suspension','Kiểm tra hệ thống treo sau','safety',9,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(10,'shock_absorbers','Kiểm tra giảm xóc','safety',10,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(11,'tire_front_left','Kiểm tra lốp trước trái (độ mòn, áp suất)','safety',11,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(12,'tire_front_right','Kiểm tra lốp trước phải (độ mòn, áp suất)','safety',12,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(13,'tire_rear_left','Kiểm tra lốp sau trái (độ mòn, áp suất)','safety',13,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(14,'tire_rear_right','Kiểm tra lốp sau phải (độ mòn, áp suất)','safety',14,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(15,'spare_tire','Kiểm tra lốp dự phòng','safety',15,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(16,'wheel_alignment','Kiểm tra độ chính xác bánh xe','safety',16,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(17,'headlights_low_beam','Kiểm tra đèn pha cốt thấp','safety',17,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(18,'headlights_high_beam','Kiểm tra đèn pha cốt cao','safety',18,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(19,'tail_lights','Kiểm tra đèn hậu','safety',19,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(20,'brake_lights','Kiểm tra đèn phanh','safety',20,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(21,'turn_signals','Kiểm tra đèn xi-nhan','safety',21,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(22,'hazard_lights','Kiểm tra đèn cảnh báo nguy hiểm','safety',22,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(23,'reverse_lights','Kiểm tra đèn lùi','safety',23,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(24,'license_plate_lights','Kiểm tra đèn biển số','safety',24,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(25,'windshield_condition','Kiểm tra kính chắn gió (nứt, vỡ)','safety',25,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(26,'windshield_wipers','Kiểm tra gạt nước','safety',26,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(27,'side_mirrors','Kiểm tra gương chiếu hậu bên','safety',27,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(28,'rearview_mirror','Kiểm tra gương chiếu hậu trong','safety',28,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(29,'horn','Kiểm tra còi xe','safety',29,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(30,'seat_belts_front','Kiểm tra dây đai an toàn trước','safety',30,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(31,'seat_belts_rear','Kiểm tra dây đai an toàn sau','safety',31,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(32,'doors_hood_trunk','Kiểm tra cửa xe, nắp ca-pô, cốp sau','safety',32,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(33,'fuel_system_leaks','Kiểm tra rò rỉ nhiên liệu','safety',33,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(34,'radiator_coolant','Kiểm tra nước làm mát','safety',34,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(35,'coolant_hoses','Kiểm tra ống dẫn nước làm mát','safety',35,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(36,'battery_condition','Kiểm tra ắc quy','safety',36,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(37,'electrical_wiring','Kiểm tra hệ thống dây điện','safety',37,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(38,'exhaust_system','Kiểm tra hệ thống xả','safety',38,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(39,'muffler_condition','Kiểm tra ống xả/giảm thanh','safety',39,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(40,'engine_oil_level','Kiểm tra mức dầu động cơ','safety',40,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(41,'engine_oil_leaks','Kiểm tra rò rỉ dầu động cơ','safety',41,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(42,'emission_co_level','Đo nồng độ CO (Carbon Monoxide)','emission',101,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(43,'emission_hc_level','Đo nồng độ HC (Hydrocarbons)','emission',102,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(44,'emission_co2_level','Đo nồng độ CO2 (Carbon Dioxide)','emission',103,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(45,'emission_o2_level','Đo nồng độ O2 (Oxygen)','emission',104,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(46,'emission_lambda_value','Đo giá trị Lambda (tỷ lệ không khí/nhiên liệu)','emission',105,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(47,'emission_smoke_opacity','Đo độ đen khói (Diesel)','emission',106,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(48,'emission_nox_level','Đo nồng độ NOx (Nitrogen Oxides)','emission',107,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(49,'catalytic_converter','Kiểm tra bộ xúc tác khí thải','emission',108,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(50,'egr_system','Kiểm tra hệ thống EGR (Exhaust Gas Recirculation)','emission',109,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(51,'evap_system','Kiểm tra hệ thống EVAP (Evaporative Emission Control)','emission',110,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(52,'vin_verification','Xác minh số VIN/số khung','both',201,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(53,'engine_number_verification','Xác minh số máy','both',202,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(54,'license_plate_verification','Xác minh biển số xe','both',203,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(55,'vehicle_documents','Kiểm tra giấy tờ xe','both',204,0,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000'),(56,'overall_vehicle_condition','Đánh giá tổng thể tình trạng xe','both',205,1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000');
/*!40000 ALTER TABLE `checklist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ward` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apple_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL,
  `email_verified` tinyint(1) NOT NULL,
  `total_orders` int NOT NULL,
  `completed_orders` int NOT NULL,
  `total_spent` decimal(12,2) NOT NULL,
  `loyalty_points` int NOT NULL,
  `membership_tier` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `preferred_language` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  `id_issued_date` date DEFAULT NULL,
  `id_issued_place` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `facebook_id` (`facebook_id`),
  UNIQUE KEY `apple_id` (`apple_id`),
  CONSTRAINT `customers_user_id_28f6c6eb_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Nguyen Van A','0736283932',NULL,'1990-05-20','male','123 Le Loi, Quy Nhon','Hà Nội','Đống Đa','Láng Thượng',NULL,NULL,NULL,1,0,3,3,1140000.00,150,'silver','vi','Asia/Ho_Chi_Minh','2026-03-02 00:00:00.000000','2026-04-15 03:29:29.665196',2,'2020-01-15','Cuc Canh sat QLHC ve TTXH','052203001234'),(2,'Trần Thị B','0987654321',NULL,'1990-08-20','female','456 Đường XYZ, Phường 2','TP. Hồ Chí Minh','Quận 1','Bến Thành',NULL,NULL,NULL,1,0,2,2,680000.00,100,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',3,NULL,NULL,NULL),(3,'Nguyễn Văn A','0901234567',NULL,'1990-05-15','male','123 Nguyễn Huệ, Q1, TP.HCM','Hà Nội','Cầu Giấy','Cổ Nhuế',NULL,NULL,NULL,1,1,1,1,340000.00,50,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 00:00:00.000000','2026-04-09 06:39:38.136780',4,'2015-01-10','Công an TP.HCM','001234567890'),(4,'Phạm Thị D','0934567890',NULL,'1992-11-25','female','321 Đường GHI, Phường 4','Đà Nẵng','Hải Châu','Hòa Thuận Tây',NULL,NULL,NULL,1,0,1,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',5,NULL,NULL,NULL),(5,'khang','0911111111',NULL,'2005-08-09','male','263HVT','TP. Hồ Chí Minh','Tân Bình','Phường 4',NULL,NULL,NULL,1,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 00:00:00.000000','2026-04-20 07:02:42.656094',6,'2016-08-09','cục công an','0666666666'),(7,'levanchien','0382786317',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 08:19:33.685023','2026-03-02 08:19:33.685062',12,NULL,NULL,NULL),(8,'lethichien','0973685142',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-02 08:25:59.098734','2026-03-02 08:25:59.098764',13,NULL,NULL,NULL),(9,'haha','0456384712',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-03 10:16:41.683192','2026-03-03 10:16:41.683211',14,NULL,NULL,NULL),(10,'Nguyen Van A','0736283935',NULL,'1990-05-20',NULL,'123 Le Loi,Quy Nhon',NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-03 11:39:54.144528','2026-04-14 07:43:26.465629',15,'2020-01-15','Cuc Canh sat QLHC ve TTXH','052203001234'),(11,'','0123456789',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-04 03:53:56.378405','2026-03-04 03:53:56.378427',16,NULL,NULL,NULL),(12,'','0919443838',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,0,0,0,0.00,0,'bronze','vi','Asia/Ho_Chi_Minh','2026-03-09 04:44:28.925268','2026-03-09 04:44:28.925286',18,NULL,NULL,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2026-03-03 03:50:18.707306','7','nv001',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',4,1),(2,'2026-03-03 03:50:49.291682','7','nv001',2,'[{\"changed\": {\"fields\": [\"password\"]}}]',4,1),(3,'2026-03-07 14:48:58.757660','17','0835641299',1,'[{\"added\": {}}]',4,1),(4,'2026-03-13 04:52:49.328607','6','Tài xế',1,'[{\"added\": {}}]',13,1),(5,'2026-03-13 04:53:15.278327','2','NV002 - Trần Văn G',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',17,1),(6,'2026-03-13 06:38:13.309368','11','DK2026030447A0B9 - ',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(7,'2026-03-13 06:38:39.165027','11','DK2026030447A0B9 - ',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(8,'2026-03-16 06:58:52.063775','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(9,'2026-03-16 10:02:07.459623','1','NV001 - Nguyễn Văn F',2,'[{\"changed\": {\"fields\": [\"Role\"]}}]',17,1),(10,'2026-03-16 10:02:33.775325','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(11,'2026-03-16 10:02:47.472414','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(12,'2026-03-16 10:24:28.876245','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(13,'2026-03-16 10:24:39.875762','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(14,'2026-03-19 08:16:02.343485','11','DK2026030447A0B9 - ',2,'[{\"changed\": {\"fields\": [\"Assigned staff\"]}}]',11,1),(15,'2026-03-19 08:16:11.429057','10','DK2026030374058E - ',2,'[{\"changed\": {\"fields\": [\"Assigned staff\", \"Staff notes\"]}}, {\"changed\": {\"name\": \"Nh\\u1eadn xe\", \"object\": \"Receipt: DK2026030374058E - draft\", \"fields\": [\"Fuel level\"]}}]',11,1),(16,'2026-03-19 08:17:08.809584','8','DK20260305VWX234 - Hoàng Văn E',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(17,'2026-03-19 08:17:41.575280','8','DK20260305VWX234 - Hoàng Văn E',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(18,'2026-03-19 08:32:39.948458','9','DK202603036C8E4A - ',2,'[{\"changed\": {\"fields\": [\"Status\", \"Assigned staff\"]}}]',11,1),(19,'2026-03-19 08:32:54.992651','8','DK20260305VWX234 - Hoàng Văn E',2,'[{\"changed\": {\"fields\": [\"Status\", \"Assigned staff\"]}}]',11,1),(20,'2026-03-21 11:01:12.247267','4','Receipt: DK20260210JKL012 - condition_checked',2,'[{\"changed\": {\"fields\": [\"Status\", \"Fuel level\"]}}]',28,1),(21,'2026-03-21 11:01:29.923453','4','Receipt: DK20260210JKL012 - vehicle_inspected',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',28,1),(22,'2026-03-21 11:01:43.920286','4','Receipt: DK20260210JKL012 - draft',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',28,1),(23,'2026-03-21 11:02:10.803221','4','Receipt: DK20260210JKL012 - condition_checked',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',28,1),(24,'2026-03-21 11:02:46.068281','4','Receipt: DK20260210JKL012 - vehicle_inspected',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',28,1),(25,'2026-03-21 11:05:51.654803','4','Receipt: DK20260210JKL012 - completed',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',28,1),(26,'2026-03-21 11:06:47.139239','4','DK20260210JKL012 - Trần Thị B',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(27,'2026-03-23 03:13:20.655150','1','Xe máy - 433,000đ',2,'[{\"changed\": {\"fields\": [\"Ph\\u00ed \\u0111\\u0103ng ki\\u1ec3m\", \"Ph\\u00ed d\\u1ecbch v\\u1ee5\", \"Ph\\u00ed \\u0111\\u01b0\\u1eddng b\\u1ed9\"]}}]',19,1),(28,'2026-03-23 03:58:44.667633','1','Xe máy - 433,000đ',2,'[]',19,1),(29,'2026-03-24 06:19:21.140776','13','DK202603058287EB - ',2,'[{\"changed\": {\"fields\": [\"Assigned staff\"]}}]',11,1),(30,'2026-03-25 02:14:51.480721','3','DK20260220GHI789 - Nguyễn Văn A (Đã phân công)',2,'[{\"changed\": {\"fields\": [\"Status\", \"Staff notes\"]}}, {\"changed\": {\"name\": \"Nh\\u1eadn xe\", \"object\": \"Receipt: DK20260220GHI789 - completed\", \"fields\": [\"Fuel level\"]}}]',11,1),(31,'2026-03-25 02:15:02.392261','7','DK20260302STU901 - Phạm Thị D (Đã phân công)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(32,'2026-03-25 02:15:46.953614','2','confirmed - Đã xác nhận',3,'',34,1),(33,'2026-03-26 04:04:59.339842','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}, {\"changed\": {\"name\": \"Nh\\u1eadn xe\", \"object\": \"Receipt: DK20260202DEF456 - draft\", \"fields\": [\"Fuel level\"]}}]',11,1),(34,'2026-03-26 04:15:55.594473','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(35,'2026-03-26 04:16:18.283941','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[]',11,1),(36,'2026-03-26 04:19:00.985370','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(37,'2026-03-26 04:20:39.693795','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(38,'2026-03-26 04:31:19.963976','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(39,'2026-03-26 04:48:29.167742','4','Xe 7-9 chỗ - 713,000đ',2,'[{\"changed\": {\"fields\": [\"Ph\\u00ed d\\u1ecbch v\\u1ee5\", \"Ph\\u00ed \\u0111\\u01b0\\u1eddng b\\u1ed9\"]}}]',19,1),(40,'2026-03-26 06:46:02.302822','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(41,'2026-03-26 06:50:10.516879','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(42,'2026-03-26 06:51:07.186419','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(43,'2026-03-26 06:57:47.597295','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(44,'2026-03-26 07:06:03.520637','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\", \"Completed at\"]}}]',11,1),(45,'2026-03-26 07:15:59.412500','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(46,'2026-03-26 07:32:09.028560','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(47,'2026-03-26 07:52:07.522382','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(48,'2026-03-26 12:32:17.919646','2','Receipt: DK20260202DEF456 - draft',2,'[]',28,1),(49,'2026-03-26 12:48:00.229413','2','Receipt: DK20260202DEF456 - draft',2,'[{\"changed\": {\"fields\": [\"Customer signature\", \"Staff signature\"]}}]',28,1),(50,'2026-03-26 12:48:40.518615','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(51,'2026-03-26 12:50:42.881819','2','Receipt: DK20260202DEF456 - draft',2,'[{\"changed\": {\"fields\": [\"Staff signature\"]}}]',28,1),(52,'2026-03-26 12:51:01.528575','2','Receipt: DK20260202DEF456 - draft',2,'[]',28,1),(53,'2026-03-26 12:51:14.984680','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(54,'2026-03-26 13:17:53.160887','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(55,'2026-03-26 13:19:11.949251','2','Receipt: DK20260202DEF456 - draft',2,'[{\"changed\": {\"fields\": [\"Customer signature\"]}}]',28,1),(56,'2026-03-26 13:19:54.212992','2','Receipt: DK20260202DEF456 - draft',2,'[{\"changed\": {\"fields\": [\"Customer signature\"]}}]',28,1),(57,'2026-03-26 13:20:05.394137','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(58,'2026-03-26 13:24:17.700162','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(59,'2026-03-26 13:41:44.465923','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(60,'2026-03-26 13:47:00.621269','2','DK20260202DEF456 - Nguyễn Văn A (Hoàn thành)',2,'[]',11,1),(61,'2026-03-26 13:49:58.220626','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(62,'2026-04-02 06:40:37.397856','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(63,'2026-04-02 06:42:51.064702','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(64,'2026-04-02 07:37:01.387162','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(65,'2026-04-02 07:44:46.922002','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(66,'2026-04-02 08:42:23.098547','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\", \"Completed at\"]}}]',11,1),(67,'2026-04-02 09:12:53.815722','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(68,'2026-04-03 02:40:52.721875','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(69,'2026-04-03 15:30:17.308355','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(70,'2026-04-10 05:35:32.770071','2','DK20260202DEF456 - Nguyễn Văn A (Đang thực hiện)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(71,'2026-04-10 05:36:02.986495','2','DK20260202DEF456 - Nguyễn Văn A (Đã nhận xe)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(72,'2026-04-10 05:36:41.009849','2','DK20260202DEF456 - Nguyễn Văn A (Đang thực hiện)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(73,'2026-04-10 05:39:45.711652','2','DK20260202DEF456 - Nguyễn Văn A (Đang thực hiện)',2,'[]',11,1),(74,'2026-04-15 03:25:43.005640','2','Receipt: DK20260202DEF456 - completed',3,'',28,1),(75,'2026-04-15 03:32:54.887933','2','DK20260202DEF456 - Nguyen Van A (Đang thực hiện)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}, {\"changed\": {\"name\": \"Nh\\u1eadn xe\", \"object\": \"Receipt: DK20260202DEF456 - condition_checked\", \"fields\": [\"Fuel level\", \"Photo rear url\", \"Additional notes\"]}}]',11,1),(76,'2026-04-15 03:51:40.080666','2','DK20260202DEF456 - Nguyen Van A (Đang thực hiện)',2,'[{\"changed\": {\"fields\": [\"Status\"]}}]',11,1),(77,'2026-04-15 03:55:04.338643','2','Biên bản trả xe - DK20260220GHI789',3,'',31,1),(78,'2026-04-15 03:55:22.716694','5','Biên bản trả xe - DK20260202DEF456',3,'',31,1),(79,'2026-04-17 07:31:19.892576','6','Receipt: DK20260305VWX234 - initialized',3,'',28,1),(80,'2026-04-17 07:49:41.015191','8','DK20260305VWX234 - khang nhan (Đã phân công)',2,'[{\"changed\": {\"fields\": [\"Estimated amount\"]}}, {\"changed\": {\"name\": \"Nh\\u1eadn xe\", \"object\": \"Receipt: DK20260305VWX234 - initialized\", \"fields\": [\"Fuel level\"]}}]',11,1),(81,'2026-04-17 07:51:27.201613','10','Receipt: DK20260305VWX234 - initialized',3,'',28,1),(82,'2026-04-17 07:56:52.680619','7','DK20260302STU901 - Phạm Thị D (Đã phân công)',2,'[{\"changed\": {\"fields\": [\"Estimated amount\"]}}]',11,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(25,'api','chatmessage'),(9,'api','checklistitem'),(10,'api','customer'),(35,'api','inspectionimagerequirement'),(36,'api','mediafile'),(27,'api','notification'),(11,'api','order'),(22,'api','orderchecklist'),(32,'api','orderservice'),(34,'api','orderstatus'),(21,'api','orderstatushistory'),(12,'api','otp'),(20,'api','payment'),(37,'api','paymentlog'),(24,'api','permission'),(19,'api','pricing'),(18,'api','rating'),(38,'api','refund'),(13,'api','role'),(26,'api','rolepermission'),(33,'api','service'),(17,'api','staff'),(14,'api','station'),(23,'api','systemsetting'),(29,'api','timeslot'),(39,'api','transaction'),(16,'api','vehicle'),(28,'api','vehiclereceiptlog'),(30,'api','vehiclereturnadditionalcost'),(31,'api','vehiclereturnlog'),(15,'api','vehicletype'),(40,'api','walletbalance'),(41,'api','wallethistory'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(7,'authtoken','token'),(8,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-03-02 03:47:16.616692'),(2,'auth','0001_initial','2026-03-02 03:47:17.210192'),(3,'admin','0001_initial','2026-03-02 03:47:17.465649'),(4,'admin','0002_logentry_remove_auto_add','2026-03-02 03:47:17.473810'),(5,'admin','0003_logentry_add_action_flag_choices','2026-03-02 03:47:17.482977'),(6,'api','0001_initial','2026-03-02 03:47:18.726745'),(7,'contenttypes','0002_remove_content_type_name','2026-03-02 03:47:18.788189'),(8,'auth','0002_alter_permission_name_max_length','2026-03-02 03:47:18.840220'),(9,'auth','0003_alter_user_email_max_length','2026-03-02 03:47:18.861842'),(10,'auth','0004_alter_user_username_opts','2026-03-02 03:47:18.872898'),(11,'auth','0005_alter_user_last_login_null','2026-03-02 03:47:18.917560'),(12,'auth','0006_require_contenttypes_0002','2026-03-02 03:47:18.921441'),(13,'auth','0007_alter_validators_add_error_messages','2026-03-02 03:47:18.934387'),(14,'auth','0008_alter_user_username_max_length','2026-03-02 03:47:18.951770'),(15,'auth','0009_alter_user_last_name_max_length','2026-03-02 03:47:18.967943'),(16,'auth','0010_alter_group_name_max_length','2026-03-02 03:47:18.994116'),(17,'auth','0011_update_proxy_permissions','2026-03-02 03:47:19.022647'),(18,'auth','0012_alter_user_first_name_max_length','2026-03-02 03:47:19.036356'),(19,'authtoken','0001_initial','2026-03-02 03:47:19.115283'),(20,'authtoken','0002_auto_20160226_1747','2026-03-02 03:47:19.157435'),(21,'authtoken','0003_tokenproxy','2026-03-02 03:47:19.162679'),(22,'authtoken','0004_alter_tokenproxy_options','2026-03-02 03:47:19.169610'),(23,'sessions','0001_initial','2026-03-02 03:47:19.202670'),(24,'api','0002_orderchecklist_check_type_orderchecklist_checked_by_and_more','2026-03-02 09:12:41.588481'),(25,'api','0003_permission_systemsetting_notification_chatmessage_and_more','2026-03-02 09:21:07.026185'),(26,'api','0004_alter_customer_full_name','2026-03-03 10:33:52.822557'),(27,'api','0005_remove_staff_station','2026-03-04 05:24:55.138203'),(28,'api','0006_vehiclereceiptlog','2026-03-04 11:36:30.480075'),(44,'api','0007_timeslot','2026-03-26 03:55:45.576801'),(45,'api','0008_order_cancelled_at_order_confirmed_at','2026-03-26 03:55:45.583321'),(46,'api','0009_customer_id_issued_date_customer_id_issued_place_and_more','2026-03-26 03:55:45.585472'),(47,'api','0010_vehiclereceiptlog_vehicle_insurance_url_and_more','2026-03-26 03:55:45.588812'),(48,'api','0011_vehiclereceiptlog_engine_check_photo_and_more','2026-03-26 03:55:45.591796'),(49,'api','0012_vehiclereceiptlog_completed_at_and_more','2026-03-26 03:55:45.595037'),(50,'api','0013_alter_vehiclereceiptlog_completed_at_and_more','2026-03-26 03:55:45.597600'),(51,'api','0014_vehiclereturnlog_handover_checklist','2026-03-26 03:55:45.600006'),(52,'api','0015_alter_vehiclereturnadditionalcost_cost_type','2026-03-26 03:55:45.633747'),(53,'api','0016_order_driver_current_lat_order_driver_current_lng_and_more','2026-03-26 03:55:45.635998'),(54,'api','0017_alter_order_driver_location_updated_at','2026-03-26 03:55:45.639078'),(55,'api','0018_service_alter_checklistitem_options_and_more','2026-03-26 03:55:45.641223'),(56,'api','0019_alter_vehiclereturnlog_status','2026-03-26 03:55:45.644681'),(57,'api','0020_alter_order_status_alter_pricing_registration_fee','2026-03-26 03:55:45.646971'),(58,'api','0021_order_status_legacy_alter_pricing_inspection_fee_and_more','2026-03-26 03:55:45.649907'),(60,'api','0022_order_contract_document_and_more','2026-03-26 03:59:36.965084'),(61,'api','0023_order_payment_completed_at_order_payment_method_and_more','2026-03-26 08:39:59.944766'),(62,'api','0024_alter_order_payment_method_and_more','2026-03-26 12:46:30.073628'),(63,'api','0025_order_contract_document_pdf','2026-04-02 05:03:06.527101'),(64,'api','0026_inspectionimagerequirement_mediafile_and_more','2026-04-15 02:26:17.443791'),(65,'api','0013_inspectionimagerequirement_mediafile','2026-04-15 02:59:31.089282'),(66,'api','0014_seed_inspection_image_requirements','2026-04-15 03:00:01.631328'),(67,'api','0015_rename_iir_stage_active_idx_inspection__stage_fa4362_idx_and_more','2026-04-15 03:01:52.998394'),(68,'api','0015_expand_inspection_image_requirements','2026-04-15 03:01:57.487312'),(69,'api','0016_merge_0015_branches','2026-04-15 03:01:57.534679'),(70,'api','0017_payment_payos_fields_and_logs','2026-04-17 07:26:59.162932'),(71,'api','0018_wallet_and_refund','2026-04-17 07:26:59.601075'),(72,'api','0019_add_transaction_table','2026-04-17 07:26:59.689000'),(73,'api','0020_remove_wallet_tables','2026-04-17 09:39:57.139425'),(74,'api','0021_remove_refund_and_legacy_payment_status','2026-04-17 09:39:57.220994');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('0d0mymc1xoz1bvpyvh39409fmaw4pq8n','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VSl:OLNUcM7vEXQveDdJCWaYkpirqOulJ_D1SMTyibQ5dn4','2026-03-26 02:07:47.032788'),('0e8578cwz5f77bl346izqha35t3q4g3c','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3DF0:m2bt_B7uO489vnNSuU1itI5-fl4wyyOTboVRvtlGJXA','2026-04-02 13:16:46.281712'),('0h1lohzh75wgso664rcgbnjhd46s6fpz','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vysuA:SRbpky5CHeGUqiCEG67a4Q5y71j6kjicC09c5VE4kdo','2026-03-21 14:45:22.385402'),('0i7y1iamz6hkjywzuwv89rleqra94mho','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCHJX:mqPUkBe38jvAOa0GR24jw3cKDIHVmiuGoJkE0yLZUgE','2026-04-27 13:26:55.927340'),('0k8gl617ag9qvy9vogypobido2jjh2i7','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Vtt:miUpzo1-2NmlTT14EJLjSK9HCZCaQBERQzdYGPVBkGI','2026-03-26 02:35:49.351780'),('0s6oaeb4is7njaj84441djah22rn9did','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wDIUi:X7TE6bNe0HU4RyhcWJKs4_5ldI_jmRjwQvD9qsgkths','2026-04-30 08:54:40.780151'),('0v2134n27nhq0fnvt3runmz0tn1fzl4k','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w22t7:IsW3HCFVwAXr_1Jl5TM4vSpemW2MYr0werQP3yfZuu0','2026-03-30 08:01:21.591617'),('1ggt6hnraxny0vspajsjhi3eql2wjqgx','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VtY:rOAjHqM0nVoht5vc1bE3wm-SPj87wmFC-uP-HetVjTs','2026-03-26 02:35:28.573330'),('1gu0oe0qhdps3s2askmazb2a6s327rb6','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vzSXU:LdDiQbCJlWEwL-5tQOIWgKOm7NrYjl3NdBpfR8O9YQo','2026-03-23 04:48:20.875688'),('1l2b4homn6hlpzjes49k4xh0zfidujus','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCZig:xGMl5OD24krSvptycLseQ8FKm_a2wfJUe7djc15dHeQ','2026-04-28 09:06:06.105750'),('2a6x9vjlqf7ywxa7hq04twf71v0cztoy','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Vik:1SL0zdmGO1wljrbK3tmSaae9X88Jz0ipk-vk-bOOgNw','2026-03-26 02:24:18.346229'),('2bw5yho9poaoh0icoiz9s9ef2uu6f56r','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wDIcV:rybhQDXx-dTHuQqXnJoPevBqKB-G703HBBOwEoP-g7E','2026-04-30 09:02:43.724483'),('2e01tj9gmqm0jpp7bgstp61na471mb8t','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w0aXQ:P8PmuUyHa32nvrpuMGLmCzIsgaipcNj7ggWKxSGrhTA','2026-03-26 07:32:56.584424'),('2oczme654sti51w5cas5ujdiqdw0xscy','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Vqc:Jeip01S1NTT_uUkhm72vGuprOqJZsHOtTeYNUqniExE','2026-03-26 02:32:26.021217'),('2s78hfeoy5poedj7few1hpbx8egci9t2','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5OrX:m9hcFz9ay5nkZDEF4DT_p8L7CQfFRM-1dQCGRUd_MhY','2026-04-08 14:05:35.036795'),('39f9b4v2s53nggsc094ll97jt1efu0mq','.eJxVjDsOwyAQRO9CHSF-XiBlep_BWhYITiKQjF1FuXtsyUVSzrw382YTbmuZtp6WaY7syqRkl98yID1TPUh8YL03Tq2uyxz4ofCTdj62mF630_07KNjLvhYYwuCFohyVHRJZL0FC9gMYApNQa2PAArg9oTDCKeUUWZ2yI-GiY58v7-c3Iw:1vwvXa:qwn5u4S0Jh28dCTtWZKx4XIKhzOpQg1NgIv2eFbsWM4','2026-03-16 05:09:58.769238'),('3nshiekmmfoiigidaei5hgyg7c90xlzq','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxhKD:pHfOJRUQ_vA6xWdJKmzVeXKE-io0Mfh7Q3ZJpvJmrb8','2026-03-18 08:11:21.417589'),('3u63zcx6o7ay81xodbetcz3x64caq1hc','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IVJdvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_xbU3HQ:1vwymF:Kt-4QjnGS0GCMpBTsfI4q2R8ugmFvcy2g5KjjWjy5hg','2026-03-16 08:37:19.428882'),('3xandw4owlp8oz2ctpon5iffogmiws4s','.eJxVjEEOwiAQRe_C2pAyZKC6dO8ZyDAMUjWQlHbVeHdt0oVu_3vvbyrQupSwdpnDlNRFGVCn3zESP6XuJD2o3pvmVpd5inpX9EG7vrUkr-vh_h0U6uVb00icwUSxgskiQQIcz5ac-IRIbAabSUxEGXymGI1ndABgs3dM2an3ByofON0:1vwyV3:6a29grlebES7BDzeZOszvEHSjF6RUJvCO64LKNcK5hQ','2026-03-16 08:19:33.715202'),('4ken3iquds4o8axmyvx48ktut60b8hen','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxEKj:bHao9mt6S4ZhAji8sw-XCkm8MvKrOWe4SfofCFSnqqg','2026-03-17 01:13:57.389853'),('4qqbd1m1gfbjx4sw0b4fkl25ybms4dfz','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vy2te:zPfV_76yyBvkgC0wK6IZFGpgcX5RcB3PJnH4msB9m-4','2026-03-19 07:13:22.815197'),('5mp669bbj5rz3bs2hf34nxbcj2upmfbl','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxF4a:_AtaQrpO6A-0H-0fWQZAWhn9B4-KIv881Eef3cyMDdM','2026-03-17 02:01:20.853329'),('5zoeda37xuytnsbjgdanisa8b2xlx3du','.eJxVjDEOwjAMRe-SGUVJqrguIztniOzYIQXUSk07Ie4OlTrA-t97_2USbWtNW9MljWLOxqM5_Y5M-aHTTuRO0222eZ7WZWS7K_agzV5n0eflcP8OKrX6rQshMBcm4gFYocPcq2bnkHFg9cGTdIhZHWSFKFSAI8S-EwmBSM37A1BNObc:1vzSUD:_Cd4xXQm4X5nJsAexrOlGy7az0YspsffQUydFEwnDcg','2026-03-23 04:44:57.771294'),('6054tqpnv3ngtthunnte1zjwq071kbtz','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w37tc:OiHB7DEpMkFpHiacsWHJFTrTY9xqPoToSu9BZ9o41sI','2026-04-02 07:34:20.853803'),('61k666tmfqs9cp7b9hjxcwhybwfxo1oo','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w1KNi:wgCLg16m4zcwSAejkhylot31e5UUy_Mbih7kEnVKP18','2026-03-28 08:29:58.658791'),('65b03hfa15x3iraqjkpya2msgqferqnq','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w7St3:tAHq75NrUNnLsHfHrKx6kVn8kqvsO2k7o_8izAxHmJI','2026-04-14 06:47:41.355548'),('65nf9u0od44x0mfru58b1jpy5lmmfq32','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w7rmY:MW5LatL7n3erGY5-sry6_7BCDaQVWVbGxJCpodD6SII','2026-04-15 09:22:38.889128'),('6jangdc0meke28804ps3irhxn8qdwc9g','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCHtP:sa2hyPoYtEadLEO0hIBS3VFPNZmt-BdB1mPq6bQIgFU','2026-04-27 14:03:59.612858'),('77oydi95hse0grud6ddax94pjwm8whgt','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0X7b:VRAyXSTcTh3E9AezWOLzibxRZ_5cn3dBaLCtxdnMFG8','2026-03-26 03:54:03.283499'),('7lr8ceatpkwxqefa0l3mzlrv4dfbpcsi','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w8VYH:KIlLgulA1UPdiRdKS_rm7SVR3sjYI3YntRSNMmbwo8A','2026-04-17 03:50:33.036082'),('7w5heowxvpkg04j2xdljvfv30cdur58s','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w7rer:-2ngGkB89Wp8IbTpkuIwvS-x7ah7R6uvkHTc6OPnNjA','2026-04-15 09:14:41.215958'),('8eitbnh1d18bgbl78sh3ebyuwqrog3xw','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wDHDR:WKeGbBgADJEuz_xb_V4r4tNgbAnqgL--G0PgDRgGyS8','2026-04-30 07:32:45.177427'),('8i0s2pd7j3k0r1cf0d1b5bui2o2ycj4i','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3RMo:pfVnzkj1dEuWASB2Y4egE1BPwxemj9J56TstwaYE58g','2026-04-03 04:21:46.605641'),('8pbht1jzw97qd54b4lgbm9nk2s7mri1v','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w7sOz:haSlNq22h_5S7qEVDvyt-_yWwQq-3Fq0VB0h7dlH_6w','2026-04-15 10:02:21.660542'),('94t8t4giz25y1ymmq48yyj101batk9h3','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxgmd:Q_so9aOv-kkD7EP0Offa4mMt5wM-4TBXZonlc-vZcck','2026-03-18 07:36:39.438372'),('aggykjhi7sp35axl049upq33t6g6dqzs','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w37mr:SUXhwWLD177OSYgJ_S7x77Hs_TFfmZm7_oV0aYmHKHQ','2026-04-02 07:27:21.772177'),('ak4ihyb05vr4e567vr56u25ifqo1rci3','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w1fiZ:59pufekP240NAzh2ZuJ8SeTRlhdzguRSpH5VYI3os7U','2026-03-29 07:16:55.986691'),('apngtt70w2qic4c3pujc6j4yoc8a275r','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w22Uj:uNI6Q5SpJHrgURH0BUntV5EnJOBCydmY5fENIffygm0','2026-03-30 07:36:09.762007'),('axo3bhwj11r6qmoxyhdmr42nzwico5dt','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Va5:dn1-xtCv1PGDjM7rBEJUWbtJG-kkqqDmiGt_GzV1C3o','2026-03-26 02:15:21.994515'),('bqco7z3urvtilruf6p80jeltc7psrl7q','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IVJdvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_xbU3HQ:1vwupP:YEOc3ukj9uKVmgQIVKVjkusno7EP5LdEJL9w_xES2u0','2026-03-16 04:24:19.930244'),('c20hb84uqtk1ff0izb208aldneopazl6','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxhqb:E-N-h4UsTMAE7ZwEy-iN7H-N-bLm5MoHlbWbNAP2CNk','2026-03-18 08:44:49.686071'),('c2ou1tfiepezk0qhrc8aqpn6x44pml2y','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VMb:F1oZG6_TPr4sf6OCosuQ-hRhaeQTGAsXL8T83rm2K7w','2026-03-26 02:01:25.586461'),('cgdjcfz2o5dl1i8pxg9tjx7anbsr64i3','.eJxVjEEOwiAQRe_C2pAyZKC6dO8ZyDAMUjWQlHbVeHdt0oVu_3vvbyrQupSwdpnDlNRFGVCn3zESP6XuJD2o3pvmVpd5inpX9EG7vrUkr-vh_h0U6uVb00icwUSxgskiQQIcz5ac-IRIbAabSUxEGXymGI1ndABgs3dM2an3ByofON0:1vwyWR:lSkBSVRADD24Rrv9_DR55sYCPRHjzvbIwirPxrJbtrI','2026-03-16 08:20:59.248375'),('cgitbvkl409z99l8zms1ke3s26fhv7zu','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1wDdfB:_ysJs0Qp6648ZVGGz6aoQ9O8zU-iDjPK5Y7ZNWtmUe0','2026-05-01 07:30:53.695913'),('csa12uqly6ghvmxt9lpq0knppiitddcr','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w4xoZ:oUspA3b3gvGElM2WhELQb5JObttnIaQrOcr1UdSWJTw','2026-04-07 09:12:43.406751'),('cvs74lnztpflok9d3foras7vqwpkw8ik','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VwG:B8hrjmz6phQGJ1rp_QoUs-iiEbmrciTRdazzho7HsW4','2026-03-26 02:38:16.835565'),('cx1x5p9uiqjonfwv8nlrqvbamlrbusdc','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1JPf:9qWEFbEkjCNtM71lRuzHxs7108lDd34fbJbeVNFnvGE','2026-03-28 07:27:55.294495'),('cxy1e356931elgwkr1diwe1z8g7w7dri','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w2rnj:lp3tAIGDZbncYiAHBve71_077qstezE2YnVrO5Cq8G0','2026-04-01 14:23:11.945017'),('dcb2d5tnivabh1pc53yyyev0lnfu9poj','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w75yr:o7eVYp7cB0HCdmJNsb0ATnSqb1aqcOqkGJx3XmNtwWk','2026-04-13 06:20:09.050218'),('donwupett35bhv109q38slqqq3kxqmen','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxyYE:-aSEbr_y20EqHZ8On8SrF-BCqNbQXz6mUIy0Wttx98g','2026-03-19 02:34:58.590059'),('e0hwsfriihzzmspiru11eq5ga2k57glo','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w5GBC:P3uFKFfIuv7DKAwkDAKIjEJFQt-VyTChGwrTPIJpM8w','2026-04-08 04:49:18.688800'),('e68jgpos4ppamdbs68n7v4ncgz4sjklf','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3yAv:NSSPbt-piPCJ2piNr_1TUdy7FJHp1pkPGaA1P7K7obQ','2026-04-04 15:23:41.259167'),('eizykdvqzvbta9vr06xg94fzdb6h1v2k','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1wEqHP:1Q0bOZurVaspumX2hLZcG3YOi-vEt76DXEnWzas6GOs','2026-05-04 15:11:19.468441'),('eu4bdi7m66493xkxs5mfp1ob1gpvxw4t','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IVJdvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_xbU3HQ:1vwz4T:m6KWRQL4WaTl9bT73t-bMEGxeD1NWa-o5j5onq_zu-E','2026-03-16 08:56:09.868662'),('evzz2jlbfbai3vxironawxfynkysk0ix','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VLy:bztIfrgU9NkC_MdBawx9WcHE0HOU87PFgRJlqdWzwbQ','2026-03-26 02:00:46.180351'),('ex5fcr4fsrivnodx0bpo2wgx17m4dscr','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5JGk:PUpexbvdnqU5TEgmBrgDwW_N1ac0TTowzpWpjTD_1E4','2026-04-08 08:07:14.667556'),('f15l88sysjqytgqxd7vg6vfguthmgdri','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5eDB:HeSH3Zx0I4V2oSl1HDZllcFYunCbsQKkCuZU_pQ-Op8','2026-04-09 06:28:57.699399'),('fena15p4xad0o1v725nca78l1af0ifpx','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VLX:BdlGze-XxLi0Vlez9YmSEGgO6RWxBJtMRL--fpvMy7E','2026-03-26 02:00:19.206223'),('ga6qwswey27488bbdvq3474xuvt6nh8v','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxhnW:inShCloua5dQTO4QJ85soDVQVKohZSGBD30nm36-pJI','2026-03-18 08:41:38.891765'),('gam8x7164763rinjrrgvuq3c0mzib706','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vzP5b:RQqNfKvx-jHe4ywUce7Qn1uGk94fUkvMNnwepcLv93g','2026-03-23 01:07:19.435846'),('gcv3wxb2nymzsffevulllg2x267d70mf','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w49T7:FIDwG84FhDMyGuTi3T7HbDwGjIpsp4OJCWXicEvKdZE','2026-04-05 03:27:13.466796'),('geecql8dr454s0kk72zg0ni07z8t8bm7','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCZXX:eh_2YssdwGHFEXDnP1x9MEvfSiaAcRZzUAquRUcrRoo','2026-04-28 08:54:35.706226'),('goc72ls0dkhpmu263vusx7rkj8t3t5p3','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w8AoN:gHSE3AM6yia_Os7OSO3U0alvwaT4qsJbU1qr7oRmFSQ','2026-04-16 05:41:47.182350'),('gosmekw2dml5iwskec45s03hsog0bv24','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCViI:VoF2WPQxuJ0096Y7qxWlH8d8gtLKQ0PyS_tLcm5REmo','2026-04-28 04:49:26.773220'),('gpq2pvi75bx6snbzhymkls180700jlpy','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VNJ:mzyU7ue88yjfxtm1daZXLNKNlsogWg5EIN-ru1IQaJo','2026-03-26 02:02:09.385329'),('gqf929xo5702flsv43nup2c5dj5braiz','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w1gVR:Hra3LmXIOICRlXMc-FZfL-egB1nG_vb7Lt4I6LB9uFM','2026-03-29 08:07:25.011588'),('gscz4d7tog4zifm0fcritrge01p2eoie','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxger:EtCKU88-m6S1XUbGK8Srx0Fk1VFg2s8hJHMVKSnTj_s','2026-03-18 07:28:37.602980'),('gsd582c2d0hhsyx7wd91weg68a1qfsut','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wE6ue:uvQU8EgNup2pMs4zGpT9e7lSzuH0P7Ln3bow6UfTgpM','2026-05-02 14:44:48.726574'),('h9q3cr7tjac4y4344m71q3m1de6mku1f','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IV5dvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_yUs3Iw:1vwxCP:KXXZsb_4J7TysO2pO8UDhAw-Vde2VbQ4D6pOzQaTwAs','2026-03-16 06:56:13.246639'),('hb74k6loxzmtt0qjd6pi6hsbi0axyjbv','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxF3h:c8mo6TYwk1PJnseHP_6wj4Y6ZYqzSwvpdIDrIqW7ko4','2026-03-17 02:00:25.988600'),('hdr2t3sscv080g8zopcst8kh312bknca','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w2Wgx:dHE2CUPD04HT4BnTeziv6fzrDScEgItXGCKDeI5OaXY','2026-03-31 15:50:47.249002'),('ht0zuc4uw9jii62dzn32xn3ouwwj2g1j','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxgh5:WPmz8-5IPgvhdIpxBhP6h1qwWCC1Q-8-GU6otJNYstQ','2026-03-18 07:30:55.952765'),('i2inaffy4ahzwvf1t3ufpv39w7egiybq','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCZnV:4TjJ5rEqj1MwNuYTXBOmonQq3QzNay_Ygc9txrZDHhE','2026-04-28 09:11:05.071118'),('i5x837rfh4cce1d89h1hlghdubht3nrf','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wENlo:0dCZHXCbcsj4ZO5hES3cWiRHJEzZuQyWcVINDdDLuDY','2026-05-03 08:44:48.084424'),('ibimlrc2i29ns7dcwejzoxt7d9t5m8te','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxkfx:d5Vh1Vuttf-3a5ItgxvQh4cNCSyzGxlGaLP6_f7-qek','2026-03-18 11:46:01.404976'),('ii2if7z5wc4v9fikl9gxee18b5b4t1jk','.eJxVjDsOwyAQRO9CHSF-XiBlep_BWhYITiKQjF1FuXtsyUVSzrw382YTbmuZtp6WaY7syqRkl98yID1TPUh8YL03Tq2uyxz4ofCTdj62mF630_07KNjLvhYYwuCFohyVHRJZL0FC9gMYApNQa2PAArg9oTDCKeUUWZ2yI-GiY58v7-c3Iw:1vwx7P:Bz5ncHhaRz3DBN2ywEkY3GIBSBbInDTMArBqpCd0AwA','2026-03-16 06:51:03.310268'),('iu5aqrboi0iorezprujhc05p84h3k2vn','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0X7a:2_O7xN_ki6Jj9qglecDkt-PeIJSv9eoxM9VpSVOYmdc','2026-03-26 03:54:02.031705'),('iyeqrjkcjkst601ozo7da3vn3m7nscaz','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxgeb:asJGeGAssAo_A4Zmg8WUkAXJpV1D_pwIorklBqjEXQ4','2026-03-18 07:28:21.257015'),('janygu4n6q038nnix9tz7zx9f113pp7p','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VlN:-aE1PRjtBWWSsh4rYghX5Cg9tfMaXy6Wm3nZ6K4lm5k','2026-03-26 02:27:01.697986'),('js3fqq0wvaadga0bmxqfqxmih25nuuqx','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCrji:te4AFKYbbfFgyTqySHUOsMzLH-8zwmLIhvoe9tORgmU','2026-04-29 04:20:22.271064'),('juhmczwcypvicuiomyprewn8jq7h89jj','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IVJdvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_xbU3HQ:1vwvtU:CojLN8JG9F6CbcOuSzOIGZCzIMKU1rR0t9ey1EcZZ-M','2026-03-16 05:32:36.289884'),('k2gd3z1irer2n4vmeio2n63xvj7gh49a','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VTh:D921i8_YJQAcJEyvXNL8zami2-oXpI6OfqJ1Xb1RA8s','2026-03-26 02:08:45.089384'),('kakravgc69uoe6zv3e2xbne6jnkw2ivg','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxGyT:nGdd9O1FOCH75jcHDOBRvygHemW2-1VpP8zn-KBvZqs','2026-03-17 04:03:09.067233'),('kgflcj1igx9ss9cv3xiq5q6dsk0120wm','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxFC7:ZXthZTsDjr8yDantodY6h0vOGfYLxcXyv1eoRuApPRY','2026-03-17 02:09:07.209107'),('kseiyimt5e8ubkf0o0dsfhcx4fykcorq','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vysqN:mL1Jqj8MV-vO6BKxUtUUCZoPdxR9-KIH68eupS-h6YI','2026-03-21 14:41:27.181858'),('l18yfgiadplchaqr8z7im83l12u7gfmx','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w23bE:7x-CwB3uLNaFlfstF6zEWbuYtaatlOV3RnLU2KB72GU','2026-03-30 08:46:56.985983'),('lk37jltgne4c19j0w4c3gi0cnd1kltb1','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wE676:sGkeJjmdtf49RvMv1LI8__qluloUj4w2E5BCu1YiyY0','2026-05-02 13:53:36.931103'),('lw6xlfgf6shh6iqts4ahaox19na9f2ij','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1E11:m0RHkuMb0F9s9phn9jnMTIFCz-pKpaukPi3Y5jqg0bs','2026-03-28 01:42:07.639450'),('m5xc9umzcix4arbo4q3xcp6vx3k9a0r3','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5eFq:_e8deHVgInKByZoCrnvtyXuxi1FNNkAvRZ7N7KDEGwE','2026-04-09 06:31:42.811131'),('mcii8ivtdg4kuqj4jt4jmr9fifd1ncza','.eJxVjDEOwjAMRe-SGUUkMW5hZOcMlR3bpIBaqWknxN1ppQ6w_vfef7uOlrl0S9Wp68VdXAB3-B2Z8lOHjciDhvvo8zjMU89-U_xOq7-Noq_r7v4dFKplrWMAyqQcWTicALkFtAiG0oKeTY6YG2mJLeEqQE5maMmUCEMK0rjPFzDoOU8:1vxMnx:V6Hh53Ut7tJhb8aXWSBIIVYk8oGnG5Zb3KIEP8Jf8A8','2026-03-17 10:16:41.708536'),('mkjcy79690tn43dhjbjolfdzaerv1bxg','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1Kx9:lDDhV3Zu18-sObhdxBo9CXIA-UQIfSyJrqI81t5I0ms','2026-03-28 09:06:35.576618'),('mthozz2sqs8hn4ngtp1nq8vne3wocirv','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w4ZUG:30OthMsZ-dGRKSJzeMXXm1eQiwcPvl67BZPimfbRxvs','2026-04-06 07:14:08.853956'),('muvkcbowmfcfrnn8lod5hyahxiyi07zq','.eJxVjEEOwiAQRe_C2pAyZKC6dO8ZyDAMUjWQlHbVeHdt0oVu_3vvbyrQupSwdpnDlNRFGVCn3zESP6XuJD2o3pvmVpd5inpX9EG7vrUkr-vh_h0U6uVb00icwUSxgskiQQIcz5ac-IRIbAabSUxEGXymGI1ndABgs3dM2an3ByofON0:1vwzL4:7Ccdr0d5Y8x6XEzftrOJER9iwhfDarhoNFDJOJSghnI','2026-03-16 09:13:18.735289'),('n1n3vx8qqricct6bk3j3n6j9buja3i8s','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w27op:v4_FYVu2rLrXCHhcBu8DpS69QJBKByJ9VdOB0J8CtNY','2026-03-30 13:17:15.307401'),('n2fismfp9et0tdwacskjaiehap25gbjw','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w37vA:Xg0DltXW1D4SJNOgEeKJ0NjZgxvkR_ESs_tq-3WOXs0','2026-04-02 07:35:56.556669'),('n4ftul2jmparuyuzl1o9xqz3ildophui','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Vxs:Rjgsp4w9OP-Lv4jeV1iLCn-La-SuqTg2vDMaT3ZAJ28','2026-03-26 02:39:56.408593'),('n5l32evligjdpwt10a20cin14ex4gvqf','.eJxVjMEOwiAQRP-FsyGFLhQ8eu83kIVlpWpoUtqT8d9tkx70NMm8N_MWAbe1hK3lJUwkrsKJy28XMT1zPQA9sN5nmea6LlOUhyJP2uQ4U37dTvfvoGAr-1oR-ARKOQ9EncHM3qB1pC30CDBEo1n5nrnbw-vI0Q1srIWUMjvL4vMF2l43-Q:1w1Jd7:HYTJau7f2HCp5ff8GnRjWDGdEnzDfQYPcRLjfKBOO44','2026-03-28 07:41:49.747541'),('n90ck1lvkt3h1h5jyiamofrn8udb5itj','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VMm:oi4V2Jaa6gG8kufnGNJadP_IAzl8l4W8fMu4oFhD8FA','2026-03-26 02:01:36.473099'),('ndjf0ngg4q8y8oejcq30awwowy0961j9','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w49no:lLAeYb3VMZe3jmr-oj2ymWALQqNRw6ekwbeGvxPr-W0','2026-04-05 03:48:36.402836'),('nyepeaww82ntrct7smvafadcu1ffg827','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w4YiW:b3g5h1CQMPKf3Bh5MFSAz_GmdbLmsJlmpUWVy2jkAHo','2026-04-06 06:24:48.063711'),('nyzsdxbpzsnhun4e0wsad30tnf76ogpc','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3wim:mRBtwufDxv7_V1TVyew3_JCEwty-TKH_-tZotAPVkO0','2026-04-04 13:50:32.623125'),('o47cwrxvujbf6gnpadvympvtb4gg7r17','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxhhD:99c8byt6wbcFLwVUwr1TMq9FunlqYrGMK74NbhvGhSs','2026-03-18 08:35:07.272362'),('o7i8eabryn2qrr2ftatuk7dibvvr2o53','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5yE0:ehbhbFRlrdKmLIDAGpciOAbkwPvpZthYGV5oQ3x8ISU','2026-04-10 03:51:08.399550'),('oa6y1ukbt6v72zzl188qkwsdkzqgbdo8','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w1KAi:S2qMUdqdTMvkzcqeZmZ8eNagwrXtmnjR_zwYvBNEByg','2026-03-28 08:16:32.421579'),('oda4mjq6bvec11oazua7q6o8x10brps3','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1JNL:ZDLpxDQ9LaLOaK-5SCRN63T3ZGDC_9N2pzfIL1xg8SU','2026-03-28 07:25:31.005879'),('oeni30tpyogcoasl72mgf89r1q5fj93o','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IV5dvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_yUs3Iw:1vwyI8:8LtnXjXkinugfSwDXbytYIeIPW3X_iD6vPVRrXZldXM','2026-03-16 08:06:12.551662'),('ogqq6ceu9rlbybi8udz72733stcaaz39','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1yKn:mhiPGDmGIqnr4romkUyFnk47VTuCwt98PbqVW5U4SAA','2026-03-30 03:09:37.916639'),('ok2ad46x7c6o378ykpwhlg3xsrops4jv','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w4WjM:uPHw-86opNgprthkRZIupngjEg9eC-R9JJ0GQ1s0pi8','2026-04-06 04:17:32.761088'),('oz091nkjvmkfyz4wze3i4i5iix8bzg28','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3b9V:cdVkNAEnGsnX2tD9cJ_MKZVkYNQBCT92DA-RDxEUl0U','2026-04-03 14:48:41.360366'),('pcj5v64plp9teoio93jrz6273h7fn6nx','.eJxVjDEOwjAMRe-SGUVJqrguIztniOzYIQXUSk07Ie4OlTrA-t97_2USbWtNW9MljWLOxqM5_Y5M-aHTTuRO0222eZ7WZWS7K_agzV5n0eflcP8OKrX6rQshMBcm4gFYocPcq2bnkHFg9cGTdIhZHWSFKFSAI8S-EwmBSM37A1BNObc:1vzSTk:GUwZBV24rCGTj3LiFIu9IZ8ss_3VY3PQ017l0rq9mYA','2026-03-23 04:44:28.949557'),('pd7xihurs0pl0qy4a9qjrct1v7sl8j9n','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCYOX:wcJBmvsiTRzqH0lu9F2zUlrwPl9iaEWRBeijqfGT8ok','2026-04-28 07:41:13.208707'),('pjetssgwpl2fp3yyot6rima4hzk2wov5','.eJxVjEEOgjAQRe_StWkoLdMZl-49A5l2BkFNSSisjHdXEha6_e-9_zI9b-vYb1WXfhJzNs6b0--YOD-07ETuXG6zzXNZlynZXbEHrfY6iz4vh_t3MHIdv3WOhAmVOLrgXAQacutDRw00LjAOrQfw4Dx2mrAhEiUFgdSJoo-M5v0B2RM3EA:1vwybH:xSR33kG8XrhSLpq4ntJTOGrDaAC-0g7M9wPS-ytKDzM','2026-03-16 08:25:59.121407'),('posyy2d6yjy1si60v5gx11wcol7za684','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IV5dvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_yUs3Iw:1vwxKj:nDFDW4wDk4exOXoO9xAFUZClx7IwOzG2D4vc6SrMEgc','2026-03-16 07:04:49.796482'),('qklr6djtnc9ulxi2p709mo0qlhytixiy','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3xHk:MIzZCATdjibT1TJWIskx3tY_O2ii8cIqO_yYtddrS20','2026-04-04 14:26:40.353721'),('qvcwa9y1yxth0dfd5zyhsddqom3q0l63','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wCrSH:klvL0FkYxRHD42HsYgON2A7mzmOX0Lndkr-xVxqH3OA','2026-04-29 04:02:21.988125'),('r5ra5oj2gm504xj9ukyk9u0gdfy914ku','.eJxVjDsOwyAQRO9CHSF-XiBlep_BWhYITiKQjF1FuXtsyUVSzrw382YTbmuZtp6WaY7syqRkl98yID1TPUh8YL03Tq2uyxz4ofCTdj62mF630_07KNjLvhYYwuCFohyVHRJZL0FC9gMYApNQa2PAArg9oTDCKeUUWZ2yI-GiY58v7-c3Iw:1vwxKB:kaA2MSExqokh_aN9uVorQf24BLrlhdzAxC7aidGH8_4','2026-03-16 07:04:15.198295'),('rupjysadrgcqc8s9bu0i5mbdz55693l1','.eJxVjDsOwjAQBe_iGln-e6GkzxmsXX9wANlSnFSIu0OkFNC-mXkvFnBba9hGXsKc2IV5dvrdCOMjtx2kO7Zb57G3dZmJ7wo_6OBTT_l5Pdy_g4qjfmuXCIVzIIyAEqW3woEHKCVb7QkVGlBUNBnwRtozgELUTkirSOcEhb0_yUs3Iw:1vwvTB:ZVNQ3R6jvwCabS0LDoskjuEPY5_X1AYvNqcHJxCpz8k','2026-03-16 05:05:25.030013'),('sjituib2oltvam7yoi9emeymbfadcf33','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w49ma:UHN6Nzm6eWd-XqrG05CEa-UYkYNiJelpaSSIHFu19qQ','2026-04-05 03:47:20.396880'),('snb3g1nzihjl85xshsxkg3jck4y1dkhy','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w4Utl:TZGU0M9Lb3cm_d6VU4XTS0CnJijPIXhje9wqa_mdHs4','2026-04-06 02:20:09.536156'),('sqifpx3ii14eioess89s8fbpfsor8zjz','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxge9:hj4A4OWnGUG_orUNRUPvLnAFJPUdwunokwDQ82QsCE0','2026-03-18 07:27:53.065183'),('sy2s0gsgoa7cq3u4tjg9qxkd4431cjxt','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w1EaU:oWRGwRwFt_yrJzBaUqeDXLHdHPVQNjPFphc1u2u3fwk','2026-03-28 02:18:46.300700'),('tavoqf74u8zs8dudfib9z4tfx4btrz12','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wDGlo:2U8Ym55yV_hokeAP4q6XUghgZUuWQRq2-4b-s7TbNoo','2026-04-30 07:04:12.203221'),('tz1g9kjawvmrv7as6zmf66h119c519rz','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w3bXU:SNp7QC5ccPMdEFbWx5U30riFX4yOX52muQx26xLCR7E','2026-04-03 15:13:28.697185'),('uelw1oeus8ute3nazop2nb4dsm8jhdv3','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxeHr:FkxdGv9gI3DU_8l_V9Qwsf3aUU5do_hZdz-ZVq3VfIw','2026-03-18 04:56:43.093274'),('uw1wwvymv1z24weou3nrepybncq0rcxy','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w76LO:Kt81ovpawT7f0DwRMIlJJoYVNnh7DrqiHaQ5I73IxAM','2026-04-13 06:43:26.497777'),('uwyw4aejkokj7ppmipb4wf5ixnjdlqj9','.eJxVjMEOwiAQRP-FsyGFLhQ8eu83kIVlpWpoUtqT8d9tkx70NMm8N_MWAbe1hK3lJUwkrsKJy28XMT1zPQA9sN5nmea6LlOUhyJP2uQ4U37dTvfvoGAr-1oR-ARKOQ9EncHM3qB1pC30CDBEo1n5nrnbw-vI0Q1srIWUMjvL4vMF2l43-Q:1w4Yim:__fACe-E1EoTaaLhXvTy1RcXHqwyJpM-TAztWs1w7PQ','2026-04-06 06:25:04.139016'),('uz4dg2z169jin1tf6xrzai8hevhxliz1','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w7rtN:kcstKQNoDeOqF1VpWQR0wGeC6X2YBhzQaagVtTpFpnI','2026-04-15 09:29:41.869768'),('v74bfs9ym445axgivk0cltxl0u3jhx0y','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vzA6X:59p4cY9DJA5tnKD0h9cM8TTGPpSKd7DK01PNc564cxk','2026-03-22 09:07:17.823171'),('veqaa3d9kh8yny3cnsdimi5msxhi38sc','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w8E6X:8JfRdZMiKPHeeN36rLPRLHZzTVRbwF2R5k2kdYtg5Yg','2026-04-16 09:12:45.283718'),('vmfok773olhjecypfy2zaaq0eb21zzeu','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w1FPq:twdsGAcRfsU1Banz8VYoisCAN8oPHZOOJ-JBFNZMNXI','2026-03-28 03:11:50.364545'),('w1ydkedqbrxgnt3gatznq1fwqsxcygaf','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxdJ6:L51DtxR9TlzKgp3a1_uUuelgurGuHJdXUcXHqMX1BRk','2026-03-18 03:53:56.406239'),('wehsum1ierfk1r3a9wr767omn10ppehw','.eJxVjEEOwiAQRe_C2hAoMIBL956BMDNEqgaS0q6Md9cmXej2v_f-S6S8rTVtoyxpZnEWIE6_G2Z6lLYDvud265J6W5cZ5a7Igw557Vyel8P9O6h51G8dSEdQCFEHZCbraXLOATF5zRaLMpawQDYUfHDa2ziBt0YDGmuQlHh_AN03N0c:1wEqnH:8bvfr8hyNE6YRekFVXoJtwlQw5cUbnNMxfk6LVyg1oY','2026-05-04 15:44:15.174258'),('wkul1auoxkqwlwjn402mpnq0ylo2le49','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1wDHuj:gg9jn6oQKbCKWLvuH_C-mcx9fVNXrj7q3xC8SPBUHmA','2026-04-30 08:17:29.323860'),('wqnvw7214zsjj4ix8oi3g0bdl6k9c24z','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vzA5v:Y02bbWtzr2D7_Icy7SMsYvy2i0259-b84U-S98woFyM','2026-03-22 09:06:39.597903'),('wwkxj08r75c772w5vc4j7434xydigly1','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0Vv4:oic_oGPfqXkF7sfPrrlr7i-64Td0JdSa4naCQ10B5w4','2026-03-26 02:37:02.453406'),('x62nk0kilpmfi7z0mgmo8bel2zzam6wq','.eJxVjMEOwiAQRP-FsyGFLhQ8eu83kIVlpWpoUtqT8d9tkx70NMm8N_MWAbe1hK3lJUwkrsKJy28XMT1zPQA9sN5nmea6LlOUhyJP2uQ4U37dTvfvoGAr-1oR-ARKOQ9EncHM3qB1pC30CDBEo1n5nrnbw-vI0Q1srIWUMjvL4vMF2l43-Q:1w1Jd9:vdoYbg3XliqMDyOtoKiyBBynxrBFQvNnLLRAZodjabk','2026-03-28 07:41:51.180607'),('xac5pgd9oyupnh2oycx7lese2wbtgp78','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w767q:t5pdooLQBGxApGsQvHskxcewEaDTL8jNj2jxZZ0b1bI','2026-04-13 06:29:26.462463'),('xbv7355xta5p5nde0136dz1lfa5uyudm','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxhbu:0dbN3s4fLNcZOUTVT3ePJjzsArtVJSOld2GCVa4n2FM','2026-03-18 08:29:38.620694'),('xc73my27fc73iyku5gtgpswwisvdayt5','.eJxVjMsOwiAQRf-FtSE8poW6dO83EAZmpGogKe3K-O_apAvd3nPOfYkQt7WErdMS5izOYhKn3w1jelDdQb7HemsytbouM8pdkQft8toyPS-H-3dQYi_f2oNHHIkzRGVc0i6D9tr4xGlQTpEhNlZZy8jAE1iP1qXBKmLQZmQU7w_nFDfT:1w4Yis:H-HFpa8uoeHU46rHJcHiqry_jHXMO1FU90qZINwqG1s','2026-04-06 06:25:10.863131'),('xe4ny182jkn830xnrvhg9qhg66i5are3','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1vxgmB:ObWn6pJbzQV0YFsZ14xyjK2c3tdrkIGmYQ5oDo10Icw','2026-03-18 07:36:11.167401'),('xfcl5p6u0kvg556vql8wsfafekluym0q','.eJxVjLEOAiEQRP-F2pBlOQ6xtPcbyC5L5NRActxVxn83JFdoM8W8N_NWkfatxL3nNS6iLgrV6bdjSs9cB5AH1XvTqdVtXVgPRR-061uT_Loe7t9BoV7G2mfDEggdegrzdJ4wCRvLPlnvHMKcM4wgB0bQcRAIxnkIHi0kVp8v2Uo3MQ:1vwvWS:_lrX0WU-8rlydlmqIjbAUnz1U3iG7YkscKeIMfrHgjs','2026-03-16 05:08:48.684259'),('xq1slvdhpn8ieby5nmkel4tusjnl0gz2','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5epQ:ocBNHeKC9mJm41M_H6em0xVPAiyRKyw3eS2unYd2Seo','2026-04-09 07:08:28.828668'),('xr139drsorutsj8t1xkroxc6g16lk1uz','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1vxFpw:4k2qZrLi8caY1vHwqMyemrLnpP1toUIUaTbQotTgDqw','2026-03-17 02:50:16.006388'),('y08ciki38opba0tx2jznswn4d1covti5','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w5eOz:FdEkCXqxS1tdH9foXXD0AIUsRUgtrcFLZUWETMAQP0U','2026-04-09 06:41:09.895865'),('ya4kua2vchgwvtx8fu8cvnlm0fyf0upt','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxggo:uyXOfeqepHKu_ipKi4HQo9q-ms8aWcFsIvK8YRObaCo','2026-03-18 07:30:38.930201'),('yb1jd5fyr0oxqb1m756kis9jp22rxkh2','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w4CaQ:CUIJ9BzVeeyvX0as9zkYQ86j2tW6Nt_QzX8JDeH_VjQ','2026-04-05 06:46:58.065341'),('yemsaskgkxxverlkd0059n47t78dt7j6','.eJxVjEEOwiAQRe_C2pAKMzi4dO8ZyACDVA1NSrsy3l2bdKHb_977LxV4XWpYu8xhzOqsjkYdfsfI6SFtI_nO7TbpNLVlHqPeFL3Trq9Tludld_8OKvf6rZNx4AU4E-HgHUXDaCSRWO_QkpTChQQAxA2WnJwkEiJgch69WKveH_9eN6o:1vwzxo:dZEQmGXEFRR-fW3Q75EmIRduCq14nv_VjfB-I-nxino','2026-03-16 09:53:20.750710'),('yer25i2989arhsk9byhvglrq3ava3qs8','.eJxVjEEOwiAQRe_C2hAopYBL956BzDCDVA0kpV0Z765NutDtf-_9l4iwrSVunZc4kzgLPYnT74iQHlx3QneotyZTq-syo9wVedAur434eTncv4MCvXxrcNomTwTTGEabCD2y9qwTswLMaL01il1IQ8hZmwDKZZdJk4HBK87i_QEykTku:1vxiUG:W0Mg7oNte6uLcifvgMoICJ92G0G0dr2DRXrAo_Ka474','2026-03-18 09:25:48.848218'),('yibp4klszje7bu9d5nyjbdkvqv82d0in','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w0VPk:m6wwcR2wWZIKuwuoRw99SXg_Hugwf1r5L1ovhVHmD8c','2026-03-26 02:04:40.681259'),('yzxgvbzavrkwir4imphnyi75o9t6wzqf','.eJxVjDkOwjAUBe_iGlnxEv-Ykp4zWH9xSADZUpxUiLtDpBTQvpl5L5VwW6e0tbykWdRZGXX63Qj5kcsO5I7lVjXXsi4z6V3RB236WiU_L4f7dzBhm761G6HvhQmjwGC98x1QQAqdQLDGdGxNdEBMo_UYLAiJB084MA89-KjeH9jWN54:1w3lZx:nmz1xcR86F3D4ovOxsSlvwTnDL5QvnYUoISS6SB3cl8','2026-04-04 01:56:41.888285'),('z0cn495t5drkbmoerr9cgoxg6vkzsbcq','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w7sDF:qvhmaL1Nm0aTQp5umUoQUIz8Xe3A58c35jf1llnnCPY','2026-04-15 09:50:13.323988'),('zkeznepfqtmogs3ebygakvv7b3jtbfvi','.eJxVjLsKAjEQAP8ltYSNeVva-w1hsxvMqSRwuavEf5fAFdrODPMWCfetpn2UNS0sLsKL0y_LSM_SpuAHtnuX1Nu2LlnORB52yFvn8roe7d-g4qhzq4pzhSFoxEgWAkck4BK0RbLkDWcCHSGH4PRZxWwiOo0anMmevRKfL-zkN6Q:1w23Z1:aidQ8KRPdCi0oJmZxkP7N8tAYEUk9P6R69Vpaj93iVg','2026-03-30 08:44:39.167356');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_image_requirements`
--

DROP TABLE IF EXISTS `inspection_image_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspection_image_requirements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `category` varchar(20) NOT NULL,
  `position` varchar(20) NOT NULL,
  `stage` varchar(20) NOT NULL,
  `is_required` tinyint(1) NOT NULL,
  `sort_order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_type_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `inspection__stage_fa4362_idx` (`stage`,`is_active`),
  KEY `inspection__categor_42a677_idx` (`category`),
  KEY `inspection_image_req_vehicle_type_id_ec5bf109_fk_vehicle_t` (`vehicle_type_id`),
  CONSTRAINT `inspection_image_req_vehicle_type_id_ec5bf109_fk_vehicle_t` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_image_requirements`
--

LOCK TABLES `inspection_image_requirements` WRITE;
/*!40000 ALTER TABLE `inspection_image_requirements` DISABLE KEYS */;
INSERT INTO `inspection_image_requirements` VALUES (1,'Ảnh mặt trước','VEHICLE','FRONT','RECEIVE',1,1,1,'2026-04-15 03:00:01.590952','2026-04-15 03:00:01.590996',NULL),(2,'Ảnh mặt sau','VEHICLE','BACK','RECEIVE',1,2,1,'2026-04-15 03:00:01.593686','2026-04-15 03:00:01.593704',NULL),(3,'Ảnh bên trái','VEHICLE','LEFT','RECEIVE',1,3,1,'2026-04-15 03:00:01.595834','2026-04-15 03:00:01.595858',NULL),(4,'Ảnh bên phải','VEHICLE','RIGHT','RECEIVE',1,4,1,'2026-04-15 03:00:01.597981','2026-04-15 03:00:01.598001',NULL),(5,'Ảnh nội thất','VEHICLE','INTERIOR','RECEIVE',0,5,1,'2026-04-15 03:00:01.600120','2026-04-15 03:00:01.600140',NULL),(6,'Ảnh táp-lô','VEHICLE','DASHBOARD','RECEIVE',0,6,1,'2026-04-15 03:00:01.602253','2026-04-15 03:00:01.602274',NULL),(7,'Ảnh giấy đăng ký','DOCUMENT','OTHER','RECEIVE',1,7,1,'2026-04-15 03:00:01.604374','2026-04-15 03:00:01.604392',NULL),(8,'Ảnh bảo hiểm','DOCUMENT','OTHER','RECEIVE',0,8,1,'2026-04-15 03:00:01.616194','2026-04-15 03:00:01.616212',NULL),(9,'Ảnh mặt trước khi trả','VEHICLE','FRONT','RETURN',1,1,1,'2026-04-15 03:00:01.618313','2026-04-15 03:00:01.618342',NULL),(10,'Ảnh mặt sau khi trả','VEHICLE','BACK','RETURN',1,2,1,'2026-04-15 03:00:01.620443','2026-04-15 03:00:01.620464',NULL),(11,'Ảnh bên trái khi trả','VEHICLE','LEFT','RETURN',1,3,1,'2026-04-15 03:00:01.622424','2026-04-15 03:00:01.622446',NULL),(12,'Ảnh bên phải khi trả','VEHICLE','RIGHT','RETURN',1,4,1,'2026-04-15 03:00:01.624454','2026-04-15 03:00:01.624475',NULL),(13,'Ảnh nội thất khi trả','VEHICLE','INTERIOR','RETURN',0,5,1,'2026-04-15 03:00:01.626487','2026-04-15 03:00:01.626509',NULL),(14,'Ảnh táp-lô khi trả','VEHICLE','DASHBOARD','RETURN',0,6,1,'2026-04-15 03:00:01.628651','2026-04-15 03:00:01.628673',NULL),(15,'Ảnh checklist ngoại thất khi nhận','CHECKLIST','OTHER','RECEIVE',1,9,1,'2026-04-15 03:01:57.440091','2026-04-15 03:01:57.440238',NULL),(16,'Ảnh checklist lốp xe khi nhận','CHECKLIST','OTHER','RECEIVE',1,10,1,'2026-04-15 03:01:57.443672','2026-04-15 03:01:57.443693',NULL),(17,'Ảnh checklist đèn khi nhận','CHECKLIST','OTHER','RECEIVE',1,11,1,'2026-04-15 03:01:57.445794','2026-04-15 03:01:57.445814',NULL),(18,'Ảnh checklist gương khi nhận','CHECKLIST','OTHER','RECEIVE',1,12,1,'2026-04-15 03:01:57.448110','2026-04-15 03:01:57.448131',NULL),(19,'Ảnh checklist kính khi nhận','CHECKLIST','OTHER','RECEIVE',1,13,1,'2026-04-15 03:01:57.450573','2026-04-15 03:01:57.450594',NULL),(20,'Ảnh checklist nội thất khi nhận','CHECKLIST','OTHER','RECEIVE',1,14,1,'2026-04-15 03:01:57.452809','2026-04-15 03:01:57.452831',NULL),(21,'Ảnh checklist động cơ khi nhận','CHECKLIST','OTHER','RECEIVE',1,15,1,'2026-04-15 03:01:57.454946','2026-04-15 03:01:57.454972',NULL),(22,'Ảnh checklist nhiên liệu khi nhận','CHECKLIST','OTHER','RECEIVE',1,16,1,'2026-04-15 03:01:57.457456','2026-04-15 03:01:57.457477',NULL),(23,'Ảnh checklist ngoại thất khi trả','CHECKLIST','OTHER','RETURN',1,7,1,'2026-04-15 03:01:57.459577','2026-04-15 03:01:57.459598',NULL),(24,'Ảnh checklist lốp xe khi trả','CHECKLIST','OTHER','RETURN',1,8,1,'2026-04-15 03:01:57.461799','2026-04-15 03:01:57.461820',NULL),(25,'Ảnh checklist đèn khi trả','CHECKLIST','OTHER','RETURN',1,9,1,'2026-04-15 03:01:57.463960','2026-04-15 03:01:57.463990',NULL),(26,'Ảnh checklist gương khi trả','CHECKLIST','OTHER','RETURN',1,10,1,'2026-04-15 03:01:57.466209','2026-04-15 03:01:57.466228',NULL),(27,'Ảnh checklist kính khi trả','CHECKLIST','OTHER','RETURN',1,11,1,'2026-04-15 03:01:57.468406','2026-04-15 03:01:57.468425',NULL),(28,'Ảnh checklist nội thất khi trả','CHECKLIST','OTHER','RETURN',1,12,1,'2026-04-15 03:01:57.470681','2026-04-15 03:01:57.470702',NULL),(29,'Ảnh checklist giấy tờ khi trả','CHECKLIST','OTHER','RETURN',1,13,1,'2026-04-15 03:01:57.472831','2026-04-15 03:01:57.472852',NULL),(30,'Ảnh checklist tem đăng kiểm khi trả','CHECKLIST','OTHER','RETURN',1,14,1,'2026-04-15 03:01:57.474886','2026-04-15 03:01:57.474907',NULL),(31,'Ảnh giấy đăng ký khi trả','DOCUMENT','OTHER','RETURN',1,15,1,'2026-04-15 03:01:57.476982','2026-04-15 03:01:57.477003',NULL),(32,'Ảnh tem đăng kiểm khi trả','DOCUMENT','OTHER','RETURN',1,16,1,'2026-04-15 03:01:57.479069','2026-04-15 03:01:57.479092',NULL),(33,'Ảnh giấy chứng nhận kiểm định khi trả','DOCUMENT','OTHER','RETURN',1,17,1,'2026-04-15 03:01:57.481334','2026-04-15 03:01:57.481354',NULL),(34,'Ảnh biên lai khi trả','RECEIPT','OTHER','RETURN',0,18,1,'2026-04-15 03:01:57.483462','2026-04-15 03:01:57.483482',NULL);
/*!40000 ALTER TABLE `inspection_image_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_files`
--

DROP TABLE IF EXISTS `media_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_files` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stage` varchar(20) NOT NULL,
  `category` varchar(20) NOT NULL,
  `position` varchar(20) NOT NULL,
  `file` varchar(100) NOT NULL,
  `url` varchar(1000) NOT NULL,
  `thumbnail_url` varchar(1000) DEFAULT NULL,
  `file_type` varchar(100) NOT NULL,
  `file_size` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `requirement_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `media_files_order_i_750b3a_idx` (`order_id`,`stage`),
  KEY `media_files_require_12d65c_idx` (`requirement_id`),
  KEY `media_files_created_by_id_98a89b93_fk_staff_id` (`created_by_id`),
  CONSTRAINT `media_files_created_by_id_98a89b93_fk_staff_id` FOREIGN KEY (`created_by_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `media_files_order_id_e7c12abd_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `media_files_requirement_id_09749757_fk_inspectio` FOREIGN KEY (`requirement_id`) REFERENCES `inspection_image_requirements` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_files`
--

LOCK TABLES `media_files` WRITE;
/*!40000 ALTER TABLE `media_files` DISABLE KEYS */;
INSERT INTO `media_files` VALUES (1,'RECEIVE','VEHICLE','BACK','media_files/2026/04/15/Screenshot_2026-03-25_220202.png','http://14.224.210.210:8008/media/media_files/2026/04/15/Screenshot_2026-03-25_220202.png','http://14.224.210.210:8008/media/media_files/2026/04/15/Screenshot_2026-03-25_220202.png','image/png',276460,'2026-04-15 03:04:23.335298',1,2,2),(2,'RECEIVE','VEHICLE','BACK','media_files/2026/04/15/Screenshot_2026-03-25_220202_qZon478.png','http://14.224.210.210:8008/media/media_files/2026/04/15/Screenshot_2026-03-25_220202_qZon478.png','http://14.224.210.210:8008/media/media_files/2026/04/15/Screenshot_2026-03-25_220202_qZon478.png','image/png',276460,'2026-04-15 03:07:34.921595',1,2,2),(3,'RECEIVE','VEHICLE','FRONT','media_files/2026/04/18/scaled_96df7fdc-543a-49bd-8dc1-8ab4d05d96107220413129133492471.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_96df7fdc-543a-49bd-8dc1-8ab4d05d96107220413129133492471.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_96df7fdc-543a-49bd-8dc1-8ab4d05d96107220413129133492471.jpg','image/jpeg',471584,'2026-04-18 13:56:01.962102',1,8,1),(4,'RECEIVE','VEHICLE','BACK','media_files/2026/04/18/scaled_832da0c9-5b42-4c83-b491-53798fbe0f4f6415066421702563050.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_832da0c9-5b42-4c83-b491-53798fbe0f4f6415066421702563050.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_832da0c9-5b42-4c83-b491-53798fbe0f4f6415066421702563050.jpg','image/jpeg',385313,'2026-04-18 13:57:04.867719',1,8,2),(5,'RECEIVE','VEHICLE','LEFT','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70.jpg','image/jpeg',78333,'2026-04-18 13:57:28.651492',1,8,3),(6,'RECEIVE','VEHICLE','RIGHT','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3if7yi0.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3if7yi0.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3if7yi0.jpg','image/jpeg',78333,'2026-04-18 13:57:31.595721',1,8,4),(7,'RECEIVE','VEHICLE','INTERIOR','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_VujbZNL.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_VujbZNL.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_VujbZNL.jpg','image/jpeg',78333,'2026-04-18 13:57:35.222519',1,8,5),(8,'RECEIVE','VEHICLE','DASHBOARD','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_myNgbPx.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_myNgbPx.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_myNgbPx.jpg','image/jpeg',78333,'2026-04-18 13:57:42.383946',1,8,6),(9,'RECEIVE','DOCUMENT','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_OSRtbCC.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_OSRtbCC.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_OSRtbCC.jpg','image/jpeg',78333,'2026-04-18 13:57:55.823149',1,8,7),(10,'RECEIVE','DOCUMENT','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_SMk1Vpu.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_SMk1Vpu.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_SMk1Vpu.jpg','image/jpeg',78333,'2026-04-18 13:57:58.809756',1,8,8),(11,'RECEIVE','VEHICLE','FRONT','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_v6q7jj0.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_v6q7jj0.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_v6q7jj0.jpg','image/jpeg',78333,'2026-04-18 14:00:04.424513',1,9,1),(12,'RECEIVE','VEHICLE','BACK','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_nECbmBz.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_nECbmBz.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_nECbmBz.jpg','image/jpeg',78333,'2026-04-18 14:00:07.048985',1,9,2),(13,'RECEIVE','VEHICLE','LEFT','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_qFiuB1q.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_qFiuB1q.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_qFiuB1q.jpg','image/jpeg',78333,'2026-04-18 14:00:09.810063',1,9,3),(14,'RECEIVE','VEHICLE','RIGHT','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sc4DLSU.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sc4DLSU.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sc4DLSU.jpg','image/jpeg',78333,'2026-04-18 14:00:12.399764',1,9,4),(15,'RECEIVE','VEHICLE','INTERIOR','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ewDh7rm.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ewDh7rm.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ewDh7rm.jpg','image/jpeg',78333,'2026-04-18 14:00:14.926011',1,9,5),(16,'RECEIVE','VEHICLE','DASHBOARD','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_fOeQyf2.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_fOeQyf2.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_fOeQyf2.jpg','image/jpeg',78333,'2026-04-18 14:00:17.029711',1,9,6),(17,'RECEIVE','DOCUMENT','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_u5v1L94.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_u5v1L94.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_u5v1L94.jpg','image/jpeg',78333,'2026-04-18 14:00:27.664907',1,9,7),(18,'RECEIVE','DOCUMENT','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3Q8djHX.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3Q8djHX.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_3Q8djHX.jpg','image/jpeg',78333,'2026-04-18 14:00:30.724355',1,9,8),(19,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_NwspKX6.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_NwspKX6.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_NwspKX6.jpg','image/jpeg',78333,'2026-04-18 14:16:10.368031',1,8,15),(20,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_zrffh65.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_zrffh65.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_zrffh65.jpg','image/jpeg',78333,'2026-04-18 14:16:15.535902',1,8,16),(21,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_XQcqySQ.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_XQcqySQ.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_XQcqySQ.jpg','image/jpeg',78333,'2026-04-18 14:16:18.524065',1,8,17),(22,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sxzaq3f.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sxzaq3f.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_Sxzaq3f.jpg','image/jpeg',78333,'2026-04-18 14:16:21.864891',1,8,18),(23,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_wETEjaD.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_wETEjaD.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_wETEjaD.jpg','image/jpeg',78333,'2026-04-18 14:16:24.801225',1,8,19),(24,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_b7fIKNc.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_b7fIKNc.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_b7fIKNc.jpg','image/jpeg',78333,'2026-04-18 14:16:28.027409',1,8,20),(25,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_yFfHHWT.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_yFfHHWT.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_yFfHHWT.jpg','image/jpeg',78333,'2026-04-18 14:16:30.697818',1,8,21),(26,'RECEIVE','CHECKLIST','OTHER','media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ykr1UCw.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ykr1UCw.jpg','http://14.224.210.210:8008/media/media_files/2026/04/18/scaled_Screenshot_2026-03-22-10-28-58-70_ykr1UCw.jpg','image/jpeg',78333,'2026-04-18 14:16:33.430676',1,8,22);
/*!40000 ALTER TABLE `media_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `recipient_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_object_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_object_id` bigint DEFAULT NULL,
  `action_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scheduled_for` datetime(6) DEFAULT NULL,
  `sent_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `recipient_customer_id` bigint DEFAULT NULL,
  `recipient_staff_id` bigint DEFAULT NULL,
  `recipient_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_recipient_customer_id_bf3f4365_fk_customers_id` (`recipient_customer_id`),
  KEY `notifications_recipient_staff_id_e6cf48cd_fk_staff_id` (`recipient_staff_id`),
  KEY `notifications_recipient_user_id_42f935ff_fk_auth_user_id` (`recipient_user_id`),
  CONSTRAINT `notifications_recipient_customer_id_bf3f4365_fk_customers_id` FOREIGN KEY (`recipient_customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `notifications_recipient_staff_id_e6cf48cd_fk_staff_id` FOREIGN KEY (`recipient_staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `notifications_recipient_user_id_42f935ff_fk_auth_user_id` FOREIGN KEY (`recipient_user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_checklist`
--

DROP TABLE IF EXISTS `order_checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_checklist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `result` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `measured_value` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `checked_at` datetime(6) DEFAULT NULL,
  `checklist_item_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `check_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `checked_by_id` bigint DEFAULT NULL,
  `is_checked` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_checklist_checklist_item_id_731ce924_fk_checklist_items_id` (`checklist_item_id`),
  KEY `order_checklist_order_id_141a1b53_fk_orders_id` (`order_id`),
  KEY `order_checklist_checked_by_id_d61a1420_fk_staff_id` (`checked_by_id`),
  CONSTRAINT `order_checklist_checked_by_id_d61a1420_fk_staff_id` FOREIGN KEY (`checked_by_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `order_checklist_checklist_item_id_731ce924_fk_checklist_items_id` FOREIGN KEY (`checklist_item_id`) REFERENCES `checklist_items` (`id`),
  CONSTRAINT `order_checklist_order_id_141a1b53_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_checklist`
--

LOCK TABLES `order_checklist` WRITE;
/*!40000 ALTER TABLE `order_checklist` DISABLE KEYS */;
INSERT INTO `order_checklist` VALUES (1,'pass',NULL,'https://example.com/check1.jpg','Phanh tốt','2026-01-15 09:15:00.000000',1,1,NULL,NULL,0),(2,'pass',NULL,'https://example.com/check2.jpg','Phanh tốt','2026-01-15 09:18:00.000000',2,1,NULL,NULL,0),(3,'pass','2.2 bar','https://example.com/check3.jpg','Lốp còn 70%','2026-01-15 09:25:00.000000',11,1,NULL,NULL,0),(4,'pass','0.8%','https://example.com/check4.jpg','CO đạt chuẩn','2026-01-15 10:00:00.000000',42,1,NULL,NULL,0),(5,'pass','120 ppm','https://example.com/check5.jpg','HC đạt chuẩn','2026-01-15 10:05:00.000000',43,1,NULL,NULL,0),(6,'pass',NULL,'https://example.com/check6.jpg','Phanh OK','2026-02-20 14:20:00.000000',1,3,NULL,NULL,0),(7,'fail',NULL,'https://example.com/check7.jpg','Đèn xi-nhan phải không sáng','2026-02-20 14:35:00.000000',21,3,NULL,NULL,0),(8,'fail',NULL,NULL,'Gạt mưa bị mòn','2026-02-20 14:40:00.000000',26,3,NULL,NULL,0);
/*!40000 ALTER TABLE `order_checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_services`
--

DROP TABLE IF EXISTS `order_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `service_name` varchar(200) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  `service_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_servi_order_i_b0931e_idx` (`order_id`),
  KEY `order_servi_service_2f5479_idx` (`service_id`),
  CONSTRAINT `order_services_order_id_ae38ee79_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_services_service_id_13abe688_fk_services_id` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_services`
--

LOCK TABLES `order_services` WRITE;
/*!40000 ALTER TABLE `order_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `from_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `changed_by_id` int DEFAULT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_status_history_changed_by_id_f13feb0a_fk_auth_user_id` (`changed_by_id`),
  KEY `order_status_history_order_id_d33fdfde_fk_orders_id` (`order_id`),
  CONSTRAINT `order_status_history_changed_by_id_f13feb0a_fk_auth_user_id` FOREIGN KEY (`changed_by_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `order_status_history_order_id_d33fdfde_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,'pending','confirmed','Đã xác nhận lịch hẹn','2026-01-10 14:25:00.000000',2,1),(2,'confirmed','assigned','Đã phân công cho NV001','2026-01-12 10:00:00.000000',2,1),(3,'assigned','in_progress','Bắt đầu kiểm tra','2026-01-15 09:05:00.000000',7,1),(4,'in_progress','completed','Hoàn thành - Đạt','2026-01-15 10:30:00.000000',7,1),(5,'pending','confirmed','Xác nhận','2026-01-28 10:00:00.000000',2,2),(6,'confirmed','assigned','Phân công NV002','2026-01-30 09:00:00.000000',2,2),(7,'assigned','in_progress','Bắt đầu','2026-02-02 10:35:00.000000',8,2),(8,'in_progress','completed','Hoàn thành','2026-02-02 11:50:00.000000',8,2),(9,'pending','confirmed','Xác nhận lịch hẹn','2026-03-01 09:00:00.000000',2,7),(10,'pending','in_progress','Staff bắt đầu xử lý đơn hàng','2026-03-16 06:58:55.798635',7,4),(11,'in_progress','pending','Staff hủy bắt đầu xử lý','2026-03-16 06:59:11.890012',7,4),(12,'pending','in_progress','Staff bắt đầu xử lý đơn hàng','2026-03-16 06:59:35.517347',7,4),(13,'in_progress','pending','Staff hủy bắt đầu xử lý','2026-03-16 07:00:12.543310',7,4),(14,'pending','in_progress','Staff bắt đầu xử lý đơn hàng','2026-03-16 10:24:42.535103',7,4),(15,'in_progress','pending','Staff hủy bắt đầu xử lý','2026-03-16 10:26:40.779299',7,4),(16,'pending','in_progress','Staff bắt đầu xử lý đơn hàng','2026-03-16 10:27:10.125179',7,4),(17,'in_progress','pending','Staff hủy bắt đầu xử lý. Lý do: Cần kiểm tra thêm thông tin','2026-03-16 10:27:24.710215',7,4),(18,'pending','in_progress','Staff bắt đầu xử lý đơn hàng','2026-03-24 06:19:29.364536',7,13);
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_statuses`
--

DROP TABLE IF EXISTS `order_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_statuses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `status_code` varchar(30) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `description` longtext,
  `color_code` varchar(20) NOT NULL,
  `display_order` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `is_terminal` tinyint(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status_code` (`status_code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
INSERT INTO `order_statuses` VALUES (1,'pending','Chờ xử lý',NULL,'gray',0,1,0,'2026-03-24 10:23:33.731430','2026-03-24 10:23:33.731593'),(3,'assigned','Đã phân công',NULL,'gray',0,1,0,'2026-03-24 10:23:33.748191','2026-03-24 10:23:33.748218'),(4,'in_progress','Đang thực hiện',NULL,'gray',0,1,0,'2026-03-24 10:23:33.753094','2026-03-24 10:23:33.753164'),(5,'vehicle_received','Đã nhận xe',NULL,'gray',0,1,0,'2026-03-24 10:23:33.820940','2026-03-24 10:23:33.821016'),(6,'vehicle_returned','Đã trả xe',NULL,'gray',0,1,0,'2026-03-24 10:23:33.825767','2026-03-24 10:23:33.825815'),(7,'completed','Hoàn thành',NULL,'gray',0,1,0,'2026-03-24 10:23:33.902518','2026-03-24 10:23:33.902672'),(8,'cancelled','Đã hủy',NULL,'gray',0,1,0,'2026-03-24 10:23:33.912208','2026-03-24 10:23:33.912282');
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time(6) NOT NULL,
  `estimated_amount` decimal(10,2) NOT NULL,
  `additional_amount` decimal(10,2) NOT NULL,
  `status_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inspection_result` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_notes` longtext COLLATE utf8mb4_unicode_ci,
  `staff_notes` longtext COLLATE utf8mb4_unicode_ci,
  `cancel_reason` longtext COLLATE utf8mb4_unicode_ci,
  `started_at` datetime(6) DEFAULT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `assigned_staff_id` bigint DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  `station_id` bigint NOT NULL,
  `vehicle_id` bigint NOT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `confirmed_at` datetime(6) DEFAULT NULL,
  `driver_current_lat` decimal(10,8) DEFAULT NULL,
  `driver_current_lng` decimal(11,8) DEFAULT NULL,
  `driver_location_updated_at` datetime(6) DEFAULT NULL,
  `pickup_address` longtext COLLATE utf8mb4_unicode_ci,
  `pickup_lat` decimal(10,8) DEFAULT NULL,
  `pickup_lng` decimal(11,8) DEFAULT NULL,
  `status_legacy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_document` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_document_created_at` datetime(6) DEFAULT NULL,
  `payment_completed_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contract_document_pdf` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `orders_assigned_staff_id_8050b97b_fk_staff_id` (`assigned_staff_id`),
  KEY `orders_customer_id_b7016332_fk_customers_id` (`customer_id`),
  KEY `orders_station_id_426ce7c9_fk_stations_id` (`station_id`),
  KEY `orders_vehicle_id_59612d64_fk_vehicles_id` (`vehicle_id`),
  CONSTRAINT `orders_assigned_staff_id_8050b97b_fk_staff_id` FOREIGN KEY (`assigned_staff_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `orders_customer_id_b7016332_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `orders_station_id_426ce7c9_fk_stations_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`),
  CONSTRAINT `orders_vehicle_id_59612d64_fk_vehicles_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'DK20260115ABC123','2026-01-15','09:00:00.000000',340000.00,0.00,'7','normal','pass','Xe chạy tốt, cần kiểm tra nhanh','Xe trong tình trạng tốt',NULL,'2026-01-15 09:05:00.000000','2026-03-10 04:00:38.216201','2026-01-10 14:20:00.000000','2026-03-10 04:00:38.216379',1,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-15 10:30:00.000000','cash','paid',NULL),(2,'DK20260202DEF456','2026-02-02','10:30:00.000000',340000.00,0.00,'6','normal','pass','','Tất cả ổn','','2026-02-02 10:35:00.000000','2026-04-03 15:30:33.000000','2026-01-28 09:15:00.000000','2026-04-15 03:55:25.596646',2,1,1,2,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,'vehicle_returned','contracts/order_2_69c63137.docx','2026-04-15 03:29:35.214413',NULL,NULL,'unpaid','contracts/order_2_8af671fc.pdf'),(3,'DK20260220GHI789','2026-02-20','14:00:00.000000',450000.00,50000.00,'3','high','fail','Gấp, cần kết quả sớm','[Chuyển từ Trần Văn G sang Lê Thị H] Staff cũ bận việc đột xuất\r\nCần thay gạt mưa và đèn xi-nhan','','2026-02-20 14:10:00.000000','2026-03-10 07:00:51.000000','2026-02-18 16:30:00.000000','2026-03-25 02:14:51.470878',1,1,1,3,NULL,NULL,13.77800000,109.22500000,'2026-03-13 06:21:09.000000','',NULL,NULL,NULL,NULL,NULL,'2026-02-20 15:45:00.000000','momo','paid',NULL),(4,'DK20260210JKL012','2026-02-10','08:00:00.000000',340000.00,0.00,'7','normal','pass','','OK','','2026-02-10 08:05:00.000000','2026-03-21 11:06:49.698612','2026-02-05 10:00:00.000000','2026-03-21 11:06:49.698902',1,2,3,4,NULL,NULL,11.09164990,106.26753320,'2026-03-17 15:51:20.000000','456 Đường XYZ, Phường 2',10.76500000,106.69200000,NULL,NULL,NULL,'2026-02-10 09:20:00.000000','vietqr','paid',NULL),(5,'DK20260225MNO345','2026-02-25','11:00:00.000000',120000.00,0.00,'7','normal','pass',NULL,'Xe máy tình trạng tốt',NULL,'2026-02-25 11:10:00.000000','2026-04-09 06:45:19.447165','2026-02-22 13:45:00.000000','2026-04-09 06:45:19.447480',4,2,3,5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,'2026-02-25 11:45:00.000000','cash','paid',''),(6,'DK20260228PQR678','2026-02-28','09:30:00.000000',340000.00,0.00,'7','normal','pass','Xe mới mua, cần đăng kiểm lần đầu','Xe mới, tình trạng xuất sắc',NULL,'2026-02-28 09:35:00.000000','2026-03-18 10:57:34.825832','2026-02-24 08:20:00.000000','2026-03-18 10:57:34.826023',3,3,2,6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 10:50:00.000000','vnpay','paid',NULL),(7,'DK20260302STU901','2026-03-02','13:00:00.000000',9999.98,0.00,'3','normal','not_started','Lần đầu đăng kiểm','','',NULL,NULL,'2026-02-28 15:30:00.000000','2026-04-17 07:56:52.676419',NULL,4,5,7,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,'',NULL,NULL,NULL,'unpaid',''),(8,'DK20260305VWX234','2026-03-05','10:00:00.000000',10000.00,0.00,'3','normal','not_started','','','',NULL,NULL,'2026-03-01 11:20:00.000000','2026-04-20 07:02:48.271560',1,5,3,7,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,'contracts/order_8_03e9af00.docx','2026-04-20 07:02:48.270496',NULL,NULL,'unpaid','contracts/order_8_61eacf11.pdf'),(9,'DK202603036C8E4A','2026-03-10','10:00:00.000000',340000.00,0.00,'3','normal','not_started','','','',NULL,NULL,'2026-03-03 12:36:19.702009','2026-04-14 07:43:36.826299',1,10,1,1,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,'contracts/order_9_999459d5.docx','2026-04-14 07:43:36.825079',NULL,NULL,'unpaid','contracts/order_9_fb7ad957.pdf'),(10,'DK2026030374058E','2026-03-10','10:00:00.000000',340000.00,0.00,'4','normal','not_started','Đăng kiểm lần đầu','=== BIÊN BẢN NHẬN XE ===\r\nThời gian: 2026-03-04 12:27:14\r\nNhân viên: Phạm Văn I (NV004)\r\nSố km: 45,000 km\r\nNhiên liệu: 3/4 bình\r\nTình trạng chung: Tốt, đèn pha hoạt động bình thường. Cản trước nguy...\r\nBiên bản ID: 1\r\n==================================================','','2026-03-04 12:27:14.000000',NULL,'2026-03-03 14:20:03.444946','2026-03-19 08:16:11.421260',1,10,1,9,NULL,NULL,11.09163910,106.26760340,'2026-03-22 06:47:05.927491','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'unpaid',NULL),(11,'DK2026030447A0B9','2026-03-10','10:00:00.000000',340000.00,0.00,'4','normal','not_started','TEST - Kiểm tra phân công nhân viên','','',NULL,NULL,'2026-03-04 01:46:12.270437','2026-03-19 08:16:02.338504',1,10,1,9,NULL,NULL,11.09164110,106.26759820,'2026-03-22 03:27:24.459471','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'unpaid',NULL),(12,'DK20260305C54309','2026-03-15','10:00:00.000000',340000.00,0.00,'1','normal','not_started','Xe có đổ/cải tạo',NULL,NULL,NULL,NULL,'2026-03-05 03:21:40.755549','2026-03-05 03:21:40.755599',NULL,10,1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'unpaid',NULL),(13,'DK202603058287EB','2026-03-15','09:00:00.000000',340000.00,0.00,'4','normal','not_started','','','',NULL,NULL,'2026-03-05 06:56:25.872396','2026-03-24 06:19:29.355906',1,10,1,1,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'unpaid',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verification`
--

DROP TABLE IF EXISTS `otp_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purpose` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
INSERT INTO `otp_verification` VALUES (1,'0912345678','123456','login',1,'2026-03-02 12:00:00.000000','2026-03-02 11:55:00.000000','2026-03-02 11:50:00.000000'),(2,'0987654321','654321','register',1,'2026-03-02 12:00:00.000000','2026-03-02 11:58:00.000000','2026-03-02 11:53:00.000000'),(3,'0912345678','332739','login',1,'2026-03-02 05:13:43.619404','2026-03-02 05:08:48.656015','2026-03-02 05:08:43.620072'),(5,'0382786317','401455','register',1,'2026-03-02 05:14:53.457596','2026-03-02 05:09:58.750938','2026-03-02 05:09:53.457789'),(6,'0912345678','699176','login',0,'2026-03-02 05:28:08.233196',NULL,'2026-03-02 05:23:08.233581'),(8,'0382786317','613470','login',1,'2026-03-02 06:56:01.995830','2026-03-02 06:51:03.285928','2026-03-02 06:51:01.996194'),(9,'0382786317','498986','login',1,'2026-03-02 07:09:06.155812','2026-03-02 07:04:15.165900','2026-03-02 07:04:06.156179'),(11,'0382786317','425530','login',0,'2026-03-02 07:31:11.130180',NULL,'2026-03-02 07:26:11.130644'),(16,'0382786317','493314','register',0,'2026-03-02 08:24:16.574187',NULL,'2026-03-02 08:19:16.575148'),(17,'0973685142','880023','register',0,'2026-03-02 08:30:32.669466',NULL,'2026-03-02 08:25:32.669877'),(18,'0358041884','243071','register',0,'2026-03-03 02:57:45.988751',NULL,'2026-03-03 02:52:45.989959'),(23,'0999777666','341499','register',0,'2026-03-03 07:55:24.624955',NULL,'2026-03-03 07:50:24.626188'),(25,'06756464544','522137','register',0,'2026-03-03 09:21:40.327138',NULL,'2026-03-03 09:16:40.328452'),(26,'0835641299','825189','register',0,'2026-03-03 10:11:14.626397',NULL,'2026-03-03 10:06:14.628192'),(27,'0456384712','760881','register',1,'2026-03-03 10:21:32.674115','2026-03-03 10:16:41.689963','2026-03-03 10:16:32.675071'),(28,'0574638921','776342','register',0,'2026-03-03 10:39:11.556769',NULL,'2026-03-03 10:34:11.557899'),(30,'0987654321','291257','login',0,'2026-03-03 11:07:39.623357',NULL,'2026-03-03 11:02:39.624230'),(31,'0984606837','611492','register',1,'2026-03-03 11:43:37.458900','2026-03-03 11:39:54.151387','2026-03-03 11:38:37.459921'),(33,'0123456789','992367','register',1,'2026-03-04 03:56:56.464283','2026-03-04 03:53:56.386489','2026-03-04 03:51:56.465286'),(34,'0919443838','481130','register',1,'2026-03-09 04:48:00.906325','2026-03-09 04:44:28.932016','2026-03-09 04:43:00.907268');
/*!40000 ALTER TABLE `otp_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_logs`
--

DROP TABLE IF EXISTS `payment_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_code` bigint DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `raw_data` longtext NOT NULL,
  `status_code` varchar(20) DEFAULT NULL,
  `ip_address` varchar(64) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_logs_payment_id_8bc90aae_fk_payments_id` (`payment_id`),
  CONSTRAINT `payment_logs_payment_id_8bc90aae_fk_payments_id` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_logs`
--

LOCK TABLES `payment_logs` WRITE;
/*!40000 ALTER TABLE `payment_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_proof_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `notes` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `payment_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_content` longtext COLLATE utf8mb4_unicode_ci,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vietqr_code_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `method` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_code` bigint DEFAULT NULL,
  `payment_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_code` longtext COLLATE utf8mb4_unicode_ci,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_code` (`transaction_code`),
  UNIQUE KEY `order_id` (`order_id`),
  UNIQUE KEY `order_code` (`order_code`),
  CONSTRAINT `payments_order_id_6086ad70_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,'PAY20260115103000A1B2C3',340000.00,'cash','SUCCESS',NULL,'2026-01-15 10:30:00.000000','Thanh toán tiền mặt tại quầy','2026-01-15 10:30:00.000000','2026-01-15 10:30:00.000000',1,NULL,NULL,NULL,NULL,'VND',NULL,'QR',NULL,NULL,NULL,NULL),(3,'PAY20260220154500G7H8I9',500000.00,'momo','SUCCESS',NULL,'2026-02-20 15:45:00.000000','Thanh toán qua Momo','2026-02-20 15:45:00.000000','2026-02-20 15:45:00.000000',3,NULL,NULL,NULL,NULL,'VND',NULL,'QR',NULL,NULL,NULL,NULL),(4,'PAY20260210092000J0K1L2',340000.00,'vietqr','SUCCESS','https://example.com/proof4.jpg','2026-02-10 09:20:00.000000','Quét VietQR','2026-02-10 09:20:00.000000','2026-02-10 09:20:00.000000',4,NULL,NULL,NULL,NULL,'VND',NULL,'QR',NULL,NULL,NULL,NULL),(5,'PAY20260225114500M3N4O5',120000.00,'cash','SUCCESS',NULL,'2026-02-25 11:45:00.000000','Tiền mặt','2026-02-25 11:45:00.000000','2026-02-25 11:45:00.000000',5,NULL,NULL,NULL,NULL,'VND',NULL,'QR',NULL,NULL,NULL,NULL),(6,'PAY20260228105000P6Q7R8',340000.00,'vnpay','SUCCESS',NULL,'2026-02-28 10:50:00.000000','VNPay','2026-02-28 10:50:00.000000','2026-02-28 10:50:00.000000',6,NULL,NULL,NULL,NULL,'VND',NULL,'QR',NULL,NULL,NULL,NULL),(15,'PAY202604170815137AC32E',9999.00,'vietqr','PENDING',NULL,NULL,NULL,'2026-04-17 08:15:13.159178','2026-04-17 08:15:13.159263',7,'order','00020101021238570010A000000727012700069704220113VQRQAIJHG50360208QRIBFTTA5303704540499995802VN62290825Thanh toan don DK202603026304A883',NULL,'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=00020101021238570010A000000727012700069704220113VQRQAIJHG50360208QRIBFTTA5303704540499995802VN62290825Thanh%20toan%20don%20DK202603026304A883','VND','Thanh toán đơn DK20260302STU901','QR',1776413712377,'https://pay.payos.vn/web/ed620c5bc05243b887adbc9603d6f8aa','00020101021238570010A000000727012700069704220113VQRQAIJHG50360208QRIBFTTA5303704540499995802VN62290825Thanh toan don DK202603026304A883','4'),(23,'PAY202604171420099E7689',150000.00,'vietqr','PENDING',NULL,NULL,'additional_cost_id=8','2026-04-17 14:20:09.544517','2026-04-17 14:20:09.544580',2,'additional_cost','00020101021238570010A000000727012700069704220113VQRQAIJOH49080208QRIBFTTA530370454061500005802VN62280824Chi phi phat sinh Sua de6304D98C',NULL,'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=00020101021238570010A000000727012700069704220113VQRQAIJOH49080208QRIBFTTA530370454061500005802VN62280824Chi%20phi%20phat%20sinh%20Sua%20de6304D98C','VND','Chi phí phát sinh: Sửa đèn pha — đơn DK20260202DEF456','QR',1776435608926,'https://pay.payos.vn/web/b26a8d4fcdc34971bcc709fd17436e84','00020101021238570010A000000727012700069704220113VQRQAIJOH49080208QRIBFTTA530370454061500005802VN62280824Chi phi phat sinh Sua de6304D98C','1'),(27,'PAY20260420070619680B03',10000.00,'cash','PENDING',NULL,NULL,NULL,'2026-04-20 07:06:19.358927','2026-04-20 07:06:19.358989',8,'order','00020101021238570010A000000727012700069704220113VQRQAILCT47200208QRIBFTTA53037045405100005802VN62290825Thanh toan don DK202603056304C336',NULL,'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=00020101021238570010A000000727012700069704220113VQRQAILCT47200208QRIBFTTA53037045405100005802VN62290825Thanh%20toan%20don%20DK202603056304C336','VND','Thanh toán đơn DK20260305VWX234','CASH',1776668778752,'https://pay.payos.vn/web/84651cdf00b649c2946fb2f77aa226af','00020101021238570010A000000727012700069704220113VQRQAILCT47200208QRIBFTTA53037045405100005802VN62290825Thanh toan don DK202603056304C336','5');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `permission_code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_code` (`permission_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pricings`
--

DROP TABLE IF EXISTS `pricings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pricings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `inspection_fee` decimal(12,2) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `vehicle_type_id` bigint NOT NULL,
  `registration_fee` decimal(12,2) NOT NULL,
  `service_fee` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pricings_vehicle_type_id_283ae16b_fk_vehicle_types_id` (`vehicle_type_id`),
  CONSTRAINT `pricings_vehicle_type_id_283ae16b_fk_vehicle_types_id` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pricings`
--

LOCK TABLES `pricings` WRITE;
/*!40000 ALTER TABLE `pricings` DISABLE KEYS */;
INSERT INTO `pricings` VALUES (1,73000.00,433000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-23 03:58:44.664120',1,240000.00,120000.00),(2,150000.00,180000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',2,0.00,0.00),(3,300000.00,340000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',3,0.00,0.00),(4,370000.00,713000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-26 04:48:29.160492',4,223000.00,120000.00),(5,400000.00,450000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',5,0.00,0.00),(6,520000.00,580000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',6,0.00,0.00),(7,700000.00,780000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',7,0.00,0.00),(8,1080000.00,1200000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',8,0.00,0.00),(9,850000.00,950000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',9,0.00,0.00),(10,1350000.00,1500000.00,'2026-01-01','2026-12-31','active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,0.00,0.00);
/*!40000 ALTER TABLE `pricings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `overall_rating` int NOT NULL,
  `service_rating` int DEFAULT NULL,
  `staff_rating` int DEFAULT NULL,
  `facility_rating` int DEFAULT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci,
  `photos_url` longtext COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `staff_id` bigint NOT NULL,
  `admin_response` longtext COLLATE utf8mb4_unicode_ci,
  `cons` longtext COLLATE utf8mb4_unicode_ci,
  `pros` longtext COLLATE utf8mb4_unicode_ci,
  `responded_at` datetime(6) DEFAULT NULL,
  `responded_by_id` bigint DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `ratings_customer_id_5e571b3b_fk_customers_id` (`customer_id`),
  KEY `ratings_staff_id_b80bbf11_fk_staff_id` (`staff_id`),
  KEY `ratings_responded_by_id_99a95be0_fk_staff_id` (`responded_by_id`),
  CONSTRAINT `ratings_customer_id_5e571b3b_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `ratings_order_id_2d75e230_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `ratings_responded_by_id_99a95be0_fk_staff_id` FOREIGN KEY (`responded_by_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `ratings_staff_id_b80bbf11_fk_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,5,5,5,5,'Dịch vụ tuyệt vời, nhân viên nhiệt tình!',NULL,'2026-01-15 11:00:00.000000',1,1,1,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224'),(2,4,4,4,4,'Tốt, hài lòng',NULL,'2026-02-02 12:30:00.000000',1,2,2,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224'),(3,5,5,5,5,'Rất chuyên nghiệp, phát hiện lỗi kỹ',NULL,'2026-02-20 16:15:00.000000',1,3,1,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224'),(4,5,5,5,4,'Nhanh gọn, chính xác',NULL,'2026-02-10 10:00:00.000000',2,4,4,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224'),(5,4,4,5,4,'OK',NULL,'2026-02-25 12:00:00.000000',2,5,4,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224'),(6,5,5,5,5,'Xe mới, dịch vụ rất tốt!','[\"https://example.com/rating1.jpg\"]','2026-02-28 11:30:00.000000',3,6,3,NULL,NULL,NULL,NULL,NULL,'pending','2026-03-02 09:12:41.221224');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `permission_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_id_permission_id_04f77df0_uniq` (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_ad343843_fk_permissions_id` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_ad343843_fk_permissions_id` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `role_permissions_role_id_216516f2_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `level` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Quản trị viên','ADMIN','Quản lý toàn bộ hệ thống',1,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000','blue',0),(2,'Nhân viên kiểm định','INSPECTOR','Thực hiện kiểm tra và đăng kiểm xe',2,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000','blue',0),(3,'Lễ tân','RECEPTIONIST','Tiếp nhận khách hàng và tạo lịch hẹn',3,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000','blue',0),(4,'Kế toán','ACCOUNTANT','Quản lý thanh toán và tài chính',4,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000','blue',0),(5,'Kỹ thuật viên','TECHNICIAN','Hỗ trợ kỹ thuật và bảo trì thiết bị',5,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000','blue',0),(6,'Tài xế','DRIVER','tài xế',0,'active','2026-03-13 04:52:49.325626','2026-03-13 04:52:49.325710','blue',0);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `service_code` varchar(20) NOT NULL,
  `service_name` varchar(200) NOT NULL,
  `description` longtext,
  `category` varchar(50) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `is_required` tinyint(1) NOT NULL,
  `status` varchar(20) NOT NULL,
  `display_order` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci,
  `tasks_total` int NOT NULL,
  `tasks_completed` int NOT NULL,
  `rating_average` decimal(3,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `role_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `staff_role_id_f8da7ae2_fk_roles_id` (`role_id`),
  CONSTRAINT `staff_role_id_f8da7ae2_fk_roles_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `staff_user_id_e6242ba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'NV001','Nguyễn Văn F','0911111111',NULL,'Nhân viên kiểm định chính','2023-01-15','1985-04-10','male','111 Đường NV1, Hà Nội',150,145,4.85,'active','2026-03-02 00:00:00.000000','2026-03-16 10:02:07.454823',6,7),(2,'NV002','Trần Văn G','0922222222',NULL,'Nhân viên kiểm định','2023-06-20','1990-09-05','male','222 Đường NV2, Hà Nội',98,95,4.70,'active','2026-03-02 00:00:00.000000','2026-03-13 04:53:15.274258',6,8),(3,'NV003','Lê Thị H','0933333333',NULL,'Lễ tân trưởng','2022-08-10','1988-12-15','female','333 Đường NV3, Hà Nội',200,198,4.92,'active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',3,9),(4,'NV004','Phạm Văn I','0944444444',NULL,'Nhân viên kiểm định','2024-01-05','1992-06-22','male','444 Đường NV4, TP.HCM',45,43,4.65,'active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',2,10);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `station_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `open_time` time(6) DEFAULT NULL,
  `close_time` time(6) DEFAULT NULL,
  `daily_capacity` int NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `capacity` int NOT NULL,
  `working_hours` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `station_code` (`station_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,'HN01','Trạm Đăng Kiểm Hà Nội 1 - Đống Đa','123 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội','024-3514-2233','hanoi1@dangkiem.vn',21.0285000,105.8048000,'07:00:00.000000','17:00:00.000000',50,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,NULL),(2,'HN02','Trạm Đăng Kiểm Hà Nội 2 - Cầu Giấy','456 Phạm Văn Đồng, Phường Cổ Nhuế, Quận Cầu Giấy, Hà Nội','024-3795-4422','hanoi2@dangkiem.vn',21.0378000,105.7804000,'07:00:00.000000','17:00:00.000000',60,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,NULL),(3,'HCM01','Trạm Đăng Kiểm TP.HCM 1 - Quận 1','789 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh','028-3829-3344','hcm1@dangkiem.vn',10.7756000,106.7019000,'07:00:00.000000','17:00:00.000000',70,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,NULL),(4,'HCM02','Trạm Đăng Kiểm TP.HCM 2 - Tân Bình','321 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh','028-3844-5566','hcm2@dangkiem.vn',10.7991000,106.6544000,'07:00:00.000000','17:00:00.000000',65,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,NULL),(5,'DN01','Trạm Đăng Kiểm Đà Nẵng 1 - Hải Châu','555 Nguyễn Văn Linh, Phường Hòa Thuận Tây, Quận Hải Châu, Đà Nẵng','023-6384-7788','danang1@dangkiem.vn',16.0544000,108.2022000,'07:00:00.000000','17:00:00.000000',40,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',10,NULL),(6,'HN03','Trạm Đăng Kiểm Hà Nội 3 - Hai Bà Trưng','123 Đường Láng, Phường Láng Thượng, Quận Hai Bà Trưng, Hà Nội','024-3514-2233','hanoi3@dangkiem.vn',21.0285000,105.8048000,'07:00:00.000000','17:00:00.000000',50,'active','2026-03-03 12:47:56.578539','2026-03-03 12:47:56.578619',10,NULL);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_group` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` longtext COLLATE utf8mb4_unicode_ci,
  `default_value` longtext COLLATE utf8mb4_unicode_ci,
  `value_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) NOT NULL,
  `is_editable` tinyint(1) NOT NULL,
  `validation_rule` longtext COLLATE utf8mb4_unicode_ci,
  `allowed_values` longtext COLLATE utf8mb4_unicode_ci,
  `display_order` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `updated_by_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `system_settings_updated_by_id_cf1dfbba_fk_staff_id` (`updated_by_id`),
  CONSTRAINT `system_settings_updated_by_id_cf1dfbba_fk_staff_id` FOREIGN KEY (`updated_by_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_slots`
--

DROP TABLE IF EXISTS `time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slots` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `time_slot` time(6) NOT NULL,
  `day_of_week` varchar(20) NOT NULL,
  `max_capacity` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `display_order` int NOT NULL,
  `notes` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `station_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `time_slots_station_id_time_slot_day_of_week_aded5d3e_uniq` (`station_id`,`time_slot`,`day_of_week`),
  KEY `time_slots_station_5118f8_idx` (`station_id`,`is_active`),
  KEY `time_slots_day_of__a162bb_idx` (`day_of_week`),
  CONSTRAINT `time_slots_station_id_bbe67166_fk_stations_id` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_slots`
--

LOCK TABLES `time_slots` WRITE;
/*!40000 ALTER TABLE `time_slots` DISABLE KEYS */;
INSERT INTO `time_slots` VALUES (3,'10:00:00.000000','all',5,1,2,NULL,'2026-03-05 04:38:48.322830','2026-03-05 04:38:48.322870',1),(4,'11:00:00.000000','all',5,1,3,NULL,'2026-03-05 04:38:48.329338','2026-03-05 04:38:48.329377',1),(5,'13:00:00.000000','all',5,1,4,NULL,'2026-03-05 04:38:48.334826','2026-03-05 04:38:48.334865',1),(6,'14:00:00.000000','all',5,1,5,NULL,'2026-03-05 04:38:48.340272','2026-03-05 04:38:48.340311',1),(7,'15:00:00.000000','all',5,1,6,NULL,'2026-03-05 04:38:48.345906','2026-03-05 04:38:48.345945',1),(8,'16:00:00.000000','all',5,1,7,NULL,'2026-03-05 04:38:48.352208','2026-03-05 04:38:48.352247',1),(9,'08:30:00.000000','all',5,1,0,NULL,'2026-03-05 04:39:57.794430','2026-03-05 04:39:57.794503',2),(10,'09:30:00.000000','all',5,1,1,NULL,'2026-03-05 04:39:57.802038','2026-03-05 04:39:57.802066',2),(11,'10:00:00.000000','all',5,1,2,NULL,'2026-03-05 04:39:57.806556','2026-03-05 04:39:57.806583',2),(12,'11:00:00.000000','all',5,1,3,NULL,'2026-03-05 04:39:57.811207','2026-03-05 04:39:57.811234',2),(13,'13:00:00.000000','all',5,1,4,NULL,'2026-03-05 04:39:57.817111','2026-03-05 04:39:57.817159',2),(14,'14:00:00.000000','all',5,1,5,NULL,'2026-03-05 04:39:57.822712','2026-03-05 04:39:57.822778',2),(15,'15:00:00.000000','all',5,1,6,NULL,'2026-03-05 04:39:57.830385','2026-03-05 04:39:57.830438',2),(16,'16:00:00.000000','all',5,1,7,NULL,'2026-03-05 04:39:57.835984','2026-03-05 04:39:57.836034',2);
/*!40000 ALTER TABLE `time_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_code` bigint DEFAULT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `amount` bigint NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_receipt_logs`
--

DROP TABLE IF EXISTS `vehicle_receipt_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_receipt_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `received_at` datetime(6) NOT NULL,
  `odometer_reading` int DEFAULT NULL,
  `fuel_level` varchar(20) NOT NULL,
  `exterior_front` longtext,
  `exterior_rear` longtext,
  `exterior_left` longtext,
  `exterior_right` longtext,
  `windows_condition` longtext,
  `lights_condition` longtext,
  `mirrors_condition` longtext,
  `wipers_condition` longtext,
  `tires_condition` longtext,
  `interior_condition` longtext,
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
  `additional_notes` longtext,
  `special_requests` longtext,
  `customer_confirmed` tinyint(1) NOT NULL,
  `customer_signature` varchar(100) DEFAULT NULL,
  `staff_signature` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  `received_by_id` bigint DEFAULT NULL,
  `vehicle_insurance_url` varchar(500) DEFAULT NULL,
  `vehicle_registration_url` varchar(500) DEFAULT NULL,
  `engine_check_photo` varchar(500) DEFAULT NULL,
  `engine_ok` tinyint(1) NOT NULL,
  `exterior_check_photo` varchar(500) DEFAULT NULL,
  `exterior_ok` tinyint(1) NOT NULL,
  `fuel_check_photo` varchar(500) DEFAULT NULL,
  `fuel_ok` tinyint(1) NOT NULL,
  `interior_check_photo` varchar(500) DEFAULT NULL,
  `interior_ok` tinyint(1) NOT NULL,
  `lights_check_photo` varchar(500) DEFAULT NULL,
  `lights_ok` tinyint(1) NOT NULL,
  `mirrors_check_photo` varchar(500) DEFAULT NULL,
  `mirrors_ok` tinyint(1) NOT NULL,
  `tires_check_photo` varchar(500) DEFAULT NULL,
  `tires_ok` tinyint(1) NOT NULL,
  `windows_check_photo` varchar(500) DEFAULT NULL,
  `windows_ok` tinyint(1) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `vehicle_receipt_logs_received_by_id_59eeb983_fk_staff_id` (`received_by_id`),
  CONSTRAINT `vehicle_receipt_logs_order_id_3966f97a_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `vehicle_receipt_logs_received_by_id_59eeb983_fk_staff_id` FOREIGN KEY (`received_by_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_receipt_logs`
--

LOCK TABLES `vehicle_receipt_logs` WRITE;
/*!40000 ALTER TABLE `vehicle_receipt_logs` DISABLE KEYS */;
INSERT INTO `vehicle_receipt_logs` VALUES (1,'2026-03-04 12:27:14.401297',45000,'full','Tốt, đèn pha hoạt động bình thường. Cản trước nguyên vẹn, không vết xước. Nắp ca-pô đóng mở tốt.','Tốt, đèn hậu nguyên. Biển số 29A-12245 rõ ràng. Cản sau không trầy xước. Cốp sau đóng mở tốt.','Thân xe trái tốt, không vết móp. Có 1 vết xước nhỏ ở cửa sau trái, dài 3cm, không sâu.','Tốt, không vết xước. Cửa phải đóng mở êm. Gương chiếu hậu phải nguyên vẹn, chỉnh điện hoạt động.','Kính trước nguyên vẹn, không vết nứt. Kính sau tốt. 4 kính cửa đều hoạt động lên xuống tốt.','Đèn pha gần/xa sáng tốt. Đèn hậu, đèn phanh, đèn xi-nhan hoạt động. Đèn sương mù nguyên vẹn.','2 gương chiếu hậu ngoài nguyên, chỉnh điện tốt. Gương trong xe không bị vỡ, chống chói tự động hoạt động.','Cần gạt nước 3 chế độ hoạt động tốt. Cao su gạt trước còn 80%, sau 90%. Phun nước rửa kính hoạt động.','4 lốp Bridgestone 195/65R15, còn 65% hoa lốp. Áp suất: trước 2.3 bar, sau 2.1 bar. Lốp dự phòng Dunlop, 75% hoa, áp suất 2.0 bar.','Nội thất sạch sẽ, không mùi khó chịu. Ghế da màu đen, không rách. Vô-lăng bọc da tốt. Táp-lô nguyên vẹn. Điều hòa lạnh tốt. Hệ thống âm thanh hoạt động.',1,1,1,1,1,0,1,1,1,'https://storage.dangkiem.vn/orders/10/2026-03-04/front_29A12245.jpg','https://storage.dangkiem.vn/orders/10/2026-03-04/rear_29A12245.jpg','https://storage.dangkiem.vn/orders/10/2026-03-04/left_29A12245.jpg','https://storage.dangkiem.vn/orders/10/2026-03-04/right_29A12245.jpg','https://storage.dangkiem.vn/orders/10/2026-03-04/dashboard_29A12245.jpg','https://storage.dangkiem.vn/orders/10/2026-03-04/interior_29A12245.jpg','Xe 29A-12245 trong tình trạng tốt. Chủ xe yêu cầu kiểm tra kỹ hệ thống treo vì xe thường chạy đường xấu.','Khách hàng cần lấy xe trước 16h30 ngày 10/03/2026 để đi công tác. Vui lòng ưu tiên.',0,NULL,NULL,'2026-03-04 12:27:14.401516','2026-03-19 08:16:11.425163',10,4,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'draft'),(3,'2026-03-09 07:02:25.615976',0,'full','','','','','','','','','','',0,0,0,0,0,0,0,0,0,'https://storage.dangkiem.vn/uploads/vehicle/abc_front.jpg','https://storage.dangkiem.vn/uploads/vehicle/abc_rear.jpg','https://storage.dangkiem.vn/uploads/vehicle/abc_left.jpg','https://storage.dangkiem.vn/uploads/vehicle/abc_right.jpg','https://storage.dangkiem.vn/uploads/vehicle/abc_dashboard.jpg','https://storage.dangkiem.vn/uploads/vehicle/abc_interior.jpg','Xe trong tình trạng tốt, không có vấn đề gì đặc biệt','',0,NULL,NULL,'2026-03-09 07:02:25.616426','2026-03-25 02:14:51.476532',3,2,'https://storage.dangkiem.vn/uploads/document/insurance.jpg','https://storage.dangkiem.vn/uploads/document/registration.jpg','https://storage.dangkiem.vn/uploads/vehicle/check_engine.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_exterior.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_fuel.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_interior.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_lights.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_mirrors.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_tires.jpg',1,'https://storage.dangkiem.vn/uploads/vehicle/check_windows.jpg',1,'2026-03-10 03:00:06.539434','completed'),(4,'2026-03-16 10:28:33.979811',0,'full','','','','','','','','','','',0,0,0,0,0,0,0,0,0,'https://storage.dangkiem.vn/uploads/vehicle_a1b2c3d4.jpg','https://storage.dangkiem.vn/uploads/vehicle_e5f6g7h8.jpg','https://storage.dangkiem.vn/uploads/vehicle_i9j0k1l2.jpg','https://storage.dangkiem.vn/uploads/vehicle_m3n4o5p6.jpg','https://storage.dangkiem.vn/uploads/vehicle_q7r8s9t0.jpg','https://storage.dangkiem.vn/uploads/vehicle_u1v2w3x4.jpg','Xe trong tình trạng tốt, giấy tờ đầy đủ','',0,NULL,NULL,'2026-03-16 10:28:33.980208','2026-03-21 11:05:51.650334',4,1,'https://storage.dangkiem.vn/uploads/insurance_def456.jpg','https://storage.dangkiem.vn/uploads/registration_abc123.jpg','https://picsum.photos/800/600?random=7',1,'https://picsum.photos/800/600?random=1',1,'https://picsum.photos/800/600?random=8',1,'https://picsum.photos/800/600?random=6',1,'https://picsum.photos/800/600?random=3',0,'https://picsum.photos/800/600?random=4',1,'https://picsum.photos/800/600?random=2',1,'https://picsum.photos/800/600?random=5',1,'2026-03-16 11:27:35.280921','completed'),(5,'2026-03-18 09:18:23.369047',0,'half','','','','','','','','','','',0,0,0,0,0,0,0,0,0,'https://storage.dangkiem.vn/uploads/vehicle_a1b2c3d4.jpg','https://storage.dangkiem.vn/uploads/vehicle_e5f6g7h8.jpg','https://storage.dangkiem.vn/uploads/vehicle_i9j0k1l2.jpg','https://storage.dangkiem.vn/uploads/vehicle_m3n4o5p6.jpg','https://storage.dangkiem.vn/uploads/vehicle_q7r8s9t0.jpg','https://storage.dangkiem.vn/uploads/vehicle_u1v2w3x4.jpg','Xe trong tình trạng tốt, chỉ cần kiểm tra đèn',NULL,0,NULL,NULL,'2026-03-18 09:18:23.369436','2026-03-18 09:53:06.821383',5,1,'https://storage.dangkiem.vn/uploads/insurance_def456.jpg','https://storage.dangkiem.vn/uploads/registration_abc123.jpg','https://storage.dangkiem.vn/uploads/check_engine_stu901.jpg',1,'https://storage.dangkiem.vn/uploads/check_exterior_abc123.jpg',1,'https://storage.dangkiem.vn/uploads/check_fuel_vwx234.jpg',1,'https://storage.dangkiem.vn/uploads/check_interior_pqr678.jpg',1,'https://storage.dangkiem.vn/uploads/check_lights_ghi789.jpg',0,'https://storage.dangkiem.vn/uploads/check_mirrors_jkl012.jpg',1,'https://storage.dangkiem.vn/uploads/check_tires_def456.jpg',1,'https://storage.dangkiem.vn/uploads/check_windows_mno345.jpg',1,'2026-03-18 09:53:06.821111','completed'),(7,'2026-04-10 03:28:09.510222',0,'half','','','','','','','','','','',0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'Khach da kiem tra va dong y noi dung hop dong',NULL,0,'signatures/customer_sig_53f6f897.png','','2026-04-10 03:28:09.510677','2026-04-14 07:43:26.661218',9,1,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'initialized'),(8,'2026-04-10 04:55:44.097648',0,'half','','','','','','','','','','',0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,0,'','','2026-04-10 04:55:44.098084','2026-04-10 04:55:44.098118',6,1,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'initialized'),(9,'2026-04-15 03:25:47.803913',0,'full','','','','','','','','','','',0,0,0,0,0,0,0,0,0,NULL,'http://14.224.210.210:8008/media/media_files/2026/04/15/Screenshot_2026-03-25_220202_qZon478.png',NULL,NULL,NULL,NULL,'','',0,'signatures/customer_sig_4339887e.webp','','2026-04-15 03:25:47.804240','2026-04-15 03:32:54.884826',2,1,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'condition_checked'),(11,'2026-04-17 07:51:36.262892',0,'half','','','','','','','','','','',0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,0,'signatures/customer_sig_7b947649.png','','2026-04-17 07:51:36.263197','2026-04-20 07:02:42.665932',8,1,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'initialized'),(12,'2026-04-17 07:57:17.601813',0,'half','','','','','','','','','','',0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,0,'','','2026-04-17 07:57:17.602399','2026-04-17 07:57:17.602421',7,1,NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,0,NULL,'initialized');
/*!40000 ALTER TABLE `vehicle_receipt_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_return_additional_costs`
--

DROP TABLE IF EXISTS `vehicle_return_additional_costs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_return_additional_costs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cost_type` varchar(100) NOT NULL,
  `cost_name` varchar(200) NOT NULL,
  `description` longtext,
  `amount` decimal(10,2) NOT NULL,
  `photo_url` varchar(200) DEFAULT NULL,
  `invoice_url` varchar(200) DEFAULT NULL,
  `is_required` tinyint(1) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `notes` longtext,
  `approved_at` datetime(6) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `payment_status` varchar(20) NOT NULL,
  `qr_code_url` varchar(200) DEFAULT NULL,
  `qr_content` longtext,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_proof_url` varchar(200) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_note` longtext,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `created_by_id` bigint DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `return_log_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_return_additi_created_by_id_b3bc7579_fk_staff_id` (`created_by_id`),
  KEY `vehicle_return_additional_costs_order_id_009a2da2_fk_orders_id` (`order_id`),
  KEY `vehicle_return_addit_return_log_id_3fe2e5cf_fk_vehicle_r` (`return_log_id`),
  CONSTRAINT `vehicle_return_addit_return_log_id_3fe2e5cf_fk_vehicle_r` FOREIGN KEY (`return_log_id`) REFERENCES `vehicle_return_logs` (`id`),
  CONSTRAINT `vehicle_return_additi_created_by_id_b3bc7579_fk_staff_id` FOREIGN KEY (`created_by_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `vehicle_return_additional_costs_order_id_009a2da2_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_return_additional_costs`
--

LOCK TABLES `vehicle_return_additional_costs` WRITE;
/*!40000 ALTER TABLE `vehicle_return_additional_costs` DISABLE KEYS */;
INSERT INTO `vehicle_return_additional_costs` VALUES (1,'repair','Sửa đèn pha','Thay bóng đèn pha bị vỡ',150000.00,NULL,NULL,0,0,NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 03:46:23.102190','2026-03-10 03:46:23.102276',NULL,1,1),(5,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-16 12:42:52.945009','2026-03-16 12:42:52.945066',NULL,4,3),(6,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,'cash','paid','https://img.vietqr.io/image/970422-1234567890-compact2.jpg?amount=150000&addInfo=Thanh toan chi phi Sửa đèn pha - Don DK20260210JKL012','{\"bank_id\": \"970422\", \"account_no\": \"1234567890\", \"account_name\": \"TRAM DANG KIEM\", \"amount\": 150000.0, \"description\": \"Thanh toan chi phi S\\u1eeda \\u0111\\u00e8n pha - Don DK20260210JKL012\", \"transaction_id\": \"VPPSF8570609\"}','2026-03-18 06:55:05.972664',NULL,'VPPSF8570609','Đã thu tiền mặt từ khách','2026-03-18 06:41:51.854066','2026-03-18 06:55:05.973320',NULL,4,3),(7,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,'qr','processing','https://img.vietqr.io/image/970422-1234567890-compact2.jpg?amount=150000&addInfo=Thanh toan chi phi Sửa đèn pha - Don DK20260228PQR678','{\"bank_id\": \"970422\", \"account_no\": \"1234567890\", \"account_name\": \"TRAM DANG KIEM\", \"amount\": 150000.0, \"description\": \"Thanh toan chi phi S\\u1eeda \\u0111\\u00e8n pha - Don DK20260228PQR678\", \"transaction_id\": \"VPPS4F753A26\"}',NULL,NULL,'VPPS4F753A26',NULL,'2026-03-18 10:49:10.313236','2026-03-18 10:49:50.539120',NULL,6,4),(8,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-17 14:18:42.157684','2026-04-17 14:18:42.158335',NULL,2,6),(9,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-20 11:12:50.734345','2026-04-20 11:12:50.734395',NULL,2,6),(10,'repair','Sửa đèn pha','Thay bóng đèn bị vỡ',150000.00,'https://storage.dangkiem.vn/uploads/damage_abc123.jpg',NULL,0,0,'Khách đồng ý',NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-04-20 12:45:01.699552','2026-04-20 12:45:01.699606',NULL,2,6);
/*!40000 ALTER TABLE `vehicle_return_additional_costs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_return_logs`
--

DROP TABLE IF EXISTS `vehicle_return_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_return_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `returned_at` datetime(6) NOT NULL,
  `status` varchar(50) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `odometer_reading` int DEFAULT NULL,
  `fuel_level` varchar(20) NOT NULL,
  `exterior_front` longtext,
  `exterior_rear` longtext,
  `exterior_left` longtext,
  `exterior_right` longtext,
  `windows_condition` longtext,
  `lights_condition` longtext,
  `mirrors_condition` longtext,
  `wipers_condition` longtext,
  `tires_condition` longtext,
  `interior_condition` longtext,
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
  `other_documents_urls` longtext,
  `receipt_url` varchar(200) DEFAULT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `certificate_number` varchar(50) DEFAULT NULL,
  `certificate_expiry_date` date DEFAULT NULL,
  `additional_notes` longtext,
  `special_requests` longtext,
  `customer_confirmed` tinyint(1) NOT NULL,
  `customer_signature` varchar(100) DEFAULT NULL,
  `staff_signature` varchar(100) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `order_id` bigint NOT NULL,
  `returned_by_id` bigint NOT NULL,
  `handover_checklist` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  KEY `vehicle_return_logs_returned_by_id_8924b2d1_fk_staff_id` (`returned_by_id`),
  CONSTRAINT `vehicle_return_logs_order_id_703b1b61_fk_orders_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `vehicle_return_logs_returned_by_id_8924b2d1_fk_staff_id` FOREIGN KEY (`returned_by_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_return_logs`
--

LOCK TABLES `vehicle_return_logs` WRITE;
/*!40000 ALTER TABLE `vehicle_return_logs` DISABLE KEYS */;
INSERT INTO `vehicle_return_logs` VALUES (1,'2026-03-10 03:06:00.888253','completed','2026-03-10 04:00:38.208304',NULL,'half',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,'https://cdn.example.com/return/front.jpg','https://cdn.example.com/return/rear.jpg','https://cdn.example.com/return/left.jpg','https://cdn.example.com/return/right.jpg','https://cdn.example.com/return/dashboard.jpg','https://cdn.example.com/return/interior.jpg','https://cdn.example.com/registration.jpg',NULL,1,1,1,1,1,1,1,1,'https://cdn.example.com/check/exterior.jpg','https://cdn.example.com/check/tires.jpg','https://cdn.example.com/check/lights.jpg','https://cdn.example.com/check/mirrors.jpg','https://cdn.example.com/check/windows.jpg','https://cdn.example.com/check/interior.jpg','https://cdn.example.com/check/engine.jpg','https://cdn.example.com/check/fuel.jpg','https://cdn.example.com/certificate.jpg','https://cdn.example.com/stamp.jpg',1,'https://cdn.example.com/check/documents.jpg',1,'https://cdn.example.com/check/stamp.jpg','29A-12345','STM202603100001','2027-03-10','[\"https://cdn.example.com/insurance.jpg\"]','https://cdn.example.com/receipt.jpg','BL202603100001','GCN202603100001','2027-03-10','Xe trong tình trạng tốt',NULL,1,NULL,NULL,'2026-03-10 03:06:00.888686','2026-03-10 04:00:38.208611',1,2,NULL),(3,'2026-03-16 11:29:26.490754','completed','2026-03-18 07:01:31.912812',NULL,'half',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,'https://storage.dangkiem.vn/uploads/return_front_abc.jpg','https://storage.dangkiem.vn/uploads/return_rear_abc.jpg','https://storage.dangkiem.vn/uploads/return_left_abc.jpg','https://storage.dangkiem.vn/uploads/return_right_abc.jpg','https://storage.dangkiem.vn/uploads/return_dashboard_abc.jpg','https://storage.dangkiem.vn/uploads/return_interior_abc.jpg','https://storage.dangkiem.vn/uploads/registration_abc123.jpg',NULL,1,1,1,1,1,1,0,0,'https://storage.dangkiem.vn/uploads/check_exterior.jpg','https://storage.dangkiem.vn/uploads/check_tires.jpg','https://storage.dangkiem.vn/uploads/check_lights.jpg','https://storage.dangkiem.vn/uploads/check_mirrors.jpg','https://storage.dangkiem.vn/uploads/check_windows.jpg','https://storage.dangkiem.vn/uploads/check_interior.jpg',NULL,NULL,'https://storage.dangkiem.vn/uploads/cert_abc.jpg','https://storage.dangkiem.vn/uploads/stamp_xyz.jpg',1,'https://storage.dangkiem.vn/uploads/check_documents.jpg',1,'https://storage.dangkiem.vn/uploads/check_stamp.jpg','123456789','TEM-2026-12345','2027-03-10','[\"https://storage.dangkiem.vn/uploads/doc1.jpg\", \"https://storage.dangkiem.vn/uploads/doc2.pdf\"]','https://storage.dangkiem.vn/uploads/receipt_def.jpg','HD-2026-001','GCN-2026-98765','2027-03-10','Xe đã kiểm định xong, tất cả giấy tờ đầy đủ',NULL,1,NULL,NULL,'2026-03-16 11:29:26.491191','2026-03-18 07:01:31.913213',4,1,'{}'),(4,'2026-03-18 09:56:18.316195','completed','2026-03-18 10:57:34.809449',NULL,'half',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,'https://storage.dangkiem.vn/uploads/return_front_abc.jpg','https://storage.dangkiem.vn/uploads/return_rear_abc.jpg','https://storage.dangkiem.vn/uploads/return_left_abc.jpg','https://storage.dangkiem.vn/uploads/return_right_abc.jpg','https://storage.dangkiem.vn/uploads/return_dashboard_abc.jpg','https://storage.dangkiem.vn/uploads/return_interior_abc.jpg','https://storage.dangkiem.vn/uploads/registration_abc123.jpg',NULL,1,1,1,1,1,1,0,0,'https://storage.dangkiem.vn/uploads/check_exterior.jpg','https://storage.dangkiem.vn/uploads/check_tires.jpg','https://storage.dangkiem.vn/uploads/check_lights.jpg','https://storage.dangkiem.vn/uploads/check_mirrors.jpg','https://storage.dangkiem.vn/uploads/check_windows.jpg','https://storage.dangkiem.vn/uploads/check_interior.jpg',NULL,NULL,'https://storage.dangkiem.vn/uploads/cert_abc.jpg','https://storage.dangkiem.vn/uploads/stamp_xyz.jpg',1,'https://storage.dangkiem.vn/uploads/check_documents.jpg',1,'https://storage.dangkiem.vn/uploads/check_stamp.jpg','123456789','TEM-2026-12345','2027-03-10','[\"https://storage.dangkiem.vn/uploads/doc1.jpg\", \"https://storage.dangkiem.vn/uploads/doc2.pdf\"]','https://storage.dangkiem.vn/uploads/receipt_def.jpg','HD-2026-001','GCN-2026-98765','2027-03-10','Xe đã kiểm định xong, tất cả giấy tờ đầy đủ',NULL,1,NULL,NULL,'2026-03-18 09:56:18.316801','2026-03-18 10:57:34.809808',6,1,'{}'),(6,'2026-04-15 03:55:25.586459','condition_checked',NULL,NULL,'half',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,'','','2026-04-15 03:55:25.587084','2026-04-15 03:57:10.909649',2,1,'{}');
/*!40000 ALTER TABLE `vehicle_return_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_types`
--

DROP TABLE IF EXISTS `vehicle_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_types` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `base_price` decimal(10,2) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `display_order` int NOT NULL,
  `icon_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_code` (`type_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_types`
--

LOCK TABLES `vehicle_types` WRITE;
/*!40000 ALTER TABLE `vehicle_types` DISABLE KEYS */;
INSERT INTO `vehicle_types` VALUES (1,'MOTO','Xe máy','Xe mô tô, xe gắn máy dưới 175cc',120000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(2,'MOTO_HEAVY','Xe máy phân khối lớn','Xe mô tô từ 175cc trở lên',180000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(3,'CAR_4S','Xe con dưới 9 chỗ','Xe ô tô con (sedan, hatchback, SUV) dưới 9 chỗ ngồi',340000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(4,'CAR_7S','Xe 7-9 chỗ','Xe ô tô 7-9 chỗ ngồi (MPV, SUV 7 chỗ)',420000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(5,'PICKUP','Xe bán tải','Xe bán tải (pickup truck)',450000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(6,'TRUCK_LIGHT','Xe tải nhẹ (dưới 3.5 tấn)','Xe tải có tải trọng dưới 3.5 tấn',580000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(7,'TRUCK_MEDIUM','Xe tải trung (3.5 - 8 tấn)','Xe tải có tải trọng từ 3.5 đến 8 tấn',780000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(8,'TRUCK_HEAVY','Xe tải nặng (trên 8 tấn)','Xe tải có tải trọng trên 8 tấn',1200000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(9,'BUS_SMALL','Xe khách dưới 30 chỗ','Xe buýt, xe khách dưới 30 chỗ ngồi',950000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL),(10,'BUS_LARGE','Xe khách trên 30 chỗ','Xe buýt, xe khách từ 30 chỗ ngồi trở lên',1500000.00,'active','2026-03-02 11:07:20.000000','2026-03-02 11:07:20.000000',0,NULL);
/*!40000 ALTER TABLE `vehicle_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `license_plate` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacture_year` int DEFAULT NULL,
  `chassis_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `engine_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `last_inspection_date` date DEFAULT NULL,
  `next_inspection_date` date DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `customer_id` bigint NOT NULL,
  `vehicle_type_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_plate` (`license_plate`),
  KEY `vehicles_customer_id_04e6bf00_fk_customers_id` (`customer_id`),
  KEY `vehicles_vehicle_type_id_45741935_fk_vehicle_types_id` (`vehicle_type_id`),
  CONSTRAINT `vehicles_customer_id_04e6bf00_fk_customers_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `vehicles_vehicle_type_id_45741935_fk_vehicle_types_id` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'29A-12345','Toyota','Vios','Trắng',2018,'VIN001ABC123','ENG001XYZ','2018-03-15','2025-03-15','2026-03-15','active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',1,3),(2,'30G-67890','Honda','City','Xám',2020,'VIN002DEF456','ENG002ABC','2020-07-20','2025-07-20','2026-07-20','active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',1,3),(3,'29C-11111','Ford','Ranger','Đen',2019,'VIN003GHI789','ENG003DEF','2019-11-10','2025-11-10','2026-11-10','active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',1,5),(4,'51F-22222','Mazda','CX-5','Đỏ',2021,'VIN004JKL012','ENG004GHI','2021-05-05','2025-05-05','2026-05-05','active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',2,3),(5,'51H-33333','Honda','Wave Alpha','Xanh',2017,'VIN005MNO345','ENG005JKL','2017-08-08','2025-08-08','2026-08-08','active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',2,1),(6,'30A-44444','Hyundai','Accent','Trắng',2022,'VIN006PQR678','ENG006MNO','2022-01-12','2025-01-12','2027-03-10','active','2026-03-02 00:00:00.000000','2026-03-18 10:26:58.847126',3,3),(7,'43A-55555','Toyota','Fortuner','Bạc',2020,'VIN007STU901','ENG007PQR','2020-09-20',NULL,NULL,'active','2026-03-02 00:00:00.000000','2026-03-02 00:00:00.000000',4,4),(8,'29B-12345','Toyota','Vios','Trắng',2020,NULL,NULL,NULL,NULL,NULL,'active','2026-03-03 11:42:05.884501','2026-03-03 11:42:05.884592',10,3),(9,'29A-12245','Honda','City','Đỏ',2020,'XYZ789012','ABC123456',NULL,NULL,NULL,'active','2026-03-03 14:14:03.543082','2026-03-03 14:14:03.543183',10,3),(11,'61A-312313','Toyota',NULL,'Den',NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-03-04 09:10:19.643928','2026-03-04 09:10:19.644018',11,3),(12,'60A-999999','Toyota',NULL,'Trang',NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-03-04 14:48:48.144773','2026-03-04 14:48:48.144865',11,3),(13,'20A-22345','toyota',NULL,'đen',NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-03-09 04:46:04.161785','2026-03-09 04:46:04.161881',12,3),(14,'29A-01679','Honda',NULL,'đỏ',NULL,NULL,NULL,NULL,NULL,NULL,'active','2026-03-09 04:46:49.778488','2026-03-09 04:46:49.778592',12,1);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21  8:20:08
