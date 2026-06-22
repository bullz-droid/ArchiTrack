import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect root to auth by default, or you can build a custom landing page here.
  redirect('/auth')
}
