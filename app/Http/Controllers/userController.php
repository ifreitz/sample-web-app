<?php

namespace App\Http\Controllers;

use App\Users;
use App\Admins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class userController extends Controller
{
    public function index($page_number) {
        try {
            $users = Users::paginate(5, ['*'], 'page', $page_number);
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
        
        $images = $user->profile_pic;
        if ($request->hasFile('file')) {
            if ($user->profile_pic != "") {
                Storage::delete('public/images/profiles/' . $user->profile_pic);
            }
            $images = $request->file->getClientOriginalName();
            $images = time() .'_' . preg_replace("/[^a-z0-9\_\-\.]/i", "", $images);
            $request->file->storeAs('public/images/profiles', $images);
            $user->profile_pic = $images;
        }

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
        if ($foundUser > 0) {
            return response()->json([
                'errors' => [
                    'email' => [
                        'This email has been used'
                    ]
                ]
            ], 422);
        }

        $images = "";
        if ($request->hasFile('file')) {
            $images = $request->file->getClientOriginalName();
            $images = time().'_' . preg_replace("/[^a-z0-9\_\-\.]/i", "", $images);
            $request->file->storeAs('public/images/profiles', $images);
        }
        
        $user = Users::create([
            'name' => $validateData['name'],
            'email' => $validateData['email'],
            'password' => $validateData['password'],
            'gender' => $validateData['gender'],
            'description' => $validateData['description'],
            'profile_pic' => $images
        ]);

        return $user->toJson();
    }

    public function search($name) {
        try {
            $users = Users::where('name', 'LIKE', '%'.$name.'%')->paginate(5, ['*'], 'page', 1);
        } catch (Exception $e) {
            echo $e;
        }

        return $users->toJson();
    }

    public function delete($user_id) {
        $user = Users::find($user_id);
        if ($user->profile_pic != "") {
            Storage::delete('public/images/profiles/' . $user->profile_pic);
        }
        Users::destroy($user_id);
        return response()->json('User deleted!');
    }
}
