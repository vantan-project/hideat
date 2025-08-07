<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KeepStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     * {
     *  isGoogle: boolean;
     *  url: string;
     *  locationId: string;
     *  }
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'isGoogle' => ['required', 'boolean'],
            'url' => ['required', 'url'],
            'locationId' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'isGoogle.required' => 'Googleかどうかは必須です。',
            'url.required' => 'URLは必須です。',
            'url.url' => '有効なURLを入力してください。',
            'locationId.required' => 'ロケーションIDは必須です。',
        ];
    }
}
