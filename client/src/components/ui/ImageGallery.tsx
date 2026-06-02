import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, ImageList, ImageListItem, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const _icon = (m: any) => (m && m.default) ? m.default : m
const CloseComp = _icon(CloseIcon)

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((image) => (
          <ImageListItem key={image} sx={{ cursor: 'pointer' }} onClick={() => setSelected(image)}>
            <img src={image} alt="Portfolio asset" loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Portfolio asset
            <IconButton edge="end" color="inherit" onClick={() => setSelected(null)}>
              {CloseComp ? <CloseComp /> : null}
            </IconButton>
        </DialogTitle>
        <DialogContent>
          {selected && <img src={selected} alt="Selected asset" style={{ width: '100%', borderRadius: 16 }} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ImageGallery
