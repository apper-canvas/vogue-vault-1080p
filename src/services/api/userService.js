import { getApperClient } from "@/services/apperClient";
import store from "@/store";

const userService = {
  getProfile: async () => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        throw new Error("User not authenticated");
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
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "addresses_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "email_c",
          "Operator": "EqualTo",
          "Values": [currentUser.emailAddress]
        }]
      };

      const response = await apperClient.fetchRecords('user_profile_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("User not found");
      }

      if (!response?.data?.length) {
        // Create profile if it doesn't exist
        return await userService.createProfile(currentUser);
      }

      const userProfile = response.data[0];
      
      return {
        Id: userProfile.Id,
        name: userProfile.Name,
        email: userProfile.email_c,
        firstName: userProfile.firstName_c,
        lastName: userProfile.lastName_c,
        phone: userProfile.phone_c,
        addresses: userProfile.addresses_c ? JSON.parse(userProfile.addresses_c) : [],
        createdAt: userProfile.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching user profile:", error?.response?.data?.message || error);
      throw error;
    }
  },

  createProfile: async (currentUser) => {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        records: [{
          Name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.emailAddress,
          email_c: currentUser.emailAddress,
          firstName_c: currentUser.firstName || '',
          lastName_c: currentUser.lastName || '',
          phone_c: '',
          addresses_c: '[]'
        }]
      };

      const response = await apperClient.createRecord('user_profile_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create user profile");
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create user profile:`, failed);
          throw new Error("Failed to create user profile");
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.Name,
            email: created.email_c,
            firstName: created.firstName_c,
            lastName: created.lastName_c,
            phone: created.phone_c,
            addresses: [],
            createdAt: created.CreatedOn
          };
        }
      }
      
      throw new Error("Failed to create user profile");
    } catch (error) {
      console.error("Error creating user profile:", error?.response?.data?.message || error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
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

      // Get current profile to find the record ID
      const currentProfile = await userService.getProfile();
      
      const updateData = {};
      if (profileData.firstName !== undefined) updateData.firstName_c = profileData.firstName;
      if (profileData.lastName !== undefined) updateData.lastName_c = profileData.lastName;
      if (profileData.phone !== undefined) updateData.phone_c = profileData.phone;
      if (profileData.firstName || profileData.lastName) {
        updateData.Name = `${profileData.firstName || currentProfile.firstName} ${profileData.lastName || currentProfile.lastName}`.trim();
      }

      const params = {
        records: [{
          Id: currentProfile.Id,
          ...updateData
        }]
      };

      const response = await apperClient.updateRecord('user_profile_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update profile");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update user profile:`, failed);
          throw new Error("Failed to update profile");
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.Name,
            email: updated.email_c,
            firstName: updated.firstName_c,
            lastName: updated.lastName_c,
            phone: updated.phone_c,
            addresses: updated.addresses_c ? JSON.parse(updated.addresses_c) : currentProfile.addresses,
            createdAt: updated.CreatedOn
          };
        }
      }

      throw new Error("Failed to update profile");
    } catch (error) {
      console.error("Error updating user profile:", error?.response?.data?.message || error);
      throw error;
    }
  },

  getAddresses: async () => {
    try {
      const profile = await userService.getProfile();
      return profile.addresses || [];
    } catch (error) {
      console.error("Error fetching addresses:", error?.response?.data?.message || error);
      return [];
    }
  },

  addAddress: async (address) => {
    try {
      const currentProfile = await userService.getProfile();
      const currentAddresses = currentProfile.addresses || [];
      
      const newAddress = {
        Id: Date.now(),
        ...address,
        isDefault: currentAddresses.length === 0
      };
      
      const updatedAddresses = [...currentAddresses, newAddress];
      
      // Update the profile with new addresses
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not available");
      }

      const params = {
        records: [{
          Id: currentProfile.Id,
          addresses_c: JSON.stringify(updatedAddresses)
        }]
      };

      const response = await apperClient.updateRecord('user_profile_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to add address");
      }

      return newAddress;
    } catch (error) {
      console.error("Error adding address:", error?.response?.data?.message || error);
      throw error;
    }
  }
};

export default userService;