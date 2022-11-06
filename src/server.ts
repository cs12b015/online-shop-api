import App from '@/app';
import validateEnv from '@utils/validateEnv';

import { productResolver } from '@/resolvers/products.resolver';
import { orderResolver } from '@/resolvers/orders.resolver';

validateEnv();

const app = new App([productResolver, orderResolver]);
app.start();
