<?php

namespace App\Http\Controllers;

use App\Users;
use App\Admins;
use Illuminate\Http\Request;

class userController extends Controller
{
    public function index() {
        try {
            $users = Users::all();
        } catch (Exception $e) {
            echo $e;
        }

        return $users->toJson();
    }

    public function login(Request $request) {
        $validateData = $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        if ($request['user'] == 'admin') {
            $user = Admins::where('email', $validateData['email'])->get();
            if (count($user) > 0) {
                $password = $user[0]['password'];
                if ($password == $validateData['password']) {
                    return $user->toJson();
                } else {
                    return response()->json($validateData, 403);
                }
            } else {
                return response()->json($validateData, 404);
            }
        } else {
            $user = Users::where('email', $validateData['email'])->get();
            if (count($user) > 0) {
                $password = $user[0]['password'];
                if ($password == $validateData['password']) {
                    return $user->toJson();
                } else {
                    return response()->json($validateData, 403);
                }
            } else {
                return response()->json($validateData, 404);
            }
        }
    }

    public function update(Request $request) {
        $validateData = $request->validate([
            'id' => 'required',
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
            'gender' => 'required',
            'description' => 'required'
        ]);

        $user = Users::find($validateData['id']);
        $user->name = $validateData['name'];
        $user->email = $validateData['email'];
        $user->password = $validateData['password'];
        $user->gender = $validateData['gender'];
        $user->description = $validateData['description'];
        $user->save();

        return $user->toJson();
    }

    public function register(Request $request) {
        $validateData = $request->validate([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
            'gender' => 'required',
            'description' => 'required'
        ]);

        $foundUser = Users::where('email', $validateData['email'])->count();
        if ($foundUser > 1) {
            return response()->json([
                'errors' => [
                    'email' => [
                        'This email has been used'
                    ]
                ]
            ], 422);
        }
        
        $user = Users::create([
            'name' => $validateData['name'],
            'email' => $validateData['email'],
            'password' => $validateData['password'],
            'gender' => $validateData['gender'],
            'description' => $validateData['description']
        ]);

        return $user->toJson();
    }

    public function delete($user_id) {
        Users::destroy($user_id);
        return response()->json('User deleted!');
    }
}
