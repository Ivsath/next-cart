import { useState, useEffect } from "react";
import { Divider, Segment, Button } from "semantic-ui-react";
import StripeCheckout from "react-stripe-checkout";

import calculateCartTotal from "../../utils/calculateCartTotal";

function CartSummary({ products, handleCheckout, success }) {
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);
  const [isCartEmpty, setCartEmpty] = useState(false);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total:</strong> ${cartAmount}
        <StripeCheckout
          name="Next Cart"
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_51H70IDB0NC0Qk6WpF2NNbuJfo4VKNk7ARdt7QqfHYFO9WpkK1hWm2zIXEc3NPOOtrFTwfI0pFO8MQePNCXgacKM700TU4duVwG"
          token={handleCheckout}
          triggerEvent="onClick"
        >
          <Button
            icon="cart"
            color="teal"
            floated="right"
            content="Checkout"
            disabled={isCartEmpty || success}
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
