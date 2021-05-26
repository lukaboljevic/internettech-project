import React, { useContext, useState } from "react";

const OrderContext = React.createContext();

// custom hook
export const useOrder = () => {
    return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
    
    const [itemToOrder, setItemToOrder] = useState(null);
    const [orderInformation, setOrderInformation] = useState(null);

    // these will be exported
    const value = {
        itemToOrder,
        orderInformation,
        setItemToOrder,
        setOrderInformation,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
