import { EntityRepository } from 'typeorm';
import { OrderEntity } from '@/entities/orders.entity';
import { HttpException } from '@exceptions/HttpException';
import { Order } from '@/interfaces/orders.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
export default class OrderRepository {
  public async orderCreate(orderData: Order): Promise<Order> {
    if (isEmpty(orderData)) throw new HttpException(400, 'orderData is empty');

    const order: Order = await OrderEntity.create(orderData).save();
    return order;
  }

  public async orderFindById(orderId: number): Promise<Order> {
    if (isEmpty(orderId)) throw new HttpException(400, 'orderId is empty');

    const order: Order = await OrderEntity.findOne({ where: { id: orderId } });
    if (isEmpty(order)) throw new HttpException(409, "Order doesn't exist");

    return order;
  }
}
