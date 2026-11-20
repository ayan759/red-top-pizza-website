/*
  Red Top Pizza — site data.
  Everything that changes (prices, hours, deals, reviews, links) lives in this one file.
  Edit a value here and every page that shows it updates.

  Menu and prices copied from Toast on 17 Nov 2026:
  https://order.toasttab.com/online/red-top-pizza-detroit-style-3950-sage-hill-drive-nw
*/
window.RTP = {
  business: {
    name: "Red Top Pizza",
    phone: "(587) 534-5053",
    phoneHref: "tel:+15875345053",
    email: "redtoppizzayyc@gmail.com",
    street: "3950 Sage Hill Dr NW, Unit 330",
    city: "Calgary, AB T3R 2A4",
    timeZone: "America/Edmonton",
    pickupUrl: "https://order.toasttab.com/online/red-top-pizza-detroit-style-3950-sage-hill-drive-nw",
    deliveryUrl: "https://order.online/store/red-top-pizza---detroit-style-calgary-29682488/?hideModal=true",
    reviewsUrl: "https://maps.google.com/?cid=17780742751554963912",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Red%20Top%20Pizza%2C%203950%20Sage%20Hill%20Dr%20NW%20%23330%2C%20Calgary%2C%20AB%20T3R%202A4",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Red+Top+Pizza+-+Detroit+Style+(Sage+Hill),+3950+Sage+Hill+Dr+NW+%23330,+Calgary,+AB+T3R+2A4&z=15&output=embed",
    social: [
      { name: "Instagram", handle: "@eatredtoppizza", url: "https://www.instagram.com/eatredtoppizza/", icon: "brand-instagram" },
      { name: "TikTok", handle: "@redtoppizzayyc", url: "https://www.tiktok.com/@redtoppizzayyc", icon: "brand-tiktok" },
      { name: "Facebook", handle: "eatredtoppizza", url: "https://www.facebook.com/eatredtoppizza", icon: "brand-facebook" }
    ],
    /* Where Request a Quote submissions go.
       Leave empty to open the visitor's email app with the request filled in (sent to `email` above).
       Paste a form-service URL (for example a Formspree endpoint) to receive submissions directly. */
    quoteEndpoint: ""
  },

  /* Opening hours. day: 0 = Sunday … 6 = Saturday. 24-hour times. From Toast, 17 Nov 2026. */
  hours: [
    { day: 0, open: "12:00", close: "22:00" },
    { day: 1, open: "11:00", close: "22:00" },
    { day: 2, open: "11:00", close: "22:00" },
    { day: 3, open: "11:00", close: "22:00" },
    { day: 4, open: "11:00", close: "22:00" },
    { day: 5, open: "11:00", close: "23:00" },
    { day: 6, open: "11:00", close: "23:00" }
  ],

  /* Google rating. Update `value`, `count` and `checked` when you check your Google profile. */
  rating: {
    value: 4.5,
    count: 408,
    checked: "2026-11-17",
    /* Topics Google shows at the top of your reviews, with how many reviews mention each. */
    topics: [
      { label: "Detroit-style pizza", count: 80 },
      { label: "Donair dunkers", count: 7 },
      { label: "Thick crust", count: 7 },
      { label: "Arabian pizza", count: 4 }
    ]
  },

  /* Reviews to feature. Copy reviews you choose from your Google profile, for example:
     { name: "Chris S.", rating: 5, date: "October 2026", text: "Paste the review text here." }
     The review cards appear on the home page as soon as this list has at least one entry. */
  reviews: [],

  /* Current deal: shown in the Deals section, the order popup on every page, and the menu page.
     on: false hides it everywhere. code: "" when customers don't need a promo code.
     img: a photo name from assets/img/menu (optional). */
  promo: {
    on: true,
    title: "Free Chocolate Lava Cake",
    detail: "Get a free Chocolate Lava Cake when you order $40 or more for pickup online.",
    short: "Free Chocolate Lava Cake on orders of $40+.",
    code: "",
    img: "lava-cake"
  },

  bundles: [
    {
      group: "8 Square Detroit-style bundles",
      note: "Choose any of our 8 Square Detroit-style pizzas. Great for family dinners, parties and game nights.",
      image: "assets/img/menu/bundle-8sq.webp",
      rows: [
        { pizzas: 3, price: 90, save: 6, serves: 12 },
        { pizzas: 6, price: 183, save: 9, serves: 24 },
        { pizzas: 8, price: 244, save: 12, serves: 32 }
      ]
    },
    {
      group: "14\" round pizza bundles",
      note: "Choose any of our 14\" specialty pizzas. Premium selections may cost extra.",
      image: "assets/img/menu/bundle-14.webp",
      rows: [
        { pizzas: 3, price: 83, save: 6 },
        { pizzas: 6, price: 169, save: 9 },
        { pizzas: 8, price: 226, save: 12 }
      ]
    }
  ],

  /* "Red Top Fan Favourites" on the home page, in order, three per row.
     - A pizza card: `pizza` is an id from the pizza list below, `sizes` picks which prices to show
       (sq4, sq8, r10, r12, r14). `img` and `desc` are optional and replace the menu's photo and description.
     - Any other item: `item` is its exact name from the sections list (calzones, sides, desserts...). */
  favourites: [
    { pizza: "good-pie", sizes: ["sq4", "sq8"] },
    { pizza: "pesto-pie", sizes: ["sq4", "sq8"] },
    { pizza: "detroiter", sizes: ["r14"], img: "detroiter-14" },
    { pizza: "bbq-chicken", sizes: ["sq8"] },
    { pizza: "tandoori", sizes: ["r14"], img: "tandoori-14",
      desc: "Pizza sauce, tandoori chicken, green peppers, red onions, jalapeños, brick & mozzarella cheese" },
    { pizza: "meat-supreme", sizes: ["r14"], img: "meat-supreme-14" },
    { item: "Classic Calzone" },
    { item: "Baked Lasagna" },
    { item: "Cheesy Garlic Bread" },
    { item: "Caesar Salad" },
    { item: "Mozzarella Sticks" },
    { item: "New York Cheesecake" }
  ],

  sizes: [
    { key: "sq4", label: "4 Square", short: "4 Sq", note: "Detroit-style, feeds up to 2" },
    { key: "sq8", label: "8 Square", short: "8 Sq", note: "Detroit-style, feeds up to 4" },
    { key: "r10", label: "10\" round", short: "10\"", note: "Traditional round" },
    { key: "r12", label: "12\" round", short: "12\"", note: "Traditional round" },
    { key: "r14", label: "14\" round", short: "14\"", note: "Traditional round" }
  ],

  pizzas: [
    { id: "detroiter", name: "The Detroiter", tag: "Best seller", img: "detroiter",
      desc: "Pizza sauce, double pepperoni, hot honey drizzle, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 18.95, r12: 23.95, r14: 27.95 } },
    { id: "good-pie", name: "The Good Pie", tag: "Feature", img: "good-pie",
      desc: "Pizza sauce, cup and char pepperoni, sausage, jalapeños, hot honey drizzle, brick & mozzarella cheese",
      prices: { sq4: 24, sq8: 34 } },
    { id: "pesto-pie", name: "Pesto Pie", tag: "Feature", img: "pesto-pie",
      desc: "Grilled chicken, bacon, brick & mozzarella cheese, topped with pesto and ranch drizzle",
      prices: { sq4: 24, sq8: 34 } },
    { id: "greektown", name: "Greektown", meatless: true,
      desc: "Pizza sauce, onions, green peppers, black olives, tomatoes, feta, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 19.95, r12: 25.95, r14: 29.95 } },
    { id: "bbq-chicken", name: "Tangy BBQ Chicken", img: "bbq-chicken",
      desc: "BBQ sauce, chicken, bacon, onions, green peppers, jalapeños, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "hawaiian", name: "Hawaiian",
      desc: "Pizza sauce, smoked ham, pineapple, bacon, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 18.95, r12: 23.95, r14: 27.95 } },
    { id: "meat-supreme", name: "Meat Supreme", img: "meat-supreme",
      desc: "Pizza sauce, pepperoni, salami, smoked ham, bacon, beef, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 32.95 } },
    { id: "zeus", name: "The Zeus", img: "zeus",
      desc: "Garlic butter, smoked ham, chicken, black olives, tomatoes, onions, feta, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "arabian", name: "Arabian", img: "arabian",
      desc: "House-made sweet sauce, beef doner meat, tomatoes, onions, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 32.95 } },
    { id: "six-mile", name: "The 6 Mile",
      desc: "Pizza sauce, pepperoni, ham, mushrooms, green peppers, onions, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "motown", name: "Mo'Town Special", img: "motown",
      desc: "Pizza sauce, pepperoni, mushrooms, green peppers, black olives, sausage, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "midtown-heat", name: "Midtown Heat", img: "midtown-heat",
      desc: "Pizza sauce, pepperoni, salami, sausage, beef, banana peppers, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "chicken-supreme", name: "Chicken Supreme", img: "chicken-supreme",
      desc: "Pizza sauce, chicken, mushrooms, green peppers, tomatoes, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 19.95, r12: 26.95, r14: 29.95 } },
    { id: "corktown", name: "Corktown Groove", img: "corktown",
      desc: "Garlic butter, bacon, pickles, spinach, feta, honey drizzle, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 19.95, r12: 26.95, r14: 29.95 } },
    { id: "veggie", name: "Veggie Supreme", img: "veggie", meatless: true,
      desc: "Pizza sauce, onions, mushrooms, green peppers, tomatoes, black olives, brick & mozzarella cheese",
      prices: { sq4: 23, sq8: 33, r10: 18.95, r12: 23.95, r14: 27.95 } },
    { id: "butter-chicken", name: "Butter Chicken", tag: "New", img: "butter-chicken",
      desc: "House butter chicken sauce, onions, chicken, roasted red pepper, green peppers, brick & mozzarella cheese, creamy garlic drizzle",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 32.95 } },
    { id: "ranchhouse", name: "Ranchhouse Chicken", tag: "New",
      desc: "Creamy ranch base, onions, chicken, bacon, jalapeños, brick & mozzarella cheese, ranch drizzle",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 31.95 } },
    { id: "tandoori", name: "Tandoori Chicken", img: "tandoori",
      desc: "Tandoori chicken, green peppers, red onions, jalapeños, brick & mozzarella cheese, pizza sauce and grated parmesan",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 26.95, r14: 31.95 } },
    { id: "cheese", name: "Cheese", img: "cheese", meatless: true,
      desc: "Marinara sauce, brick & mozzarella cheese",
      prices: { sq4: 17, sq8: 24, r10: 15.95, r12: 18.95, r14: 20.95 } },
    { id: "pepperoni", name: "Pepperoni",
      desc: "Marinara sauce, pepperoni, brick & mozzarella cheese",
      prices: { sq4: 19.25, sq8: 27.25, r10: 17.7, r12: 21.45, r14: 25.95 } }
  ],

  seasonal: [
    { id: "spanakopita", name: "Tony Soprano Spanakopita", tag: "Seasonal",
      desc: "Garlic oil, premium mozzarella, spinach, ground beef, red onion, mushrooms, tomatoes and feta",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 26.95, r14: 30.95 } },
    { id: "pickle", name: "I'm Da' Pickle", tag: "Seasonal", img: "pickle",
      desc: "White sauce, cracked black pepper, premium mozzarella, red onions, sausage, sliced pickles, dill and hot honey drizzle",
      prices: { sq4: 23, sq8: 33, r10: 20.95, r12: 27.95, r14: 30.95 } }
  ],

  buildYourOwn: {
    id: "byo", name: "Build Your Own",
    desc: "Start with sauce and cheese, then add the toppings you love. Half-and-half is available on round pizzas.",
    prices: { sq4: 17, sq8: 24, r10: 15.95, r12: 18.95, r14: 22.95 }
  },

  /* Everything that isn't a pizza. */
  sections: [
    { id: "calzones", title: "Oven-baked calzones", items: [
      { name: "Classic Calzone", price: 12.95, img: "calzone-classic", desc: "Pepperoni, ham, mushrooms, green peppers, signature tomato sauce and mozzarella" },
      { name: "Folded Arabian", price: 13.95, img: "calzone-arabian", desc: "Beef doner meat, onions, tomatoes, sweet sauce and mozzarella" },
      { name: "Folded Meat Supreme", price: 13.95, img: "calzone-meat", desc: "Pepperoni, ham, Italian salami, beef, bacon, signature tomato sauce and mozzarella" },
      { name: "Build Your Own Calzone", price: 12.95, desc: "Signature tomato sauce and mozzarella cheese" }
    ] },
    { id: "pastas", title: "Baked pastas", items: [
      { name: "8 Mile Lasagna", price: 16.95, desc: "Meat sauce, doner meat, mushrooms, green peppers and mozzarella" },
      { name: "Baked Lasagna", price: 13.95, img: "lasagna", desc: "Meat sauce, lasagna noodles and mozzarella" },
      { name: "Baked Fettuccine Alfredo", price: 13.95, desc: "Alfredo sauce, fettuccine noodles and mozzarella", meatless: true },
      { name: "Build Your Own Pasta", price: 16.95, desc: "Built your way" }
    ] },
    { id: "wings", title: "Wings", items: [
      { name: "Chicken Wings", price: 13.95, desc: "10 pieces" }
    ] },
    { id: "salads", title: "Fresh salads", items: [
      { name: "Caesar Salad", price: 9.95, img: "caesar", desc: "Fresh-cut romaine, croutons, parmesan and creamy Caesar dressing" },
      { name: "Greek Salad", price: 11.95, img: "greek-salad", desc: "Romaine, onions, green peppers, tomatoes, black olives, feta and Greek dressing", meatless: true },
      { name: "Garden Salad", price: 11.95, img: "garden-salad", desc: "Romaine, onions, green peppers, tomatoes, black olives and Italian dressing", meatless: true }
    ] },
    { id: "sides", title: "Sides", items: [
      { name: "Cheesy Garlic Bread", price: 9.95, img: "garlic-bread", desc: "Served with marinara sauce", meatless: true },
      { name: "Donair Fingers", price: 11.95, desc: "Served with sweet sauce" },
      { name: "Jalapeño Breadsticks", price: 10.95, desc: "Served with marinara sauce", meatless: true },
      { name: "Chicken Fingers & Fries", price: 12.95, img: "chicken-fingers", desc: "Served with plum sauce" },
      { name: "Buffalo Chicken Tenders", price: 12.95, desc: "Served with ranch" },
      { name: "Chicken Thai Bites", price: 11.95, desc: "" },
      { name: "Jalapeño Poppers", price: 9.95, img: "poppers", desc: "Served with marinara sauce" },
      { name: "Mozzarella Sticks", price: 9.95, img: "mozza-sticks", desc: "Served with marinara sauce" },
      { name: "French Fries", price: 4.95, img: "fries", desc: "", meatless: true },
      { name: "Sauce & Dips", price: 1.35, img: "dips", desc: "Extra dipping sauce" }
    ] },
    { id: "desserts", title: "Desserts", items: [
      { name: "New York Cheesecake", price: 6.95, img: "cheesecake", desc: "" },
      { name: "Chocolate Lava Cake", price: 6.95, img: "lava-cake", desc: "Topped with chocolate syrup" }
    ] },
    { id: "drinks", title: "Drinks", items: [
      { name: "Can of Pop", price: 2.0, desc: "355 mL" },
      { name: "Bottle of Pop", price: 4.75, desc: "2 L" },
      { name: "Bottled Water", price: 2.0, desc: "" }
    ] }
  ]
};
