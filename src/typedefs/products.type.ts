import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Product {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  imageUrl: string;

  @Field()
  price: number;

  @Field()
  quantity: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
