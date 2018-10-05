@extends('layouts.app')

@section('content')
    <simple-sendbird
        :send-bird-app-key="'{{ $key }}'"
        :client-user-id="'{{ $user }}'"
        :channel-key="'{{ $channel }}'"
    ></simple-sendbird>
@endsection
