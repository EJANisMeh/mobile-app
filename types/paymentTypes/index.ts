/**
 * Payment method tuple: [type, details]
 * Example: ["cash", "Pay cash on counter"]
 *          ["gcash", "09171234567"]
 *          ["Bank Transfer", "BDO Account: 1234567890"]
 */
export type PaymentMethodTuple = [string, string]

/**
 * Payment method object for component state
 */
export interface PaymentMethod {
	type: string
	details: string
}

/**
 * Props for PaymentMethodsList component
 */
export interface PaymentMethodsListProps {
	paymentMethods: PaymentMethod[]
	onUpdateMethod: (index: number, method: PaymentMethod) => void
	onRemoveMethod: (index: number) => void
}

/**
 * Props for AddPaymentMethodInput component
 */
export interface AddPaymentMethodInputProps {
	onAdd: (method: PaymentMethod) => void
	existingTypes: string[]
}
