import gql from 'graphql-tag'

export const createPublicApiKeyMutation = gql`
  mutation createPublicApiKey {
    createPublicApiKey(input: {}) {
      account_id
      secret_key
    }
  }
`

export const addBillingDetails = gql`
  mutation addBillingDetails($input: BillingDetailsInput) {
    addBillingDetails(input: $input) {
      address
      city
      state
      country
      zipcode
      organisation_name
      billing_email
    }
  }
`
export const payInvoice = gql`
  mutation payInvoice($input: PayInvoiceInput) {
    payInvoice(input: $input) {
      success
    }
  }
`
