import { Badge } from "react-bootstrap";

const categories = [
  { key: "all", value: "all", display: "All" },
  { key: "professional", value: "Professional Wear", display: "Professional" },
  { key: "party", value: "Party Wear", display: "Party" },
  { key: "classic", value: "Classic Wear", display: "Classic" },
  { key: "street", value: "Street Wear", display: "Street" },
  { key: "daily", value: "Daily Wear", display: "Daily" },
  { key: "traditional", value: "Traditional Wear", display: "Traditional" },
];

function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter mb-4 text-center">
      <h4 className="mb-3 fw-bold" style={{ color: "#2c3e50" }}>
        Shop by Category
      </h4>

      <div className="d-flex flex-wrap justify-content-center gap-2">
        {categories.map((category) => (
          <Badge
            key={category.key}
            className={`category-badge ${
              selectedCategory === category.value ? "active" : ""
            }`}
            onClick={() => onSelectCategory(category.value)}
            style={{
              cursor: "pointer",
              fontSize: "1rem",
              padding: "10px 25px",
            }}
          >
            {category.display}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
