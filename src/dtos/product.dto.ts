import { IsString, IsOptional, IsEnum } from 'class-validator';
import { InputType, Field } from 'type-graphql';

export enum SortByEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class ProductSearchDto {
  @Field({ nullable: true, defaultValue: '' })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true, defaultValue: SortByEnum.ASC })
  @IsString()
  @IsOptional()
  @IsEnum(SortByEnum, { message: 'Invalid sort Order value [ASC | DESC]' })
  sortOrder: string;
}

@InputType()
export class ProductCreateDto {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  imageUrl: string;

  @Field()
  price: number;

  @Field()
  quantity: number;
}
