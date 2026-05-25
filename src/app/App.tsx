import { useState } from "react";
import { Sparkles, Clock, Leaf, TrendingDown, ChefHat, Users, Heart, Flame, X, User } from "lucide-react";

interface Recipe {
  image: string;
  title: string;
  time: string;
  calories: string;
  tags: string[];
  fav: boolean;
  ingredients: string[];
  steps: string[];
}

const initialRecipes: Recipe[] = [
  {
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Салат с киноа и овощами",
    time: "15 мин", calories: "320 ккал", tags: ["ПП", "Вегетарианское"], fav: false,
    ingredients: ["150г киноа", "1 огурец", "2 помидора", "100г шпината", "2 ст.л. оливкового масла", "Лимонный сок", "Соль, перец"],
    steps: ["Отварите киноа 15 минут в подсоленной воде, промойте.", "Нарежьте огурец и помидоры кубиками.", "Смешайте киноа, овощи и шпинат.", "Заправьте маслом и лимонным соком, посолите."]
  },
  {
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Паста с брокколи и лимоном",
    time: "20 мин", calories: "450 ккал", tags: ["Быстро"], fav: false,
    ingredients: ["200г пасты", "300г брокколи", "3 зубчика чеснока", "Цедра 1 лимона", "3 ст.л. оливкового масла", "50г пармезана", "Соль, перец"],
    steps: ["Отварите пасту аль денте.", "Разберите брокколи на соцветия, обжарьте с чесноком 5 минут.", "Смешайте пасту с брокколи, добавьте цедру лимона.", "Посыпьте пармезаном и подавайте."]
  },
  {
    image: "https://images.unsplash.com/photo-1565895405140-6b9830a88c19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Рисовая тарелка с курицей",
    time: "25 мин", calories: "520 ккал", tags: ["Сытно"], fav: false,
    ingredients: ["200г риса", "300г куриного филе", "1 болгарский перец", "1 морковь", "3 ст.л. соевого соуса", "Кунжутное масло", "Зелёный лук"],
    steps: ["Отварите рис.", "Нарежьте курицу, обжарьте 7 минут.", "Добавьте овощи, тушите ещё 5 минут.", "Полейте соевым соусом, подавайте с рисом."]
  },
  {
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Боул с авокадо и яйцом",
    time: "10 мин", calories: "380 ккал", tags: ["ПП", "Низкокалорийное"], fav: true,
    ingredients: ["1 авокадо", "2 яйца", "100г шпината", "1 помидор", "Лимонный сок", "Соль, красный перец"],
    steps: ["Отварите яйца пашот 3-4 минуты.", "Нарежьте авокадо дольками.", "Выложите шпинат, авокадо, помидор.", "Добавьте яйца, сбрызните лимонным соком."]
  }
];

const filtersList = [
  { label: "До 20 минут", icon: <Clock className="w-4 h-4" /> },
  { label: "Без мяса", icon: <Leaf className="w-4 h-4" /> },
  { label: "Низкокалорийный", icon: <TrendingDown className="w-4 h-4" /> },
  { label: "Из того, что есть", icon: <ChefHat className="w-4 h-4" /> },
  { label: "ПП-обед", icon: <Sparkles className="w-4 h-4" /> },
  { label: "Для гостей", icon: <Users className="w-4 h-4" /> },
];

const categories = [
  { name: "Итальянская кухня", image: "https://images.unsplash.com/photo-1768204037592-92308f35120c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Азиатская кухня", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Здоровое питание", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { name: "Супы и бульоны", image: "https://images.unsplash.com/photo-1547592180-85f173990554?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const toggleFilter = (label: string) => {
    setActiveFilters(prev =>
      prev.includes(label) ? prev.filter(f => f !== label) : [...prev, label]
    );
  };

  const toggleFav = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setRecipes(prev => prev.map((r, i) => i === index ? { ...r, fav: !r.fav } : r));
  };

  const generateRecipe = async () => {
    setGenerating(true);
    setError("");
    const filters = activeFilters.length ? `Учти фильтры: ${activeFilters.join(", ")}.` : "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Придумай один оригинальный рецепт обеда. ${filters} Ответь ТОЛЬКО JSON без пояснений и markdown:
{"title":"название","time":"X мин","calories":"X ккал","tags":["тег1","тег2"],"image":"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400","ingredients":["ингредиент 1","ингредиент 2","ингредиент 3","ингредиент 4","ингредиент 5"],"steps":["шаг 1","шаг 2","шаг 3","шаг 4"]}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content.map((c: { text?: string }) => c.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const recipe: Recipe = { ...JSON.parse(clean), fav: false };
      setRecipes(prev => [recipe, ...prev]);
    } catch {
      setError("Не удалось сгенерировать рецепт. Попробуйте снова.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff8f0] via-[#fef5eb] to-[#fdfaf5]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#E8672A] p-2.5 rounded-2xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Обед за 5 секунд</h1>
        </div>
        <button
          onClick={() => setProfileOpen(true)}
          className="px-4 py-2 rounded-full border border-border hover:border-[#E8672A] hover:text-[#E8672A] transition-colors text-sm font-medium flex items-center gap-1.5"
        >
          <User className="w-4 h-4" />
          Мой профиль
        </button>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-6">
        <h2 className="text-4xl font-semibold text-foreground leading-tight mb-3">
          Что будем есть сегодня?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">Генерируем вкусные обеды за секунды</p>
        <button
          onClick={generateRecipe}
          disabled={generating}
          className="bg-[#E8672A] disabled:bg-gray-300 text-white px-9 py-4 rounded-full text-lg font-medium inline-flex items-center gap-2.5 transition-all hover:scale-105 shadow-lg shadow-orange-200 hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          {generating ? "Генерирую..." : "Сгенерировать обед"}
        </button>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>

      {/* Filters */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Быстрые фильтры</h3>
        <div className="flex flex-wrap gap-2.5">
          {filtersList.map(f => (
            <button
              key={f.label}
              onClick={() => toggleFilter(f.label)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all border ${
                activeFilters.includes(f.label)
                  ? "bg-[#E8672A] text-white border-[#E8672A]"
                  : "bg-white border-border hover:border-orange-300 text-foreground"
              }`}
            >
              {f.icon}{f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-foreground">Недавние идеи</h3>
          <button className="text-[#E8672A] text-sm font-medium hover:opacity-75">Посмотреть все</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recipes.map((recipe, i) => (
            <div
              key={i}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-card rounded-2xl overflow-hidden border border-border cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                <button
                  onClick={(e) => toggleFav(e, i)}
                  className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Heart className={`w-4 h-4 ${recipe.fav ? "fill-[#E8672A] text-[#E8672A]" : "text-gray-400"}`} />
                </button>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-foreground mb-2 leading-tight">{recipe.title}</h4>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{recipe.time}</span>
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{recipe.calories}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-orange-50 text-[#E8672A] text-[10px] font-medium rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 pb-10">
        <h3 className="text-xl font-medium text-foreground mb-4">Популярные категории</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <div key={cat.name} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-background rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 bg-secondary rounded-full w-8 h-8 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full aspect-video object-cover rounded-2xl mb-5" />
            <h2 className="text-2xl font-semibold mb-2">{selectedRecipe.title}</h2>
            <div className="flex gap-4 text-sm text-muted-foreground mb-5">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{selectedRecipe.time}</span>
              <span className="flex items-center gap-1"><Flame className="w-4 h-4" />{selectedRecipe.calories}</span>
            </div>
            <h3 className="font-medium mb-3">Ингредиенты</h3>
            <ul className="mb-5 space-y-2">
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i} className="text-sm border-b border-border pb-2 last:border-0">{ing}</li>
              ))}
            </ul>
            <h3 className="font-medium mb-3">Приготовление</h3>
            <div className="space-y-3">
              {selectedRecipe.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#E8672A] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setProfileOpen(false)}>
          <div className="bg-background rounded-3xl w-full max-w-sm p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 bg-secondary rounded-full w-8 h-8 flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-[#E8672A]" />
              </div>
              <h3 className="text-lg font-semibold">Гурман</h3>
              <p className="text-sm text-muted-foreground">Любитель вкусной еды</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { num: recipes.length, label: "Рецептов" },
                { num: recipes.filter(r => r.fav).length, label: "Избранных" },
                { num: 4, label: "Категорий" }
              ].map(s => (
                <div key={s.label} className="bg-secondary rounded-xl p-3 text-center">
                  <div className="text-2xl font-semibold text-[#E8672A]">{s.num}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">Генерируйте новые рецепты, добавляйте в избранное и готовьте с удовольствием!</p>
          </div>
        </div>
      )}
    </div>
  );
}
