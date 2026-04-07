import { useEffect, useState } from "react";
import "./CleaningAnimation.css";

const garbageIcons = ["🗑️", "🥤", "🧴", "🍾", "🛢️"];

function CleaningAnimation() {
  const [garbage, setGarbage] = useState([]);
  const [cleaner, setCleaner] = useState({ x: 10, y: 12 });
  const [cleaning, setCleaning] = useState(false);

  const generateGarbage = () => {
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({
        id: i,
        icon: garbageIcons[Math.floor(Math.random() * garbageIcons.length)],
        x: Math.random() * 90,
        y: Math.random() * 22 + 2,   // ← top 2%–24% only
        visible: true,
      });
    }
    setGarbage(items);
  };

  useEffect(() => { generateGarbage(); }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (cleaning) return;
      const remaining = garbage.filter((g) => g.visible);
      if (remaining.length === 0) { generateGarbage(); return; }

      const target = remaining[Math.floor(Math.random() * remaining.length)];
      setCleaning(true);
      setCleaner({ x: target.x, y: target.y });

      setTimeout(() => {
        setGarbage((prev) =>
          prev.map((g) => (g.id === target.id ? { ...g, visible: false } : g))
        );
        setCleaning(false);
      }, 1300);
    }, 2000);

    return () => clearInterval(interval);
  }, [garbage, cleaning]);

  return (
    <div className="cleaning-strip">
      {garbage.map((g) => (
        <div
          key={g.id}
          className={`garbage ${g.visible ? "show" : "hide"}`}
          style={{ left: `${g.x}%`, top: `${g.y}%` }}
        >
          {g.icon}
        </div>
      ))}
      <div
        className="cleaner"
        style={{ left: `${cleaner.x}%`, top: `${cleaner.y}%` }}
      >
        🧹
      </div>
    </div>
  );
}

export default CleaningAnimation;