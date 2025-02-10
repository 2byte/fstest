<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('bank_id');
            $table->decimal('amount', 10, 2);
            $table->string('card_number')->nullable();
            $table->string('card_number_client')->nullable();
            $table->string('phone')->nullable();
            $table->string('type');
            $table->boolean('sbp_phone')->default(false);
            $table->string('status');
            $table->json('callback_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
