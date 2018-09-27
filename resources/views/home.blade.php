@extends('layouts.app')

{{--@section('sidebar')
    @parent
    <p>test section 입니다</p>
@endsection--}}

@section('content')
    <div class="container">
        </div>
        <send-bird :app-key="'{{ $name }}'"></send-bird>
    </div>
@endsection
