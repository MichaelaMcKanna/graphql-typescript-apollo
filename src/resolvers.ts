import { Resolvers } from './types';
import { validateFullAmenities } from './helpers';

export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListing(id);
    },
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingAPI.getAmenities(id);
    },
  },
  Mutation: {
    createListing: async (_, { input }, { dataSources }) => {
      try {
        const res = await dataSources.listingAPI.createListing(input);
        return {
          code: 200,
          success: true,
          message: 'Listing successfully created!',
          listing: res,
        };
      } catch (error) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${error.extensions.response.body}`,
          listing: null,
        };
      }
    },
  },
};
