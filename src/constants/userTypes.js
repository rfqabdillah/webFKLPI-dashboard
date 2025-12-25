/**
 * User Type Constants
 * Centralized constants for user type identification
 */

// Non-ASN (Aparatur Sipil Negara) user type ID
export const NON_ASN_ID = "7563d021-664d-4cd9-87d7-82cb3440664f";

// User type helper functions
export const isASNUser = (userTypeId) => {
  return userTypeId !== NON_ASN_ID;
};

export const isNonASNUser = (userTypeId) => {
  return userTypeId === NON_ASN_ID;
};
