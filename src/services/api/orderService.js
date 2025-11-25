import { getApperClient } from "@/services/apperClient";
import store from "@/store";
import userService from "./userService";

const orderService = {
  createOrder: async (orderData) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const state = store.getState();
      const currentUser = state.user.user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Get user profile to get the database user ID
      const userProfile = await userService.getProfile();
      
      const params = {
        records: [{
          Name: `Order ${Date.now()}`,
          orderNumber_c: `VO${Date.now().toString().slice(-8)}`,
          items_c: JSON.stringify(orderData.items),
          subtotal_c: parseFloat(orderData.subtotal),
          shipping_c: parseFloat(orderData.shipping),
          tax_c: parseFloat(orderData.tax),
          total_c: parseFloat(orderData.total),
          shippingAddress_c: JSON.stringify(orderData.shippingAddress),
          status_c: "Processing",
          userId_c: userProfile.Id
        }]
      };

      const response = await apperClient.createRecord('order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create order");
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create order:`, failed);
          throw new Error("Failed to create order");
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            userId: created.userId_c,
            orderNumber: created.orderNumber_c,
            items: JSON.parse(created.items_c),
            subtotal: parseFloat(created.subtotal_c),
            shipping: parseFloat(created.shipping_c),
            tax: parseFloat(created.tax_c),
            total: parseFloat(created.total_c),
            shippingAddress: JSON.parse(created.shippingAddress_c),
            status: created.status_c,
            createdAt: created.CreatedOn
          };
        }
      }

      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const state = store.getState();
      const currentUser = state.user.user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Get user profile to get the database user ID
      const userProfile = await userService.getProfile();

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "orderNumber_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shippingAddress_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "userId_c",
          "Operator": "EqualTo",
          "Values": [userProfile.Id]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      };

      const response = await apperClient.fetchRecords('order_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(order => ({
        Id: order.Id,
        userId: order.userId_c,
        orderNumber: order.orderNumber_c,
        items: JSON.parse(order.items_c || '[]'),
        subtotal: parseFloat(order.subtotal_c || 0),
        shipping: parseFloat(order.shipping_c || 0),
        tax: parseFloat(order.tax_c || 0),
        total: parseFloat(order.total_c || 0),
        shippingAddress: JSON.parse(order.shippingAddress_c || '{}'),
        status: order.status_c,
        createdAt: order.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching user orders:", error?.response?.data?.message || error);
      return [];
    }
  },

  getOrderById: async (orderId) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const state = store.getState();
      const currentUser = state.user.user;
      
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "orderNumber_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "subtotal_c"}},
          {"field": {"Name": "shipping_c"}},
          {"field": {"Name": "tax_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "shippingAddress_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      };

      const response = await apperClient.getRecordById('order_c', parseInt(orderId), params);

      if (!response?.data) {
        throw new Error("Order not found");
      }

      const order = response.data;
      
      // Get user profile to verify ownership
      const userProfile = await userService.getProfile();
      
      if (order.userId_c !== userProfile.Id) {
        throw new Error("Order not found");
      }

      return {
        Id: order.Id,
        userId: order.userId_c,
        orderNumber: order.orderNumber_c,
        items: JSON.parse(order.items_c || '[]'),
        subtotal: parseFloat(order.subtotal_c || 0),
        shipping: parseFloat(order.shipping_c || 0),
        tax: parseFloat(order.tax_c || 0),
        total: parseFloat(order.total_c || 0),
        shippingAddress: JSON.parse(order.shippingAddress_c || '{}'),
        status: order.status_c,
        createdAt: order.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default orderService;