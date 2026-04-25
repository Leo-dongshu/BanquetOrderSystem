-- 添加优惠金额字段到orders表
ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0 AFTER total_amount;