import { HStack, Tag, Text } from "@chakra-ui/react";
import LoadingProduct from "../components/Loading/LoadingProduct";
import Main from "../components/Main";
import ProductCard from "../components/ProductCard";
import ProductsGrid from "../components/ProductsGrid";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { searchTags } from "../mockDB/db";
import { ProductType } from "../context/GlobalState";
import { Product } from "../api/types";
import { useGlobalContext } from "../context/useGlobalContext";
import { useMemo } from "react";

const Home = () => {
  const { products: filteredProducts, loading: isLoading } = useFilteredProducts();
  const { products: globalProducts } = useGlobalContext();
  
  // Transform API Product objects to ProductType and merge with global state (cart/saved)
  const products: ProductType[] = useMemo(() => {
    return filteredProducts.map((product: Product) => {
      // Find the corresponding product in global state to get cart/saved state
      const globalProduct = globalProducts.find(gp => gp.id === product.id);
      
      const baseProduct = {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category: product.category?.name || '',
        isSaved: globalProduct?.isSaved || false, // Use saved state from global context
        delivery_summary: product.delivery_summary,
      };
      
      // Preserve cart state from global context
      if (globalProduct?.inCart) {
        return {
          ...baseProduct,
          inCart: true as true,
          quantity: globalProduct.quantity || 1,
        };
      } else {
        return {
          ...baseProduct,
          inCart: false,
        };
      }
    });
  }, [filteredProducts, globalProducts]);
  
  return (
    <Main>
      <HStack p={3} mb={5} spacing={2} flexWrap="wrap">
        <Text fontWeight="bold" fontSize="sm" mr={3}>
          Related
        </Text>
        {searchTags.map((tag, i) => (
          <Tag key={i} size="sm" bg="blackAlpha.200" rounded="full" m={1}>
            {tag}
          </Tag>
        ))}
      </HStack>
      <ProductsGrid>
        {isLoading
          ? Array(20)
              .fill("")
              .map((_, i) => <LoadingProduct key={i} />)
          : products.map((product, index) => <ProductCard key={`${product.id}-${index}`} product={product} />)}
      </ProductsGrid>
    </Main>
  );
};

export default Home;
