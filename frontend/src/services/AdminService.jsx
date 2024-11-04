import Register from "../pages/Register";
import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const AdminServices = {
    login(body){
     return   requests.post("user/login",body);
    },
    getUserMe(){
        return requests.get("/user/me")
    },
    updateUser(body){
        return requests.patch("/user/update-account",body)
    },

    logout(){
        return requests.post("user/logout")
    },
    Register(body){
        return   requests.post("user/register",body);

    }

} 

export default AdminServices;