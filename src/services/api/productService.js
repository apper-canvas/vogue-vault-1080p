import { getApperClient } from "@/services/apperClient";

const productService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to UI format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ]
      };

      const response = await apperClient.getRecordById('product_c', parseInt(id), params);

      if (!response?.data) {
        throw new Error("Product not found");
      }

      const product = response.data;
      return {
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  getByCategory: async (category) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category]
        }]
      };

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      }));
    } catch (error) {
      console.error("Error fetching products by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  getFeatured: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ],
        where: [{
          "FieldName": "featured_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      };

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      }));
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error);
      return [];
    }
  },

  getTrending: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ],
        where: [{
          "FieldName": "trending_c",
          "Operator": "EqualTo",
          "Values": [true]
        }]
      };

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      }));
    } catch (error) {
      console.error("Error fetching trending products:", error?.response?.data?.message || error);
      return [];
    }
  },

  search: async (query) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "sizes_c"}},
          {"field": {"Name": "colors_c"}},
          {"field": {"Name": "inStock_c"}},
          {"field": {"Name": "stockCount_c"}},
          {"field": {"Name": "featured_c"}},
          {"field": {"Name": "trending_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{
              "fieldName": "Name",
              "operator": "Contains",
              "values": [query]
            }], "operator": ""},
            {"conditions": [{
              "fieldName": "category_c",
              "operator": "Contains",
              "values": [query]
            }], "operator": ""},
            {"conditions": [{
              "fieldName": "description_c",
              "operator": "Contains",
              "values": [query]
            }], "operator": ""}
          ]
        }]
      };

      const response = await apperClient.fetchRecords('product_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(product => ({
        Id: product.Id,
        name: product.Name,
        description: product.description_c,
        price: parseFloat(product.price_c || 0),
        category: product.category_c,
        subcategory: product.subcategory_c,
        images: product.images_c ? product.images_c.split('\n').filter(img => img.trim()) : [],
        sizes: product.sizes_c ? product.sizes_c.split('\n').filter(size => size.trim()) : [],
        colors: product.colors_c ? product.colors_c.split('\n').filter(color => color.trim()) : [],
        inStock: product.inStock_c || false,
        stockCount: parseInt(product.stockCount_c || 0),
        featured: product.featured_c || false,
        trending: product.trending_c || false
      }));
    } catch (error) {
      console.error("Error searching products:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export default productService;