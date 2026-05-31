import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const _icon = (m: any) => (m && m.default) ? m.default : m
const SearchComp = _icon(SearchIcon)

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
          {SearchComp ? <SearchComp color="action" /> : null}
        </InputAdornment>
      ),
    }}
  />
)

export default SearchBar
