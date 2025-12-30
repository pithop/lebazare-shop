import { createClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'
import { notFound, redirect } from 'next/navigation'
import PrintOrderTemplate from '@/components/admin/PrintOrderTemplate'

export default async function PrintOrderPage({ params }: { params: { id: string } }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const adminClient = createAdminClient()

    const { data: order, error } = await adminClient
        .from('orders')
        .select(`
      *,
      order_items (
        *,
        products (
          title
        ),
        product_variants (
          name
        )
      )
    `)
        .eq('id', params.id)
        .single()

    if (error || !order) {
        notFound()
    }

    return <PrintOrderTemplate order={order} />
}
