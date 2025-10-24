import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'

const ConcessionHeader: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionStyles = createConcessionStyles(colors, responsive)

	const [descExpanded, setDescExpanded] = useState(false)
	const DESC_COLLAPSE_LENGTH = 240
	const { concession } = useConcessionContext()

	return (
		<View style={concessionStyles.headerSection}>
			<Text style={concessionStyles.concessionName}>{concession?.name}</Text>
			{concession?.description ? (
				<>
					<Text
						style={concessionStyles.concessionDescription}
						numberOfLines={descExpanded ? undefined : 4}>
						{concession.description}
					</Text>
					{concession.description.length > DESC_COLLAPSE_LENGTH && (
						<TouchableOpacity onPress={() => setDescExpanded((s) => !s)}>
							<Text style={concessionStyles.showMoreText}>
								{descExpanded ? 'Show less' : 'Show more'}
							</Text>
						</TouchableOpacity>
					)}
				</>
			) : (
				<Text style={concessionStyles.noDescription}>
					No description available
				</Text>
			)}
		</View>
	)
}

export default ConcessionHeader
