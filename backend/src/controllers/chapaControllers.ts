// chapaController.tsx
import { Request, Response } from 'express';
import axios from 'axios';


const CHAPA_URL = process.env.CHAPA_URL || 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_AUTH = process.env.CHAPA_AUTH || 'CHASECK_TEST-iDvsnxTeq7Iuw6D04W8emJkKTyRLREct';

const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`,
  },
};

// Initial payment endpoint for Chapa
export const initiatePayment = async (req: Request, res: Response) => {
  const { amount, currency, email, first_name, last_name } = req.body; // Added missing fields

  const CALLBACK_URL = `http://localhost:${process.env.PORT || 7000}/api/chapa/verify-payment/`;
  const RETURN_URL = "http://localhost:5173/api/chapa/payment-success/"

  const TEXT_REF = 'tx-hotelbooking-' + Date.now();

  const data = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    tx_ref: TEXT_REF,
    callback_url: CALLBACK_URL + TEXT_REF,
    return_url: RETURN_URL,
  };

  try {
    const response = await axios.post(CHAPA_URL, data, config);
    const checkout_url = response.data.data.checkout_url;
    res.status(200).json({ checkout_url, paymentStatus: response.data.status });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// Handle Chapa webhook
export const webhookclient = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (data.status === 'success') {
     
    
    }
    return res.status(200).json('Payment processed successfully');
  } catch (error) {
    res.status(500).json('Webhook error');
  }
};