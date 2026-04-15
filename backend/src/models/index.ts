import Dish from './Dish';
import Ingredient from './Ingredient';
import Order from './Order';
import SetMeal from './SetMeal';
import DishIngredient from './DishIngredient';
import OrderDish from './OrderDish';
import OrderSetMeal from './OrderSetMeal';
import SetMealDish from './SetMealDish';
import User from './User';

// 定义关联
Dish.hasMany(DishIngredient, { foreignKey: 'dish_id', as: 'dish_ingredients' });
Ingredient.hasMany(DishIngredient, { foreignKey: 'ingredient_id', as: 'dish_ingredients' });
DishIngredient.belongsTo(Dish, { foreignKey: 'dish_id' });
DishIngredient.belongsTo(Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });

Order.hasMany(OrderDish, { foreignKey: 'order_id', as: 'order_dishes' });
Dish.hasMany(OrderDish, { foreignKey: 'dish_id' });
OrderDish.belongsTo(Order, { foreignKey: 'order_id' });
OrderDish.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

Order.hasMany(OrderSetMeal, { foreignKey: 'order_id', as: 'order_set_meals' });
SetMeal.hasMany(OrderSetMeal, { foreignKey: 'set_meal_id' });
OrderSetMeal.belongsTo(Order, { foreignKey: 'order_id' });
OrderSetMeal.belongsTo(SetMeal, { foreignKey: 'set_meal_id', as: 'set_meal' });

SetMeal.hasMany(SetMealDish, { foreignKey: 'set_meal_id', as: 'set_meal_dishes' });
Dish.hasMany(SetMealDish, { foreignKey: 'dish_id' });
SetMealDish.belongsTo(SetMeal, { foreignKey: 'set_meal_id' });
SetMealDish.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

export { Dish, Ingredient, Order, SetMeal, DishIngredient, OrderDish, OrderSetMeal, SetMealDish, User };