import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '../ui/dialog'
import { useAuth } from '@/hooks/use-auth'
import AuthSocialButton from '../buttons/auth-social-button'
import { Github } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

const SettingsModal = () => {
  const authModal = useAuth()
  const router = useRouter()
  // redirect to github.com
  const socialLogin = (platform: string) => {
    if (platform === 'github') {
      router.push(
        `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}`
      )
    }
  }
  return (
    <Dialog open={authModal.isOpen} onOpenChange={authModal.onClose}>
      <DialogContent className="w-96">
        <DialogHeader className="pb-3">
          <h2 className="text-lg font-bold">Sign in</h2>
          <DialogDescription>to continue to jotlin</DialogDescription>
        </DialogHeader>
        <div className="flex  items-center justify-between">
          <AuthSocialButton
            icon={Github}
            onClick={() => socialLogin('github')}
            platform="GitHub"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
