import { Arg, Resolver, Mutation, Query } from 'type-graphql';
import { CheckoutItemDto } from '@dtos/order.dto';
import { HttpException } from '@exceptions/HttpException';
import OrderRepository from '@repositories/orders.repository';
import OrderItemRepository from '@repositories/order-items.repository';
import ProductRepository from '@repositories/products.repository';
import { Product } from '@typedefs/products.type';
import { Order } from '@interfaces/orders.interface';
import { OrderItem } from '@interfaces/order-items.interface';
import { OrderResponse, OrderItemResponse } from '@typedefs/orders.type';

@Resolver()
export class orderResolver {
  private readonly orderRepository: OrderRepository;
  private readonly productRepository: ProductRepository;
  private readonly orderItemRepository: OrderItemRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
    this.orderItemRepository = new OrderItemRepository();
  }

  @Query(() => OrderResponse, {
    description: 'Order find by id',
  })
  async getOrderById(@Arg('id') id: number): Promise<OrderResponse> {
    const orderItems: OrderItemResponse[] = await this.orderItemRepository.orderItemsFindAllByOrderId(id);
    const order: Order = await this.orderRepository.orderFindById(id);
    return { ...order, orderItems };
  }

  @Mutation(() => OrderResponse, {
    description: 'Order create',
  })
  async createOrder(@Arg('orderData', () => [CheckoutItemDto]) orderData: CheckoutItemDto[]): Promise<OrderResponse> {
    const products: Product[] = await this.productRepository.productFindByIds(orderData.map(({ productId }) => productId));
    const productsByIds = products.reduce((acc, product) => ({ ...acc, [product.id]: product }), {});
    orderData.forEach(orderItem => {
      if (!productsByIds[orderItem.productId]) throw new HttpException(409, `Product not found: id=${orderItem.productId}`);
      if (productsByIds[orderItem.productId].quantity < orderItem.quantity)
        throw new HttpException(409, `Not enough quantity: productId=${orderItem.productId}, quantity=${orderItem.quantity}`);
    });

    const totalQuantity = orderData.reduce((acc, { quantity }) => acc + quantity, 0);
    const totalPrice = orderData.reduce((acc, { productId, quantity }) => acc + productsByIds[productId].price * quantity, 0);

    const order: Order = await this.orderRepository.orderCreate({ totalQuantity, totalPrice } as Order);
    const orderItemsData: OrderItem[] = orderData.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: productsByIds[item.productId].price,
    }));
    await Promise.all([this.orderItemRepository.orderItemsCreate(orderItemsData), this.productRepository.productUpdateQuantity(orderData)]);
    const orderResponse: OrderResponse = await this.getOrderById(order.id);
    return orderResponse;
  }
}
