<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data['key'] = '076F2CD7-A154-4522-8415-112D6CDB2248';
        return view('home', $data);
    }
    public function sendbird()
    {
        $data['key'] = '076F2CD7-A154-4522-8415-112D6CDB2248';
        return view( 'sendbird', $data);
    }
}
