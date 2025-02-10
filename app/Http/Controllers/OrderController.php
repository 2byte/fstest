<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Provider;
use Illuminate\Http\Request;
use Twobyte\Frutokassaapi\FrutoKassaApi;
use Twobyte\Frutokassaapi\FrutoKassaApiException;
use Twobyte\Frutokassaapi\FrutoKassaOrder;
use Arr;

class OrderController extends Controller
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

        $request->validate([
            'provider_id' => 'required|exists:providers,id',
        ]);

        $provider = Provider::find($request->provider_id);

        //
        $fsbill = new FrutoKassaApi(
            $provider->token,
            $provider->secret_key
        );

        if (app()->isLocal()) {
            $fsbill->setApiUrl('http://127.0.0.1:8000/api/v1/');
        }

        $response = null;
        $apiErrors = null;

        try {
            $response = $fsbill->createOrder(
                FrutoKassaOrder::make()->setParams($request->all())
            );
            $provider->orders()->create(
                Arr::only((array) $response->getData(), ['type', 'bank_id', 'card_number', 'card_number_client', 'amount', 'sbp_phone', 'status', 'created_at'])
            );
        } catch (FrutoKassaApiException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()
            ->with('created_order', $response?->getFullResponse())
            ->with('order_api_errors', $response->getErrors());
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
