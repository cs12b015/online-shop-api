import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class OrderItemResponse {
  @Field()
  id: number;

  @Field()
  productId: number;

  @Field()
  title: string;

  @Field()
  imageUrl: string;

  @Field()
  description: string;

  @Field()
  quantity: number;

  @Field()
  price: number;
}

@ObjectType()
export class OrderResponse {
  @Field()
  id: number;

  @Field()
  totalPrice: number;

  @Field()
  totalQuantity: number;

  @Field(() => [OrderItemResponse])
  orderItems: OrderItemResponse[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
