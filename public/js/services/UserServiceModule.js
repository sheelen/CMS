angular.module('UserServiceModule',[]).factory('userService',['$http',function($http){
    console.log("userservice");
    return {
        registerUser : function(firstname,lastname,email,password,institution,postaladdress,city,state,country){
            return $http.post("/users/register",
            {
                firstname: firstname,
                lastname: lastname,
                username: email,
                password: password,
                institution: institution,
                postaladdress: postaladdress,
                city: city,
                state: state,
                country: country
            });
        },
        getUserInfoByEmailid : function (id) {
            console.log(id+"eDit user service!!");
            return $http.get("/profile/data",
                {
                    params:{id:id}
                }
            );
        },
        saveUserInfo : function(id,firstName,lastName,institution,city,state,country){
            return $http.post("/profile/data",{
                    id: id,
                    firstName: firstName,
                    lastName: lastName,
                    institution: institution,
                    city: city,
                    state: state,
                    country: country
                }
            )
        },
        updatePassword : function(userID,oldPassword,newPassword){
            return $http.post("/profile/password",{
                userId:userID,
                oldPass:oldPassword,
                newPass:newPassword
            })
        }
    }

}]);