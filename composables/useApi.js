const API_ENDPOINTS = {
  stores: {
    blogs: "/blog",
    stores: "/store",
    customer: "/customer",
  },
  admin: {
    tags: "admin/tags",
    faqs: "admin/faqs",
  }
};
class Request {
  constructor() {
    this.baseURL = useRuntimeConfig().public.BaseUrl;
    this.headers = {};
  }
  fetch(url, method, options) {
    this.headers = {
      "Content-type": "application/json",
    };
    return useFetch(url, {
      method: method,
      headers: this.headers,
      ...options,
    });
  }
  get(url, options = {}) {
    return this.fetch(url, "GET", options);
  }
  post(url, options = {}) {
    return this.fetch(url, "POST", options);
  }
  put(url, options = {}) {
    return this.fetch(url, "PUT", options);
  }
  delete(url, options = {}) {
    return this.fetch(url, "DELETE", options);
  }
  patch(url, options = {}) {
    return this.fetch(url, "PATCH", options);
  }
}
class CMSManager {
  constructor(request) {
    this.request = request;
  }
  async getBlogs(data) {
    return this.request.get(`${API_ENDPOINTS.stores.blogs}/blogs`, data);
  }
  async getBlogsDetail(slug) {
    return this.request.get(`${API_ENDPOINTS.stores.blogs}/${slug}`);
  }
  async getBlogCategories(data) {
    return this.request.get(`${API_ENDPOINTS.stores.blogs}/categories`, data);
  }
  async getBlogCategoryBySlug(slug) {
    return this.request.get(`${API_ENDPOINTS.stores.blogs}/categories/${slug}`);
  }
  async getBlogTagsStores(slug, data) {
    return this.request.get(`${API_ENDPOINTS.stores.blogs}/tags/${slug}`, data);
  }
  async getBlogTags(data) {
    return this.request.get(`${API_ENDPOINTS.admin.tags}`, data);
  }
  async getFAQ(data) {
    return this.request.get(`${API_ENDPOINTS.admin.faqs}`, data);
  }
  async getListProductCategory(data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.stores}/list_product_category`,
      data
    );
  }
  async getStoreProduct(data) {
    return this.request.get(`${API_ENDPOINTS.stores.stores}/products`, data);
  }
  async getStoreProductDetail(slug) {
    return this.request.get(`${API_ENDPOINTS.stores.stores}/product/${slug}`);
  }
  async getStoreProductCategories(data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.stores}/product-categories`,
      data
    );
  }
  async getStoreProductCategoriesDetail(slug, data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.stores}/product-categories/${slug}`,
      data
    );
  }
  async getCustomer(cart_id) {
    return this.request.get(`${API_ENDPOINTS.stores.customer}/cart/${cart_id}`);
  }

  async getCustomerOrders(data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.customer}/cart/orders`,
      data
    );
  }
  async getCustomerOrderDetail(data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.customer}/cart/order/${order_id}`,
      data
    );
  }
  async updateCustomer(cart_id, data) {
    return this.request.put(
      `${API_ENDPOINTS.stores.customer}/cart/${cart_id}`,
      data
    );
  }
  async deleteCustomer(cart_id) {
    return this.request.delete(
      `${API_ENDPOINTS.stores.customer}/cart/${cart_id}`
    );
  }
  async createCustomer(data) {
    return this.request.post(`${API_ENDPOINTS.stores.customer}/cart`, data);
  }

  async createCustomerOrderCheckout(data) {
    return this.request.post(
      `${API_ENDPOINTS.stores.customer}/order/checkout`,
      data
    );
  }
  async createCustomerOrderCancel(data) {
    return this.request.post(
      `${API_ENDPOINTS.stores.customer}/orders/cancel/${order_id}`,
      data
    );
  }

  async createCustomerOrderCoupons(data) {
    return this.request.post(
      `${API_ENDPOINTS.stores.customer}/orders/check_coupons`,
      data
    );
  }
  async getSearch(data) {
    return this.request.get(`${API_ENDPOINTS.stores.stores}/nations`, data);
  }

  async getFeedbacks(data) {
    return this.request.get(`${API_ENDPOINTS.stores.stores}/feedbacks`, data);
  }

  async getPartners(data) {
    return this.request.get(`${API_ENDPOINTS.stores.stores}/partners`, data);
  }

  async getProductsSearch(slug, data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.stores}/products-with-nation/${slug}`,
      data
    );
  }

  async getProductsEndow(data) {
    return this.request.get(
      `${API_ENDPOINTS.stores.stores}/endow_products`,
      data
    );
  }
}
class RestAPI {
  constructor() {
    this.request = new Request();
    this.stores = new CMSManager(this.request);
    this.admin = new CMSManager(this.request);
  }
}
export default () => ({ restAPI: new RestAPI() });