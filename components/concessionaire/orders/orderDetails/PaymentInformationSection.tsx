import React from 'react'
import { View, Text, Image } from 'react-native'
import type { PaymentMode } from '../../../../types'

interface PaymentInformationSectionProps {
	paymentMode: PaymentMode | null
	paymentProof: any
	formatDate: (date: Date) => string
	styles: any
	colors: any
}

const PaymentInformationSection: React.FC<PaymentInformationSectionProps> = ({
	paymentMode,
	paymentProof,
	formatDate,
	styles,
	colors,
}) => {
	if (!paymentMode) {
		return null
	}

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Payment Information</Text>

			{/* Payment Method */}
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>Payment Method:</Text>
				<Text style={styles.detailValue}>{paymentMode.type}</Text>
			</View>

			{/* Payment Details/Instructions */}
			{paymentMode.details && (
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>Details:</Text>
					<Text style={styles.detailValue}>{paymentMode.details}</Text>
				</View>
			)}

			{/* Payment Proof if required */}
			{paymentMode.needsProof && (
				<>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Proof Required:</Text>
						<Text style={styles.detailValue}>
							{paymentMode.proofMode === 'text'
								? 'Text Reference'
								: 'Screenshot'}
						</Text>
					</View>

					{paymentProof ? (
						<>
							<Text style={styles.proofLabel}>Payment Proof:</Text>
							{paymentProof.mode === 'text' ? (
								<View style={styles.proofTextContainer}>
									<Text style={styles.proofText}>{paymentProof.value}</Text>
								</View>
							) : (
								<View style={styles.proofImageContainer}>
									<Image
										source={{ uri: paymentProof.value }}
										style={styles.proofImage}
										resizeMode="contain"
									/>
								</View>
							)}
						</>
					) : (
						<View style={styles.proofMissingContainer}>
							<Text style={styles.proofMissingText}>
								Payment proof not yet submitted
							</Text>
						</View>
					)}
				</>
			)}
		</View>
	)
}

export default PaymentInformationSection
