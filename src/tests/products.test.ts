import request from 'supertest';
import App from '@/app';
import { faker } from '@faker-js/faker';
import { productResolver } from '@resolvers/products.resolver';
import { ProductCreateDto } from '@dtos/product.dto';
import { Product } from '@typedefs/products.type';
import { PORT } from '@/config';

const mockServer = new App([productResolver]);

beforeAll(async () => {
  await mockServer.start();
});

describe('Testing Products', () => {
  const createProductQuery = `mutation CreateProduct($productData: ProductCreateDto!) {
    createProduct(productData: $productData) {
      id
      title
      description
      imageUrl
      price
      quantity
      createdAt
      updatedAt
    }
  }`;

  describe('[Create] - Product', () => {
    it('should create a product', async () => {
      const productData: ProductCreateDto = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.imageUrl(),
        price: 100,
        quantity: 10,
      };

      const queryData = {
        query: createProductQuery,
        variables: { productData },
      };
      const response = await request(`http://localhost:${PORT}/graphql`).post('/').send(queryData);
      expect(response.body.errors).toBeUndefined();
      const product: Product = response.body.data.createProduct;
      expect(product).toHaveProperty('id');
      expect(product.title).toEqual(productData.title);
      expect(product.description).toEqual(productData.description);
      expect(product.imageUrl).toEqual(productData.imageUrl);
      expect(product.price).toEqual(productData.price);
      expect(product.quantity).toEqual(productData.quantity);
    });
  });

  describe('[Search] - Product', () => {
    it('should search for a product', async () => {
      const productData: ProductCreateDto = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageUrl: faker.image.imageUrl(),
        price: 100,
        quantity: 10,
      };

      const queryData = {
        query: createProductQuery,
        variables: { productData },
      };

      const searchQueryData = {
        query: `query GetProductsBySearch($search: ProductSearchDto!) {
          getProductsBySearch(search: $search) {
            id
            title
            description
            imageUrl
          }
        }`,
        variables: { search: { search: productData.title, sortOrder: 'ASC' } },
      };

      const response = await request(`http://localhost:${PORT}/graphql`).post('/').send(queryData);
      const product: Product = response.body.data.createProduct;
      const searchResponse = await request(`http://localhost:${PORT}/graphql`).post('/').send(searchQueryData);
      const searchProducts: Product[] = searchResponse.body.data.getProductsBySearch;
      expect(searchProducts.length).not.toBe(0);
      searchProducts.forEach(searchProduct => {
        const searchInFields: Boolean = searchProduct.title.includes(product.title) || searchProduct.description.includes(product.description);
        expect(searchInFields).toEqual(true);
      });
    });
  });
});

afterAll(async () => {
  await mockServer.stop();
});
