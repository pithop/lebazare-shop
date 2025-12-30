import { getSetting } from '@/actions/settings'

export default async function AnnouncementBar() {
    const setting = await getSetting('announcement')

    if (!setting || !setting.isActive) return null

    return (
        <div className="bg-terracotta text-white text-center py-2 px-4 text-sm font-medium tracking-wide">
            {setting.text}
        </div>
    )
}
