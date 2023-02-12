import { USD, USD_PENDING } from 'constants/currency'

export const PENDING = 'PENDING';
export const POSTED = 'POSTED';

export const PLATINUM = 'AMEX(P)';
export const EVERYDAY = 'AMEX(ED)';

export const pendingCategory = {
    processType: PENDING,
    currency: USD_PENDING,
};

export const postedCategory = {
    processType: POSTED,
    currency: USD,
};
