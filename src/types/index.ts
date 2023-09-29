export interface StoreProps {
  id: string;
  name: string;
  userId: string;
  billboards: BillboardProps[];
  categories: CategoryProps[];
  products: ProductProps[];
  sizes: SizeProps[];
  colors: ColorProps[];
  orders: OrderProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BillboardProps {
  id: string;
  storeId: string;
  store: StoreProps[];
  label: string;
  imageUrl: string;
  categories: CategoryProps[];
  createdAt: Date; 
  updatedAt: Date;
}

export interface CategoryProps {
  id: string;
  storeId: string;
  store: StoreProps[];
  billboard: BillboardProps;
  name: string;
  products: ProductProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductProps {
  id: string;
  storeId: string;
  store?: StoreProps[];
  categoryId: string;
  category?: CategoryProps;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: string;
  size?: SizeProps;
  colorId: string;
  color?: ColorProps;
  images?: ImageProps[] | null;
  orderItems?: OrderItemProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderProps {
  id: string;
  storeId: string;
  store: StoreProps;
  orderItems: OrderItemProps[];
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemProps{
  id: string;
  orderId: string;
  order: OrderProps;
  productId: string;
  product: ProductProps;
  createdAt: Date;
  updatedAt: Date;
}

export interface SizeProps {
  id: string;
  storeId: string;
  store: StoreProps;
  name: string;
  value: string;
  products: ProductProps[]; 
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorProps {
  id: string;
  storeId: string;
  store: StoreProps;
  name: string;
  value: string;
  products: ProductProps[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageProps {
  id: string;
  productId: string;
  product: ProductProps;
  url: string 
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductColumnProps{
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: CategoryProps;
  size: SizeProps;
  color: ColorProps;
  createdAt: Date;
}

export interface OrderColumnProps{
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: Date;
}
