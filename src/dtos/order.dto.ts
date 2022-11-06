import { InputType, Field } from 'type-graphql';

@InputType()
export class CheckoutItemDto {
  @Field()
  productId: number;

  @Field()
  quantity: number;
}
