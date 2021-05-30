import React, { useContext, useState } from "react";

const OrderContext = React.createContext();

// custom hook
export const useOrder = () => {
    return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
    // Context that provides information about
    // the item to be ordered, and the order information
    // (name, surname, address etc)

    const [itemToOrder, setItemToOrder] = useState(null);
    const [orderInformation, setOrderInformation] = useState(null);
    const [paymentType, setPaymentType] = useState(null);

    // these will be exported
    const value = {
        itemToOrder,
        orderInformation,
        paymentType,
        setItemToOrder,
        setOrderInformation,
        setPaymentType,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
