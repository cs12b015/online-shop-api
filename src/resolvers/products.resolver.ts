import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import { ProductSearchDto, ProductCreateDto } from '@dtos/product.dto';
import ProductRepository from '@repositories/products.repository';
import { Product } from '@typedefs/products.type';

@Resolver()
export class productResolver extends ProductRepository {
  @Query(() => [Product], {
    description: 'Product find by search',
  })
  async getProductsBySearch(@Arg('search', { nullable: true }) search?: ProductSearchDto): Promise<Product[]> {
    const products: Product[] = await this.productFindAllBySearch(search);
    return products;
  }

  @Mutation(() => Product, {
    description: 'Product create',
  })
  async createProduct(@Arg('productData') productData: ProductCreateDto): Promise<Product> {
    const product: Product = await this.productCreate(productData as Product);
    return product;
  }
}
