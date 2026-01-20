import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import api from "../services/api";
import { toast } from "react-toastify";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, searchQuery]);

  // FETCH ALL PAGINATED PRODUCTS
  const fetchProducts = async () => {
    try {
      let allProducts = [];
      let nextUrl = "/products/";

      while (nextUrl) {
        const res = await api.get(nextUrl);

        allProducts = [...allProducts, ...(res.data?.results || [])];

        nextUrl = res.data?.next
          ? res.data.next.replace("http://localhost:8000/api", "")
          : null;
      }

      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // APPLY CATEGORY + SEARCH FILTERS
  const applyFilters = () => {
    let filtered = [...products];

    // CATEGORY FILTER (EXACT MATCH)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product?.category_name?.toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }

    // SEARCH FILTER (SAFE)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((product) => {
        const name = product?.name?.toLowerCase() || "";
        const description = product?.description?.toLowerCase() || "";
        const brand = product?.brand?.toLowerCase() || "";
        const category = product?.category_name?.toLowerCase() || "";

        return (
          name.includes(q) ||
          description.includes(q) ||
          brand.includes(q) ||
          category.includes(q)
        );
      });
    }

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to STYLON</h1>
          <p className="lead">Discover Your Perfect Style</p>
          <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
            Browse through our exclusive collection of professional, party,
            classic, street, daily, and traditional wear
          </p>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        {/* Search Bar */}
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <InputGroup size="lg">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Count */}
        <div className="mb-4 text-center">
          <h5 className="text-muted">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "Product" : "Products"} Found
          </h5>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">No products found</h4>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

export default Home;
