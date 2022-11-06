import { EntityRepository } from 'typeorm';
import { OrderItemEntity } from '@/entities/order-items.entity';
import { HttpException } from '@exceptions/HttpException';
import { OrderItem } from '@/interfaces/order-items.interface';
import { OrderItemResponse } from '@typedefs/orders.type';

import { isEmpty } from '@utils/util';

@EntityRepository()
export default class OrderItemRepository {
  public async orderItemsCreate(orderItemsData: OrderItem[]): Promise<void> {
    if (isEmpty(orderItemsData)) throw new HttpException(400, 'orderItemData is empty');

    await OrderItemEntity.createQueryBuilder().insert().into(OrderItemEntity).values(orderItemsData).execute();
  }

  public async orderItemsFindAllByOrderId(orderId: number): Promise<OrderItemResponse[]> {
    if (isEmpty(orderId)) throw new HttpException(400, 'orderId is empty');

    const orderItems: OrderItemResponse[] = await OrderItemEntity.query(
      `SELECT order_items.id, "order_items"."orderId", "order_items"."productId", order_items.quantity, order_items.price, products.title, "products"."imageUrl", products.description FROM order_items INNER JOIN products ON "order_items"."productId" = products.id WHERE "order_items"."orderId" = ${orderId}`,
    );
    return orderItems;
  }
}
