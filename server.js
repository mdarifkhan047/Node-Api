'use strict';

const Hapi = require('hapi');
const MySQL = require('mysql');
const Joi = require('joi');
const server = new Hapi.Server();
const { port } = require('./config');
const { endpoint } = require('./config');
const  env  = require('./config');
var path = require("path");



//connection string
const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tms_app'
});
//set port
server.connection({
    host: 'localhost',
    port: 8000
});
connection.connect();

//Get all users
server.route({
    method: 'GET',
    path: '/api/users',
    handler: function (request, reply) {
        connection.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            reply(results);
        });
    }
});

//Get User By Id
server.route({
    method: 'GET',
    path: '/api/user/{uid}',
    handler: function (request, reply) {
        const UserId = request.params.uid;
        connection.query('SELECT * FROM user WHERE UserId = "' + UserId + '"', function (error, results, fields) {
            if (error) throw error;         
            reply(results);
        });

    }
});

//Add User
server.route({
    method: 'POST',
    path: '/api/user/add',

    handler: function (request, reply) {
        const UserName = request.payload.UserName;
        const UserPassword = request.payload.UserPassword;
        const UserRole = request.payload.UserRole; 
        connection.query('INSERT INTO user (UserName,UserPassword,UserRole) VALUES ("' + UserName + '","' + UserPassword + '","' + UserRole + '")', function (error, results, fields) {
            if (error) throw error;
            if(results.affectedRows)
            reply('Record Inserted');
         else
            reply('Error occurred');   
        });

    },
    config: {
        validate: {
            payload: {                
                UserName: Joi.string().alphanum().min(3).max(30).required(),
                UserRole: Joi.string(),
                UserPassword: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
            }
        }

    }
});

//Update User
server.route({
    method: 'PUT',
    path: '/api/user/update',

    handler: function (request, reply) {
        const UserId=request.payload.UserId;
        const UserName = request.payload.UserName;
        const UserPassword = request.payload.UserPassword;
        const UserRole = request.payload.UserRole;    
        connection.query('Update user  set UserName="' + UserName + '" , UserPassword="'+ UserPassword +'", UserRole="'+ UserRole + '" WHERE UserId = "' + UserId + '"', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
        if(results.affectedRows)
            reply('Record Updated');
         else
            reply('Error occurred');        
            
        });

    },
    config: {
        validate: {
            payload: {
                UserId:Joi.number().required(),
                UserName: Joi.string().alphanum().min(3).max(30).required(),
                UserRole: Joi.string(),
                UserPassword: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
            }
        }

    }
});

//Delete User
server.route({
    method: 'DELETE',
    path: '/api/user/delete/{uid}',
    handler: function (request, reply) {
        const UserId = request.params.uid;      
        connection.query('DELETE FROM user WHERE UserId = "' + UserId + '"', function (error, result, fields) {
            if (error) throw error;
            if (result.affectedRows) {
                reply('Record Deleted');
            } else {
                reply('Error occurred');
            }
        });
    }    
});


// Start the server
server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Node Environment`, env.NODE_ENV); 
    console.log(`Your port is ${port}`); 
    console.log(`End point ${endpoint}`);     
    console.log('Server running at:', server.info.uri);
});