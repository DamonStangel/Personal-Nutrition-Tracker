const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shake"];
const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 225, fat: 65, sugar: 40 };
let GOALS = {...DEFAULT_GOALS,...JSON.parse(localStorage.getItem("daily-fuel-goals") || "{}")};
let weekOffset = 0;
let activeRecipeFilter = "all";
let activeRecipeSort = "az";
let currentPage = "weekly";
let editingFood = null;
let editingRecipeId = null;
let activeDayDetail = null;
let deletedRecipeNames = JSON.parse(localStorage.getItem("daily-fuel-deleted-recipes") || "[]");

const RECIPES = [
  ["Example Protein Oatmeal","breakfast",390,31,52,8,10,["Rolled oats","Protein powder","Milk","Berries"]],
  ["Example Chicken Rice Bowl","meal",520,48,58,12,6,["Chicken breast","Rice","Mixed vegetables","Sauce"]],
  ["Example Turkey Wrap","meal",410,36,39,12,5,["Turkey breast","Whole-wheat wrap","Cheese","Lettuce"]],
  ["Example Roasted Potatoes","side",210,4,35,7,2,["Potatoes","Olive oil","Seasoning"]],
  ["Example Yogurt Snack","side",190,20,22,3,12,["Greek yogurt","Berries","Honey"]]
].map(([name,type,cal,p,c,fat,s,ingredients],id)=>({id,name,type,cal,p,c,fat,s,ingredients,rows:RECIPE_DETAILS[name] || []}));

const importedRecipes = JSON.parse(localStorage.getItem("daily-fuel-imported-recipes") || "[]");
importedRecipes.forEach((recipe,index)=>{ if(!RECIPES.some(existing=>existing.name.toLowerCase()===String(recipe.name).toLowerCase())) RECIPES.push({...recipe,id:`imported-${index}`}); });
const savedRecipes = JSON.parse(localStorage.getItem("daily-fuel-custom-recipes") || "[]");
savedRecipes.forEach((recipe,index) => { if(!RECIPES.some(existing=>existing.name.toLowerCase()===String(recipe.name).toLowerCase())) RECIPES.push({...recipe,id:`custom-${index}`}); });
const recipeOverrides = JSON.parse(localStorage.getItem("daily-fuel-recipe-overrides") || "{}");
RECIPES.forEach(recipe=>{ if(recipeOverrides[String(recipe.id)]) Object.assign(recipe,recipeOverrides[String(recipe.id)]); });
RECIPES.splice(0,RECIPES.length,...RECIPES.filter(recipe=>!deletedRecipeNames.includes(recipe.name.toLowerCase())));

const sample = {
  Monday: {
    Breakfast: [["Example Protein Oatmeal",390,31,52,8,10,1,"1 bowl"]],
    Lunch: [["Example Chicken Rice Bowl",520,48,58,12,6,1,"1 bowl"]],
    Dinner: [],
    Snacks: [["Example Yogurt Snack",190,20,22,3,12,1,"1 serving"]],
    Shake: []
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
    card.innerHTML = `<header class="day-header"><div class="day-title"><button class="day-title-button" data-open-day="${day}" aria-label="Open ${day} breakdown">${day}<span>↗</span></button><div class="day-header-actions"><span>${formatDate(date,{month:"short",day:"numeric"})}</span><button class="clear-day" data-clear-day="${day}" aria-label="Clear ${day}" title="Clear ${day}">⌫</button></div></div><div class="day-total">${tidy(total.cal).toLocaleString()} cal<small>${tidy(total.p)}p · ${tidy(total.c)}c · ${tidy(total.fat)}f · ${tidy(total.s)}s</small></div><div class="progress"><span style="width:${Math.min(total.cal/GOALS.calories*100,100)}%"></span></div></header>`;
    MEALS.forEach(meal => {
      const foods = meals[meal] || [], mt = sumFoods(foods), section = document.createElement("section"); section.className = "meal"; section.dataset.meal=meal.toLowerCase();
      section.innerHTML = `<div class="meal-heading"><strong>${meal}</strong><div class="meal-heading-actions">${foods.length?`<button class="save-meal" data-save-meal="${meal}" data-day="${day}" aria-label="Save ${day} ${meal} to Food Library" title="Save meal to Food Library">▣</button>`:""}<button data-day="${day}" data-meal="${meal}" aria-label="Add to ${meal}">+</button></div></div>${foods.length ? foods.map((f,index) => { const quantity=f[6]||1; return `<div class="food"><div class="food-name">${escapeHtml(f[0])}${f[7]?`<small>${escapeHtml(f[7])}</small>`:""}${quantity>1?`<span class="food-quantity">×${quantity}</span>`:""}</div><div class="food-macros">${macroText({cal:f[1]*quantity,p:f[2]*quantity,c:f[3]*quantity,fat:f[4]*quantity,s:f[5]*quantity})}</div><div class="food-actions"><button class="edit-food" data-action="edit" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Edit ${escapeHtml(f[0])}">✎</button><button class="delete-food" data-action="delete" data-day="${day}" data-meal="${meal}" data-index="${index}" aria-label="Delete ${escapeHtml(f[0])}">×</button></div></div>`; }).join("") + `<div class="meal-total">Total: ${macroText(mt)}</div>` : `<div class="empty-meal">Nothing logged</div>`}`;
      card.append(section);
    });
    grid.append(card);
  });
  const target = GOALS.calories*7, pct = Math.round(week.cal/target*100);
  document.querySelector("#weeklyPercent").textContent = `${pct}%`; document.querySelector("#goalRing").style.background = `conic-gradient(var(--green) ${Math.min(pct,100)}%, #e8ede8 0)`;
  document.querySelector("#weeklyCalories").textContent = `${Math.round(week.cal).toLocaleString()} / ${target.toLocaleString()}`;
  document.querySelector("#weeklySubtext").textContent = `${Math.max(target-week.cal,0).toLocaleString(undefined,{maximumFractionDigits:0})} calories remaining · averages from ${averageDays} ${averageDays===1?"day":"days"}`;
  document.querySelector("#avgCalories").textContent = `${tidy(averageDays?averageTotals.cal/averageDays:0).toLocaleString()} cal`; document.querySelector("#avgProtein").textContent = `${tidy(averageDays?averageTotals.p/averageDays:0)}g`; document.querySelector("#avgCarbs").textContent = `${tidy(averageDays?averageTotals.c/averageDays:0)}g`; document.querySelector("#avgFats").textContent = `${tidy(averageDays?averageTotals.fat/averageDays:0)}g`;
  document.querySelector("#calorieGoalLabel").textContent=`Goal ${tidy(GOALS.calories).toLocaleString()} cal`; document.querySelector("#proteinGoalLabel").textContent=`Goal ${tidy(GOALS.protein)}g`; document.querySelector("#carbsGoalLabel").textContent=`Goal ${tidy(GOALS.carbs)}g`; document.querySelector("#fatGoalLabel").textContent=`Goal ${tidy(GOALS.fat)}g`;
  const streak=calculateStreak(); document.querySelector("#streakCount").textContent=`${streak} day streak`; document.querySelector("#streakMessage").textContent=streak ? "Keep it rolling" : "Log today to begin";
}

function renderLibrary() {
  const term = document.querySelector("#recipeSearch").value.trim().toLowerCase();
  const matches = RECIPES.filter(r => {
    const searchHit = !term || `${r.name} ${r.ingredients.join(" ")}`.toLowerCase().includes(term);
    const filterHit = activeRecipeFilter === "all" || r.type === activeRecipeFilter || (activeRecipeFilter === "high-protein" && r.p >= 40);
    return searchHit && filterHit;
  }).sort((a,b)=>activeRecipeSort==="za"?b.name.localeCompare(a.name):activeRecipeSort==="protein-high"?b.p-a.p||a.name.localeCompare(b.name):activeRecipeSort==="protein-low"?a.p-b.p||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
  document.querySelector("#recipeCount").textContent = RECIPES.length;
  document.querySelector("#recipeGrid").innerHTML = matches.length ? matches.map(r => `<article class="recipe-card"><div class="recipe-top"><div><span class="recipe-type">${r.type}</span><h3>${r.name}</h3></div><span class="protein-badge">${tidy(r.p)}p</span></div><div class="recipe-macros"><div><strong>${tidy(r.cal)}</strong><small>cal</small></div><div><strong>${tidy(r.c)}g</strong><small>carbs</small></div><div><strong>${tidy(r.fat)}g</strong><small>fat</small></div><div><strong>${tidy(r.s)}g</strong><small>sugar</small></div></div><p class="ingredient-preview">${r.ingredients.slice(0,3).join(" · ")}${r.ingredients.length>3?" · +more":""}</p><div class="recipe-actions"><button class="recipe-details" data-details="${r.id}">View</button><button class="recipe-edit" data-edit-recipe="${r.id}">Edit</button><button class="add-recipe" data-recipe="${r.id}">＋ Add</button><button class="delete-recipe" data-delete-recipe="${r.id}" aria-label="Delete ${escapeHtml(r.name)}" title="Delete recipe">×</button></div></article>`).join("") : `<div class="empty-library"><h3>No recipes found</h3><p>Try another search or filter.</p></div>`;
}

function clearRecipeDeletion(name){ const normalized=name.toLowerCase(); if(!deletedRecipeNames.includes(normalized))return; deletedRecipeNames=deletedRecipeNames.filter(saved=>saved!==normalized); localStorage.setItem("daily-fuel-deleted-recipes",JSON.stringify(deletedRecipeNames)); }
async function deleteLibraryRecipe(recipe){
  if(!await showAppModal({title:`Delete ${recipe.name}?`,message:"This removes the recipe from your Food Library and Quick Entry. Existing daily-log entries will not be changed.",confirmText:"Delete recipe",cancelText:"Keep recipe",tone:"danger"}))return;
  const normalized=recipe.name.toLowerCase(); if(!deletedRecipeNames.includes(normalized))deletedRecipeNames.push(normalized); localStorage.setItem("daily-fuel-deleted-recipes",JSON.stringify(deletedRecipeNames));
  const index=RECIPES.indexOf(recipe); if(index>=0)RECIPES.splice(index,1); populateQuickRecipes(); renderLibrary();
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
  const isExisting=recipe?.id!==undefined&&recipe?.id!==null; editingRecipeId=isExisting?recipe.id:null;
  document.querySelector("#recipeDialogEyebrow").textContent=recipe&&!isExisting?"SAVE LOGGED MEAL":"RECIPE CALCULATOR"; document.querySelector("#recipeDialogTitle").textContent=isExisting?`Edit ${recipe.name}`:recipe?"Save meal to Food Library":"Create a recipe";
  document.querySelector("#recipeReadView").hidden=true; document.querySelector("#recipeEditView").hidden=false;
  document.querySelector("#newRecipeName").value=recipe?.name||""; document.querySelector("#newRecipeType").value=recipe?.type||"meal"; document.querySelector("#ingredientEditor").innerHTML=`<div class="ingredient-editor-columns"><span>Ingredient</span><span>Quantity / serving</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span><span></span></div>`;
  if(recipe?.rows?.length) recipe.rows.forEach(row=>ingredientRow(row)); else { ingredientRow(); ingredientRow(); } updateBuilderTotal();
  document.querySelector("#recipeDialogActions").innerHTML=`<button value="cancel" class="ghost-button" formnovalidate>Cancel</button><button type="button" class="primary-button" id="saveRecipe">${isExisting?"Save changes":"Save to library"}</button>`;
  document.querySelector("#saveRecipe").addEventListener("click",saveRecipeChanges);
  document.querySelector("#recipeDialog").showModal();
}

function saveRecipeChanges() {
  const name=document.querySelector("#newRecipeName").value.trim(), rows=editorRows();
  if(!name || !rows.length || rows.some(r=>!r[0]||!r[1])) { showAppModal({title:"Recipe needs a little more",message:"Give the recipe a name and complete every ingredient and quantity.",confirmText:"Got it"}); return; }
  const total=calculatedRecipeTotal(rows), recipeData={name,type:document.querySelector("#newRecipeType").value,...total,ingredients:rows.map(r=>r[0]),rows}; clearRecipeDeletion(name);
  if(editingRecipeId!==null){ const recipe=RECIPES.find(r=>String(r.id)===String(editingRecipeId)); Object.assign(recipe,recipeData); const overrides=JSON.parse(localStorage.getItem("daily-fuel-recipe-overrides")||"{}"); overrides[String(editingRecipeId)]=recipeData; localStorage.setItem("daily-fuel-recipe-overrides",JSON.stringify(overrides)); }
  else { const stored=JSON.parse(localStorage.getItem("daily-fuel-custom-recipes")||"[]"); stored.push(recipeData); localStorage.setItem("daily-fuel-custom-recipes",JSON.stringify(stored)); RECIPES.push({...recipeData,id:`custom-${stored.length-1}`}); }
  document.querySelector("#recipeDialog").close(); populateQuickRecipes(); renderLibrary(); showAppModal({title:"Recipe saved",message:`${name} and its recalculated macros are now available throughout Daily Fuel.`,confirmText:"Done"});
}

function prefillRecipe(recipe) {
  openFood("Monday", recipe.type === "breakfast" ? "Breakfast" : recipe.type === "side" ? "Dinner" : "Lunch");
  document.querySelector("#foodName").value=recipe.name; document.querySelector("#foodServing").value="1 serving"; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v);
}

function saveLoggedMeal(day,meal) {
  const foods=loadWeek()[day][meal]||[]; if(!foods.length)return;
  const rows=foods.map(food=>{ const quantity=food[6]||1; return [food[0],food[7]||`${quantity} serving${quantity===1?"":"s"}`,tidy(food[1]*quantity),tidy(food[2]*quantity),tidy(food[3]*quantity),tidy(food[4]*quantity),tidy(food[5]*quantity)]; });
  const name=foods.length<=2?foods.map(food=>food[0]).join(" + "):`${foods[0][0]} meal`;
  openRecipeBuilder({name,type:meal==="Breakfast"?"breakfast":"meal",rows,ingredients:rows.map(row=>row[0])});
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

function renderInsights() {
  const data=loadWeek(), days=Object.entries(data).map(([name,meals])=>({name,meals,total:dayTotal(meals),mealCount:MEALS.filter(meal=>(meals[meal]||[]).length).length}));
  const logged=days.filter(d=>d.total.cal>0), complete=days.filter(d=>d.mealCount>1), caloriesHit=logged.filter(d=>Math.abs(d.total.cal-GOALS.calories)<=GOALS.calories*.1).length, proteinHit=logged.filter(d=>d.total.p>=GOALS.protein).length;
  const averageCalories=logged.length?logged.reduce((sum,d)=>sum+d.total.cal,0)/logged.length:0, averageProtein=complete.length?complete.reduce((sum,d)=>sum+d.total.p,0)/complete.length:0;
  const sunday=getSunday(), saturday=new Date(sunday); saturday.setDate(sunday.getDate()+6); document.querySelector("#insightWeekLabel").textContent=`${formatDate(sunday,{month:"long",day:"numeric"})}–${formatDate(saturday,{month:"long",day:"numeric",year:"numeric"})} · based on your saved entries`;
  document.querySelector("#insightStats").innerHTML=`<div class="insight-stat"><small>DAYS LOGGED</small><strong>${logged.length}/7</strong><p>${complete.length} qualify for macro averages</p></div><div class="insight-stat"><small>AVG CALORIES</small><strong>${tidy(averageCalories).toLocaleString()}</strong><p>Goal ${tidy(GOALS.calories).toLocaleString()} per day</p></div><div class="insight-stat"><small>AVG PROTEIN</small><strong>${tidy(averageProtein)}g</strong><p>Across complete days</p></div><div class="insight-stat"><small>GOAL DAYS</small><strong>${caloriesHit}</strong><p>Within 10% of calorie target</p></div>`;
  document.querySelector("#dailyInsightChart").innerHTML=days.map(d=>`<div class="insight-day"><strong>${d.name.slice(0,3)}</strong><div class="dual-bars"><div class="insight-bar"><i style="width:${Math.min(d.total.cal/GOALS.calories*100,100)}%"></i></div><div class="insight-bar protein"><i style="width:${Math.min(d.total.p/GOALS.protein*100,100)}%"></i></div></div><span>${tidy(d.total.cal)} cal</span></div>`).join("")+`<div class="insight-legend"><span><i></i>Calories vs goal</span><span><i></i>Protein vs goal</span></div>`;
  const notes=[];
  if(!logged.length) notes.push(["1","Start with consistency","Log at least two meal sections in a day to include it in macro averages."]);
  else {
    const calorieDiff=tidy(averageCalories-GOALS.calories); notes.push(["1","Calorie pace",`${Math.abs(calorieDiff).toLocaleString()} calories ${calorieDiff>0?"above":"below"} your daily target on average.`]);
    notes.push(["2","Protein consistency",`${proteinHit} of ${logged.length} logged days reached your ${tidy(GOALS.protein)}g protein goal.`]);
    notes.push(["3","Logging quality",`${complete.length} day${complete.length===1?"":"s"} had more than one meal section and counted toward macro averages.`]);
    const highest=[...logged].sort((a,b)=>b.total.cal-a.total.cal)[0]; notes.push(["4","Highest intake day",`${highest.name} was highest at ${tidy(highest.total.cal).toLocaleString()} calories.`]);
  }
  document.querySelector("#insightNotes").innerHTML=notes.map(([n,title,text])=>`<div class="insight-note"><span>${n}</span><div><strong>${title}</strong><p>${text}</p></div></div>`).join("");
}

function openDayDetail(day) {
  activeDayDetail=day;
  const data=loadWeek(), meals=data[day], days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], index=days.indexOf(day), date=getSunday(); date.setDate(date.getDate()+index); const total=dayTotal(meals);
  document.querySelector("#dayDetailTitle").textContent=day; document.querySelector("#dayDetailDate").textContent=formatDate(date,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
  const caloriePercent=Math.round(total.cal/GOALS.calories*100), proteinPercent=Math.round(total.p/GOALS.protein*100);
  document.querySelector("#dayDetailSummary").innerHTML=`<div><small>DAY TOTAL</small><strong>${macroText(total)}</strong></div><div class="day-goal-meter"><span><b>Calories</b>${tidy(total.cal)} / ${tidy(GOALS.calories)}</span><div><i style="width:${Math.min(caloriePercent,100)}%"></i></div></div><div class="day-goal-meter protein"><span><b>Protein</b>${tidy(total.p)}g / ${tidy(GOALS.protein)}g</span><div><i style="width:${Math.min(proteinPercent,100)}%"></i></div></div>`;
  const order=["Breakfast","Snacks","Lunch","Shake","Dinner"];
  document.querySelector("#dayDetailMeals").innerHTML=order.map(meal=>{ const foods=meals[meal]||[], total=sumFoods(foods); return `<section class="day-detail-meal" data-meal="${meal.toLowerCase()}"><div class="day-detail-meal-head"><strong>${meal}</strong><div><span>${foods.length} item${foods.length===1?"":"s"}</span><button data-day-modal-add="${meal}" aria-label="Add to ${day} ${meal}">＋</button></div></div><div class="day-detail-foods">${foods.length?foods.map((food,itemIndex)=>{const quantity=food[6]||1; return `<div class="day-detail-food"><strong>${escapeHtml(food[0])}${food[7]?` <small>${escapeHtml(food[7])}</small>`:""}${quantity>1?` <em>×${quantity}</em>`:""}</strong><span>${macroText({cal:food[1]*quantity,p:food[2]*quantity,c:food[3]*quantity,fat:food[4]*quantity,s:food[5]*quantity})}</span><div class="day-detail-food-actions"><button data-day-modal-edit="${itemIndex}" data-meal="${meal}" aria-label="Edit ${escapeHtml(food[0])}">✎ Edit</button><button data-day-modal-delete="${itemIndex}" data-meal="${meal}" aria-label="Delete ${escapeHtml(food[0])}">×</button></div></div>`;}).join(""):`<p>Nothing logged</p>`}</div><div class="day-detail-meal-total"><span>Meal total</span><strong>${macroText(total)}</strong></div></section>`;}).join("");
  const dialog=document.querySelector("#dayDetailDialog"); if(!dialog.open)dialog.showModal();
}

function switchPage(page) {
  if(!["weekly","library","insights","goals"].includes(page)) page="weekly";
  currentPage = page;
  localStorage.setItem("daily-fuel-current-page",page); if(location.hash!==`#${page}`) history.replaceState(null,"",`#${page}`);
  const library = page === "library";
  const goals = page === "goals";
  const insights = page === "insights";
  document.querySelector("#weeklyPage").hidden = page!=="weekly"; document.querySelector("#libraryPage").hidden = !library; document.querySelector("#goalsPage").hidden=!goals; document.querySelector("#insightsPage").hidden=!insights;
  document.querySelector(".week-controls").hidden = page!=="weekly";
  document.querySelector("#clearWeek").hidden = page!=="weekly"; document.querySelector("#addFoodTop").hidden=goals||insights;
  document.querySelector("#pageEyebrow").textContent = library ? "RECIPES & SAVED FOODS" : goals ? "TARGETS & PROGRESS" : insights ? "PATTERNS & CONSISTENCY" : "NUTRITION OVERVIEW";
  document.querySelector("#pageTitle").textContent = library ? "Food library" : goals ? "Goals" : insights ? "Insights" : "Weekly log";
  document.querySelector("#addFoodTop").innerHTML = library ? "＋ New recipe" : "<span>＋</span> Add food";
  document.querySelectorAll(".nav-item[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if (library) renderLibrary();
  if (goals) renderGoals();
  if (insights) renderInsights();
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
function backupStorageSnapshot(){ const storage={}; for(let index=0;index<localStorage.length;index++){ const key=localStorage.key(index); if(key?.startsWith("daily-fuel-")) storage[key]=localStorage.getItem(key); } return storage; }
function updateBackupStatus(){ const saved=localStorage.getItem("daily-fuel-last-backup"); document.querySelector("#lastBackupDate").textContent=saved?formatDate(new Date(saved),{month:"long",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"}):"Never"; }
function openBackupDialog(){ updateBackupStatus(); document.querySelector("#backupDialog").showModal(); }
function downloadBackup(){
  const exportedAt=new Date().toISOString(); localStorage.setItem("daily-fuel-last-backup",exportedAt);
  const backup={format:"daily-fuel-backup",version:1,exportedAt,libraryRecipes:RECIPES.map(({id,...recipe})=>recipe),storage:backupStorageSnapshot()};
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"}), link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download=`daily-fuel-private-backup-${exportedAt.slice(0,10)}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(link.href),1000); updateBackupStatus();
}
async function restoreBackup(file){
  let backup; try{ backup=JSON.parse(await file.text()); }catch{ showAppModal({title:"That file could not be read",message:"Choose a valid Daily Fuel JSON backup file.",confirmText:"Got it"}); return; }
  if(backup?.format!=="daily-fuel-backup"||!backup.storage||typeof backup.storage!=="object"||!Array.isArray(backup.libraryRecipes)){ showAppModal({title:"This is not a Daily Fuel backup",message:"The selected JSON file does not contain the expected backup information.",confirmText:"Got it"}); return; }
  document.querySelector("#backupDialog").close();
  const approved=await showAppModal({title:"Replace this browser's saved data?",message:`This backup contains ${backup.libraryRecipes.length} library recipes and was created ${formatDate(new Date(backup.exportedAt),{month:"short",day:"numeric",year:"numeric"})}. Current Daily Fuel data in this browser will be replaced.`,confirmText:"Restore backup",cancelText:"Cancel",tone:"danger"});
  if(!approved)return;
  Object.keys(localStorage).filter(key=>key.startsWith("daily-fuel-")).forEach(key=>localStorage.removeItem(key));
  const rebuiltLibraryKeys=new Set(["daily-fuel-custom-recipes","daily-fuel-recipe-overrides","daily-fuel-imported-recipes"]);
  Object.entries(backup.storage).forEach(([key,value])=>{ if(key.startsWith("daily-fuel-")&&!rebuiltLibraryKeys.has(key)&&typeof value==="string")localStorage.setItem(key,value); });
  localStorage.setItem("daily-fuel-imported-recipes",JSON.stringify(backup.libraryRecipes)); localStorage.setItem("daily-fuel-last-backup",new Date().toISOString()); location.reload();
}
function mealItemRow(values=["","",0,0,0,0,0]) {
  const row=document.createElement("div"); row.className="meal-item-row";
  row.innerHTML=`<input class="meal-ing-name" required placeholder="Food item" aria-label="Food item" value="${escapeHtml(values[0])}"><input class="meal-ing-qty" placeholder="Amount used" aria-label="Amount used" value="${escapeHtml(values[1])}">${["cal","p","c","f","s"].map((key,index)=>`<input class="meal-ing-${key}" type="number" min="0" step="0.1" required aria-label="${key}" placeholder="${key}" value="${values[index+2]??""}">`).join("")}<button type="button" class="remove-meal-item" aria-label="Remove item">×</button>`;
  row.querySelectorAll("input").forEach(input=>input.addEventListener("input",updateQuickMealTotal));
  row.querySelector(".remove-meal-item").addEventListener("click",()=>{ row.remove(); updateQuickMealTotal(); });
  document.querySelector("#mealItemEditor").append(row);
}
function quickMealRows(){ return [...document.querySelectorAll(".meal-item-row")].map(row=>[row.querySelector(".meal-ing-name").value.trim(),row.querySelector(".meal-ing-qty").value.trim(),...["cal","p","c","f","s"].map(key=>tidy(Number(row.querySelector(`.meal-ing-${key}`).value)||0))]); }
function updateQuickMealTotal(){ const rows=quickMealRows(); document.querySelector("#quickMealTotal").textContent=macroText(calculatedRecipeTotal(rows)); }
function setEntryMode(mode="single") {
  const fullMeal=mode==="meal";
  document.querySelector("#singleFoodEntry").hidden=fullMeal; document.querySelector("#fullMealEntry").hidden=!fullMeal;
  document.querySelectorAll("[data-entry-mode]").forEach(button=>{ const active=button.dataset.entryMode===mode; button.classList.toggle("active",active); button.setAttribute("aria-pressed",String(active)); });
  document.querySelectorAll("#singleFoodEntry input,#singleFoodEntry select").forEach(input=>input.disabled=fullMeal);
  document.querySelectorAll("#fullMealEntry input").forEach(input=>input.disabled=!fullMeal);
  document.querySelector("#saveFood").textContent=fullMeal?"Add meal to day":editingFood?"Save changes":"Add to day";
  document.querySelector("#foodDialogTitle").textContent=fullMeal?"Add full meal":editingFood?"Edit food":"Add food";
  document.querySelector("#saveFoodToLibrary").hidden=fullMeal||!editingFood;
  document.querySelector("#foodDialog").classList.toggle("meal-entry-dialog",fullMeal);
}
function openFood(day="Monday", meal="Breakfast", food=null, index=null) {
  const form=document.querySelector("#foodForm"); form.reset(); editingFood=food ? {day,meal,index} : null;
  document.querySelector("#quickRecipeSearch").value=""; populateQuickRecipes();
  document.querySelector("#foodDialogTitle").textContent=food ? "Edit food" : "Add food"; document.querySelector("#saveFood").textContent=food ? "Save changes" : "Add to day";
  document.querySelector("#saveFoodToLibrary").hidden=!food;
  document.querySelector("#foodDay").value=day; document.querySelector("#foodMeal").value=meal;
  if(food){ document.querySelector("#foodName").value=food[0]; document.querySelector("#foodServing").value=food[7]||""; document.querySelector("#foodQuantity").value=food[6]||1; [["Calories",food[1]],["Protein",food[2]],["Carbs",food[3]],["Fat",food[4]],["Sugar",food[5]]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); }
  document.querySelector("#mealItemEditor").innerHTML=`<div class="meal-item-columns"><span>Food item</span><span>Amount used</span><span>Calories</span><span>Protein</span><span>Carbs</span><span>Fats</span><span>Sugars</span><span></span></div>`; mealItemRow(); mealItemRow(); updateQuickMealTotal(); setEntryMode("single");
  document.querySelector('[data-entry-mode="meal"]').disabled=Boolean(food);
  updateQuantityHint(); document.querySelector("#foodDialog").showModal(); setTimeout(()=>document.querySelector(food?"#foodName":"#quickRecipeSearch").focus(),50);
}

function saveEditedFoodToLibrary() {
  const name=document.querySelector("#foodName").value.trim(); if(!name){ showAppModal({title:"Give this food a name",message:"A name is required before the item can be saved to your Food Library.",confirmText:"Got it"}); return; }
  const values=["Calories","Protein","Carbs","Fat","Sugar"].map(key=>tidy(Number(document.querySelector(`#food${key}`).value)||0)), meal=document.querySelector("#foodMeal").value;
  const serving=document.querySelector("#foodServing").value.trim()||"1 serving", rows=[[name,serving,...values]], recipeData={name,type:meal==="Breakfast"?"breakfast":"meal",cal:values[0],p:values[1],c:values[2],fat:values[3],s:values[4],ingredients:[name],rows};
  const stored=JSON.parse(localStorage.getItem("daily-fuel-custom-recipes")||"[]"); stored.push(recipeData); localStorage.setItem("daily-fuel-custom-recipes",JSON.stringify(stored)); clearRecipeDeletion(name); RECIPES.push({...recipeData,id:`custom-${stored.length-1}`}); populateQuickRecipes();
  showAppModal({title:"Item saved to your library",message:`${name} is now available in the Food Library and the Quick Entry recipe picker.`,confirmText:"Done"});
}

const daySelect = document.querySelector("#foodDay"); ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d => daySelect.add(new Option(d,d)));
document.querySelector("#weekGrid").addEventListener("click", async e => {
  const saveMeal=e.target.closest("button[data-save-meal]"); if(saveMeal){ saveLoggedMeal(saveMeal.dataset.day,saveMeal.dataset.saveMeal); return; }
  const openDay=e.target.closest("button[data-open-day]"); if(openDay){ openDayDetail(openDay.dataset.openDay); return; }
  const clearDay=e.target.closest("button[data-clear-day]");
  if(clearDay){ const day=clearDay.dataset.clearDay; if(await showAppModal({title:`Clear ${day}?`,message:`Every breakfast, lunch, dinner, snack, and shake entry from ${day} will be removed. This cannot be undone.`,confirmText:"Clear day",cancelText:"Keep entries",tone:"danger"})){ const data=loadWeek(); data[day]=Object.fromEntries(MEALS.map(meal=>[meal,[]])); saveWeek(data); render(); } return; }
  const action=e.target.closest("button[data-action]");
  if(action){ const data=loadWeek(), {day,meal}=action.dataset, index=Number(action.dataset.index); if(action.dataset.action==="delete"){ data[day][meal].splice(index,1); saveWeek(data); render(); } else openFood(day,meal,data[day][meal][index],index); return; }
  const b=e.target.closest("button[data-day]"); if(b) openFood(b.dataset.day,b.dataset.meal);
});
document.querySelector("#closeDayDetail").addEventListener("click",()=>{ document.querySelector("#dayDetailDialog").close(); activeDayDetail=null; });
document.querySelector("#dayDetailDialog").addEventListener("cancel",()=>{ activeDayDetail=null; });
document.querySelector("#dayDetailMeals").addEventListener("click",async e=>{
  const add=e.target.closest("[data-day-modal-add]"); if(add){ openFood(activeDayDetail,add.dataset.dayModalAdd); return; }
  const edit=e.target.closest("[data-day-modal-edit]"); if(edit){ const data=loadWeek(), meal=edit.dataset.meal, index=Number(edit.dataset.dayModalEdit); openFood(activeDayDetail,meal,data[activeDayDetail][meal][index],index); return; }
  const remove=e.target.closest("[data-day-modal-delete]"); if(remove){ const meal=remove.dataset.meal,index=Number(remove.dataset.dayModalDelete),data=loadWeek(),food=data[activeDayDetail][meal][index]; if(await showAppModal({title:`Remove ${food[0]}?`,message:`This item will be removed from ${activeDayDetail} ${meal}.`,confirmText:"Remove item",cancelText:"Keep it",tone:"danger"})){ data[activeDayDetail][meal].splice(index,1); saveWeek(data); render(); openDayDetail(activeDayDetail); } }
});
document.querySelector("#addFoodTop").addEventListener("click",()=> currentPage === "library" ? openRecipeBuilder() : openFood());
document.querySelector("#settingsButton").addEventListener("click",openBackupDialog);
document.querySelector("#closeBackupDialog").addEventListener("click",()=>document.querySelector("#backupDialog").close());
document.querySelector("#downloadBackup").addEventListener("click",downloadBackup);
document.querySelector("#chooseBackupFile").addEventListener("click",()=>document.querySelector("#backupFileInput").click());
document.querySelector("#backupFileInput").addEventListener("change",event=>{ const file=event.target.files[0]; event.target.value=""; if(file)restoreBackup(file); });
document.querySelector("#saveFoodToLibrary").addEventListener("click",saveEditedFoodToLibrary);
document.querySelector("#addIngredientRow").addEventListener("click",()=>ingredientRow());
document.querySelector("#addMealItemRow").addEventListener("click",()=>mealItemRow());
document.querySelector(".entry-mode-toggle").addEventListener("click",event=>{ const button=event.target.closest("[data-entry-mode]"); if(button&&!button.disabled)setEntryMode(button.dataset.entryMode); });
document.querySelectorAll(".nav-item[data-page]").forEach(b => b.addEventListener("click",()=>switchPage(b.dataset.page)));
document.querySelector("#recipeSearch").addEventListener("input",renderLibrary);
document.querySelector("#recipeSort").addEventListener("change",event=>{ activeRecipeSort=event.target.value; renderLibrary(); });
document.querySelector("#recipeFilters").addEventListener("click",e=>{ const b=e.target.closest("[data-filter]"); if(!b)return; activeRecipeFilter=b.dataset.filter; document.querySelectorAll(".filter-chip").forEach(x=>x.classList.toggle("active",x===b)); renderLibrary(); });
document.querySelector("#recipeGrid").addEventListener("click",async e=>{
  const add=e.target.closest("[data-recipe]"), details=e.target.closest("[data-details]"), edit=e.target.closest("[data-edit-recipe]"), remove=e.target.closest("[data-delete-recipe]");
  if(remove){ const recipe=RECIPES.find(x=>String(x.id)===remove.dataset.deleteRecipe); if(recipe)await deleteLibraryRecipe(recipe); return; }
  if(add){ const r=RECIPES.find(x=>String(x.id)===add.dataset.recipe); prefillRecipe(r); }
  if(details){ const r=RECIPES.find(x=>String(x.id)===details.dataset.details); openRecipeDetails(r); }
  if(edit){ const r=RECIPES.find(x=>String(x.id)===edit.dataset.editRecipe); openRecipeBuilder(r); }
});
document.querySelector("#foodForm").addEventListener("submit", e => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault(); const data=loadWeek(), day=daySelect.value, meal=document.querySelector("#foodMeal").value;
  if(!document.querySelector("#fullMealEntry").hidden){ const rows=quickMealRows(); if(!rows.length||rows.some(row=>!row[0])){ showAppModal({title:"Add at least one complete item",message:"Each meal item needs a name and its macros before the meal can be logged.",confirmText:"Got it"}); return; } rows.forEach(row=>data[day][meal].push([row[0],row[2],row[3],row[4],row[5],row[6],1,row[1]])); saveWeek(data); e.target.reset(); document.querySelector("#foodDialog").close(); render(); if(activeDayDetail)openDayDetail(activeDayDetail); return; }
  const entry=[document.querySelector("#foodName").value, ...["Calories","Protein","Carbs","Fat","Sugar"].map(k=>tidy(Number(document.querySelector(`#food${k}`).value))),Math.max(1,Number(document.querySelector("#foodQuantity").value)||1),document.querySelector("#foodServing").value.trim()];
  if(editingFood){ data[editingFood.day][editingFood.meal].splice(editingFood.index,1); data[day][meal].push(entry); } else data[day][meal].push(entry);
  saveWeek(data); e.target.reset(); document.querySelector("#foodDialog").close(); render(); if(activeDayDetail)openDayDetail(activeDayDetail);
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
const quickRecipeSearch=document.querySelector("#quickRecipeSearch");
function populateQuickRecipes(){
  const selected=quickRecipe.value, term=quickRecipeSearch.value.trim().toLowerCase();
  const matches=RECIPES.filter(recipe=>!term||recipe.name.toLowerCase().includes(term)||(recipe.ingredients||[]).some(ingredient=>String(ingredient).toLowerCase().includes(term)));
  quickRecipe.replaceChildren(new Option(matches.length?"Select a saved recipe…":"No matching foods or recipes",""));
  matches.forEach(recipe=>quickRecipe.add(new Option(`${recipe.name} — ${tidy(recipe.cal)}cal, ${tidy(recipe.p)}p`,String(recipe.id))));
  quickRecipe.disabled=!matches.length;
  if(matches.some(recipe=>String(recipe.id)===selected)) quickRecipe.value=selected;
  document.querySelector("#quickRecipeStatus").textContent=term?(matches.length?`${matches.length} match${matches.length===1?"":"es"} found. Select one to fill in its macros.`:"No matches found. Try a recipe name or ingredient."):"Optional — search or select a recipe to fill in all macro fields below.";
}
populateQuickRecipes();
quickRecipeSearch.addEventListener("input",populateQuickRecipes);
quickRecipeSearch.addEventListener("keydown",event=>{ if(event.key==="Enter"){ event.preventDefault(); const first=quickRecipe.options[1]; if(first){ quickRecipe.value=first.value; quickRecipe.dispatchEvent(new Event("change")); } } });
quickRecipe.addEventListener("change",()=>{ const recipe=RECIPES.find(r=>String(r.id)===quickRecipe.value); if(!recipe)return; document.querySelector("#foodName").value=recipe.name; document.querySelector("#foodServing").value="1 serving"; [["Calories",recipe.cal],["Protein",recipe.p],["Carbs",recipe.c],["Fat",recipe.fat],["Sugar",recipe.s]].forEach(([k,v])=>document.querySelector(`#food${k}`).value=v); updateQuantityHint(); });
function updateQuantityHint(){ const quantity=Math.max(1,Number(document.querySelector("#foodQuantity").value)||1), values=["Calories","Protein","Carbs","Fat","Sugar"].map(k=>Number(document.querySelector(`#food${k}`).value)||0); document.querySelector("#quantityHint").textContent=quantity===1?"Macros below are for one serving.":`Entry total: ${macroText({cal:values[0]*quantity,p:values[1]*quantity,c:values[2]*quantity,fat:values[3]*quantity,s:values[4]*quantity})}`; }
document.querySelector("#decreaseQuantity").addEventListener("click",()=>{ const input=document.querySelector("#foodQuantity"); input.value=Math.max(1,Number(input.value)-1); updateQuantityHint(); });
document.querySelector("#increaseQuantity").addEventListener("click",()=>{ const input=document.querySelector("#foodQuantity"); input.value=Math.max(1,Number(input.value)+1); updateQuantityHint(); });
document.querySelector("#foodQuantity").addEventListener("input",updateQuantityHint);
["Calories","Protein","Carbs","Fat","Sugar"].forEach(k=>document.querySelector(`#food${k}`).addEventListener("input",updateQuantityHint));
render();
const requestedPage=location.hash.slice(1)||localStorage.getItem("daily-fuel-current-page")||"weekly";
switchPage(requestedPage);
