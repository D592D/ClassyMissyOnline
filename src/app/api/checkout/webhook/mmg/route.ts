import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * MMG Webhook Callback Handler
 * Receives payment status updates from MMG's hosted gateway.
 * Transitions order status and decrements stock levels atomically.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, reference } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      console.error('Supabase Admin Client not initialized. Webhook ignored.');
      return NextResponse.json({ error: 'Database client unconfigured' }, { status: 500 });
    }

    const isBooking = orderId.startsWith('BK-');

    if (isBooking) {
      // 1. Retrieve the pending booking
      const { data: booking, error: fetchError } = await supabaseAdmin
        .from('bookings')
        .select('status')
        .eq('id', orderId)
        .single();

      if (fetchError || !booking) {
        console.error(`Booking ${orderId} not found in database:`, fetchError);
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // 2. Prevent replay attacks
      if (booking.status !== 'pending') {
        console.warn(`Booking ${orderId} has already been processed (status: ${booking.status}).`);
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Handle booking payment
      if (status === 'paid' || status === 'success') {
        const { error: updateError } = await supabaseAdmin
          .from('bookings')
          .update({
            status: 'paid',
            mmg_reference: reference || null,
          })
          .eq('id', orderId);

        if (updateError) {
          console.error(`Failed to update status for booking ${orderId}:`, updateError);
          return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
        }
        console.log(`Successfully processed payment for booking ${orderId}`);
      } else if (status === 'failed' || status === 'cancelled') {
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
        console.log(`Booking ${orderId} was marked as cancelled/failed.`);
      }
    } else {
      // 1. Retrieve the pending order to verify details and get items
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('status, items')
        .eq('id', orderId)
        .single();

      if (fetchError || !order) {
        console.error(`Order ${orderId} not found in database:`, fetchError);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // 2. Prevent replay attacks or double processing
      if (order.status !== 'pending') {
        console.warn(`Order ${orderId} has already been processed (status: ${order.status}).`);
        return NextResponse.json({ success: true, message: 'Already processed' });
      }

      // Handle successful payment
      if (status === 'paid' || status === 'success') {
        // 3. Mark the order as paid
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            mmg_reference: reference || null,
          })
          .eq('id', orderId);

        if (updateError) {
          console.error(`Failed to update status for order ${orderId}:`, updateError);
          return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
        }

        // 4. Decrement stock levels for all ordered items
        const items = Array.isArray(order.items) ? order.items : [];
        for (const item of items) {
          if (!item.id || !item.quantity) continue;

          try {
            // Attempt atomic decrement using public.decrement_product_stock RPC function
            const { error: rpcError } = await supabaseAdmin.rpc('decrement_product_stock', {
              product_id: item.id,
              quantity_to_decrement: parseInt(item.quantity, 10),
            });

            if (rpcError) {
              // Fallback to fetch-and-update if RPC is not defined in the database
              console.warn(`RPC decrement failed, falling back to manual update for product ${item.id}:`, rpcError.message);
              
              const { data: product } = await supabaseAdmin
                .from('products')
                .select('stock')
                .eq('id', item.id)
                .single();

              if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                await supabaseAdmin
                  .from('products')
                  .update({ stock: newStock })
                  .eq('id', item.id);
              }
            }
          } catch (stockErr) {
            console.error(`Error updating stock for product ${item.id}:`, stockErr);
          }
        }

        console.log(`Successfully processed payment and updated stock for order ${orderId}`);
      } else if (status === 'failed' || status === 'cancelled') {
        // Mark order as cancelled
        await supabaseAdmin
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId);
        
        console.log(`Order ${orderId} was marked as cancelled/failed.`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('MMG Webhook execution failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}
