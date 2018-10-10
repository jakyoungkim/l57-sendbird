@extends('layouts.app')

@section('content')
    <simple-sendbird
        :send-bird-app-key="'{{ $key }}'"
        :client-user-id="'{{ $user }}'"
        :channel-key="'{{ $channel }}'"
        :token = "'{{ $token }}'"
    ></simple-sendbird>
@endsection
