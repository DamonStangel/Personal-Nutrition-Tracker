const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shake"];
const GOALS = { calories: 2500, protein: 190, carbs: 275, fat: 70, sugar: 38 };
let weekOffset = 0;
let activeRecipeFilter = "all";
let currentPage = "weekly";
let editingFood = null;

const RECIPES = [
  ["Breakfast Bagel","breakfast",305,36,34,28,6,["2 oz ham","Tomato slices","Cheese spread","3/4 cup egg whites","Thin bagel"]],
  ["Protein Oatmeal & Banana","breakfast",410,30.5,60.5,6.5,17,["1/2 cup Quaker oats","Protein powder","1/2 cup almond milk","1 banana"]],
  ["Egg Bake","breakfast",323.5,20.7,29.3,12.9,1.5,["Eggs","Milk","Fat-free cheese","Spinach","Ham","Hash browns"]],
  ["Eggs, Hash Browns & Sausage","breakfast",460,36,20,15,0,["3 eggs","85g hash browns","Sausage link"]],
  ["Egg Cheese Burrito","breakfast",420,33,20,17.5,0,["3 eggs","Tortilla","Colby jack cheese"]],
  ["Turkey Pepperoni Chicken Pizza","meal",549.3,63,50,8.5,6,["Chicken breast","Breadcrumbs","Parmesan","Pizza sauce","Fat-free mozzarella","Turkey pepperoni"]],
  ["Taco Bell Sliders","meal",214.5,16,17.5,7.6,5,["King's Hawaiian roll","93/7 beef","Taco seasoning","Fat-free cheddar","Cheese","Quest chips"]],
  ["Penne Spaghetti","meal",515,46.5,53,14,11,["170g 93/7 beef","Protein penne","Ragu chunky sauce"]],
  ["Apache Penne Spaghetti","meal",387.5,29.3,53,8,11,["85g 93/7 beef","Protein penne","Ragu chunky sauce"]],
  ["Damon Penne Spaghetti Soup","meal",480,45.5,44,13.5,6.5,["170g 93/7 beef","Protein penne","Tomato sauce","Chicken broth"]],
  ["Damon Penne Butter Noodles","meal",540,53.5,40,24,2,["170g 93/7 beef","Protein penne","Fat-free mozzarella","Butter"]],
  ["Apache Chicken Salad","meal",245,27.5,10.5,10.3,0,["98g chicken breast","Avocado caesar dressing","Spring mix","Colby jack","Croutons"]],
  ["Damon Chicken Salad","meal",450,48.5,8.5,23.8,1,["196g chicken breast","Ranch","Spring mix","Colby jack","Croutons"]],
  ["Chicken Alfredo Pizza - Damon","meal",559,69,40,13,2.5,["196g chicken","Cottage cheese","Low-fat mozzarella","Pita bread","Alfredo sauce"]],
  ["Chicken Alfredo Pizza - Wife","meal",454,48,40,10.5,2.5,["98g chicken","Cottage cheese","Low-fat mozzarella","Pita bread","Alfredo sauce"]],
  ["Chicken Alfredo Pizza","meal",536,66,40,10,2.5,["170g chicken","Cottage cheese","Low-fat mozzarella","Pita bread","Alfredo sauce"]],
  ["Damon Meatloaf","meal",425,39.5,32,15,4,["170g 93/7 beef","Ketchup","Quaker oats"]],
  ["Apache Meatloaf","meal",297.5,22.3,32,9,4,["85g 93/7 beef","Ketchup","Quaker oats"]],
  ["DAMETIME Burger Gravy","meal",525,47.5,50,13.5,0,["170g 93/7 beef","White rice","Gravy","Egg whites"]],
  ["Apache Burger Gravy","meal",347.5,20.3,48,7.5,0,["85g 93/7 beef","White rice","Gravy"]],
  ["Cheeseburger - Keto Bun","meal",440,48.5,27,20,8,["170g 93/7 beef","Pepper jack","Keto bun","Ketchup","Pickles"]],
  ["Cheeseburger - White Bread","meal",520,44.5,39,20,10,["170g 93/7 beef","Pepper jack","White bread","Ketchup","Pickles"]],
  ["DAMETIME Taco Salad","meal",685,44.9,38,34,0,["170g 93/7 beef","Taco seasoning","Cheese","Lettuce","Chips"]],
  ["DAMETIME Chicken Taco Salad","meal",490,50.4,19,21,0,["196g chicken","Taco seasoning","Cheese","Lettuce","Doritos"]],
  ["DAMETIME Dorito Burger Taco Salad","meal",535,42.9,19,28,0,["170g 93/7 beef","Taco seasoning","Cheese","Lettuce","Doritos"]],
  ["DAMETIME Mini Tacos","meal",475,48.9,26,24,0,["170g 93/7 beef","Taco seasoning","Cheese","Lettuce","Carb-balance tortillas"]],
  ["Apache Mini Tacos","meal",347.5,31.7,26,18,0,["85g 93/7 beef","Taco seasoning","Cheese","Lettuce","Carb-balance tortillas"]],
  ["Egg Drop Chicken Soup","meal",387,56.3,3,9,0,["2 eggs","196g chicken","Carrots","Broth"]],
  ["Cajun Chicken Noodles","meal",647.5,54.3,34.4,33,1.7,["Protein spaghetti","Chicken","Olive oil","Tomatoes","Heavy cream","Parmesan"]],
  ["Pizza Bagels - High Protein","meal",495,33,51,16,5,["Protein bagel","Pizza sauce","Mozzarella","Pepperoni"]],
  ["Pizza Bagels - Current","meal",500,33,51,16,5,["Protein bagel","Roasted pizza sauce","Mozzarella","Pepperoni"]],
  ["Pizza Bagels - Classic","meal",440,21,54,14.5,7,["Everything bagel","Pizza sauce","Mozzarella","Pepperoni"]],
  ["Protein McFlurry","meal",383,45.5,32,7,12,["Fairlife skim milk","Vanilla whey","Vanilla extract","Xanthan gum","Oreo Thins"]],
  ["Grilled Cheese","meal",240,11,22,19,4,["Thin white bread","Butter","Kraft cheese"]],
  ["Russet Potato Fries","side",201,3.8,32.5,7,0,["Russet potatoes","Olive oil","Seasonings"]],
  ["Sweet Potato Fries","side",427,6,72,14,15,["Sweet potatoes","Olive oil","Seasonings"]],
  ["Instant Potatoes","side",150,3.5,19,6.5,0,["Milk","Butter","Potato mix"]],
  ["Half Can Corn","side",105,1.8,16,1.8,0,["1/2 of a 15 oz can"]],
  ["BBQ Pack Keto","meal",310,26,30,13.5,12,["BBQ packs","Keto bun"]]
].map(([name,type,cal,p,c,fat,s,ingredients],id)=>({id,name,type,cal,p,c,fat,s,ingredients,rows:RECIPE_DETAILS[name] || []}));

const savedRecipes = JSON.parse(localStorage.getItem("daily-fuel-custom-recipes") || "[]");
savedRecipes.forEach((recipe,index) => RECIPES.push({...recipe,id:`custom-${index}`}));

const sample = {
  Monday: {
    Breakfast: [["3 eggs",240,21,0,6,0],["White bread toast ×2",280,10,52,3,2],["Banana",105,1,27,0,0]],
    Lunch: [["Chicken salad ranch",450,48.5,8.5,23.75,1],["Baked Lays",110,2,19,3,2]],
    Dinner: [["Taco Bell sliders ×3",643.5,48,52.5,22.8,15],["Half 15oz corn",105,1.75,16,1.75,0]],
    Snacks: [["Pizza chips — BBQ",140,19,5,5,0]],
    Shake: [["1 cup milk",130,8,13,5,0],["GNC chocolate protein",120,25,3,1,1],["Creatine gummy 4.5g",33,0,8,0,3.3]]
  },
  Tuesday: {
    Breakfast: [["Protein oatmeal & banana",410,30.5,60.5,6.5,2]],
    Lunch: [["Tyson chicken breast",190,47,0,5.25,0],["Jasmine rice",150,3,35,0,0],["Teriyaki sauce",70,1,16,0,14]],
    Dinner: [["Burger gravy with egg whites",525,47.5,50,13.5,0],["Sun Chips original",140,2,19,6,2]],
    Snacks: [["Oikos protein yogurt",120,23,5,1.5,0],["Sun Chips original",140,2,19,6,2]],
    Shake: [["1 cup milk",130,8,13,5,0],["GNC chocolate protein",120,25,3,1,1],["Creatine gummy 4.5g",33,0,8,0,3.3]]
  },
  Wednesday: {
    Breakfast: [["Protein oatmeal & banana",410,30.5,60.5,6.5,2]],
    Lunch: [["Chicken salad ranch",450,48.5,8.5,23.75,1],["Baked Lays",110,2,19,3,2]],
    Dinner: [["Taco Bell sliders ×3",643.5,48,52.5,22.8,15],["Half 15oz corn",105,1.75,16,1.75,0]],
    Snacks: [["Oikos protein yogurt",120,23,5,1.5,0],["Baked Cheetos",120,2,18,4,1]],
    Shake: [["1 cup milk",130,8,13,5,0],["GNC chocolate protein",120,25,3,1,1],["Creatine gummy 4.5g",33,0,8,0,3.3]]
  }
};

function blankWeek() {
  return Object.fromEntries(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map(day => [day, Object.fromEntries(MEALS.map(m => [m, []]))]));
}
function getWeekKey() { const d = getSunday(); return d.toISOString().slice(0,10); }
function getSunday() { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate() - d.getDay() + weekOffset * 7); return d; }
function loadWeek() {
  const saved = localStorage.getItem(`daily-fuel-${getWeekKey()}`);
  if (saved) return JSON.parse(saved);
  const data = blankWeek();
  if (weekOffset === 0) Object.entries(sample).forEach(([day, meals]) => Object.assign(data[day], meals));
  return data;
}
function saveWeek(data) { localStorage.setItem(`daily-fuel-${getWeekKey()}`, JSON.stringify(data)); }
function sumFoods(foods) { return foods.reduce((a,f) => ({cal:a.cal+f[1],p:a.p+f[2],c:a.c+f[3],fat:a.fat+f[4],s:a.s+f[5]}), {cal:0,p:0,c:0,fat:0,s:0}); }
function dayTotal(day) { return MEALS.reduce((total, meal) => { const m = sumFoods(day[meal]); Object.keys(total).forEach(k => total[k] += m[k]); return total; }, {cal:0,p:0,c:0,fat:0,s:0}); }
function tidy(n) { return Number.isInteger(n) ? n : Math.round(n * 10) / 10; }
function macroText(t) { return `${tidy(t.cal)}cal · ${tidy(t.p)}p · ${tidy(t.c)}c · ${tidy(t.fat)}f · ${tidy(t.s)}s`; }
function formatDate(d, opts) { return new Intl.DateTimeFormat("en-US", opts).format(d); }

function render() {
  const data = loadWeek(), sunday = getSunday(), grid = document.querySelector("#weekGrid");
  const saturday = new Date(sunday); saturday.setDate(sunday.getDate()+6);
  document.querySelector("#weekLabel").textContent = `${formatDate(sunday,{month:"short",day:"numeric"})} – ${formatDate(saturday,{month:"short",day:"numeric",year:"numeric"})}`;
  grid.innerHTML = "";
  let week = {cal:0,p:0,c:0,fat:0,s:0};
  Object.entries(data).forEach(([day, meals], index) => {
    const date = new Date(sunday); date.setDate(sunday.getDate()+index);
    const total = dayTotal(meals); Object.keys(week).forEach(k => week[k] += total[k]);
    const isToday = date.toDateString() === new Date().toDateString();
    const card = document.createElement("article"); card.className = `day-card${isToday ? " today" : ""}`;
    card.innerHTML = `<header class="day-header"><div class="day-title"><h3>${day}</h3><div class="day-header-actions"><span>${formatDate(date,{month:"short",day:"numeric"})}</span><button class="clear-day" data-clear-day="${day}" aria-label="Clear ${day}" title="Clear ${day}">⌫</button></div></div><div class="day-total">${tidy(total.cal).toLocaleString()} cal<small>${tidy(total.p)}p · ${tidy(total.c)}c · ${tidy(total.fat)}f · ${tidy(total.s)}s</small></div><div class="progress"><span style="width:${Math.min(total.cal/GOALS.calories*100,100)}%"></span></div></header>`;
    MEALS.forEach(meal => {
      const foods = meals[meal] || [], mt = sumFoods(foods), section = document.createElement("section"); section.className = "meal";
      section.innerHTML = `<div class="meal-heading"><strong>${meal}</strong><button data-day="${day}" data-meal="${meal}" aria-label="Add to ${meal}">+</button></div>${foods.length ? foods.map((f,index) => `<div class="food"><div class="food-name">${escapeHtml(f[0])}</div><div class="food-macros">${macroText({cal:f[1],p:f[2],c:f[3],fat:f[4],s:f[5]})}</div><div class="food-actions"><button class="edit-food" data-action="edit" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Edit ${escapeHtml(f[0])}">✎</button><button class="delete-food" data-action="delete" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Delete ${escapeHtml(f[0])}">×</button></div></div>`).join("") + `<div class="meal-total">Total: ${macroText(mt)}</div>` : `<div class="empty-meal">Nothing logged</div>`}`;
      card.append(section);
    });
    grid.append(card);
  });
  const target = GOALS.calories*7, pct = Math.round(week.cal/target*100);
  document.querySelector("#weeklyPercent").textContent = `${pct}%`; document.querySelector("#goalRing").style.background = `conic-gradient(var(--green) ${Math.min(pct,100)}%, #e8ede8 0)`;
  document.querySelector("#weeklyCalories").textContent = `${Math.round(week.cal).toLocaleString()} / ${target.toLocaleString()}`;
  document.querySelector("#weeklySubtext").textContent = `${Math.max(target-week.cal,0).toLocaleString(undefined,{maximumFractionDigits:0})} calories remaining`;
  document.querySelector("#avgProtein").textContent = `${tidy(week.p/7)}g`; document.querySelector("#avgCarbs").textContent = `${tidy(week.c/7)}g`; document.querySelector("#avgFats").textContent = `${tidy(week.fat/7)}g`;
}

function renderLibrary() {
  const term = document.querySelector("#recipeSearch").value.trim().toLowerCase();
  const matches = RECIPES.filter(r => {
    const searchHit = !term || `${r.name} ${r.ingredients.join(" ")}`.toLowerCase().includes(term);
    const filterHit = activeRecipeFilter === "all" || r.type === activeRecipeFilter || (activeRecipeFilter === "high-protein" && r.p >= 40);
    return searchHit && filterHit;
  });
  document.querySelector("#recipeCount").textContent = RECIPES.length;
  document.querySelector("#recipeGrid").innerHTML = matches.length ? matches.map(r => `<article class="recipe-card"><div class="recipe-top"><div><span class="recipe-type">${r.type}</span><h3>${r.name}</h3></div><span class="protein-badge">${tidy(r.p)}p</span></div><div class="recipe-macros"><div><strong>${tidy(r.cal)}</strong><small>cal</small></div><div><strong>${tidy(r.c)}g</strong><small>carbs</small></div><div><strong>${tidy(r.fat)}g</strong><small>fat</small></div><div><strong>${tidy(r.s)}g</strong><small>sugar</small></div></div><p class="ingredient-preview">${r.ingredients.slice(0,3).join(" · ")}${r.ingredients.length>3?" · +more":""}</p><div class="recipe-actions"><button class="recipe-details" data-details="${r.id}">View ingredients</button><button class="add-recipe" data-recipe="${r.id}">＋ Add to log</button></div></article>`).join("") : `<div class="empty-library"><h3>No recipes found</h3><p>Try another search or filter.</p></div>`;
}

function recipeTable(recipe) {
  return `<div class="recipe-sheet"><div class="sheet-header"><span>Ingredient</span><span>Quantity per serving</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span></div>${recipe.rows.map(row=>`<div class="sheet-row"><strong>${escapeHtml(row[0])}</strong><span>${escapeHtml(row[1])}</span><span>${tidy(row[2])}</span><span>${tidy(row[3])}</span><span>${tidy(row[4])}</span><span>${tidy(row[5])}</span><span>${tidy(row[6])}</span></div>`).join("")}<div class="sheet-total"><span>Recipe total</span><strong>${macroText(recipe)}</strong></div></div>`;
}

function openRecipeDetails(recipe) {
  document.querySelector("#recipeDialogEyebrow").textContent = "RECIPE BREAKDOWN";
  document.querySelector("#recipeDialogTitle").textContent = recipe.name;
  document.querySelector("#recipeReadView").hidden = false; document.querySelector("#recipeEditView").hidden = true;
  document.querySelector("#recipeReadView").innerHTML = recipeTable(recipe);
  document.querySelector("#recipeDialogActions").innerHTML = `<button value="cancel" class="ghost-button" formnovalidate>Close</button><button type="button" class="primary-button" id="logRecipeFromDetail">Add recipe to log</button>`;
  document.querySelector("#logRecipeFromDetail").addEventListener("click",()=>{ document.querySelector("#recipeDialog").close(); prefillRecipe(recipe); });
  document.querySelector("#recipeDialog").showModal();
}

function ingredientRow(values=["","",0,0,0,0,0]) {
  const row=document.createElement("div"); row.className="ingredient-edit-row";
  row.innerHTML=`<input class="ing-name" required placeholder="Ingredient" value="${escapeHtml(values[0])}"><input class="ing-qty" required placeholder="Qty / serving" value="${escapeHtml(values[1])}">${["cal","p","c","f","s"].map((k,i)=>`<input class="ing-${k}" type="number" min="0" step="0.1" required aria-label="${k}" placeholder="${k}" value="${values[i+2]||""}">`).join("")}<button type="button" class="remove-ingredient" aria-label="Remove ingredient">×</button>`;
  row.querySelectorAll("input").forEach(input=>input.addEventListener("input",updateBuilderTotal));
  row.querySelector(".remove-ingredient").addEventListener("click",()=>{row.remove();updateBuilderTotal();});
  document.querySelector("#ingredientEditor").append(row);
}

function editorRows() {
  return [...document.querySelectorAll(".ingredient-edit-row")].map(row=>[row.querySelector(".ing-name").value.trim(),row.querySelector(".ing-qty").value.trim(),...['cal','p','c','f','s'].map(k=>Number(row.querySelector(`.ing-${k}`).value)||0)]);
}
function calculatedRecipeTotal(rows=editorRows()) { return sumFoods(rows.map(r=>[r[0],r[2],r[3],r[4],r[5],r[6]])); }
function updateBuilderTotal() { document.querySelector("#builderTotal").textContent=macroText(calculatedRecipeTotal()); }

function openRecipeBuilder() {
  document.querySelector("#recipeDialogEyebrow").textContent="RECIPE CALCULATOR"; document.querySelector("#recipeDialogTitle").textContent="Create a recipe";
  document.querySelector("#recipeReadView").hidden=true; document.querySelector("#recipeEditView").hidden=false;
  document.querySelector("#newRecipeName").value=""; document.querySelector("#newRecipeType").value="meal"; document.querySelector("#ingredientEditor").innerHTML=`<div class="ingredient-editor-columns"><span>Ingredient</span><span>Quantity / serving</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span><span></span></div>`;
  ingredientRow(); ingredientRow(); updateBuilderTotal();
  document.querySelector("#recipeDialogActions").innerHTML=`<button value="cancel" class="ghost-button" formnovalidate>Cancel</button><button type="button" class="primary-button" id="saveRecipe">Save recipe</button>`;
  document.querySelector("#saveRecipe").addEventListener("click",saveCustomRecipe);
  document.querySelector("#recipeDialog").showModal();
}

function saveCustomRecipe() {
  const name=document.querySelector("#newRecipeName").value.trim(), rows=editorRows();
  if(!name || !rows.length || rows.some(r=>!r[0]||!r[1])) { showAppModal({title:"Recipe needs a little more",message:"Give the recipe a name and complete every ingredient and quantity.",confirmText:"Got it"}); return; }
  const total=calculatedRecipeTotal(rows), stored=JSON.parse(localStorage.getItem("daily-fuel-custom-recipes")||"[]");
  const recipe={name,type:document.querySelector("#newRecipeType").value,...total,ingredients:rows.map(r=>r[0]),rows}; stored.push(recipe); localStorage.setItem("daily-fuel-custom-recipes",JSON.stringify(stored));
  RECIPES.push({...recipe,id:`custom-${stored.length-1}`}); document.querySelector("#recipeDialog").close(); renderLibrary();
}

function prefillRecipe(recipe) {
  openFood("Monday", recipe.type === "breakfast" ? "Breakfast" : recipe.type === "side" ? "Dinner" : "Lunch");
  document.querySelector("#foodName").value=recipe.name; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v);
}

function switchPage(page) {
  currentPage = page;
  const library = page === "library";
  document.querySelector("#weeklyPage").hidden = library; document.querySelector("#libraryPage").hidden = !library;
  document.querySelector(".week-controls").hidden = library;
  document.querySelector("#clearWeek").hidden = library;
  document.querySelector("#pageEyebrow").textContent = library ? "RECIPES & SAVED FOODS" : "NUTRITION OVERVIEW";
  document.querySelector("#pageTitle").textContent = library ? "Food library" : "Weekly log";
  document.querySelector("#addFoodTop").innerHTML = library ? "＋ New recipe" : "<span>＋</span> Add food";
  document.querySelectorAll(".nav-item[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (library) renderLibrary();
}
function escapeHtml(value) { const d=document.createElement("div"); d.textContent=value; return d.innerHTML; }
function showAppModal({title,message,confirmText="Okay",cancelText="",tone="info"}) {
  return new Promise(resolve=>{
    const dialog=document.querySelector("#appModal"), confirmButton=document.querySelector("#appModalConfirm"), cancelButton=document.querySelector("#appModalCancel");
    dialog.dataset.tone=tone; document.querySelector("#appModalIcon").textContent=tone==="danger"?"!":"i"; document.querySelector("#appModalTitle").textContent=title; document.querySelector("#appModalMessage").textContent=message;
    confirmButton.textContent=confirmText; confirmButton.classList.toggle("danger",tone==="danger"); cancelButton.textContent=cancelText||"Cancel"; cancelButton.hidden=!cancelText;
    const finish=value=>{ dialog.close(); resolve(value); };
    confirmButton.onclick=()=>finish(true); cancelButton.onclick=()=>finish(false); document.querySelector("#appModalClose").onclick=()=>finish(false); dialog.oncancel=e=>{e.preventDefault();finish(false);};
    dialog.showModal();
  });
}
function openFood(day="Monday", meal="Breakfast", food=null, index=null) {
  const form=document.querySelector("#foodForm"); form.reset(); editingFood=food ? {day,meal,index} : null;
  document.querySelector("#foodDialogTitle").textContent=food ? "Edit food" : "Add food"; document.querySelector("#saveFood").textContent=food ? "Save changes" : "Add to day";
  document.querySelector("#foodDay").value=day; document.querySelector("#foodMeal").value=meal;
  if(food){ document.querySelector("#foodName").value=food[0]; [["Calories",food[1]],["Protein",food[2]],["Carbs",food[3]],["Fat",food[4]],["Sugar",food[5]]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); }
  document.querySelector("#foodDialog").showModal(); setTimeout(()=>document.querySelector("#foodName").focus(),50);
}

const daySelect = document.querySelector("#foodDay"); ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d => daySelect.add(new Option(d,d)));
document.querySelector("#weekGrid").addEventListener("click", async e => {
  const clearDay=e.target.closest("button[data-clear-day]");
  if(clearDay){ const day=clearDay.dataset.clearDay; if(await showAppModal({title:`Clear ${day}?`,message:`Every breakfast, lunch, dinner, snack, and shake entry from ${day} will be removed. This cannot be undone.`,confirmText:"Clear day",cancelText:"Keep entries",tone:"danger"})){ const data=loadWeek(); data[day]=Object.fromEntries(MEALS.map(meal=>[meal,[]])); saveWeek(data); render(); } return; }
  const action=e.target.closest("button[data-action]");
  if(action){ const data=loadWeek(), {day,meal}=action.dataset, index=Number(action.dataset.index); if(action.dataset.action==="delete"){ data[day][meal].splice(index,1); saveWeek(data); render(); } else openFood(day,meal,data[day][meal][index],index); return; }
  const b=e.target.closest("button[data-day]"); if(b) openFood(b.dataset.day,b.dataset.meal);
});
document.querySelector("#addFoodTop").addEventListener("click",()=> currentPage === "library" ? openRecipeBuilder() : openFood());
document.querySelector("#addIngredientRow").addEventListener("click",()=>ingredientRow());
document.querySelectorAll(".nav-item[data-page]").forEach(b => b.addEventListener("click",()=>switchPage(b.dataset.page)));
document.querySelector("#recipeSearch").addEventListener("input",renderLibrary);
document.querySelector("#recipeFilters").addEventListener("click",e=>{ const b=e.target.closest("[data-filter]"); if(!b)return; activeRecipeFilter=b.dataset.filter; document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b)); renderLibrary(); });
document.querySelector("#recipeGrid").addEventListener("click",e=>{
  const add=e.target.closest("[data-recipe]"), details=e.target.closest("[data-details]");
  if(add){ const r=RECIPES.find(x=>String(x.id)===add.dataset.recipe); prefillRecipe(r); }
  if(details){ const r=RECIPES.find(x=>String(x.id)===details.dataset.details); openRecipeDetails(r); }
});
document.querySelector("#foodForm").addEventListener("submit", e => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault(); const data=loadWeek(), day=daySelect.value, meal=document.querySelector("#foodMeal").value;
  const entry=[document.querySelector("#foodName").value, ...["Calories","Protein","Carbs","Fat","Sugar"].map(k=>Number(document.querySelector(`#food${k}`).value))];
  if(editingFood){ data[editingFood.day][editingFood.meal].splice(editingFood.index,1); data[day][meal].push(entry); } else data[day][meal].push(entry);
  saveWeek(data); e.target.reset(); document.querySelector("#foodDialog").close(); render();
});
document.querySelector("#prevWeek").addEventListener("click",()=>{weekOffset--;render();}); document.querySelector("#nextWeek").addEventListener("click",()=>{weekOffset++;render();}); document.querySelector("#todayButton").addEventListener("click",()=>{weekOffset=0;render();});
document.querySelector("#editGoals").addEventListener("click",()=>showAppModal({title:"Goal editing is coming next",message:"Your current daily target is 2,500 calories. Soon you'll be able to adjust every macro target here.",confirmText:"Sounds good"}));
document.querySelector("#clearWeek").addEventListener("click",async()=>{ if(await showAppModal({title:"Clear the entire week?",message:"Every food entry from Sunday through Saturday will be removed. This cannot be undone.",confirmText:"Clear week",cancelText:"Keep entries",tone:"danger"})){ saveWeek(blankWeek()); render(); } });
const themeToggle=document.querySelector("#themeToggle");
function setTheme(dark){ document.body.classList.toggle("dark",dark); themeToggle.textContent=dark?"☀":"☾"; themeToggle.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode"); localStorage.setItem("daily-fuel-theme",dark?"dark":"light"); }
themeToggle.addEventListener("click",()=>setTheme(!document.body.classList.contains("dark")));
setTheme(localStorage.getItem("daily-fuel-theme")==="dark");

const quickRecipe=document.querySelector("#recipeQuickSelect");
RECIPES.forEach(recipe=>quickRecipe.add(new Option(`${recipe.name} — ${tidy(recipe.cal)}cal, ${tidy(recipe.p)}p`,String(recipe.id))));
quickRecipe.addEventListener("change",()=>{ const recipe=RECIPES.find(r=>String(r.id)===quickRecipe.value); if(!recipe)return; document.querySelector("#foodName").value=recipe.name; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); });
render();
