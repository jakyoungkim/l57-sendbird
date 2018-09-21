@extends('layouts.app')

@section('endArea')
    @parent
    <send-bird :header-text="'{{ $name }}'" :old="{{ $old }}"></send-bird>
@endsection
