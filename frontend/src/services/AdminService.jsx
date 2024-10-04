import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const AdminServices = {
    login(body){
     return   requests.post("user/login",body);
    },
    getUserMe(){
        return requests.get("/user/me")
    }

} 

export default AdminServices;