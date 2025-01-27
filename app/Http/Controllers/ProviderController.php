<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;

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
            'token' => 'size:64',
        ]);

        $provider = Provider::create($request->all());
        
        return redirect()->route('provider.show', [$provider->id])->with('success', 'Провайдер успешно создан');
    }

    /**
     * Display the specified resource.
     */
    public function show(Provider $provider)
    {
        //
        return inertia('ProviderView', [
            'data' => $provider->toArray()
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
}
