<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AuthSignUpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'user.name' => ['required', 'string', 'max:255'],
            'user.email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'user.password' => ['required', 'string'],
            'restaurant.name' => ['required', 'string', 'max:255'],
            'restaurant.placeId' => ['required', 'string'],
            'restaurant.instagramUrl' => ['nullable', 'url'],
            'restaurant.tiktokUrl' => ['nullable', 'url'],
            'restaurant.xUrl' => ['nullable', 'url'],
            'restaurant.facebookUrl' => ['nullable', 'url'],
            'restaurant.lineUrl' => ['nullable', 'url'],
            'restaurant.tabelogUrl' => ['nullable', 'url'],
            'restaurant.gnaviUrl' => ['nullable', 'url'],

            'restaurant.categoryIds' => ['required', 'array'],
            'restaurant.categoryIds.*' => ['integer', 'exists:categories,id'],

            'restaurant.imageFiles' => ['array'],
            'restaurant.imageFiles.*' => ['file', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ];
    }

    public function messages()
    {
        return [
            'user.name.required' => 'ユーザー名は必須です。',
            'user.name.string' => 'ユーザー名は文字列で入力してください。',
            'user.name.max' => 'ユーザー名は255文字以内で入力してください。',

            'user.email.required' => 'メールアドレスは必須です。',
            'user.email.email' => '正しいメールアドレスの形式で入力してください。',
            'user.email.max' => 'メールアドレスは255文字以内で入力してください。',
            'user.email.unique' => 'このメールアドレスは既に使用されています。',

            'user.password.required' => 'パスワードは必須です。',
            'user.password.string' => 'パスワードは文字列で入力してください。',

            'restaurant.name.required' => '店舗名は必須です。',
            'restaurant.name.string' => '店舗名は文字列で入力してください。',
            'restaurant.name.max' => '店舗名は255文字以内で入力してください。',

            'restaurant.placeId.required' => 'お店のPlace IDは必須です。',
            'restaurant.placeId.string'   => 'お店のPlace IDは文字列で指定してください。',

            'restaurant.instagramUrl.url' => 'Instagram URLは有効なURL形式で入力してください。',
            'restaurant.tiktokUrl.url' => 'TikTok URLは有効なURL形式で入力してください。',
            'restaurant.xUrl.url' => 'X URLは有効なURL形式で入力してください。',
            'restaurant.facebookUrl.url' => 'Facebook URLは有効なURL形式で入力してください。',
            'restaurant.lineUrl.url' => 'LINE URLは有効なURL形式で入力してください。',
            'restaurant.tabelogUrl.url' => '食べログ URLは有効なURL形式で入力してください。',
            'restaurant.gnaviUrl.url' => 'ぐるなび URLは有効なURL形式で入力してください。',

            'restaurant.categoryIds.required' => 'カテゴリーは必須です。',
            'restaurant.categoryIds.array' => 'カテゴリーは配列形式で送信してください。',
            'restaurant.categoryIds.*.integer' => 'カテゴリーIDは整数である必要があります。',
            'restaurant.categoryIds.*.exists' => '指定されたカテゴリーは存在しません。',

            'restaurant.imageFiles.array' => '画像ファイルは配列で送信してください。',
            'restaurant.imageFiles.*.file' => 'アップロードされたファイルが不正です。',
            'restaurant.imageFiles.*.image' => '画像ファイル形式（jpg、jpeg、png、webp）を指定してください。',
            'restaurant.imageFiles.*.max' => '画像ファイルは5MB以内でアップロードしてください。',
            'restaurant.imageFiles.*.mimes' => '許可されている画像形式は jpg、jpeg、png、webp です。',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'messages' => collect($validator->errors()->messages())
                    ->flatten()
                    ->toArray()
            ], 422)
        );
    }
}
