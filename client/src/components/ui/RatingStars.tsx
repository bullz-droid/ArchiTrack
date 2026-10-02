import { Stack, Typography } from '@mui/material'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  value: number
  count?: number
}

const RatingStars = ({ value, count = 5 }: RatingStarsProps) => {
  const filled = Math.round(value)
  const stars = Array.from({ length: count }, (_, index) => index < filled)

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {stars.map((filledStar, index) => (
        <Star
          key={index}
          size={16}
          className={filledStar ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
        />
      ))}
      <Typography variant="body2" color="text.secondary">
        {value.toFixed(1)}
      </Typography>
    </Stack>
  )
}

export default RatingStars
