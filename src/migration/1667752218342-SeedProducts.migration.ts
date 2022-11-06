import { MigrationInterface, getRepository } from 'typeorm';
import { ProductsSeed } from '@/seeds/products.seed';

export class SeedProducts1667752218342 implements MigrationInterface {
  public async up(): Promise<void> {
    await getRepository('products').save(ProductsSeed);
  }

  public async down(): Promise<void> {
    // do nothing
  }
}
