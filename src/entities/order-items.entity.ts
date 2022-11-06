import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderItem } from '@interfaces/order-items.interface';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends BaseEntity implements OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  orderId: number;

  @Column()
  @IsNotEmpty()
  productId: number;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column()
  @IsNotEmpty()
  quantity: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
