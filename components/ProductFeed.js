import React from "react";
import Product from "./Product";
import { useSelector } from "react-redux";

function ProductFeed() {
  const { categoryProducts } = useSelector((state) => state.products);

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:-mt-28 mx-auto  sm:mt-0 mt-12">
      {categoryProducts?.map((product) => (
        <Product
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          description={product.description}
          category={product.category}
          image={product.image}
          priority={true}
        />
      ))}
      {/* <img
        className="hidden md:block md:col-span-full"
        src="https://links.papareact.com/dyz"
        alt="middle banner"
      /> */}
      {/* <div className="md:col-span-2">
        {products?.slice(4, 5).map((product) => (
          <Product
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
            category={product.category}
            image={product.image}
            priority={true}
          />
        ))}
      </div>
      {products?.slice(5, products.length - 1).map((product) => (
        <Product
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          description={product.description}
          category={product.category}
          image={product.image}
          priority={true}
        />
      ))}*/}
    </div>
  );
}

export default ProductFeed;
