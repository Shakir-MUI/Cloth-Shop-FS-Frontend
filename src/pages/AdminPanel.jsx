import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Modal,
  Badge,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import { productsAPI, ordersAPI, categoriesAPI } from "../services/api";
import { toast } from "react-toastify";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("stats");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    size: "M",
    color: "",
    material: "",
    brand: "",
    image: null,
    image2: null,
    image3: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAdminProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAdminOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await productsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProductForm({ ...productForm, [name]: files[0] });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(productForm).forEach((key) => {
      if (productForm[key] !== null && productForm[key] !== "") {
        formData.append(key, productForm[key]);
      }
    });

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await productsAPI.create(formData);
        toast.success("Product created successfully");
      }
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      size: product.size,
      color: product.color,
      material: product.material,
      brand: product.brand,
      image: null,
      image2: null,
      image3: null,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(productId);
        toast.success("Product deleted successfully");
        fetchProducts();
        fetchStats();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      size: "M",
      color: "",
      material: "",
      brand: "",
      image: null,
      image2: null,
      image3: null,
    });
    setEditingProduct(null);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, { order_status: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Statistics Tab */}
        <Tab
          eventKey="stats"
          title={
            <span>
              <FaChartLine className="me-2" />
              Statistics
            </span>
          }
        >
          <Row className="g-4">
            <Col md={3}>
              <Card
                className="shadow-sm text-center h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                }}
              >
                <Card.Body>
                  <FaBox size={40} className="mb-3" />
                  <h3 className="fw-bold">{stats.total_products || 0}</h3>
                  <p className="mb-0">Total Products</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="shadow-sm text-center h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                }}
              >
                <Card.Body>
                  <FaShoppingCart size={40} className="mb-3" />
                  <h3 className="fw-bold">{stats.total_sold || 0}</h3>
                  <p className="mb-0">Items Sold</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="shadow-sm text-center h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "white",
                }}
              >
                <Card.Body>
                  <FaBox size={40} className="mb-3" />
                  <h3 className="fw-bold">{stats.total_stock || 0}</h3>
                  <p className="mb-0">Stock Available</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card
                className="shadow-sm text-center h-100"
                style={{
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  color: "white",
                }}
              >
                <Card.Body>
                  <FaBox size={40} className="mb-3" />
                  <h3 className="fw-bold">{stats.out_of_stock || 0}</h3>
                  <p className="mb-0">Out of Stock</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Products Tab */}
        <Tab
          eventKey="products"
          title={
            <span>
              <FaBox className="me-2" />
              Products
            </span>
          }
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Manage Products</h4>
            <Button
              variant="primary"
              onClick={() => {
                resetProductForm();
                setShowProductModal(true);
              }}
            >
              <FaPlus className="me-2" />
              Add New Product
            </Button>
          </div>

          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sold</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={
                            product.image
                              ? `http://localhost:8000${product.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={product.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                      </td>
                      <td className="fw-bold">{product.name}</td>
                      <td>
                        <Badge bg="info">
                          {product.category_name || "Uncategorized"}
                        </Badge>
                      </td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.sold}</td>
                      <td>
                        <Badge bg={product.is_active ? "success" : "danger"}>
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Orders Tab */}
        <Tab
          eventKey="orders"
          title={
            <span>
              <FaShoppingCart className="me-2" />
              Orders
            </span>
          }
        >
          <h4 className="mb-4">Manage Orders</h4>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-bold">{order.order_number}</td>
                      <td>{order.full_name}</td>
                      <td>₹{order.total_amount}</td>
                      <td>
                        <Badge bg="secondary">
                          {order.payment_method_display}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={order.order_status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                          style={{ width: "150px" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </Form.Select>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <Badge
                          bg={
                            order.order_status === "delivered"
                              ? "success"
                              : order.order_status === "cancelled"
                              ? "danger"
                              : order.order_status === "shipped"
                              ? "info"
                              : "warning"
                          }
                        >
                          {order.order_status_display}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Product Modal */}
      <Modal
        show={showProductModal}
        onHide={() => {
          setShowProductModal(false);
          resetProductForm();
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand *</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.display_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Size *</Form.Label>
                  <Form.Select
                    name="size"
                    value={productForm.size}
                    onChange={handleProductFormChange}
                    required
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Color *</Form.Label>
                  <Form.Control
                    type="text"
                    name="color"
                    value={productForm.color}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Material *</Form.Label>
                  <Form.Control
                    type="text"
                    name="material"
                    value={productForm.material}
                    onChange={handleProductFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image 1</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleProductFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image 2</Form.Label>
                  <Form.Control
                    type="file"
                    name="image2"
                    accept="image/*"
                    onChange={handleProductFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Image 3</Form.Label>
                  <Form.Control
                    type="file"
                    name="image3"
                    accept="image/*"
                    onChange={handleProductFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowProductModal(false);
                  resetProductForm();
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminPanel;
