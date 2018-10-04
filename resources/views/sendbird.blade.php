@extends('layouts.app')

@section('sendbird')
    @parent
    <simple-sendbird :app-key="'{{ $key }}'" :user="'{{ $user }}'" :channel-name="'{{ $channel }}'" ></simple-sendbird>
@endsection
