'use server'

import { createAdminClient } from '@/lib/supabase-admin'

export async function getDashboardStats() {
    const supabase = createAdminClient()

    // 1. Total Revenue & Orders Count
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at, status')
        .order('created_at', { ascending: true }) // Oldest first for chart

    if (ordersError) {
        console.error('Error fetching orders stats:', ordersError)
        return null
    }

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const totalOrders = orders.length

    // 2. Revenue Over Time (Group by Day for last 30 days)
    // Since we don't have complex SQL functions exposed easily via JS client without RPC,
    // we'll process this in JS for now (assuming reasonable order volume for this stage).
    const revenueByDate: Record<string, number> = {}
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    orders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('fr-FR') // DD/MM/YYYY
        if (new Date(order.created_at) >= last30Days) {
            revenueByDate[date] = (revenueByDate[date] || 0) + order.total
        }
    })

    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        amount
    }))

    // 3. Top Products
    // We need to fetch order items. 
    const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity, products(title, images)')

    if (itemsError) {
        console.error('Error fetching order items:', itemsError)
        return { totalRevenue, totalOrders, chartData, topProducts: [] }
    }

    const productSales: Record<string, { title: string, count: number, image: string }> = {}

    orderItems.forEach((item: any) => {
        if (item.products) {
            const id = item.product_id
            if (!productSales[id]) {
                productSales[id] = {
                    title: item.products.title,
                    count: 0,
                    image: item.products.images?.[0] || ''
                }
            }
            productSales[id].count += item.quantity
        }
    })

    const topProducts = Object.values(productSales)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    return {
        totalRevenue,
        totalOrders,
        chartData,
        topProducts
    }
}
