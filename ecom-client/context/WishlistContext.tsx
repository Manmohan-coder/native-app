import { dummyWishlist } from "@/assets/assets";
import { WishlistContextType, Product } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {

    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchWishlist = async () => {
        setLoading(true);
        setWishlist(dummyWishlist)
        setLoading(false);
    }

    const toggleWishlist = async (product: Product) => {
        const exists = wishlist.find(item => item._id === product._id);
        setWishlist(prev => exists ? prev.filter(item => item._id !== product._id) : [...prev, product]);
    }
    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item._id === productId);
    }

    useEffect(() => {
        fetchWishlist();
    }, [])

    return (
        <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
};

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}