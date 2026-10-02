import { InputAdornment, TextField } from '@mui/material'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const SearchBar = ({ value, onChange, placeholder = 'Search architects, projects, or locations' }: SearchBarProps) => (
  <TextField
    fullWidth
    size="small"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search size={18} className="text-gray-400" />
        </InputAdornment>
      ),
    }}
  />
)

export default SearchBar
