import { EntityRepository, Like } from 'typeorm';
import { ProductSearchDto } from '@/dtos/product.dto';
import { CheckoutItemDto } from '@/dtos/order.dto';
import { ProductEntity } from '@/entities/products.entity';
import { HttpException } from '@exceptions/HttpException';
import { Product } from '@/interfaces/products.interface';
import { isEmpty } from '@utils/util';

@EntityRepository()
export default class ProductRepository {
  public async productFindByIds(productIds: number[]): Promise<Product[]> {
    if (isEmpty(productIds)) throw new HttpException(400, 'ProductIds are empty');

    const products: Product[] = await ProductEntity.findByIds(productIds);
    if (isEmpty(products)) throw new HttpException(409, "Products doesn't exist");

    return products;
  }

  public async productFindAllBySearch(productData?: ProductSearchDto): Promise<Product[]> {
    if (isEmpty(productData)) productData = { search: '', sortOrder: 'ASC' };
    const { search = '', sortOrder = 'ASC' } = productData;
    const products: Product[] = await ProductEntity.find({
      where: [{ title: Like(`%${search}%`) }, { description: Like(`%${search}%`) }],
      order: { price: sortOrder as 'ASC' | 'DESC' },
    });
    return products;
  }

  public async productCreate(productData: Product): Promise<Product> {
    if (isEmpty(productData)) throw new HttpException(400, 'productData is empty');

    const product: Product = await ProductEntity.create(productData).save();
    return product;
  }

  public async productUpdateQuantity(items: CheckoutItemDto[]): Promise<void> {
    if (isEmpty(items)) throw new HttpException(400, 'productData is empty');

    await Promise.all(
      items.map(item =>
        ProductEntity.createQueryBuilder()
          .update()
          .set({ quantity: () => `quantity - ${item.quantity}` })
          .where('id = :id', { id: item.productId })
          .execute(),
      ),
    );
  }
}
