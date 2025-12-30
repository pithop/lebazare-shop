import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { getSetting } from '@/actions/settings'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const announcement = await getSetting('announcement') || { text: '', isActive: false }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif text-slate-800 mb-8">Paramètres du Site</h1>
            <SettingsForm initialAnnouncement={announcement} />
        </div>
    )
}
