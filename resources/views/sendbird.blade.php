@extends('layouts.app')

@section('sendbird')
    @parent
    <simple-sendbird :app-key="'{{ $key }}'"></simple-sendbird>
@endsection
