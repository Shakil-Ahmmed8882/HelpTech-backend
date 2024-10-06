import { Types } from 'mongoose';
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';

export const SSLPaymentGateway = async (price: number, paymentId:string) => {
  
  const unique_tran_id = new Types.ObjectId().toString();

  const data = {
    total_amount: price,
    currency: 'BDT',
    tran_id: unique_tran_id, // use unique tran_id for each api call
    success_url: `${config.server_url}/payments/success/${unique_tran_id}/${paymentId}`,
    fail_url: `${config.server_url}/payments/fail/${unique_tran_id}/${paymentId}`,
    cancel_url: 'http://localhost:3030/cancel',
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'customer@example.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    config.store_id,
    config.store_passwd,
    config.is_live === "true",
  );


  const url = await sslcz.init(data).then((apiResponse:any) => {
    // Redirect the user to payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;
    return GatewayPageURL;
  });

  return { url, tranId: unique_tran_id };
};
