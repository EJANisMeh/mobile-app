import React from 'react'
import { View, Text, Image } from 'react-native'
import type { ThemeColors } from '../../../../types'

interface PaymentInformationSectionProps {
	paymentMode: { type: string; details?: string } | null
	paymentProof: any
	formatDate: (date: Date) => string
	styles: any
	colors: ThemeColors
	children?: React.ReactNode
}

const PaymentInformationSection: React.FC<PaymentInformationSectionProps> = ({
	paymentMode,
	paymentProof,
	formatDate,
	styles,
	colors,
	children,
}) => {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Payment Information</Text>
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Method:</Text>
				<Text style={styles.infoValue}>{paymentMode?.type || 'N/A'}</Text>
			</View>
			{paymentMode?.details && (
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Details:</Text>
					<Text style={styles.infoValue}>{paymentMode.details}</Text>
				</View>
			)}
			{children}
			{paymentProof && (
				<View style={styles.proofSection}>
					<Text style={styles.proofLabel}>Payment Proof Submitted:</Text>
					{paymentProof.mode === 'text' ? (
						<View style={styles.proofTextContainer}>
							<Text style={styles.proofText}>{paymentProof.value}</Text>
						</View>
					) : (
						<Image
							source={{ uri: paymentProof.value }}
							style={styles.proofImage}
							resizeMode="contain"
						/>
					)}
					<Text style={styles.proofTimestamp}>
						Submitted on:{' '}
						{paymentProof.submittedAt
							? formatDate(new Date(paymentProof.submittedAt))
							: 'N/A'}
					</Text>
				</View>
			)}
		</View>
	)
}

export default PaymentInformationSection
