import type {
  CustomerDataWithId,
  CustomerInsertDTO,
  CustomerRowDTO,
} from './types';

export const mapCustomerFromDB = (row: CustomerRowDTO): CustomerDataWithId => ({
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  dateOfBirth: row.date_of_birth,
  title: row.title || null,
  company: row.company || null,
  id: row.user_id,
});

export const mapCustomerToDB = (
  customer: CustomerDataWithId
): CustomerInsertDTO => ({
  first_name: customer.firstName,
  last_name: customer.lastName,
  email: customer.email,
  phone: customer.phone,
  date_of_birth: customer.dateOfBirth,
  title: customer.title ?? null,
  company: customer.company ?? null,
  user_id: customer.id,
});
