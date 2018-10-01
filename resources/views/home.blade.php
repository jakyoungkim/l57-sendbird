@extends('layouts.app')

@section('content')
    <div class="container">
        </div>
        <send-bird :app-key="'{{ $key }}'"></send-bird>
    </div>
@endsection
