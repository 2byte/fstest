<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Provider;
use Illuminate\Http\Request;
use Twobyte\Frutokassaapi\FrutoKassaApi;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'alpha_num|min:3',
            'token' => 'min:50',
            'secret_key' => 'required'
        ]);

        $provider = Provider::create($request->all());

        return redirect()->route('provider.show', [$provider->id])->with('success', 'Провайдер успешно создан');
    }

    /**
     * Display the specified resource.
     */
    public function show(Provider $provider)
    {
        $orders = $provider->orders()->latest();

        //
        return inertia('ProviderView', [
            'data' => $provider->toArray(),
            'orders' => fn() => $orders->paginate(10),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Provider $provider)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Provider $provider)
    {
        //
    }

    public function handler(Request $request, Provider $provider)
    {
        $fsbill = new FrutoKassaApi(
            $provider->token,
            $provider->secret_key
        );

        if (!$fsbill->validHook()) {
            abort(403);
        }

        $order = Order::find($request->id);

        $receivedOrder = (object) $request['data'];

        if ($order->status !== $request->status) {
            if (
                $order->status == 'pending_requisites' &&
                $receivedOrder->status == 'pending'
            ) {
                $order->card_number = $receivedOrder->card_number;
                $order->card_holder = $receivedOrder->card_holder;
                $order->sbp_phone = $receivedOrder->sbp_phone;
                $order->status = $receivedOrder->status;
                $order->save();
            }

            if ($order->status == 'pending' && $receivedOrder->status == 'processed') {
                $order->amount = $receivedOrder->amount;
                $order->status = $receivedOrder->status;
            }
        }

        logger('Received order', (array) $receivedOrder);

        return response('ok');
    }
}
