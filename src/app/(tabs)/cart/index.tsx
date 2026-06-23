import { getMyCart } from "@/services/CartService";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";

const Cart = () => {
    const {total_cart} = useSelector((state: any) => state.public)
    const [cart, setCart] = useState();
    const getCart = async() => {
        const data = await getMyCart();
        if(data){
            setCart({...data})
        }
    }
    useEffect(() => {
        getCart()
    }, [])
    return (
        <View>
            <Text>Cart</Text>
        </View>
    )
}
export default Cart;