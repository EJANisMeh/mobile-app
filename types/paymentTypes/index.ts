/**
 * Payment method tuple: [type, details, needsProof, proofMode]
 * Example: ["cash", "Pay cash on counter", false, null]
 *          ["gcash", "09171234567", true, "screenshot"]
 *          ["Bank Transfer", "BDO Account: 1234567890", true, "text"]
 */
export type PaymentMethodTuple = [
	string,
	string,
	boolean,
	'text' | 'screenshot' | null
]

/**
 * Payment method object for component state
 */
export interface PaymentMethod {
	type: string
	details: string
	needsProof: boolean
	proofMode: 'text' | 'screenshot' | null
	isDefaultCash?: boolean // Track if this is the original default cash method
}

/**
 * Payment mode structure stored in orders table
 * Built from selected payment method tuple
 */
export interface PaymentMode {
	type: string // Payment method name (e.g., "Cash", "GCash", "Bank Transfer")
	details: string // Payment instructions/details
	needsProof?: boolean // Whether payment proof is required
	proofMode?: 'text' | 'screenshot' | null // Type of proof required
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
