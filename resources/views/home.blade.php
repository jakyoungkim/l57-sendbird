@extends('layouts.app')

@section('sidebar')
    @parent
    <p>test section 입니다</p>
@endsection

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4">
                Tweet Form
            </div>
            <div class="col-md-8">
                TimeLines
            </div>
        </div>
        <send-bird :headerText="'test'"></send-bird>
    </div>
@endsection
