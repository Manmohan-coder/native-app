
import { dummyCart } from "@/assets/assets";
import { Product } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    price: number;
}
type CartContextType = {
    cartItems: CartItem[],
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (cartItemId: string, size: string) => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cartTotal, setCartTotal] = useState<number>(0);

    const fetchCart = async () => {
        setIsLoading(true);
        const serverCart = dummyCart;
        const mappedItems: CartItem[] = serverCart.items.map((item: any) => ({
            id: item.product._id,
            productId: item.product._id,
            product: item.product,
            quantity: item.quantity,
            size: item?.size || "M",
            price: item.price,
        }))
        setCartItems(mappedItems);
        setCartTotal(serverCart.totalAmount);
        setIsLoading(false);
    }
    const addToCart = async (product: Product, size: string) => {
    };
    const removeFromCart = async (cartItemId: string, size: string) => {
    };
    const updateQuantity = async (cartItemId: string, quantity: number, size: string = 'M') => {
    };
    const clearCart = async () => { }

    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => { fetchCart() }, []);


    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isLoading }}>
            {children}
        </CartContext.Provider>
    )
};

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}