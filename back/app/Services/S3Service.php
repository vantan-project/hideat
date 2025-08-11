<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;

class S3Service
{
    protected Filesystem $disk;
    protected string $baseUrl;

    public function __construct()
    {
        $this->disk = Storage::disk('s3');
        $this->baseUrl = rtrim(config('filesystems.disks.s3.url'), '/');
    }

    public function upload(UploadedFile $file, string $directory): string
    {
        $path = $this->disk->putFile($directory, $file);
        return $this->baseUrl . '/' . $path;
    }

    public function delete(string $url): bool
    {
        $path = ltrim(str_replace($this->baseUrl, '', $url), '/');
        return $this->disk->delete($path);
    }
}
