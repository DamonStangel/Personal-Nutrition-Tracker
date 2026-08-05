const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shake"];
const DEFAULT_GOALS = { calories: 2500, protein: 190, carbs: 275, fat: 70, sugar: 38 };
let GOALS = {...DEFAULT_GOALS,...JSON.parse(localStorage.getItem("daily-fuel-goals") || "{}")};
let weekOffset = 0;
let activeRecipeFilter = "all";
let currentPage = "weekly";
let editingFood = null;
let editingRecipeId = null;

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
const recipeOverrides = JSON.parse(localStorage.getItem("daily-fuel-recipe-overrides") || "{}");
RECIPES.forEach(recipe=>{ if(recipeOverrides[String(recipe.id)]) Object.assign(recipe,recipeOverrides[String(recipe.id)]); });

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
function sumFoods(foods) { return foods.reduce((a,f) => { const quantity=f[6]||1; return {cal:a.cal+f[1]*quantity,p:a.p+f[2]*quantity,c:a.c+f[3]*quantity,fat:a.fat+f[4]*quantity,s:a.s+f[5]*quantity}; }, {cal:0,p:0,c:0,fat:0,s:0}); }
function dayTotal(day) { return MEALS.reduce((total, meal) => { const m = sumFoods(day[meal]); Object.keys(total).forEach(k => total[k] += m[k]); return total; }, {cal:0,p:0,c:0,fat:0,s:0}); }
function weekKeyForDate(date) { const d=new Date(date); d.setHours(12,0,0,0); d.setDate(d.getDate()-d.getDay()); return d.toISOString().slice(0,10); }
function dataForDate(date) { const key=weekKeyForDate(date), saved=localStorage.getItem(`daily-fuel-${key}`); if(saved) return JSON.parse(saved); if(key===weekKeyForDate(new Date())){ const data=blankWeek(); Object.entries(sample).forEach(([day,meals])=>Object.assign(data[day],meals)); return data; } return blankWeek(); }
function calculateStreak() {
  let streak=0, cursor=new Date(); cursor.setHours(12,0,0,0);
  for(let i=0;i<366;i++){ const data=dataForDate(cursor), dayName=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][cursor.getDay()]; if(dayTotal(data[dayName]).cal<=0) break; streak++; cursor.setDate(cursor.getDate()-1); }
  return streak;
}
function tidy(n) { return Number.isInteger(n) ? n : Math.round(n * 10) / 10; }
function macroText(t) { return `${tidy(t.cal)}cal · ${tidy(t.p)}p · ${tidy(t.c)}c · ${tidy(t.fat)}f · ${tidy(t.s)}s`; }
function formatDate(d, opts) { return new Intl.DateTimeFormat("en-US", opts).format(d); }

function render() {
  const data = loadWeek(), sunday = getSunday(), grid = document.querySelector("#weekGrid");
  const saturday = new Date(sunday); saturday.setDate(sunday.getDate()+6);
  document.querySelector("#weekLabel").textContent = `${formatDate(sunday,{month:"short",day:"numeric"})} – ${formatDate(saturday,{month:"short",day:"numeric",year:"numeric"})}`;
  grid.innerHTML = "";
  let week = {cal:0,p:0,c:0,fat:0,s:0}, averageTotals={cal:0,p:0,c:0,fat:0,s:0}, averageDays=0;
  Object.entries(data).forEach(([day, meals], index) => {
    const date = new Date(sunday); date.setDate(sunday.getDate()+index);
    const total = dayTotal(meals); Object.keys(week).forEach(k => week[k] += total[k]);
    const populatedMeals=MEALS.filter(meal=>(meals[meal]||[]).length>0).length; if(populatedMeals>1){ averageDays++; Object.keys(averageTotals).forEach(k=>averageTotals[k]+=total[k]); }
    const isToday = date.toDateString() === new Date().toDateString();
    const card = document.createElement("article"); card.className = `day-card${isToday ? " today" : ""}`;
    card.innerHTML = `<header class="day-header"><div class="day-title"><h3>${day}</h3><div class="day-header-actions"><span>${formatDate(date,{month:"short",day:"numeric"})}</span><button class="clear-day" data-clear-day="${day}" aria-label="Clear ${day}" title="Clear ${day}">⌫</button></div></div><div class="day-total">${tidy(total.cal).toLocaleString()} cal<small>${tidy(total.p)}p · ${tidy(total.c)}c · ${tidy(total.fat)}f · ${tidy(total.s)}s</small></div><div class="progress"><span style="width:${Math.min(total.cal/GOALS.calories*100,100)}%"></span></div></header>`;
    MEALS.forEach(meal => {
      const foods = meals[meal] || [], mt = sumFoods(foods), section = document.createElement("section"); section.className = "meal"; section.dataset.meal=meal.toLowerCase();
      section.innerHTML = `<div class="meal-heading"><strong>${meal}</strong><button data-day="${day}" data-meal="${meal}" aria-label="Add to ${meal}">+</button></div>${foods.length ? foods.map((f,index) => { const quantity=f[6]||1; return `<div class="food"><div class="food-name">${escapeHtml(f[0])}${quantity>1?`<span class="food-quantity">×${quantity}</span>`:""}</div><div class="food-macros">${macroText({cal:f[1]*quantity,p:f[2]*quantity,c:f[3]*quantity,fat:f[4]*quantity,s:f[5]*quantity})}</div><div class="food-actions"><button class="edit-food" data-action="edit" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Edit ${escapeHtml(f[0])}">✎</button><button class="delete-food" data-action="delete" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Delete ${escapeHtml(f[0])}">×</button></div></div>`; }).join("") + `<div class="meal-total">Total: ${macroText(mt)}</div>` : `<div class="empty-meal">Nothing logged</div>`}`;
      card.append(section);
    });
    grid.append(card);
  });
  const target = GOALS.calories*7, pct = Math.round(week.cal/target*100);
  document.querySelector("#weeklyPercent").textContent = `${pct}%`; document.querySelector("#goalRing").style.background = `conic-gradient(var(--green) ${Math.min(pct,100)}%, #e8ede8 0)`;
  document.querySelector("#weeklyCalories").textContent = `${Math.round(week.cal).toLocaleString()} / ${target.toLocaleString()}`;
  document.querySelector("#weeklySubtext").textContent = `${Math.max(target-week.cal,0).toLocaleString(undefined,{maximumFractionDigits:0})} calories remaining · averages from ${averageDays} ${averageDays===1?"day":"days"}`;
  document.querySelector("#avgProtein").textContent = `${tidy(averageDays?averageTotals.p/averageDays:0)}g`; document.querySelector("#avgCarbs").textContent = `${tidy(averageDays?averageTotals.c/averageDays:0)}g`; document.querySelector("#avgFats").textContent = `${tidy(averageDays?averageTotals.fat/averageDays:0)}g`;
  document.querySelector("#proteinGoalLabel").textContent=`Goal ${tidy(GOALS.protein)}g`; document.querySelector("#carbsGoalLabel").textContent=`Goal ${tidy(GOALS.carbs)}g`; document.querySelector("#fatGoalLabel").textContent=`Goal ${tidy(GOALS.fat)}g`;
  const streak=calculateStreak(); document.querySelector("#streakCount").textContent=`${streak} day streak`; document.querySelector("#streakMessage").textContent=streak ? "Keep it rolling" : "Log today to begin";
}

function renderLibrary() {
  const term = document.querySelector("#recipeSearch").value.trim().toLowerCase();
  const matches = RECIPES.filter(r => {
    const searchHit = !term || `${r.name} ${r.ingredients.join(" ")}`.toLowerCase().includes(term);
    const filterHit = activeRecipeFilter === "all" || r.type === activeRecipeFilter || (activeRecipeFilter === "high-protein" && r.p >= 40);
    return searchHit && filterHit;
  });
  document.querySelector("#recipeCount").textContent = RECIPES.length;
  document.querySelector("#recipeGrid").innerHTML = matches.length ? matches.map(r => `<article class="recipe-card"><div class="recipe-top"><div><span class="recipe-type">${r.type}</span><h3>${r.name}</h3></div><span class="protein-badge">${tidy(r.p)}p</span></div><div class="recipe-macros"><div><strong>${tidy(r.cal)}</strong><small>cal</small></div><div><strong>${tidy(r.c)}g</strong><small>carbs</small></div><div><strong>${tidy(r.fat)}g</strong><small>fat</small></div><div><strong>${tidy(r.s)}g</strong><small>sugar</small></div></div><p class="ingredient-preview">${r.ingredients.slice(0,3).join(" · ")}${r.ingredients.length>3?" · +more":""}</p><div class="recipe-actions"><button class="recipe-details" data-details="${r.id}">View</button><button class="recipe-edit" data-edit-recipe="${r.id}">Edit</button><button class="add-recipe" data-recipe="${r.id}">＋ Add</button></div></article>`).join("") : `<div class="empty-library"><h3>No recipes found</h3><p>Try another search or filter.</p></div>`;
}

function recipeTable(recipe) {
  return `<div class="recipe-sheet"><div class="sheet-header"><span>Ingredient</span><span>Quantity per serving</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span></div>${recipe.rows.map(row=>`<div class="sheet-row"><strong>${escapeHtml(row[0])}</strong><span>${escapeHtml(row[1])}</span><span>${tidy(row[2])}</span><span>${tidy(row[3])}</span><span>${tidy(row[4])}</span><span>${tidy(row[5])}</span><span>${tidy(row[6])}</span></div>`).join("")}<div class="sheet-total"><span>Recipe total</span><strong>${macroText(recipe)}</strong></div></div>`;
}

function openRecipeDetails(recipe) {
  document.querySelector("#recipeDialogEyebrow").textContent = "RECIPE BREAKDOWN";
  document.querySelector("#recipeDialogTitle").textContent = recipe.name;
  document.querySelector("#recipeReadView").hidden = false; document.querySelector("#recipeEditView").hidden = true;
  document.querySelector("#recipeReadView").innerHTML = recipeTable(recipe);
  document.querySelector("#recipeDialogActions").innerHTML = `<button value="cancel" class="ghost-button" formnovalidate>Close</button><button type="button" class="ghost-button" id="editRecipeFromDetail">Edit recipe</button><button type="button" class="primary-button" id="logRecipeFromDetail">Add recipe to log</button>`;
  document.querySelector("#editRecipeFromDetail").addEventListener("click",()=>{ document.querySelector("#recipeDialog").close(); openRecipeBuilder(recipe); });
  document.querySelector("#logRecipeFromDetail").addEventListener("click",()=>{ document.querySelector("#recipeDialog").close(); prefillRecipe(recipe); });
  document.querySelector("#recipeDialog").showModal();
}

function ingredientRow(values=["","",0,0,0,0,0]) {
  const row=document.createElement("div"); row.className="ingredient-edit-row";
  row.innerHTML=`<input class="ing-name" required placeholder="Ingredient" value="${escapeHtml(values[0])}"><input class="ing-qty" required placeholder="Qty / serving" value="${escapeHtml(values[1])}">${["cal","p","c","f","s"].map((k,i)=>`<input class="ing-${k}" type="number" min="0" step="0.1" required aria-label="${k}" placeholder="${k}" value="${values[i+2]??""}">`).join("")}<button type="button" class="remove-ingredient" aria-label="Remove ingredient">×</button>`;
  row.querySelectorAll("input").forEach(input=>input.addEventListener("input",updateBuilderTotal));
  row.querySelector(".remove-ingredient").addEventListener("click",()=>{row.remove();updateBuilderTotal();});
  document.querySelector("#ingredientEditor").append(row);
}

function editorRows() {
  return [...document.querySelectorAll(".ingredient-edit-row")].map(row=>[row.querySelector(".ing-name").value.trim(),row.querySelector(".ing-qty").value.trim(),...['cal','p','c','f','s'].map(k=>tidy(Number(row.querySelector(`.ing-${k}`).value)||0))]);
}
function calculatedRecipeTotal(rows=editorRows()) { return sumFoods(rows.map(r=>[r[0],r[2],r[3],r[4],r[5],r[6]])); }
function updateBuilderTotal() { document.querySelector("#builderTotal").textContent=macroText(calculatedRecipeTotal()); }

function openRecipeBuilder(recipe=null) {
  editingRecipeId=recipe?.id ?? null;
  document.querySelector("#recipeDialogEyebrow").textContent="RECIPE CALCULATOR"; document.querySelector("#recipeDialogTitle").textContent=recipe?`Edit ${recipe.name}`:"Create a recipe";
  document.querySelector("#recipeReadView").hidden=true; document.querySelector("#recipeEditView").hidden=false;
  document.querySelector("#newRecipeName").value=recipe?.name||""; document.querySelector("#newRecipeType").value=recipe?.type||"meal"; document.querySelector("#ingredientEditor").innerHTML=`<div class="ingredient-editor-columns"><span>Ingredient</span><span>Quantity / serving</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span><span></span></div>`;
  if(recipe?.rows?.length) recipe.rows.forEach(row=>ingredientRow(row)); else { ingredientRow(); ingredientRow(); } updateBuilderTotal();
  document.querySelector("#recipeDialogActions").innerHTML=`<button value="cancel" class="ghost-button" formnovalidate>Cancel</button><button type="button" class="primary-button" id="saveRecipe">${recipe?"Save changes":"Save recipe"}</button>`;
  document.querySelector("#saveRecipe").addEventListener("click",saveRecipeChanges);
  document.querySelector("#recipeDialog").showModal();
}

function saveRecipeChanges() {
  const name=document.querySelector("#newRecipeName").value.trim(), rows=editorRows();
  if(!name || !rows.length || rows.some(r=>!r[0]||!r[1])) { showAppModal({title:"Recipe needs a little more",message:"Give the recipe a name and complete every ingredient and quantity.",confirmText:"Got it"}); return; }
  const total=calculatedRecipeTotal(rows), recipeData={name,type:document.querySelector("#newRecipeType").value,...total,ingredients:rows.map(r=>r[0]),rows};
  if(editingRecipeId!==null){ const recipe=RECIPES.find(r=>String(r.id)===String(editingRecipeId)); Object.assign(recipe,recipeData); const overrides=JSON.parse(localStorage.getItem("daily-fuel-recipe-overrides")||"{}"); overrides[String(editingRecipeId)]=recipeData; localStorage.setItem("daily-fuel-recipe-overrides",JSON.stringify(overrides)); }
  else { const stored=JSON.parse(localStorage.getItem("daily-fuel-custom-recipes")||"[]"); stored.push(recipeData); localStorage.setItem("daily-fuel-custom-recipes",JSON.stringify(stored)); RECIPES.push({...recipeData,id:`custom-${stored.length-1}`}); }
  document.querySelector("#recipeDialog").close(); populateQuickRecipes(); renderLibrary(); showAppModal({title:"Recipe saved",message:`${name} and its recalculated macros are now available throughout Daily Fuel.`,confirmText:"Done"});
}

function prefillRecipe(recipe) {
  openFood("Monday", recipe.type === "breakfast" ? "Breakfast" : recipe.type === "side" ? "Dinner" : "Lunch");
  document.querySelector("#foodName").value=recipe.name; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v);
}

function loadWeights() { return JSON.parse(localStorage.getItem("daily-fuel-weights") || "[]").sort((a,b)=>a.date.localeCompare(b.date)); }
function renderGoals() {
  [["Calories",GOALS.calories],["Protein",GOALS.protein],["Carbs",GOALS.carbs],["Fat",GOALS.fat],["Sugar",GOALS.sugar]].forEach(([key,value])=>document.querySelector(`#goal${key}`).value=value);
  const sunday=new Date(); sunday.setDate(sunday.getDate()-sunday.getDay()); document.querySelector("#weightDate").value=sunday.toISOString().slice(0,10);
  const weights=loadWeights(), change=document.querySelector("#weightChange"), chart=document.querySelector("#weightChart"), history=document.querySelector("#weightHistory");
  if(!weights.length){ change.textContent="No data yet"; change.classList.remove("gain"); chart.innerHTML=`<div class="empty-weight">Add your first weekly check-in to start the trend.</div>`; history.innerHTML=""; return; }
  const delta=tidy(weights.at(-1).weight-weights[0].weight); change.textContent=weights.length===1?"Baseline saved":`${delta>0?"+":""}${delta} lb overall`; change.classList.toggle("gain",delta>0);
  const values=weights.map(w=>w.weight), min=Math.min(...values)-2, max=Math.max(...values)+2, span=max-min||1, width=640, height=150, pad=26;
  const points=weights.map((w,i)=>({x:weights.length===1?width/2:pad+i*(width-pad*2)/(weights.length-1),y:pad+(max-w.weight)*(height-pad*2)/span,...w}));
  const path=points.map((p,i)=>`${i?"L":"M"}${p.x},${p.y}`).join(" "), area=`${path} L${points.at(-1).x},${height} L${points[0].x},${height} Z`;
  chart.innerHTML=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Weight trend"><defs><linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa178" stop-opacity=".45"/><stop offset="1" stop-color="#7fa178" stop-opacity="0"/></linearGradient></defs>${points.length>1?`<path class="chart-area" d="${area}"/><path class="chart-line" d="${path}"/>`:""}${points.map(p=>`<circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="5"/><text class="chart-label" text-anchor="middle" x="${p.x}" y="${p.y-11}">${tidy(p.weight)} lb</text><text class="chart-label" text-anchor="middle" x="${p.x}" y="${height-3}">${formatDate(new Date(`${p.date}T12:00:00`),{month:"short",day:"numeric"})}</text>`).join("")}</svg>`;
  history.innerHTML=[...weights].reverse().map(w=>`<div class="weight-row"><span>Week of ${formatDate(new Date(`${w.date}T12:00:00`),{month:"short",day:"numeric",year:"numeric"})}</span><strong>${tidy(w.weight)} lb</strong><button data-remove-weight="${w.date}" aria-label="Remove weight from ${w.date}">×</button></div>`).join("");
}

function switchPage(page) {
  currentPage = page;
  const library = page === "library";
  const goals = page === "goals";
  document.querySelector("#weeklyPage").hidden = page!=="weekly"; document.querySelector("#libraryPage").hidden = !library; document.querySelector("#goalsPage").hidden=!goals;
  document.querySelector(".week-controls").hidden = page!=="weekly";
  document.querySelector("#clearWeek").hidden = page!=="weekly"; document.querySelector("#addFoodTop").hidden=goals;
  document.querySelector("#pageEyebrow").textContent = library ? "RECIPES & SAVED FOODS" : goals ? "TARGETS & PROGRESS" : "NUTRITION OVERVIEW";
  document.querySelector("#pageTitle").textContent = library ? "Food library" : goals ? "Goals" : "Weekly log";
  document.querySelector("#addFoodTop").innerHTML = library ? "＋ New recipe" : "<span>＋</span> Add food";
  document.querySelectorAll(".nav-item[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (library) renderLibrary();
  if (goals) renderGoals();
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
  if(food){ document.querySelector("#foodName").value=food[0]; document.querySelector("#foodQuantity").value=food[6]||1; [["Calories",food[1]],["Protein",food[2]],["Carbs",food[3]],["Fat",food[4]],["Sugar",food[5]]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); }
  updateQuantityHint(); document.querySelector("#foodDialog").showModal(); setTimeout(()=>document.querySelector("#foodName").focus(),50);
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
  const add=e.target.closest("[data-recipe]"), details=e.target.closest("[data-details]"), edit=e.target.closest("[data-edit-recipe]");
  if(add){ const r=RECIPES.find(x=>String(x.id)===add.dataset.recipe); prefillRecipe(r); }
  if(details){ const r=RECIPES.find(x=>String(x.id)===details.dataset.details); openRecipeDetails(r); }
  if(edit){ const r=RECIPES.find(x=>String(x.id)===edit.dataset.editRecipe); openRecipeBuilder(r); }
});
document.querySelector("#foodForm").addEventListener("submit", e => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault(); const data=loadWeek(), day=daySelect.value, meal=document.querySelector("#foodMeal").value;
  const entry=[document.querySelector("#foodName").value, ...["Calories","Protein","Carbs","Fat","Sugar"].map(k=>tidy(Number(document.querySelector(`#food${k}`).value))),Math.max(1,Number(document.querySelector("#foodQuantity").value)||1)];
  if(editingFood){ data[editingFood.day][editingFood.meal].splice(editingFood.index,1); data[day][meal].push(entry); } else data[day][meal].push(entry);
  saveWeek(data); e.target.reset(); document.querySelector("#foodDialog").close(); render();
});
document.querySelector("#prevWeek").addEventListener("click",()=>{weekOffset--;render();}); document.querySelector("#nextWeek").addEventListener("click",()=>{weekOffset++;render();}); document.querySelector("#todayButton").addEventListener("click",()=>{weekOffset=0;render();});
document.querySelector("#editGoals").addEventListener("click",()=>switchPage("goals"));
document.querySelector("#clearWeek").addEventListener("click",async()=>{ if(await showAppModal({title:"Clear the entire week?",message:"Every food entry from Sunday through Saturday will be removed. This cannot be undone.",confirmText:"Clear week",cancelText:"Keep entries",tone:"danger"})){ saveWeek(blankWeek()); render(); } });
document.querySelector("#goalsForm").addEventListener("submit",e=>{ e.preventDefault(); GOALS={calories:tidy(Number(document.querySelector("#goalCalories").value)),protein:tidy(Number(document.querySelector("#goalProtein").value)),carbs:tidy(Number(document.querySelector("#goalCarbs").value)),fat:tidy(Number(document.querySelector("#goalFat").value)),sugar:tidy(Number(document.querySelector("#goalSugar").value))}; localStorage.setItem("daily-fuel-goals",JSON.stringify(GOALS)); render(); showAppModal({title:"Goals updated",message:"Your weekly dashboard now uses these nutrition targets.",confirmText:"Done"}); });
document.querySelector("#weightForm").addEventListener("submit",e=>{ e.preventDefault(); const date=document.querySelector("#weightDate").value, weight=Number(document.querySelector("#weightValue").value), entries=loadWeights().filter(w=>w.date!==date); entries.push({date,weight}); localStorage.setItem("daily-fuel-weights",JSON.stringify(entries)); document.querySelector("#weightValue").value=""; renderGoals(); });
document.querySelector("#weightHistory").addEventListener("click",async e=>{ const button=e.target.closest("[data-remove-weight]"); if(!button)return; if(await showAppModal({title:"Remove this check-in?",message:"This weight entry will be removed from your progress history.",confirmText:"Remove",cancelText:"Keep it",tone:"danger"})){ const entries=loadWeights().filter(w=>w.date!==button.dataset.removeWeight); localStorage.setItem("daily-fuel-weights",JSON.stringify(entries)); renderGoals(); } });
const themeToggle=document.querySelector("#themeToggle");
function setTheme(dark){ document.body.classList.toggle("dark",dark); themeToggle.textContent=dark?"☀":"☾"; themeToggle.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode"); localStorage.setItem("daily-fuel-theme",dark?"dark":"light"); }
themeToggle.addEventListener("click",()=>setTheme(!document.body.classList.contains("dark")));
setTheme(localStorage.getItem("daily-fuel-theme")==="dark");

const quickRecipe=document.querySelector("#recipeQuickSelect");
function populateQuickRecipes(){ quickRecipe.replaceChildren(new Option("Select a saved recipe…","")); RECIPES.forEach(recipe=>quickRecipe.add(new Option(`${recipe.name} — ${tidy(recipe.cal)}cal, ${tidy(recipe.p)}p`,String(recipe.id)))); }
populateQuickRecipes();
quickRecipe.addEventListener("change",()=>{ const recipe=RECIPES.find(r=>String(r.id)===quickRecipe.value); if(!recipe)return; document.querySelector("#foodName").value=recipe.name; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); updateQuantityHint(); });
function updateQuantityHint(){ const quantity=Math.max(1,Number(document.querySelector("#foodQuantity").value)||1), values=["Calories","Protein","Carbs","Fat","Sugar"].map(k=>Number(document.querySelector(`#food${k}`).value)||0); document.querySelector("#quantityHint").textContent=quantity===1?"Macros below are for one serving.":`Entry total: ${macroText({cal:values[0]*quantity,p:values[1]*quantity,c:values[2]*quantity,fat:values[3]*quantity,s:values[4]*quantity})}`; }
document.querySelector("#decreaseQuantity").addEventListener("click",()=>{ const input=document.querySelector("#foodQuantity"); input.value=Math.max(1,Number(input.value)-1); updateQuantityHint(); });
document.querySelector("#increaseQuantity").addEventListener("click",()=>{ const input=document.querySelector("#foodQuantity"); input.value=Math.max(1,Number(input.value)+1); updateQuantityHint(); });
document.querySelector("#foodQuantity").addEventListener("input",updateQuantityHint);
["Calories","Protein","Carbs","Fat","Sugar"].forEach(k=>document.querySelector(`#food${k}`).addEventListener("input",updateQuantityHint));
render();
