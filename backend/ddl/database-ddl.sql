
-- Table: category_settings 类别设置表
CREATE TABLE `category_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL COMMENT '类别类型: meal_type-用餐类型, service_type-服务类型, order_type-订单类型',
  `name` varchar(100) NOT NULL,
  `createdBy` varchar(50) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: category_types 类型管理表
CREATE TABLE `category_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '类型名称（如：用餐类型）',
  `createdBy` varchar(50) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: dish_ingredients 菜品配料存储
CREATE TABLE `dish_ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dish_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dish_id` (`dish_id`),
  KEY `ingredient_id` (`ingredient_id`),
  CONSTRAINT `dish_ingredients_ibfk_1` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dish_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: dishes 菜品管理
CREATE TABLE `dishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `dishware` varchar(50) NOT NULL,
  `cookingMethod` varchar(50) NOT NULL,
  `cookingDescription` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) NOT NULL,
  `updatedBy` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ingredients 配料管理
CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '1',
  `category` varchar(50) NOT NULL DEFAULT 'grain-oil',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) NOT NULL,
  `updatedBy` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_dishes 订单菜品存储
CREATE TABLE `order_dishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `order_dishes_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Table: order_staff_arrangements 订单人员安排
CREATE TABLE `order_staff_arrangements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `chefs` text NOT NULL,
  `waiters` text NOT NULL,
  `drivers` text,
  `vehicles` text,
  `external_drivers` text,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `remark` text,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_staff_arrangements_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_status_history 订单状态历史记录
CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: order_statuses 订单状态管理
CREATE TABLE `order_statuses` (
  `id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders 订单管理
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_phone2` varchar(20) DEFAULT NULL,
  `service_address` varchar(255) NOT NULL,
  `service_date` date NOT NULL,
  `region` varchar(255) NOT NULL,
  `source` varchar(100) NOT NULL,
  `set_meal_id` int(11) NOT NULL,
  `feast_time` datetime NOT NULL,
  `feast_type` varchar(50) NOT NULL,
  `booking_days` int(11) NOT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `remark` text,
  `formal_tables` int(11) NOT NULL,
  `backup_tables` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) NOT NULL,
  `updatedBy` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `set_meal_id` (`set_meal_id`),
  KEY `status` (`status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`set_meal_id`) REFERENCES `set_meals` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`status`) REFERENCES `order_statuses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: set_meal_dishes 套餐菜品存储
CREATE TABLE `set_meal_dishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `set_meal_id` int(11) NOT NULL,
  `dish_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `set_meal_id` (`set_meal_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `set_meal_dishes_ibfk_1` FOREIGN KEY (`set_meal_id`) REFERENCES `set_meals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `set_meal_dishes_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: set_meals 套餐管理
CREATE TABLE `set_meals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `dishCount` int(11) NOT NULL DEFAULT '0',
  `isVisible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `createdBy` varchar(50) NOT NULL,
  `updatedBy` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: staff 人员管理
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `age` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(100) NOT NULL,
  `positionType` varchar(100) NOT NULL,
  `registrationTime` date NOT NULL,
  `createdBy` varchar(50) NOT NULL DEFAULT 'system',
  `updatedBy` varchar(50) NOT NULL DEFAULT 'system',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users 用户管理
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: vehicles 车辆管理
CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plate_number` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: kitchenwares 厨具管理
CREATE TABLE `kitchenwares` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '厨具名称',
  `type` varchar(50) NOT NULL COMMENT '厨具类型',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT '数量',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` varchar(50) NOT NULL COMMENT '创建人',
  `updatedBy` varchar(50) NOT NULL COMMENT '修改人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;