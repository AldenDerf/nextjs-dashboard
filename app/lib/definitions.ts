// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
import * as z from 'zod';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type SignUpData = z.infer<typeof SignupFormSchema>;

export const SignupFormSchema = z.object({
  name: z
  .string()
  .min(2, { error: 'Name must be at least 2 characters long.'})
  .trim(),
  email: z.email({ error: 'Please enter a valid email.'}),
  password: z
  .string()
  .min(8, { error: 'Be at least 8 characters long'})
  .regex(/[a-zA-Z]/, {error: 'Containt at least one letter'})
  .regex(/[0-9]/, { error: 'Contain at lease one number.'})
  .regex(/[^a-zA-Z0-9]/, { error: 'Contain at least one special character.'})
  .trim(),
})

export type FormState = 
| { // Shape:: the 'error' object shape

  error?: {
    name?: string[]
    email: string[]
    password?: string[]

  }
  message?:string // <-- Note: message is optional here
} | undefined
