import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, MenuItem, Select, Slider, Stack } from '@mui/material'
import type { ArchitectFilters } from '@/types'

interface FilterPanelProps {
  filters: ArchitectFilters
  onFiltersChange: (filters: ArchitectFilters) => void
}

const experienceOptions = ['Junior', 'Mid', 'Senior']
const projectTypes = ['Residential', 'Commercial', 'Interior', 'Landscape']
const locations = ['New York', 'Los Angeles', 'London', 'Dubai', 'Remote']
const styles = ['Modern', 'Sustainable', 'Minimalist', 'Luxury']

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const handleToggleStyle = (style: string) => {
    const nextStyles = filters.styles.includes(style)
      ? filters.styles.filter((item) => item !== style)
      : [...filters.styles, style]
    onFiltersChange({ ...filters, styles: nextStyles })
  }

  return (
    <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <FormLabel>Location</FormLabel>
          <Select value={filters.location} onChange={(event) => onFiltersChange({ ...filters, location: event.target.value })} size="small">
            <MenuItem value="">Any</MenuItem>
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Project type</FormLabel>
          <Select value={filters.projectType} onChange={(event) => onFiltersChange({ ...filters, projectType: event.target.value })} size="small">
            <MenuItem value="">All Types</MenuItem>
            {projectTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Budget range</FormLabel>
          <Slider
            value={filters.budgetRange}
            onChange={(_, value) => onFiltersChange({ ...filters, budgetRange: value as [number, number] })}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={5000}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Experience level</FormLabel>
          <Select value={filters.experience} onChange={(event) => onFiltersChange({ ...filters, experience: event.target.value })} size="small">
            <MenuItem value="">Any</MenuItem>
            {experienceOptions.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">Architectural styles</FormLabel>
          <FormGroup>
            {styles.map((style) => (
              <FormControlLabel
                key={style}
                control={<Checkbox checked={filters.styles.includes(style)} onChange={() => handleToggleStyle(style)} />}
                label={style}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Stack>
    </Box>
  )
}

export default FilterPanel
