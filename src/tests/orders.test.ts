import request from 'supertest';
import App from '@/app';
import { faker } from '@faker-js/faker';
import { productResolver } from '@resolvers/products.resolver';
import { orderResolver } from '@/resolvers/orders.resolver';
import { ProductCreateDto } from '@dtos/product.dto';
import { Product } from '@typedefs/products.type';
import { PORT } from '@/config';

const mockServer = new App([productResolver, orderResolver]);
let product: Product;

beforeAll(async () => {
  const productData: ProductCreateDto = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    imageUrl: faker.image.imageUrl(),
    price: 100,
    quantity: 10,
  };
  await mockServer.start();
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
  const queryData = {
    query: createProductQuery,
    variables: { productData },
  };

  const response = await request(`http://localhost:${PORT}/graphql`).post('/').send(queryData);
  product = response.body.data.createProduct;
});

describe('Testing Orders', () => {
  const createOrderQuery = `mutation CreateOrder($orderData: [CheckoutItemDto!]!) {
    createOrder(orderData: $orderData) {
      id
      totalPrice
      totalQuantity
      orderItems {
        id
        productId
        title
        imageUrl
        description
        quantity
        price
      }
      createdAt
      updatedAt
    }
  }`;
  describe('[Create] - Order', () => {
    it('should not create an order - [Out Of Stock]', async () => {
      const orderQueryData = {
        orderData: [
          {
            productId: product.id,
            quantity: 50,
          },
        ],
      };

      const response = await request(`http://localhost:${PORT}/graphql`).post('/').send({ query: createOrderQuery, variables: orderQueryData });
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].message.includes('Not enough quantity')).toEqual(true);
    });
  });

  describe('[Create] - Order', () => {
    it('should create an order ', async () => {
      const orderQueryData = {
        orderData: [
          {
            productId: product.id,
            quantity: 5,
          },
        ],
      };

      const response = await request(`http://localhost:${PORT}/graphql`).post('/').send({ query: createOrderQuery, variables: orderQueryData });
      expect(response.body.errors).toBeUndefined();
      const order = response.body.data.createOrder;
      expect(order).toHaveProperty('id');
      expect(order.totalPrice).toEqual(product.price * orderQueryData.orderData[0].quantity);
      expect(order.totalQuantity).toEqual(orderQueryData.orderData[0].quantity);
      expect(order.orderItems[0].productId).toEqual(product.id);
      expect(order.orderItems[0].title).toEqual(product.title);
    });
  });
});

afterAll(async () => {
  await mockServer.stop();
});
