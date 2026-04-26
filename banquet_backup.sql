-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: banquet_order_system
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `category_settings`
--

DROP TABLE IF EXISTS `category_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类别类型: meal_type-用餐类型, service_type-服务类型, order_type-订单类型',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_settings`
--

LOCK TABLES `category_settings` WRITE;
/*!40000 ALTER TABLE `category_settings` DISABLE KEYS */;
INSERT INTO `category_settings` VALUES (1,'了解渠道','抖音','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(2,'了解渠道','吃过','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(3,'了解渠道','朋友介绍','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(4,'菜品做法','炒菜','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(5,'菜品做法','例汤','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(6,'菜品做法','炖菜','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(7,'配料类型','蔬菜类','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(8,'配料类型','牛羊肉类','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(9,'配料类型','猪肉类','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(10,'配料类型','禽类','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(11,'配料类型','水产','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(12,'配料类型','本地食材','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(13,'厨具类型','餐具盘碗','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(14,'厨具类型','大设备','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(15,'厨具类型','厨房小设备','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(16,'职位类型','全职','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(17,'职位类型','兼职','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(18,'人员类型','厨师','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(19,'人员类型','服务员','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(20,'人员类型','司机','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(21,'车辆类型','小货车','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(22,'车辆类型','面包车','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(23,'支付方式','支付宝','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(24,'支付方式','微信','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(25,'酒席类型','升学宴','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(26,'酒席类型','婚宴','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(27,'套餐类型','多桌套餐','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(30,'一次性消耗品','一次性桌布','system','system','2026-04-19 11:12:11','2026-04-19 11:12:11'),(31,'一次性消耗品','一次性餐具','system','system','2026-04-19 11:12:28','2026-04-19 11:12:28'),(32,'一次性消耗品','一次性筷子','system','system','2026-04-19 11:12:38','2026-04-19 11:12:38'),(33,'一次性消耗品','一次性皮手套','system','system','2026-04-19 11:12:48','2026-04-19 11:12:48'),(34,'一次性消耗品','一次性口罩','system','system','2026-04-19 11:12:55','2026-04-19 11:12:55'),(35,'一次性消耗品','一次性线手套','system','system','2026-04-19 11:13:02','2026-04-19 11:13:02'),(36,'酒水礼包','加多宝','system','system','2026-04-19 11:13:17','2026-04-19 11:13:17'),(37,'酒水礼包','王老吉','system','system','2026-04-19 11:13:24','2026-04-19 11:13:24'),(38,'酒水礼包','鲜橙多','system','system','2026-04-19 11:13:30','2026-04-19 11:13:30'),(39,'酒水礼包','可乐','system','system','2026-04-19 11:13:40','2026-04-19 11:13:40'),(40,'配料类型','店铺食材','system','system','2026-04-19 11:16:02','2026-04-19 11:17:35'),(41,'配料类型','干货类','system','system','2026-04-19 11:19:33','2026-04-19 11:19:33'),(42,'菜品做法','蒸菜','system','system','2026-04-19 19:35:12','2026-04-19 19:35:12');
/*!40000 ALTER TABLE `category_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_types`
--

DROP TABLE IF EXISTS `category_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型名称（如：用餐类型）',
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_types`
--

LOCK TABLES `category_types` WRITE;
/*!40000 ALTER TABLE `category_types` DISABLE KEYS */;
INSERT INTO `category_types` VALUES (1,'配料类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(2,'厨具类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(3,'菜品做法','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(4,'套餐类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(5,'职位类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(6,'人员类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(7,'车辆类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(8,'酒席类型','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(9,'支付方式','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(10,'了解渠道','system','system','2026-04-18 22:02:51','2026-04-18 22:02:51'),(11,'一次性消耗品','system','system','2026-04-19 11:01:40','2026-04-19 11:01:40'),(12,'调料用品','system','system','2026-04-19 11:01:51','2026-04-19 11:01:51'),(13,'酒水礼包','system','system','2026-04-19 11:02:37','2026-04-19 11:02:37');
/*!40000 ALTER TABLE `category_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish_ingredients`
--

DROP TABLE IF EXISTS `dish_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish_ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dish_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dish_id` (`dish_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `dish_ingredients_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dish_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish_ingredients`
--

LOCK TABLES `dish_ingredients` WRITE;
/*!40000 ALTER TABLE `dish_ingredients` DISABLE KEYS */;
INSERT INTO `dish_ingredients` VALUES (6,1,1,100.00,'2026-04-18 21:47:06'),(7,1,3,100.00,'2026-04-18 21:47:06'),(8,3,2,100.00,'2026-04-18 21:47:13'),(9,2,1,100.00,'2026-04-18 21:47:19'),(10,2,2,100.00,'2026-04-18 21:47:19'),(11,4,3,100.00,'2026-04-18 21:48:27'),(12,4,2,100.00,'2026-04-18 21:48:27'),(13,5,2,100.00,'2026-04-19 19:33:25'),(14,5,7,100.00,'2026-04-19 19:33:25'),(15,6,6,1.00,'2026-04-19 19:35:49');
/*!40000 ALTER TABLE `dish_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dishes`
--

DROP TABLE IF EXISTS `dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dishware` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cookingMethod` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cookingDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dishes`
--

LOCK TABLES `dishes` WRITE;
/*!40000 ALTER TABLE `dishes` DISABLE KEYS */;
INSERT INTO `dishes` VALUES (1,'土豆丝','通盘','炒菜','阿阿斯顿','2026-04-18 11:08:18','2026-04-18 21:47:06','system','system'),(2,'土豆牛腩','通盘','炖菜','aaaaaaaaaaaa','2026-04-18 11:08:50','2026-04-18 21:47:19','system','system'),(3,'牛肉汤','通盘','例汤','阿打发手动阀第三方','2026-04-18 11:09:10','2026-04-18 21:47:13','system','system'),(4,'爆炒牛肉','通盘','炒菜','青红椒、姜、蒜米辣子粉','2026-04-18 21:48:27','2026-04-18 21:48:27','system','system'),(5,'腐竹牛腩','通盘','炖菜','一到现场开始泡发','2026-04-19 19:33:25','2026-04-19 19:33:25','system','system'),(6,'红糖发糕','通盘','蒸菜','和鱼仔11点40开蒸','2026-04-19 19:35:49','2026-04-19 19:35:49','system','system');
/*!40000 ALTER TABLE `dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'grain-oil',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'土豆','克',100.00,'蔬菜类','2026-04-18 11:07:45','2026-04-18 11:07:45','system','system'),(2,'牛腩','克',100.00,'牛羊肉类','2026-04-18 11:07:54','2026-04-18 11:07:54','system','system'),(3,'青椒','克',100.00,'蔬菜类','2026-04-18 11:08:01','2026-04-18 11:08:01','system','system'),(4,'卤牛肉','斤',1.00,'店铺食材','2026-04-19 11:16:27','2026-04-19 11:17:45','system','system'),(5,'小酥肉','包',1.00,'店铺食材','2026-04-19 11:16:41','2026-04-19 11:17:49','system','system'),(6,'红糖发糕','包',1.00,'店铺食材','2026-04-19 11:17:02','2026-04-19 11:17:55','system','system'),(7,'腐竹','克',100.00,'干货类','2026-04-19 19:32:31','2026-04-19 19:32:31','system','system');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kitchenwares`
--

DROP TABLE IF EXISTS `kitchenwares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kitchenwares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kitchenwares`
--

LOCK TABLES `kitchenwares` WRITE;
/*!40000 ALTER TABLE `kitchenwares` DISABLE KEYS */;
INSERT INTO `kitchenwares` VALUES (1,'通盘','餐具盘碗',1,'2026-04-18 21:18:08','2026-04-18 21:18:08','system','system'),(2,'高压锅','厨房小设备',2,'2026-04-18 21:18:59','2026-04-18 21:19:42','system','system'),(3,'大刨刀','厨房小设备',1,'2026-04-18 21:19:29','2026-04-18 21:19:29','system','system'),(4,'桌架子','大设备',1,'2026-04-18 21:22:25','2026-04-18 21:22:25','system','system'),(5,'桌面','大设备',1,'2026-04-18 21:22:38','2026-04-18 21:22:38','system','system'),(6,'高压锅皮圈','厨房小设备',2,'2026-04-18 22:33:01','2026-04-18 22:33:01','system','system'),(7,'高压锅滴滴','厨房小设备',2,'2026-04-18 22:33:11','2026-04-18 22:33:11','system','system'),(8,'钩子','厨房小设备',2,'2026-04-18 22:33:19','2026-04-18 22:33:19','system','system'),(9,'案板','厨房小设备',2,'2026-04-18 22:33:31','2026-04-18 22:33:31','system','system'),(10,'大锅灶','厨房小设备',2,'2026-04-18 22:33:40','2026-04-18 22:33:40','system','system'),(11,'钢丝球','厨房小设备',1,'2026-04-18 22:33:47','2026-04-18 22:33:47','system','system'),(12,'凳子','大设备',10,'2026-04-18 22:37:37','2026-04-18 22:37:37','system','system'),(13,'桌布','大设备',1,'2026-04-18 22:37:54','2026-04-18 22:37:54','system','system'),(14,'转盘','大设备',1,'2026-04-18 22:38:16','2026-04-18 22:38:16','system','system');
/*!40000 ALTER TABLE `kitchenwares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_dishes`
--

DROP TABLE IF EXISTS `order_dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `dish_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `order_dishes_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_dishes`
--

LOCK TABLES `order_dishes` WRITE;
/*!40000 ALTER TABLE `order_dishes` DISABLE KEYS */;
INSERT INTO `order_dishes` VALUES (26,3,1,1,'2026-04-18 14:04:55'),(27,3,2,1,'2026-04-18 14:04:55'),(28,3,3,1,'2026-04-18 14:04:55'),(36,4,1,1,'2026-04-20 22:41:14'),(37,4,2,1,'2026-04-20 22:41:14'),(38,4,3,1,'2026-04-20 22:41:14'),(39,4,4,1,'2026-04-20 22:41:14'),(40,4,5,1,'2026-04-20 22:41:14'),(41,4,6,1,'2026-04-20 22:41:14'),(42,1,1,1,'2026-04-23 11:41:56'),(43,1,2,1,'2026-04-23 11:41:56'),(44,1,3,1,'2026-04-23 11:41:56'),(45,1,5,1,'2026-04-23 11:41:56'),(46,1,6,1,'2026-04-23 11:41:56'),(47,2,1,1,'2026-04-23 11:42:16'),(48,2,2,1,'2026-04-23 11:42:16'),(49,2,3,1,'2026-04-23 11:42:16'),(56,5,1,1,'2026-04-23 20:20:43'),(57,5,2,1,'2026-04-23 20:20:43'),(58,5,3,1,'2026-04-23 20:20:43'),(59,5,4,1,'2026-04-23 20:20:43'),(60,5,5,1,'2026-04-23 20:20:43'),(61,5,6,1,'2026-04-23 20:20:43'),(62,6,1,1,'2026-04-23 20:57:14'),(63,6,2,1,'2026-04-23 20:57:14'),(64,6,3,1,'2026-04-23 20:57:14'),(65,6,4,1,'2026-04-23 20:57:14'),(66,6,5,1,'2026-04-23 20:57:14'),(67,6,6,1,'2026-04-23 20:57:14');
/*!40000 ALTER TABLE `order_dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_set_meals`
--

DROP TABLE IF EXISTS `order_set_meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_set_meals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `set_meal_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `set_meal_id` (`set_meal_id`),
  CONSTRAINT `order_set_meals_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_set_meals_ibfk_2` FOREIGN KEY (`set_meal_id`) REFERENCES `set_meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_set_meals`
--

LOCK TABLES `order_set_meals` WRITE;
/*!40000 ALTER TABLE `order_set_meals` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_set_meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_staff_arrangements`
--

DROP TABLE IF EXISTS `order_staff_arrangements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_staff_arrangements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `chefs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `waiters` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `drivers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `vehicles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `external_drivers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_staff_arrangements_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_staff_arrangements`
--

LOCK TABLES `order_staff_arrangements` WRITE;
/*!40000 ALTER TABLE `order_staff_arrangements` DISABLE KEYS */;
INSERT INTO `order_staff_arrangements` VALUES (1,1,'[1]','[3]','[2]','[]','[{\"name\":\"user5\",\"phone\":\"1821111\",\"licensePlate\":\"赣a111\"}]','2026-04-20 00:00:00','2026-04-20 00:00:00','','system','system','2026-04-18 11:11:53','2026-04-18 11:11:53'),(2,3,'[1]','[3]','[2]','[1]','[]','2026-04-23 00:00:00','2026-04-23 00:00:00','','system','system','2026-04-18 14:05:37','2026-04-18 14:05:37'),(3,4,'[1]','[3]','[2]','[1]','[]','2026-04-26 00:00:00','2026-04-26 00:00:00','','system','system','2026-04-20 22:41:42','2026-04-20 22:41:42'),(4,6,'[1]','[3]','[2]','[]','[]','2026-04-24 00:00:00','2026-04-24 00:00:00','','leo','leo','2026-04-23 22:24:21','2026-04-23 22:24:21');
/*!40000 ALTER TABLE `order_staff_arrangements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `status_id` int NOT NULL,
  `created_by` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,1,1,'system','2026-04-18 11:10:34'),(2,1,2,'system','2026-04-18 11:11:53'),(3,1,3,'system','2026-04-18 11:11:53'),(4,2,1,'system','2026-04-18 12:17:03'),(5,3,1,'system','2026-04-18 14:04:55'),(6,3,2,'system','2026-04-18 14:05:37'),(7,4,1,'system','2026-04-20 22:41:14'),(8,4,2,'system','2026-04-20 22:41:42'),(9,3,3,'system','2026-04-23 11:31:38'),(10,3,9,'system','2026-04-23 13:12:01'),(11,1,9,'system','2026-04-23 13:18:15'),(12,5,1,'system','2026-04-23 20:17:26'),(13,6,1,'leo','2026-04-23 20:57:14'),(14,6,2,'leo','2026-04-23 22:24:21'),(15,6,9,'leo','2026-04-25 09:54:49');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_statuses`
--

DROP TABLE IF EXISTS `order_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_statuses` (
  `id` int NOT NULL DEFAULT '0',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
INSERT INTO `order_statuses` VALUES (-1,'已取消','客户退订','2026-04-18 10:38:44','2026-04-18 22:02:51'),(1,'待安排','新建订单默认状态','2026-04-18 10:38:44','2026-04-18 22:02:51'),(2,'已安排','人员安排完成','2026-04-18 10:38:44','2026-04-18 22:02:51'),(3,'待回款','服务完成','2026-04-18 10:38:44','2026-04-18 22:02:51'),(9,'已完成','尾款回收','2026-04-18 10:38:44','2026-04-18 22:02:51');
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone2` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_date` date NOT NULL,
  `region` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `set_meal_id` int NOT NULL,
  `feast_time` datetime NOT NULL,
  `feast_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_days` int NOT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `formal_tables` int NOT NULL,
  `backup_tables` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `status` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` int DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `set_meal_id` (`set_meal_id`),
  KEY `status` (`status`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`set_meal_id`) REFERENCES `set_meals` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`status`) REFERENCES `order_statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'20260418_111001650','leo','18211114489','18288889999','aaaaaaaaaaaa','2026-04-22','江西省 / 南昌市 / 东湖区','抖音',1,'2026-04-22 00:00:00','升学宴',1,1000.00,'支付宝','桌布红色',10,0,6880.00,0.00,9,'2026-04-18 11:10:34','2026-04-23 13:18:15','system','system',2,5880.00),(2,'20260418_121608695','李总','18325554446','','安安生生','2026-04-27','江西省 / 南昌市 / 东湖区','朋友介绍',1,'2026-04-27 12:00:00','婚宴',1,500.00,'支付宝','',8,0,5504.00,0.00,1,'2026-04-18 12:17:03','2026-04-23 11:42:16','system','system',3,0.00),(3,'20260418_140402230','user66','18325445566','','adfa','2026-04-24','江西省 / 南昌市 / 东湖区','吃过',1,'2026-04-24 00:00:00','升学宴',1,600.00,'支付宝','',5,0,3440.00,0.00,9,'2026-04-18 14:04:55','2026-04-23 13:12:01','system','system',2,2840.00),(4,'20260420_223957629','来来来','18211114444','17655559999','阿打发','2026-04-27','江西省 / 九江市 / 浔阳区','朋友介绍',1,'2026-04-27 00:00:00','婚宴',2,1000.00,'支付宝','',20,0,13760.00,0.00,2,'2026-04-20 22:41:14','2026-04-23 13:29:26','system','system',2,10000.00),(5,'20260423_201634283','老王','18422223333','','啊阿道夫','2026-04-28','江西省 / 南昌市 / 西湖区','吃过',1,'2026-04-28 12:00:00','升学宴',1,1000.00,'支付宝','',8,1,6192.00,0.00,1,'2026-04-23 20:17:26','2026-04-23 20:20:43','system','leo',3,1000.00),(6,'20260423_205630081','xylon','18366664444','','asdf','2026-04-24','江西省 / 南昌市 / 西湖区','吃过',1,'2026-04-24 12:00:00','升学宴',1,1000.00,'支付宝','',10,0,6880.00,40.00,9,'2026-04-23 20:57:14','2026-04-25 09:54:49','leo','leo',1,5840.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `set_meal_dishes`
--

DROP TABLE IF EXISTS `set_meal_dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `set_meal_dishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `set_meal_id` int NOT NULL,
  `dish_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `set_meal_id` (`set_meal_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `set_meal_dishes_ibfk_1` FOREIGN KEY (`set_meal_id`) REFERENCES `set_meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `set_meal_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `set_meal_dishes`
--

LOCK TABLES `set_meal_dishes` WRITE;
/*!40000 ALTER TABLE `set_meal_dishes` DISABLE KEYS */;
INSERT INTO `set_meal_dishes` VALUES (10,1,1,1,'2026-04-23 20:20:58'),(11,1,2,1,'2026-04-23 20:20:58'),(12,1,6,1,'2026-04-23 20:20:58'),(13,1,4,1,'2026-04-23 20:20:58'),(14,1,3,1,'2026-04-23 20:20:58'),(15,1,5,1,'2026-04-23 20:20:58');
/*!40000 ALTER TABLE `set_meal_dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `set_meals`
--

DROP TABLE IF EXISTS `set_meals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `set_meals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `dishCount` int NOT NULL DEFAULT '0',
  `isVisible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `set_meals`
--

LOCK TABLES `set_meals` WRITE;
/*!40000 ALTER TABLE `set_meals` DISABLE KEYS */;
INSERT INTO `set_meals` VALUES (1,'套餐1','多桌套餐',688.00,'阿斯顿发山东发生的',6,1,'2026-04-18 11:09:53','2026-04-23 20:20:58','system','leo');
/*!40000 ALTER TABLE `set_meals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `positionType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `registrationTime` date NOT NULL,
  `createdBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'user1','男',32,'18211114444','厨师','全职','2026-04-18','system','system','2026-04-18 11:06:54','2026-04-18 11:06:54'),(2,'suer2','男',23,'18211117777','司机','全职','2026-04-18','system','system','2026-04-18 11:07:10','2026-04-18 11:07:10'),(3,'dadd','女',21,'18211114442','服务员','全职','2026-04-18','system','system','2026-04-18 11:07:27','2026-04-18 11:07:27');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'system','$2b$10$otef8KDmkqLvnSyGt2gFWeZ6.xLXwzRTQiAdCP97hwFU3kfi85yDy','admin','2026-04-18 22:02:51','2026-04-18 22:02:51'),(2,'leo','$2b$10$G87LTo/8ozl2fk5KHNaL2ugrAfikf3uuwTW6UncFTkRZdZuReHN0a','admin','2026-04-23 20:12:49','2026-04-23 20:12:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `plate_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'赣L8888','小货车','白色','可用','admin','admin','2026-04-18 10:42:29','2026-04-18 10:42:29');
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

-- Dump completed on 2026-04-26 14:02:42
