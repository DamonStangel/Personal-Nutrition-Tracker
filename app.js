const MEALS = ["Breakfast", "Lunch", "Dinner", "Snacks", "Shake"];
const GOALS = { calories: 2500, protein: 190, carbs: 275, fat: 70, sugar: 38 };
let weekOffset = 0;

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
    card.innerHTML = `<header class="day-header"><div class="day-title"><h3>${day}</h3><span>${formatDate(date,{month:"short",day:"numeric"})}</span></div><div class="day-total">${tidy(total.cal).toLocaleString()} cal<small>${tidy(total.p)}p · ${tidy(total.c)}c · ${tidy(total.fat)}f · ${tidy(total.s)}s</small></div><div class="progress"><span style="width:${Math.min(total.cal/GOALS.calories*100,100)}%"></span></div></header>`;
    MEALS.forEach(meal => {
      const foods = meals[meal] || [], mt = sumFoods(foods), section = document.createElement("section"); section.className = "meal";
      section.innerHTML = `<div class="meal-heading"><strong>${meal}</strong><button data-day="${day}" data-meal="${meal}" aria-label="Add to ${meal}">+</button></div>${foods.length ? foods.map(f => `<div class="food"><div class="food-name">${escapeHtml(f[0])}</div><div class="food-macros">${macroText({cal:f[1],p:f[2],c:f[3],fat:f[4],s:f[5]})}</div></div>`).join("") + `<div class="meal-total">Total: ${macroText(mt)}</div>` : `<div class="empty-meal">Nothing logged</div>`}`;
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
function escapeHtml(value) { const d=document.createElement("div"); d.textContent=value; return d.innerHTML; }
function openFood(day="Monday", meal="Breakfast") { document.querySelector("#foodDay").value=day; document.querySelector("#foodMeal").value=meal; document.querySelector("#foodDialog").showModal(); setTimeout(()=>document.querySelector("#foodName").focus(),50); }

const daySelect = document.querySelector("#foodDay"); ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].forEach(d => daySelect.add(new Option(d,d)));
document.querySelector("#weekGrid").addEventListener("click", e => { const b=e.target.closest("button[data-day]"); if(b) openFood(b.dataset.day,b.dataset.meal); });
document.querySelector("#addFoodTop").addEventListener("click",()=>openFood());
document.querySelector("#foodForm").addEventListener("submit", e => {
  if (e.submitter?.value === "cancel") return;
  e.preventDefault(); const data=loadWeek(), day=daySelect.value, meal=document.querySelector("#foodMeal").value;
  data[day][meal].push([document.querySelector("#foodName").value, ...["Calories","Protein","Carbs","Fat","Sugar"].map(k=>Number(document.querySelector(`#food${k}`).value))]);
  saveWeek(data); e.target.reset(); document.querySelector("#foodDialog").close(); render();
});
document.querySelector("#prevWeek").addEventListener("click",()=>{weekOffset--;render();}); document.querySelector("#nextWeek").addEventListener("click",()=>{weekOffset++;render();}); document.querySelector("#todayButton").addEventListener("click",()=>{weekOffset=0;render();});
document.querySelector("#editGoals").addEventListener("click",()=>alert("Goal editing is next on the roadmap — the current daily target is 2,500 calories."));
render();
