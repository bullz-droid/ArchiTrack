import { Stack, SvgIcon, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

const _icon = (m: any) => (m && m.default) ? m.default : m
const StarComp = _icon(StarIcon)
const StarBorderComp = _icon(StarBorderIcon)

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
        <SvgIcon key={index} color={filledStar ? 'secondary' : 'disabled'} fontSize="small">
          {filledStar ? (StarComp ? <StarComp /> : null) : (StarBorderComp ? <StarBorderComp /> : null)}
        </SvgIcon>
      ))}
      <Typography variant="body2" color="text.secondary">
        {value.toFixed(1)}
      </Typography>
    </Stack>
  )
}

export default RatingStars
