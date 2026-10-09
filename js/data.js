// Mock data for Tiffin and Food Delivery Platform

const TIFFIN_PLANS = [
  {
    id: "plan-solo",
    title: "Standard Ghar-Jaisa Thali",
    subtitle: "Light, healthy, everyday comfort food",
    badge: "Most Popular",
    badgeColor: "primary",
    image: "images/food/plan-ghar-jaisa-thali.webp",
    veg: true,
    fitness: false,
    rating: 4.8,
    reviewsCount: 342,
    calories: "550-650 kcal",
    dishesHighlight: ["Dal Tadka", "Seasonal Sabzi", "4 Phulkas", "Jeera Rice"],
    includes: [
      "4 Fresh Whole Wheat Phulkas",
      "1 Seasonal Sabzi (Bhindi, Aloo Gobi, etc.)",
      "1 Homely Dal (Tadka / Palak / Yellow)",
      "Steamed Jeera Basmati Rice",
      "Fresh Green Salad & Pickle"
    ],
    pricing: { single: 120, weekly: 780, monthly: 3100 }
  },
  {
    id: "plan-royal",
    title: "Executive Deluxe Thali",
    subtitle: "Rich, satisfying meal with paneer/curry & dessert",
    badge: "Chef's Special",
    badgeColor: "accent",
    image: "images/food/plan-executive-deluxe-thali.webp",
    veg: true,
    fitness: false,
    rating: 4.9,
    reviewsCount: 520,
    calories: "750-850 kcal",
    dishesHighlight: ["Paneer Makhani", "Dal Makhani", "Jeera Pulao", "Gulab Jamun"],
    includes: [
      "4 Ghee Phulkas or 2 Parathas",
      "Paneer Special / Kofta Curry",
      "Seasonal Dry Veggie",
      "Dal Makhani / Dal Tadka",
      "Jeera Pulao / Biryani Rice",
      "Sweet Gulab Jamun / Kheer & Raita"
    ],
    pricing: { single: 180, weekly: 1150, monthly: 4400 }
  },
  {
    id: "plan-south",
    title: "South Indian Homely Meals Thali",
    subtitle: "Traditional Sambhar, Rasam & Kootu with hot Phulkas",
    badge: "Regional Special",
    badgeColor: "primary",
    image: "images/food/plan-south-indian-meals.webp",
    veg: true,
    fitness: false,
    rating: 4.8,
    reviewsCount: 290,
    calories: "520-600 kcal",
    dishesHighlight: ["Drumstick Sambhar", "Pepper Rasam", "Poriyal", "Appalam"],
    includes: [
      "3 Fresh Phulkas or 2 Parottas",
      "Authentic Drumstick Sambhar",
      "Pepper Tomato Rasam & Poriyal",
      "Steamed Sona Masoori Rice",
      "Curd, Appalam & Mango Thokku"
    ],
    pricing: { single: 130, weekly: 820, monthly: 3250 }
  },
  {
    id: "plan-satvik",
    title: "Satvik & Jain Pure Ghar Thali",
    subtitle: "Zero onion, zero garlic, light & gentle home cooking",
    badge: "Pure Satvik",
    badgeColor: "success",
    image: "images/food/plan-satvik-jain-thali.webp",
    veg: true,
    fitness: false,
    rating: 4.9,
    reviewsCount: 180,
    calories: "480-550 kcal",
    dishesHighlight: ["Moong Dal Tadka", "Satvik Sabzi", "4 Ghee Phulkas", "Rice Kheer"],
    includes: [
      "4 Ghee Tawa Phulkas",
      "Satvik Seasonal Sabzi (No Onion-Garlic)",
      "Hing Jeera Moong Dal Tadka",
      "Steamed Basmati Rice",
      "Sweet Rice Kheer & Fresh Salad"
    ],
    pricing: { single: 125, weekly: 790, monthly: 3150 }
  },
  // ==========================================================================
  // Non-Veg Specialized Tiffin Plans (With Respective Dish Names)
  // ==========================================================================
  {
    id: "plan-chicken-homestyle",
    title: "Tariwala Chicken & Egg Curry Thali",
    subtitle: "Homestyle chicken curry with spiced boiled egg & ghee phulkas",
    badge: "Daily Non-Veg",
    badgeColor: "danger",
    image: "images/food/plan-chicken-curry-thali.webp",
    veg: false,
    fitness: false,
    rating: 4.9,
    reviewsCount: 430,
    calories: "650-720 kcal (36g Protein)",
    dishesHighlight: ["Tariwala Chicken", "Egg Masala Roast", "4 Ghee Phulkas", "Basmati Rice"],
    includes: [
      "Tariwala Homestyle Chicken Curry (3 tender pcs)",
      "Spiced Egg Masala Roast (1 whole egg)",
      "4 Fresh Whole Wheat Phulkas with Desi Ghee",
      "Steamed Jeera Basmati Rice",
      "Cucumber Onion Mint Raita & Lemon Salad"
    ],
    pricing: { single: 210, weekly: 1350, monthly: 5100 }
  },
  {
    id: "plan-butter-chicken",
    title: "Royal Butter Chicken & Biryani Feast",
    subtitle: "Creamy boneless makhani chicken with fragrant chicken dum biryani",
    badge: "Chef's Special",
    badgeColor: "accent",
    image: "images/food/plan-butter-chicken-biryani.webp",
    veg: false,
    fitness: false,
    rating: 4.9,
    reviewsCount: 512,
    calories: "780-860 kcal (42g Protein)",
    dishesHighlight: ["Butter Chicken Makhani", "Chicken Dum Biryani", "Dal Makhani", "Butter Paratha"],
    includes: [
      "Dhaba-style Boneless Butter Chicken Makhani",
      "Fragrant Chicken Dum Biryani Rice",
      "3 Flaky Butter Tawa Parathas",
      "Slow-cooked Creamy Dal Makhani",
      "Gulab Jamun (1 pc) & Sirka Onions"
    ],
    pricing: { single: 240, weekly: 1550, monthly: 5800 }
  },
  {
    id: "plan-mutton-rogan",
    title: "Kashmiri Mutton Rogan Josh Special Thali",
    subtitle: "Slow-cooked tender mutton curry in authentic Kashmiri spices",
    badge: "Royal Feast",
    badgeColor: "primary",
    image: "images/food/plan-mutton-rogan-thali.webp",
    veg: false,
    fitness: false,
    rating: 4.9,
    reviewsCount: 385,
    calories: "740-830 kcal (40g Protein)",
    dishesHighlight: ["Mutton Rogan Josh", "Egg Bhurji", "Lachha Paratha", "Jeera Pulao"],
    includes: [
      "Kashmiri Mutton Rogan Josh (Slow-braised cuts)",
      "Spiced Double Egg Bhurji / Masala Egg",
      "3 Layered Lachha Parathas",
      "Fragrant Kashmiri Jeera Pulao",
      "Boondi Raita & Fresh Mint Chutney"
    ],
    pricing: { single: 270, weekly: 1750, monthly: 6500 }
  },
  {
    id: "plan-egg-delight",
    title: "Homestyle Egg Curry & Bhurji Meal",
    subtitle: "Double egg curry in rustic onion-tomato gravy with egg bhurji",
    badge: "Budget Protein",
    badgeColor: "warning",
    image: "images/food/plan-egg-curry-meal.webp",
    veg: false,
    fitness: false,
    rating: 4.8,
    reviewsCount: 298,
    calories: "580-650 kcal (32g Protein)",
    dishesHighlight: ["Rustic Egg Curry", "Mumbai Egg Bhurji", "4 Tawa Phulkas", "Basmati Rice"],
    includes: [
      "Rustic Dhaba Egg Curry (2 whole eggs)",
      "Mumbai Masala Egg Bhurji with Veggies",
      "4 Fresh Whole Wheat Tawa Phulkas",
      "Steamed Long-Grain Basmati Rice",
      "Fresh Green Salad & Mango Pickle"
    ],
    pricing: { single: 160, weekly: 1020, monthly: 3900 }
  },
  // ==========================================
  // Fitness / High Protein Specialized Plans (With Respective Dish Names)
  // ==========================================
  {
    id: "plan-fitness-chicken",
    title: "Grilled Chicken Breast & Quinoa Power Box",
    subtitle: "200g lean chicken breast, organic quinoa, egg whites & greens",
    badge: "45g Protein",
    badgeColor: "success",
    image: "images/food/plan-fitness-chicken-quinoa.webp",
    veg: false,
    fitness: true,
    rating: 4.9,
    reviewsCount: 340,
    calories: "480-530 kcal (45g Protein)",
    dishesHighlight: ["Grilled Chicken (200g)", "Tri-Color Quinoa", "2 Egg Whites", "Sautéed Broccoli"],
    includes: [
      "Herb-Grilled Chicken Breast (200g Lean Cut)",
      "Steamed Organic Tri-Color Quinoa Bowl",
      "2 Boiled Egg Whites with Crushed Pepper",
      "Sautéed Broccoli, Zucchini & Bell Peppers",
      "Cold-Pressed Olive Oil & Lemon Vinaigrette"
    ],
    pricing: { single: 230, weekly: 1490, monthly: 5600 }
  },
  {
    id: "plan-fitness-paneer",
    title: "Tandoori Paneer & Soya Power Muscle Meal",
    subtitle: "Grilled low-fat paneer, roasted soya chunks & multigrain rotis",
    badge: "36g Protein",
    badgeColor: "success",
    image: "images/food/plan-fitness-paneer-soya.webp",
    veg: true,
    fitness: true,
    rating: 4.9,
    reviewsCount: 295,
    calories: "510-570 kcal (36g Protein)",
    dishesHighlight: ["Low-Fat Paneer (150g)", "Soya Chunks Curry", "Sprout Chaat", "Oats Rotis"],
    includes: [
      "Tandoori Grilled Low-Fat Paneer Slices (150g)",
      "High-Protein Spiced Soya Chunks Curry",
      "3 Multigrain Oats & Jowar Rotis",
      "Sprouted Moong & Kala Chana Protein Salad",
      "Low-Sodium Yellow Moong Dal Tadka"
    ],
    pricing: { single: 200, weekly: 1300, monthly: 4900 }
  },
  {
    id: "plan-fitness-egg",
    title: "6 Egg Whites & Sprouted Chana Athlete Box",
    subtitle: "Zero-yolk boiled egg whites, high-fiber sprout chaat & brown rice",
    badge: "38g Protein",
    badgeColor: "success",
    image: "images/food/plan-fitness-egg-whites.webp",
    veg: false,
    fitness: true,
    rating: 4.8,
    reviewsCount: 260,
    calories: "460-510 kcal (38g Protein)",
    dishesHighlight: ["6 Boiled Egg Whites", "Sprout Moong Chaat", "Brown Basmati", "Palak Dal"],
    includes: [
      "6 Boiled Egg Whites (or Herb Egg White Scramble)",
      "Steamed Organic Brown Basmati Rice",
      "Sprouted Green Moong & Pomegranate Chaat",
      "High-Fiber Spinach Palak Dal",
      "Roasted Flaxseeds & Lemon Dressing"
    ],
    pricing: { single: 180, weekly: 1180, monthly: 4400 }
  },
  {
    id: "plan-fitness-vegan",
    title: "Tofu, Edamame & Avocado Vegan Lean Bowl",
    subtitle: "Plant-powered firm tofu, edamame beans & Hass avocado",
    badge: "32g Protein",
    badgeColor: "success",
    image: "images/food/plan-fitness-tofu-avocado.webp",
    veg: true,
    fitness: true,
    rating: 4.8,
    reviewsCount: 195,
    calories: "440-490 kcal (32g Protein)",
    dishesHighlight: ["Organic Tofu (160g)", "Edamame & Chickpeas", "Hass Avocado", "Brown Rice"],
    includes: [
      "Pan-Seared Organic Firm Tofu Cubes (160g)",
      "Steamed Edamame & Boiled Chickpea Supermix",
      "Fresh Hass Avocado & Cherry Tomato Salad",
      "Steamed Brown Rice & Red Lentil Soup",
      "Toasted Sesame, Ginger & Garlic Dressing"
    ],
    pricing: { single: 210, weekly: 1360, monthly: 5100 }
  }
];

const MENU_ITEMS = [
  // ==========================================
  // 1. DAILY SPECIALS (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-1", name: "Dal Khichdi & Desi Ghee Bowl", category: "dailyspecial", price: 130, veg: true, rating: 4.8, prepTime: "20 mins", image: "images/food/dish-dal-khichdi.webp", description: "Comforting moong dal khichdi tempered with cumin, garlic and pure desi ghee. Served with curd and papad.", tag: "Comfort Food" },
  { id: "item-2", name: "Baingan Bharta & Phulka Thali", category: "dailyspecial", price: 139, veg: true, rating: 4.7, prepTime: "20 mins", image: "images/food/dish-baingan-bharta.webp", description: "Smoked roasted eggplant mashed with garlic, onions, and ripe tomatoes. Accompanied by four ghee phulkas, curd, and salad.", tag: "Homely Favorite" },
  { id: "item-3", name: "Gujarati Kadhi & Steamed Rice", category: "dailyspecial", price: 129, veg: true, rating: 4.8, prepTime: "18 mins", image: "images/food/dish-gujarati-kadhi.webp", description: "Sweet-savory buttermilk kadhi tempered with cinnamon, cloves and mustard seeds, served with fluffy steamed basmati rice.", tag: "Chef Special" },
  { id: "item-4", name: "Panchmel Dal & Tawa Roti Meal", category: "dailyspecial", price: 140, veg: true, rating: 4.9, prepTime: "20 mins", image: "images/food/dish-panchmel-dal.webp", description: "Authentic Rajasthani 5-lentil mix tempered with hing and dry red chilies, served with 4 ghee rotis and pickle.", tag: "Traditional" },
  { id: "item-5", name: "Kashmiri Dum Aloo Thali", category: "dailyspecial", price: 159, veg: true, rating: 4.8, prepTime: "22 mins", image: "images/food/dish-kashmiri-dum-aloo.webp", description: "Baby potatoes simmered in a spiced fennel-ginger curd gravy, served with 3 lachha parathas and mint onion salad.", tag: "Regional Special" },
  { id: "item-6", name: "Methi Matar Malai & Pulao", category: "dailyspecial", price: 169, veg: true, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-methi-matar-malai.webp", description: "Fresh fenugreek leaves and sweet green peas simmered in cream gravy, served alongside fragrant jeera basmati rice.", tag: "Seasonal Favorite" },
  { id: "item-7", name: "Sarson Ka Saag & Makki Di Roti", category: "dailyspecial", price: 189, veg: true, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-sarson-ka-saag.webp", description: "Slow-cooked mustard greens tempered with ginger, garlic and white butter, served with 2 makki rotis and jaggery.", tag: "Punjabi Classic" },
  { id: "item-8", name: "Subz Dum Handi Biryani Bowl", category: "dailyspecial", price: 179, veg: true, rating: 4.8, prepTime: "25 mins", image: "images/food/dish-veg-handi-biryani.webp", description: "Layered basmati rice with seasonal garden vegetables, mint, and whole spices cooked on slow charcoal dum with salan and raita.", tag: "Claypot Special" },

  // ==========================================
  // 2. NORTH INDIAN (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-9", name: "Paneer Butter Masala Combo", category: "northindian", price: 199, veg: true, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-paneer-butter-masala.webp", description: "Creamy cottage cheese cubes in rich tomato gravy served with 3 butter phulkas, jeera rice, and sliced onions.", tag: "Bestseller" },
  { id: "item-10", name: "Home-style Rajma Chawal Bowl", category: "northindian", price: 149, veg: true, rating: 4.9, prepTime: "20 mins", image: "images/food/dish-rajma-chawal.webp", description: "Slow-cooked Kashmiri red kidney beans in aromatic spices served atop fluffy steamed basmati rice with pickled onions.", tag: "Homely Classic" },
  { id: "item-11", name: "Amritsari Chole Kulche Platter", category: "northindian", price: 179, veg: true, rating: 4.9, prepTime: "22 mins", image: "images/food/dish-chole-kulche.webp", description: "Slow-cooked tangy pindi chole paired with two soft butter-toasted kulchas, pickled carrots, mint chutney, and spiced onion rings.", tag: "Chef Special" },
  { id: "item-12", name: "Shahi Paneer & Lachha Paratha", category: "northindian", price: 219, veg: true, rating: 4.8, prepTime: "25 mins", image: "images/food/dish-shahi-paneer.webp", description: "Tender paneer cubes simmered in cashew-saffron gravy, served with 2 crispy layered lachha parathas and gulab jamun.", tag: "Deluxe Meal" },
  { id: "item-13", name: "Dal Makhani & Jeera Rice", category: "northindian", price: 169, veg: true, rating: 4.9, prepTime: "22 mins", image: "images/food/dish-dal-makhani.webp", description: "Black lentils slow-cooked overnight with white butter and pure cream, paired with fragrant long-grain cumin rice.", tag: "Rich & Creamy" },
  { id: "item-14", name: "Palak Paneer with 3 Phulkas", category: "northindian", price: 189, veg: true, rating: 4.7, prepTime: "20 mins", image: "images/food/dish-palak-paneer.webp", description: "Farm-fresh spinach puree tempered with garlic and soft paneer cubes, served with 3 hot phulkas and fresh salad.", tag: "Healthy North" },
  { id: "item-15", name: "Kadhai Paneer & Butter Naan Meal", category: "northindian", price: 209, veg: true, rating: 4.8, prepTime: "25 mins", image: "images/food/dish-kadhai-paneer.webp", description: "Paneer cubes tossed with crunchy bell peppers and freshly ground spices, served with 2 soft butter naans.", tag: "Spicy & Robust" },
  { id: "item-16", name: "Malai Kofta Deluxe Thali", category: "northindian", price: 229, veg: true, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-malai-kofta.webp", description: "Melt-in-mouth paneer and potato dumplings stuffed with dry fruits, served in velvety cashew gravy with 3 rotis and pulao.", tag: "Royal Feast" },

  // ==========================================
  // 3. SOUTH INDIAN (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-17", name: "South Indian Mini Tiffin Box", category: "southindian", price: 159, veg: true, rating: 4.8, prepTime: "20 mins", image: "images/food/dish-south-mini-tiffin.webp", description: "2 soft steaming Idlis, 1 crispy Medu Vada, mini Masala Dosa, served with drumstick sambar & 2 fresh chutneys.", tag: "All-in-One" },
  { id: "item-18", name: "Mysore Masala Dosa Feast", category: "southindian", price: 149, veg: true, rating: 4.8, prepTime: "18 mins", image: "images/food/dish-mysore-masala-dosa.webp", description: "Crisp golden crepe smeared with spicy red garlic chutney, filled with potato bhaji, served with sambar and coconut dip.", tag: "Bestseller" },
  { id: "item-19", name: "Steaming Ghee Idli (4 Pcs)", category: "southindian", price: 110, veg: true, rating: 4.9, prepTime: "15 mins", image: "images/food/dish-ghee-idli.webp", description: "Pillow-soft fermented rice cakes soaked in aromatic drumstick sambar, topped with roasted gun powder podi and pure ghee.", tag: "Breakfast Hit" },
  { id: "item-20", name: "Crispy Medu Vada Plate (3 Pcs)", category: "southindian", price: 119, veg: true, rating: 4.7, prepTime: "15 mins", image: "images/food/dish-medu-vada.webp", description: "Golden crunchy lentil fritters tempered with whole peppercorns and curry leaves, served with tomato-onion and coconut chutneys.", tag: "Crispy Snack" },
  { id: "item-21", name: "Bisi Bele Bath & Boondi Raita", category: "southindian", price: 139, veg: true, rating: 4.8, prepTime: "20 mins", image: "images/food/dish-bisi-bele-bath.webp", description: "Karnataka specialty rice and lentil mash cooked with vegetables, tamarind, and desi ghee, served with boondi raita.", tag: "Karnataka Special" },
  { id: "item-22", name: "Lemon Rice & Coconut Chutney", category: "southindian", price: 119, veg: true, rating: 4.7, prepTime: "15 mins", image: "images/food/dish-lemon-rice.webp", description: "Zesty turmeric-tempered rice with roasted peanuts, curry leaves, and green chilies, served with freshly grated coconut dip.", tag: "Tangy Delight" },
  { id: "item-23", name: "Curd Rice with Pomegranate", category: "southindian", price: 129, veg: true, rating: 4.9, prepTime: "12 mins", image: "images/food/dish-curd-rice.webp", description: "Soothing creamy yogurt rice tempered with mustard, ginger, curry leaves, and fresh pomegranate jewels. Paired with mango pickle.", tag: "Soothing & Cool" },
  { id: "item-24", name: "Onion Tomato Uttapam (2 Pcs)", category: "southindian", price: 139, veg: true, rating: 4.8, prepTime: "18 mins", image: "images/food/dish-onion-uttapam.webp", description: "Thick savory rice pancakes topped with finely chopped onions, tomatoes, and green chilies. Served with sambar and podi.", tag: "Fluffy & Savory" },

  // ==========================================
  // 4. NON-VEG DELIGHTS (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-25", name: "Dhaba Style Butter Chicken Meal", category: "nonveg", price: 249, veg: false, rating: 4.9, prepTime: "30 mins", image: "images/food/dish-butter-chicken.webp", description: "Tender chicken tikka cooked in velvety makhani gravy served with 3 lachha parathas, sirka onion and mint dip.", tag: "Top Non-Veg" },
  { id: "item-26", name: "Hyderabadi Chicken Dum Biryani", category: "nonveg", price: 239, veg: false, rating: 4.9, prepTime: "30 mins", image: "images/food/dish-chicken-dum-biryani.webp", description: "Aromatic long-grain basmati layered with marinated chicken and saffron, slow-cooked in sealed clay pot with salan and raita.", tag: "Weekend Special" },
  { id: "item-27", name: "Egg Curry & Steamed Rice Bowl", category: "nonveg", price: 169, veg: false, rating: 4.7, prepTime: "20 mins", image: "images/food/dish-egg-curry-rice.webp", description: "Two boiled eggs roasted and simmered in rustic onion-tomato gravy with steamed fragrant rice and onion salad.", tag: "High Protein" },
  { id: "item-28", name: "Tariwala Chicken Curry & Rotis", category: "nonveg", price: 229, veg: false, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-tariwala-chicken.webp", description: "Homestyle thin gravy chicken cooked with ginger, garlic, and fresh coriander, served with 4 whole wheat phulkas.", tag: "Ghar-Style" },
  { id: "item-29", name: "Chicken Korma & Rumali Rotis", category: "nonveg", price: 249, veg: false, rating: 4.8, prepTime: "25 mins", image: "images/food/dish-chicken-korma.webp", description: "Awadhi style boneless chicken simmered in rich yogurt and caramelized onion gravy, served with 2 soft rumali rotis.", tag: "Mughlai Feast" },
  { id: "item-30", name: "Masala Egg Bhurji & Parathas", category: "nonveg", price: 139, veg: false, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-egg-bhurji.webp", description: "Three eggs scrambled with crunchy onions, green chilies, tomatoes, and cumin, served with 2 crispy parathas.", tag: "Quick Protein" },
  { id: "item-31", name: "Chicken Tikka Masala Rice Bowl", category: "nonveg", price: 239, veg: false, rating: 4.9, prepTime: "25 mins", image: "images/food/dish-chicken-tikka-masala.webp", description: "Smoky tandoori chicken chunks tossed in spicy masala gravy over long-grain jeera basmati rice with cucumber dip.", tag: "Smoky & Bold" },
  { id: "item-32", name: "Kashmiri Mutton Rogan Josh Bowl", category: "nonveg", price: 299, veg: false, rating: 4.9, prepTime: "30 mins", image: "images/food/dish-mutton-rogan-josh.webp", description: "Tender slow-cooked mutton pieces in authentic Kashmiri red chilli and ratan jot gravy, served with basmati rice.", tag: "Royal Meat" },

  // ==========================================
  // 5. BREAKFAST & PARATHAS (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-33", name: "Aloo Paratha with White Butter", category: "breakfast", price: 119, veg: true, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-aloo-paratha.webp", description: "2 large whole wheat parathas stuffed with spiced potatoes, served with freshly churned white makhan, curd & pickle.", tag: "All-time Classic" },
  { id: "item-34", name: "Paneer Pyaaz Paratha Box", category: "breakfast", price: 129, veg: true, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-paneer-paratha.webp", description: "Two whole-wheat tawa parathas generously stuffed with grated paneer and onions, accompanied by thick curd and mango pickle.", tag: "Morning Hit" },
  { id: "item-35", name: "Gobi Paratha with Chilled Curd", category: "breakfast", price: 119, veg: true, rating: 4.7, prepTime: "15 mins", image: "images/food/dish-gobi-paratha.webp", description: "Finely grated spiced cauliflower stuffed inside crispy tawa parathas, served with green chilli pickle and fresh curd.", tag: "Winter Classic" },
  { id: "item-36", name: "Indori Poha with Sev & Jalebi", category: "breakfast", price: 99, veg: true, rating: 4.9, prepTime: "12 mins", image: "images/food/dish-indori-poha.webp", description: "Steamed flattened rice tossed with jeeravan masala, onions and pomegranate, topped with ratlami sev and 2 hot jalebis.", tag: "Street Favorite" },
  { id: "item-37", name: "Methi Thepla Plate (4 Pcs)", category: "breakfast", price: 109, veg: true, rating: 4.8, prepTime: "12 mins", image: "images/food/dish-methi-thepla.webp", description: "Thin Gujarati flatbreads flavored with fresh fenugreek leaves, sesame seeds and ajwain, served with sweet mango chunda.", tag: "Light & Travel" },
  { id: "item-38", name: "Club Vegetable Grilled Sandwich", category: "breakfast", price: 119, veg: true, rating: 4.6, prepTime: "15 mins", image: "images/food/dish-veg-grilled-sandwich.webp", description: "Triple-layered toasted whole-wheat sandwich with cucumber, tomato, cheese slice, and spicy mint chutney spread.", tag: "Quick Bite" },
  { id: "item-39", name: "Delhi Style Chole Bhature", category: "breakfast", price: 149, veg: true, rating: 4.9, prepTime: "18 mins", image: "images/food/dish-chole-bhature.webp", description: "Two fluffy paneer-stuffed bhaturas paired with dark spiced pindi chole, pickled amla, and sirka onions.", tag: "Weekend Indulgence" },
  { id: "item-40", name: "Masala Omelette & Toast Combo", category: "breakfast", price: 119, veg: false, rating: 4.8, prepTime: "12 mins", image: "images/food/dish-masala-omelette.webp", description: "Double egg fluffy omelette folded with chopped onions, green chilies, tomatoes, and coriander, served with 2 butter toasts.", tag: "Protein Breakfast" },

  // ==========================================
  // 6. HEALTHY BOWLS (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-41", name: "Sprouts & Paneer Salad Bowl", category: "healthy", price: 139, veg: true, rating: 4.7, prepTime: "15 mins", image: "images/food/dish-sprouts-paneer-salad.webp", description: "Sprouted green gram, fresh paneer cubes, pomegranate, tomatoes, cucumbers with lemon-honey-pepper dressing.", tag: "Diet Special" },
  { id: "item-42", name: "Quinoa Rajma Protein Bowl", category: "healthy", price: 169, veg: true, rating: 4.9, prepTime: "15 mins", image: "images/food/dish-quinoa-protein-bowl.webp", description: "Nutrient-packed boiled red kidney beans served over organic quinoa, paired with broccoli, peanuts, avocado, and lemon dressing.", tag: "High Protein" },
  { id: "item-43", name: "Chickpea & Avocado Super Bowl", category: "healthy", price: 159, veg: true, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-chickpea-avocado-bowl.webp", description: "Boiled white kabuli chana tossed with diced avocado, cherry tomatoes, baby spinach, and roasted flax seeds in olive oil.", tag: "Superfood" },
  { id: "item-44", name: "Grilled Paneer & Veggie Sauté", category: "healthy", price: 179, veg: true, rating: 4.9, prepTime: "18 mins", image: "images/food/dish-grilled-paneer-veggies.webp", description: "Char-grilled cottage cheese slabs with bell peppers, zucchini, and mushrooms, lightly seasoned with rosemary and black pepper.", tag: "Keto Friendly" },
  { id: "item-45", name: "Oats Khichdi with Greens", category: "healthy", price: 139, veg: true, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-oats-khichdi.webp", description: "Rolled oats simmered with yellow moong dal and finely chopped carrots, peas, and spinach. Low GI and light on digestion.", tag: "Low Calorie" },
  { id: "item-46", name: "Brown Rice & Tadka Dal Bowl", category: "healthy", price: 149, veg: true, rating: 4.7, prepTime: "18 mins", image: "images/food/dish-brown-rice-dal.webp", description: "Organic steamed brown rice paired with garlic-cumin tempered yellow dal, roasted papad, and fresh cucumber slices.", tag: "High Fiber" },
  { id: "item-47", name: "Soya Chunks High-Protein Bowl", category: "healthy", price: 149, veg: true, rating: 4.8, prepTime: "15 mins", image: "images/food/dish-soya-chunks-protein.webp", description: "High-protein roasted soya chunks tossed in onion-tomato masala with boiled sweet corn, capsicum, and lemon squeeze.", tag: "35g Protein" },
  { id: "item-48", name: "Greek Garden Salad with Feta", category: "healthy", price: 159, veg: true, rating: 4.7, prepTime: "12 mins", image: "images/food/dish-greek-garden-salad.webp", description: "Crisp lettuce, bell peppers, Kalamata black olives, sliced cucumbers, and soft feta cheese cubes in herb vinaigrette.", tag: "Fresh Greens" },

  // ==========================================
  // 7. DESSERTS & DRINKS (8 Dishes - All WebP < 40KB)
  // ==========================================
  { id: "item-49", name: "Warm Gulab Jamun (2 Pcs)", category: "dessert", price: 60, veg: true, rating: 4.9, prepTime: "10 mins", image: "images/food/dish-gulab-jamun.webp", description: "Soft khoya dumplings dipped in warm saffron-cardamom sugar syrup.", tag: "Sweet Delight" },
  { id: "item-50", name: "Masala Chaas (Spiced Buttermilk)", category: "dessert", price: 35, veg: true, rating: 4.8, prepTime: "5 mins", image: "images/food/dish-masala-chaas.webp", description: "Traditional chilled probiotic buttermilk seasoned with roasted cumin, rock salt, ginger & fresh coriander.", tag: "Digestive Drink" },
  { id: "item-51", name: "Shahi Kesar Phirni in Matki", category: "dessert", price: 75, veg: true, rating: 4.9, prepTime: "10 mins", image: "images/food/dish-kesar-phirni.webp", description: "Slow-cooked creamy ground rice pudding infused with Kashmiri saffron and crushed pistachios, served in clay earthen bowl.", tag: "Royal Sweet" },
  { id: "item-52", name: "Moong Dal Halwa with Desi Ghee", category: "dessert", price: 85, veg: true, rating: 4.9, prepTime: "10 mins", image: "images/food/dish-moong-dal-halwa.webp", description: "Rich roasted yellow lentils slow-cooked with pure cow ghee, milk, cardamom, and slivered almonds.", tag: "Pure Desi Ghee" },
  { id: "item-53", name: "Punjabi Sweet Lassi with Malai", category: "dessert", price: 55, veg: true, rating: 4.8, prepTime: "5 mins", image: "images/food/dish-punjabi-lassi.webp", description: "Thick hand-churned yogurt beverage sweetened with fragrant rose water and topped with a thick dollop of clotted cream.", tag: "Chilled Cooler" },
  { id: "item-54", name: "Chilled Kesar Badam Milk", category: "dessert", price: 65, veg: true, rating: 4.8, prepTime: "5 mins", image: "images/food/dish-kesar-badam-milk.webp", description: "Creamy whole milk infused with crushed almonds, cardamom, and saffron strands, served ice-cold.", tag: "Nutritious Drink" },
  { id: "item-55", name: "Spongy Bengali Rasgulla (2 Pcs)", category: "dessert", price: 55, veg: true, rating: 4.9, prepTime: "8 mins", image: "images/food/dish-bengali-rasgulla.webp", description: "Fresh cottage cheese balls boiled in light rose-flavored sugar syrup until porous, tender and juicy.", tag: "Authentic Sweet" },
  { id: "item-56", name: "South Indian Filter Coffee", category: "dessert", price: 45, veg: true, rating: 4.9, prepTime: "5 mins", image: "images/food/dish-filter-coffee.webp", description: "Traditional chicory-blended decoction frothed with boiling whole milk, served piping hot with signature foam head.", tag: "Aromatic Brew" }
];

const TODAY_SCHEDULE = {
  day: "Today's Homely Lunch",
  timeSlot: "Lunch (12:30 PM - 2:00 PM)",
  dishes: [
    { name: "Methi Paneer / Aloo Shimlamirch", type: "Main Sabzi" },
    { name: "Panchmel Dal Tadka", type: "Dal" },
    { name: "Tawa Phulkas with Pure Ghee", type: "Breads (4 pcs)" },
    { name: "Steamed Zeera Rice", type: "Rice" },
    { name: "Cucumber Boondi Raita & Salad", type: "Sides" },
    { name: "Rice Kheer / Moong Halwa", type: "Dessert" }
  ]
};

const TESTIMONIALS = [
  {
    name: "Rohan Sharma",
    role: "Software Engineer, HSR Layout",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    comment: "I subscribed to the 30-day Lunch plan. The food genuinely feels like my mom's home cooking. Very light on the stomach, no excess oil or artificial colors."
  },
  {
    name: "Pooja Deshmukh",
    role: "PG Student, Koramangala",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    comment: "The best part is flexibility! On days I'm traveling or eating out, I can simply pause the subscription with one click. Super reliable delivery too."
  },
  {
    name: "Arjun Nair",
    role: "Marketing Manager, Whitefield",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
    rating: 5,
    comment: "Fitness thali has been a game changer for my diet! 30g protein daily without having to cook or wash dishes after a long work shift."
  }
];

const FAQS = [
  {
    q: "How does the Tiffin subscription work?",
    a: "You choose between a 1-day trial, 7-day weekly, or 30-day monthly plan. You select your preferred meal time (Lunch, Dinner, or Both) and enter your address. Meals are delivered fresh every day in insulated hygienic containers."
  },
  {
    q: "Can I skip or pause meals if I go out of town?",
    a: "Yes! You can pause your subscription up to 4 hours before the delivery slot. The paused days are automatically added to the end of your subscription period."
  },
  {
    q: "Is the food prepared fresh every day?",
    a: "Absolutely. Our certified home-chefs prepare meals 45 minutes before dispatch. We never reuse gravies or freeze cooked meals."
  },
  {
    q: "What payment methods are supported?",
    a: "We support UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, and Cash on Delivery (COD) for trial meals."
  }
];
