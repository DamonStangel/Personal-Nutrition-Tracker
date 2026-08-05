// Ingredient rows: [ingredient, quantity per serving, calories, protein, carbs, fat, sugar]
const RECIPE_DETAILS = {
  "Breakfast Bagel": [
    ["Ham","2 oz",70,10,4,1.5,4],["Tomato","2 slices",0,0,0,0,0],["Cheese spread","1 serving",25,2,1,1.5,1],["Egg whites","12 tbsp / 3/4 cup",100,20,4,0,0],["Thin bagel","1 bagel",110,4,25,2.5,1]
  ],
  "Protein Oatmeal & Banana": [
    ["Quaker oats","1/2 cup (40g)",150,5,27,3,1],["Protein powder","1 scoop",140,24,6,2,2],["Unsweetened almond milk","1/2 cup (120ml)",15,.5,.5,1.5,0],["Banana","1 whole",105,1,27,0,14]
  ],
  "Egg Bake": [
    ["Extra virgin olive oil","1 tsp",120,0,0,14,0],["Minced garlic","1 tsp",4,0,1,0,0],["Eggs","12 eggs",1560,96,144,60,0],["Milk","1/3 cup",43,3,4,2,4],["Fat-free cheese","38g",60,12,3,0,0],["Spinach","2 cups (60g)",14,2,2,0,1],["Ham","2 oz",70,10,4,1.5,4],["Hash browns","1 cup (85g)",70,1,18,0,0],["Salt and pepper","1/4 tsp each",0,0,0,0,0]
  ],
  "Eggs, Hash Browns & Sausage": [["Eggs","3",240,21,0,6,0],["Hash browns","85g",70,1,18,0,0],["Good & Gather sausage link","1",150,14,2,9,0]],
  "Egg Cheese Burrito": [["Eggs","3",240,21,0,6,0],["Tortilla","1",70,6,19,3.5,0],["Colby jack cheese","1 serving (28g)",110,6,1,8,0]],
  "Turkey Pepperoni Chicken Pizza": [["Italian-seasoning breadcrumbs","1/2 cup",200,8,36,2,4],["Grated Parmesan","1/4 cup",80,8,0,4,0],["All-purpose flour","1/2 cup",220,6,46,0,0],["Chicken breast","170g x 2",334,76,0,3,0],["Egg","1",78,6,0,5,0],["Classico pizza sauce","1/2 cup",80,2,14,2,8],["Fat-free shredded mozzarella","1/2 cup",90,18,4,0,0],["Turkey pepperoni","4 pieces",16.5,2,0,1,0]],
  "Taco Bell Sliders": [["King's Hawaiian roll","1 roll",90,3,15,2,5],["93/7 ground beef","37g",57,7.6,0,2.6,0],["Bell pepper","20g / 12",1,0,0,0,0],["Onion","50g / 12",2,0,0,0,0],["Taco Bell seasoning","1/12 packet",7.5,0,1.5,0,0],["Taco Bell mild sauce","30g / 12",0,0,0,0,0],["Fat-free cheddar","10.5g",17,3.4,1,0,0],["Good & Gather cheese","1/2 slice",40,2,0,3,0],["Quest nacho chips","1/24 bag",6,.75,.2,.2,0],["Beef bone broth","1/24 cup",1.6,.4,0,0,0]],
  "Penne Spaghetti": [["93/7 ground beef","170g",255,34.5,0,12,0],["Protein penne","56g",190,10,38,1,2],["Ragu chunky traditional sauce","120ml (125g)",70,2,15,1,9]],
  "Apache Penne Spaghetti": [["93/7 ground beef","85g",127.5,17.25,0,6,0],["Protein penne","56g",190,10,38,1,2],["Ragu chunky traditional sauce","120ml (125g)",70,2,15,1,9]],
  "Damon Penne Spaghetti Soup": [["93/7 ground beef","170g",255,34.5,0,12,0],["Prego traditional tomato sauce","2 oz",35,1,6,.5,4.5],["Protein penne","56g",190,10,38,1,2],["Chicken broth","As needed",0,0,0,0,0]],
  "Damon Penne Butter Noodles": [["93/7 ground beef","170g",255,34.5,0,12,0],["Fat-free mozzarella","1 serving",45,9,2,0,0],["Protein penne","56g",190,10,38,1,2],["Butter ball","1",50,0,0,11,0]],
  "Apache Chicken Salad": [["Chicken breast","98g",105,21,0,2.75,0],["SkinnyGirl avocado caesar","30ml",30,0,3,2,0],["Spring mix","85g",20,2,3,0,0],["Colby jack cheese","14g",55,3.5,.5,4,0],["Seasoned croutons","7g",35,1,4,1.5,0]],
  "Damon Chicken Salad": [["Chicken breast","7 oz (196g)",210,42,0,5.25,0],["Ranch","30ml",130,0,1,13,1],["Spring mix","85g",20,2,3,0,0],["Colby jack cheese","14g",55,3.5,.5,4,0],["Seasoned croutons","7g",35,1,4,1.5,0]],
  "Chicken Alfredo Pizza - Damon": [["Chicken","196g",210,42,0,5,0],["Cottage cheese","70g",50,7,3,.5,0],["Low-fat mozzarella","40g",64,13,3,0,0],["Pita bread","1/2 bread",190,6,31,4.5,1.5],["Classico Alfredo sauce","60g",45,1,3,3,1],["Salt and pepper","1/4 tsp each",0,0,0,0,0]],
  "Chicken Alfredo Pizza - Wife": [["Chicken","98g",105,21,0,2.5,0],["Cottage cheese","70g",50,7,3,.5,0],["Low-fat mozzarella","40g",64,13,3,0,0],["Pita bread","1/2 bread",190,6,31,4.5,1.5],["Classico Alfredo sauce","60g",45,1,3,3,1],["Salt and pepper","1/4 tsp each",0,0,0,0,0]],
  "Chicken Alfredo Pizza": [["Chicken","170g",187,39,0,2,0],["Cottage cheese","70g",50,7,3,.5,0],["Low-fat mozzarella","40g",64,13,3,0,0],["Pita bread","1/2 bread",190,6,31,4.5,1.5],["Classico Alfredo sauce","60g",45,1,3,3,1],["Salt and pepper","1/4 tsp each",0,0,0,0,0]],
  "Damon Meatloaf": [["93/7 ground beef","170g",255,34.5,0,12,0],["Ketchup","1 serving",20,0,5,0,4],["Quaker oats","1/2 cup (40g)",150,5,27,3,0]],
  "Apache Meatloaf": [["93/7 ground beef","85g",127.5,17.25,0,6,0],["Ketchup","1 serving",20,0,5,0,4],["Quaker oats","1/2 cup (40g)",150,5,27,3,0]],
  "DAMETIME Burger Gravy": [["93/7 ground beef","170g",255,34.5,0,12,0],["White rice","45g",160,3,36,0,0],["Gravy","3 tbsp",60,0,12,1.5,0],["Egg whites","92g",50,10,2,0,0]],
  "Apache Burger Gravy": [["93/7 ground beef","85g",127.5,17.25,0,6,0],["White rice","45g",160,3,36,0,0],["Gravy","3 tbsp",60,0,12,1.5,0]],
  "Cheeseburger - Keto Bun": [["93/7 ground beef","170g",255,34.5,0,12,0],["Sliced pepper jack","1 slice",70,5,1,6,0],["Brownberry keto bun","1 bun",70,9,16,2,0],["Ketchup","2 servings",40,0,10,0,8],["Pickles","5",5,0,0,0,0]],
  "Cheeseburger - White Bread": [["93/7 ground beef","170g",255,34.5,0,12,0],["Sliced pepper jack","1 slice",70,5,1,6,0],["White bread","2 slices",150,5,28,2,2],["Ketchup","2 servings",40,0,10,0,8],["Pickles","5",5,0,0,0,0]],
  "DAMETIME Taco Salad": [["93/7 ground beef","170g",255,34.5,0,12,0],["Taco seasoning","1 serving",15,0,0,0,0],["Cheese","1 serving (28g)",110,6,1,8,0],["Lettuce","30g",5,.4,1,0,0],["Chips","2 servings (56g)",300,4,36,14,0]],
  "DAMETIME Chicken Taco Salad": [["Chicken","196g",210,42,0,5,0],["Taco seasoning","1 serving",15,0,0,0,0],["Cheese","1 serving (28g)",110,6,1,8,0],["Lettuce","30g",5,.4,1,0,0],["Small Doritos","1 bag",150,2,17,8,0]],
  "DAMETIME Dorito Burger Taco Salad": [["93/7 ground beef","170g",255,34.5,0,12,0],["Taco seasoning","1 serving",15,0,0,0,0],["Cheese","1 serving (28g)",110,6,1,8,0],["Lettuce","30g",5,.4,1,0,0],["Small Doritos","1 bag",150,2,17,8,0]],
  "DAMETIME Mini Tacos": [["93/7 ground beef","170g",255,34.5,0,12,0],["Taco seasoning","1 serving",15,0,0,0,0],["Cheese","1 serving (28g)",110,6,1,8,0],["Lettuce","30g",5,.4,1,0,0],["Carb-balance tortillas","2",90,8,24,4,0]],
  "Apache Mini Tacos": [["93/7 ground beef","85g",127.5,17.25,0,6,0],["Taco seasoning","1 serving",15,0,0,0,0],["Cheese","1 serving (28g)",110,6,1,8,0],["Lettuce","30g",5,.4,1,0,0],["Carb-balance tortillas","2",90,8,24,4,0]],
  "Egg Drop Chicken Soup": [["Eggs","2",160,14,0,4,0],["Chicken","196g",210,42,0,5,0],["Carrots","30g",12,.3,3,0,0],["Broth","5 servings",5,0,0,0,0]],
  "Cajun Chicken Noodles": [["Protein spaghetti","10 oz",950,50,190,5,10],["Chicken","1176g",1260,252,0,30,0],["Olive oil","2 tsp (10g)",80,0,0,9,0],["Butter balls","4",200,0,0,22,0],["Minced garlic","3 cloves",15,.6,3,0,0],["Diced tomatoes","120g",20,1,4.5,0,0],["Heavy whipping cream","360g",1200,6,9,120,0],["Grated Parmesan","40g",160,16,0,12,0]],
  "Pizza Bagels - High Protein": [["Protein everything bagel","1",300,21,44,3,3],["Classico pizza sauce","60g",40,0,7,1,2],["Great Value mozzarella","2 slices",100,10,0,7,0],["Hormel pepperoni","6 pieces",55,2,0,5,0]],
  "Pizza Bagels - Current": [["Protein everything bagel","1",300,21,44,3,3],["Roasted pizza sauce","60g",25,0,5,0,2],["Good & Gather mozzarella","2 slices",120,10,2,8,0],["Hormel pepperoni","6 pieces",55,2,0,5,0]],
  "Pizza Bagels - Classic": [["Everything bagel","1",240,9,47,1.5,5],["Roasted pizza sauce","60g",25,0,5,0,2],["Good & Gather mozzarella","2 slices",120,10,2,8,0],["Hormel pepperoni","6 pieces",55,2,0,5,0]],
  "Protein McFlurry": [["Fairlife skim milk","1.5 cups (360ml)",120,19.5,9,0,0],["Vanilla whey protein","1 scoop",120,25,2,1,0],["Zero-cal sweetener","2 tbsp",0,0,0,0,0],["Vanilla extract","1/4 tsp",3,0,0,0,0],["Xanthan gum","1/4 tsp",0,0,0,0,0],["Oreo Thins","4",140,1,21,6,12]],
  "Grilled Cheese": [["Thin white bread","2 slices",90,5,18,1,2],["Butter ball","1",50,0,0,11,0],["Kraft cheese","2 slices",100,6,4,7,2]],
  "Russet Potato Fries": [["Russet potato","2 medium (357g)",282,7.6,65,0,0],["Olive oil","1 tbsp (15ml)",120,0,0,14,0],["Seasonings","To taste",0,0,0,0,0]],
  "Sweet Potato Fries": [["Sweet potato","2 medium (357g)",307,6,72,0,15],["Olive oil","1 tbsp (15ml)",120,0,0,14,0],["Seasonings","To taste",0,0,0,0,0]],
  "Instant Potatoes": [["Milk","1/3 cup",40,3,5,2,0],["Butter","1 tbsp (14g)",100,0,0,11,0],["Potato mix","44g",160,4,34,0,0]],
  "Half Can Corn": [["Canned corn","1/2 of 15 oz can",105,1.75,16,1.75,0]],
  "BBQ Pack Keto": [["Great Value BBQ packs","2 packs",260,20,14,12,12],["Keto bun","1",50,6,16,1.5,0]]
};
